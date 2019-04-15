import * as path from 'path'
import * as fs from 'fs'
import * as csv from 'csv-parser'
import { Client as ElasticClient, ApiResponse, RequestParams } from '@elastic/elasticsearch'

export type Expense = {
	Date: string //'06/01/2018',
	Type: string //'N/A',
	Category: string //'Food/Drink',
	Subcategory: string // 'Fast Food',
	Vendor: string // 'Pad thai',
	Payment: string // 'N/A',
	Currency: string // 'DKK',
	Amount: number // '-76,55',
	Note: string // 'GBP: 9,00 £\nExchange rate: 8.50545829\n',
	ID: string // '6B1A25B8-5BCD-431A-9190-73F32F91ACC3' }
}

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
	// console.log(results[0])

	// let iSum: number = results.reduce((iTotal: number, oExpense: Expense) => iTotal + oExpense.Amount, 0)

	// console.log('iSum: ', iSum)

	const client = new ElasticClient({ node: 'http://elasticsearch:9200' })
	const sIndex: string = 'expense-explorer-index'
	const sType: string = 'expense'

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
				// remove certain properties
				delete data.Payment
				delete data.Currency
				delete data.Note
				delete data.ID
				// console.log(fAmount)
				return results.push({
				...data,
				Amount: fAmount *= -1
			})})
			.on('end', () => {
				resolve(results)
			})
	})
}
