import * as path from 'path'
import * as fs from 'fs'
import * as csv from 'csv-parser'
import { Client as ElasticClient } from '@elastic/elasticsearch'
import * as moment from 'moment'
import { ICSVExpenseRow, Expense, IElasticExpenseDocument } from './../src/declarations'

const main = async () => {
	console.log('\nimporter script\n')

	// get path of file to import
	const importDir = path.resolve(path.dirname(__filename), 'data')
	// find CSVs in specified data dir
	const filesPaths: string[] = fs.readdirSync(importDir).filter(sPath => sPath.endsWith('.csv'))

	if (filesPaths.length < 1) {
		console.log('no data files to import')
		return
	}
	console.log(`found ${filesPaths.length} csv files`)
	const filePathDatesAsNumbers: number[] = filesPaths.map(
		sPath => Number(
			sPath
				.replace('.csv', '')
				.replace('ix_', '')
		)
	)
	const sortedDates = filePathDatesAsNumbers.sort((a, b) => b - a) // Sort descending
	
	let results: IElasticExpenseDocument[] = []
	let importFilePath: string | null = null
	
	// Try files from newest to oldest until one works
	for (const date of sortedDates) {
		const importFileName = `ix_${date}.csv`
		importFilePath = path.resolve(importDir, importFileName)
		console.log(`trying to import from ${importFileName}`)
		
		try {
			results = await readInFile(importFilePath)
			console.log(`successfully imported from ${importFileName}`)
			break
		} catch (err) {
			console.log(`failed to read ${importFileName}, trying next file...`)
			if (date === sortedDates[sortedDates.length - 1]) {
				// Last file failed, exit with error
				console.error('All files failed to read:', err)
				process.exit(1)
			}
		}
	}

	console.log(`${results.length} expenses read from csv`)

	const client = new ElasticClient({ node: 'http://elasticsearch:9200' })
	const indexName = String(process.env.ELASTIC_INDEX)
	const elasticDocumentType = String(process.env.ELASTIC_TYPE)

	//
	// put mapping
	//
	const elasticIndexMapping = {
		mappings: {
			properties: {
				Category: { "type": "keyword" },
				Date: { "type": "date", "format": "MM/dd/yyyy" },
				Fullcategory: { "type": "keyword" },
				Subcategory: { "type": "keyword" }
			}
		}
	}

	try {
		await client.indices.delete({ index: indexName })
	} catch (err) {
		console.log('\nerror deleting index:\n', err.message, '\n\n', err, '\n\n')
	}
	try {
		await client.indices.create({
			index: indexName,
			body: elasticIndexMapping
		})
	} catch (err) {
		console.log('\nerror applying mapping:\n', err.message, '\n\n', err, '\n\n')
	}

	// try {
	// 	const oFetchedMapping = await client.indices.getMapping()
	// 	// @ts-ignore
	// 	let expenseObjectMapping = oFetchedMapping.body['expense-explorer-index'].mappings
	// 	// console.log(expenseObjectMapping)
	// 	// console.log('\n\initialDate: ', expenseObjectMapping.expense.properties.Date.type, '\n\n')
	// } catch (err) {
	// 	console.log('error getting mapping')
	// }

	// 
	// store expenses
	//
	const elasticBulkInsertDocumentBody: any[] = []

	results.forEach(async (expenseObject) => {

		elasticBulkInsertDocumentBody.push({ index: { _index: indexName, _id: expenseObject.ID } })
		elasticBulkInsertDocumentBody.push({
			...expenseObject
		})
	})

	const { body: bulkResponse } = await client.bulk({
		index: indexName,
		body: elasticBulkInsertDocumentBody
	})
}

main()

async function readInFile(importFilePath: string) {
	return new Promise<IElasticExpenseDocument[]>((resolve, reject) => {

		const results: IElasticExpenseDocument[] = []

		const stream = fs.createReadStream(importFilePath)
			.on('error', (err) => {
				console.error('Error reading file:', err)
				reject(err)
			})
			.pipe(csv())
			.on('data', (data: ICSVExpenseRow) => {
				// only store past expenses
				const expenseDate: moment.Moment = moment(data.Date, 'MM/DD/Y')
				if (expenseDate.isBefore(moment())) {
					// // convert danish numbers to english numbers
					// let amount = parseFloat(data.Amount.replace('.', '').replace(',', '.'))
					let amount = parseFloat(data.Amount.replace(/,/g, ''))
					amount *= process.env?.EUR_TO_USD ? Number(process.env.EUR_TO_USD) : 1 // convert to dollars or keep as is (euros?)
					amount *= -1 // make positive
					// save ID before deleting
					const expenseId = data.ID
					// remove certain properties
					delete data.Payment
					delete data.Currency
					delete data.Note
					delete data.ID

					return results.push({
						...data,
						ID: expenseId,
						Amount: amount,
						Fullcategory: data.Category + '_' + data.Subcategory
					})
				}
			})
			.on('end', () => {
				resolve(results)
			})
			.on('error', (err) => {
				console.error('Error parsing CSV:', err)
				reject(err)
			})
	})
}
