import {
	GraphQLID,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
	GraphQLFloat,
	GraphQLInt,
	GraphQLList
} from 'graphql'
import { Expense } from './declarations'

const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://elasticsearch:9200' })

const ExpenseType = new GraphQLObjectType({
	name:  'ExpenseType',
	fields: () => ({
		id: { type: GraphQLID },
		vendor: { type: GraphQLString },
		category: { type: GraphQLString },
		subcategory: { type: GraphQLString },
		date: { type: GraphQLString },
		amount: { type: GraphQLFloat }
	})
})

const SummaryType = new GraphQLObjectType({
	name: 'SummaryType',
	fields: () => ({
		totalExpenditure: { type: GraphQLFloat },
		numberOfExpenses: { type: GraphQLInt },
		expenses: { type: GraphQLList(ExpenseType)}
	})
})

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: () => ({
		expense: {
			type: ExpenseType,
			args: { id: { type: new GraphQLNonNull(GraphQLID) } },
			resolve: async (parentValue, { id }) => {
				const result = await client.get({
					index: process.env.ELASTIC_INDEX,
					type: process.env.ELASTIC_TYPE,
					id
				})
				if (result && result.body && result.body._source) {
					let oExpense = result.body._source
					return {
						...oExpense,
						vendor: oExpense.Vendor,
						category: oExpense.Category,
						subcategory: oExpense.Subcategory,
						amount: oExpense.Amount,
						date: oExpense.Date
					}
				} else {
					return {}
				}
			}
		},
		summary: {
			type: SummaryType,
			args: { year: { type: new GraphQLNonNull(GraphQLInt) }, month: { type: new GraphQLNonNull(GraphQLInt) } },
			resolve: async (parentValue, { year, month }) => {

				const oQuery = {
					index: process.env.ELASTIC_INDEX,
					body: {
						query: {
							bool: {
								must: [
									{
										match: {
											Year: year
										}
									},
									{
										match: {
											Month: month
										}
									}
								]
							}
						},
						size: 10000
					}
				}
				// console.log(oQuery)
				const result = await client.search(oQuery).catch((err: any) => console.log(err))
				if (result && result.body && result.body.hits && result.body.hits.hits) {

					let { hits } = result.body.hits
					let aReturn: any[] = []

					for (let cMatch: number = 0; cMatch < hits.length; cMatch++) {
					// hits.foreach((oHit: any) => {
						let oDocument = hits[cMatch]
						// console.log('len: ', oDocument)
						aReturn.push(elasticDocumentToObject(oDocument._source))
					}

					// console.log(result.body._source)
					let iSum: number = aReturn.reduce((iTotal: number, oExpense: Expense) => iTotal + oExpense.Amount, 0)

					return {
						totalExpenditure: iSum,
						numberOfExpenses: aReturn.length,
						expenses: aReturn
					}
				} else {
					return {}
				}
			}
		}
	})
})

let elasticDocumentToObject = (oDocument: any) => {
	return {
		...oDocument,
		vendor: oDocument.Vendor,
		category: oDocument.Category,
		subcategory: oDocument.Subcategory,
		amount: oDocument.Amount,
		date: oDocument.Date
	}
}

export default new GraphQLSchema({
  query: RootQuery
})
