import * as path from 'path'
import * as fs from 'fs'
import * as csv from 'csv-parser'
import { Client as ElasticClient, ApiResponse, RequestParams } from '@elastic/elasticsearch'

import { Expense } from './../src/declarations'

const main  = async () => {
	// @ts-ignore
	console.log('\nimporter script\n\n')

	// get path of file to import
	const sImportDir: string =  path.resolve(path.dirname(__filename), 'data')
	const asFiles: string[] = fs.readdirSync(sImportDir)

	if (asFiles.length < 1) {
		console.log('no data files to import')
		return
	}
	const sImportFile: string = path.resolve(sImportDir, asFiles[0])
	console.log(`importing from ${sImportFile}`)


	const results: Expense[] = await readInFile(sImportFile)
	
	console.log(`${results.length} expenses read from csv`)

	const client = new ElasticClient({ node: 'http://elasticsearch:9200' })
	const sIndex: string = String(process.env.ELASTIC_INDEX)
	const sType: string = String(process.env.ELASTIC_TYPE)

	//
	// put mapping
	//
	const oMapping = {
		mappings: {				
			expense:{
				properties: {
					Category: { "type": "keyword" },
					Date: { "type": "date", "format": "MM/dd/yyyy" }
				}
			}
		}
	}
	
	try { 
		await client.indices.delete({ index: sIndex })
	}catch(err) {
		console.log('\nerror deleting index:\n')
		// console.log('\nerror deleting index:\n', err.message, '\n\n', err, '\n\n')
	}
	try { 
		await client.indices.create({
			index: sIndex,
			body: oMapping
		})
	}catch(err) {
		console.log('\nerror applying mapping:\n', err.message, '\n\n', err, '\n\n')
	}

	try { 
		const oFetchedMapping = await client.indices.getMapping()
		let oExpenseMapping = oFetchedMapping.body['expense-explorer-index'].mappings
		// console.log(oExpenseMapping)
		// console.log('\n\ndate: ', oExpenseMapping.expense.properties.Date.type, '\n\n')
	}catch(err) {
		console.log('error getting mapping')
	}

	// 
	// store expenses
	//
	let aBody: any[] = []

	results.forEach( async (oExpense: Expense) => {

		aBody.push({ index: { _index: sIndex, _id: oExpense.ID }})
		aBody.push({
			...oExpense
		})
	})

	const { body: bulkResponse } = await client.bulk({
        index: sIndex,
        type: sType,
		body: aBody
	})
}

main()

async function readInFile (sImportFile: string) {
	return new Promise<Expense[]>(resolve => {

		let results: Expense[] = []

		fs.createReadStream(sImportFile)
			.pipe(csv())
			.on('data', (data: any) => {
				// convert danish numbers to english numbers
				let fAmount: number = parseFloat(data.Amount.replace('.', '').replace(',', '.'))
				let asDateParts: string[] = data.Date.split('/')
				// remove certain properties
				delete data.Payment
				delete data.Currency
				delete data.Note
				delete data.ID
				
				return results.push({
				...data,
				Amount: fAmount *= -1,
			})})
			.on('end', () => {
				resolve(results)
			})
	})
}
