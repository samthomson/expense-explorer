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
import * as moment from 'moment'
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

const CategorySpendType = new GraphQLObjectType({
	name: 'CategorySpend',
	fields: () => ({
		key: { type: GraphQLString },
		doc_count: { type: GraphQLInt },
		total: { type: GraphQLFloat }
	})
})
const TimeSpendType = new GraphQLObjectType({
	name: 'TimeSpend',
	fields: () => ({
		key: { type: GraphQLString },
		doc_count: { type: GraphQLInt },
		total: { type: GraphQLFloat }
	})
})

const SummaryType = new GraphQLObjectType({
	name: 'SummaryType',
	fields: () => ({
		totalExpenditure: { type: GraphQLFloat },
		numberOfExpenses: { type: GraphQLInt },
		expenses: { type: GraphQLList(ExpenseType)},
		spending_over_time: {
			type: GraphQLList(TimeSpendType)
		},
		spending_by_category: {
			type: GraphQLList(CategorySpendType)
		}
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
			args: { date: { type: new GraphQLNonNull(GraphQLInt), description: "unix epoch date: number of seconds since 1970" }, scope: { type: new GraphQLNonNull(GraphQLString) } },
			resolve: async (parentValue, { date, scope }) => {

				// build date range query
				const oQueriedDate = moment.unix(date)
				const sScopePeriod: any = (scope === 'month') ? 'month' : 'year'
				const sLowerDateRange = oQueriedDate.startOf(sScopePeriod).format('DD/MM/Y')
				const sUpperDateRange = oQueriedDate.endOf(sScopePeriod).format('DD/MM/Y')

				const oQuery = {
					index: process.env.ELASTIC_INDEX,
					body: {
						query: {
							range: {
								Date: {
									gte: sLowerDateRange,
									lte: sUpperDateRange,
									format: "dd/MM/yyyy"
								}
							}
						},
						size: 10000,
						aggs: {
							time_spending_breakdown: {
								date_histogram : {
									field: "Date",
									interval: "day"
								},
								aggs: {
									unit_total: { "sum" : { "field" : "Amount" } }
								}
							},
							category_spending_breakdown: {
								terms : { "field" : "Category" },
								aggs: {
									unit_total: { "sum" : { "field" : "Amount" } }
								}
							}
						}
					}
				}
				// console.log(oQuery)
				const result = await client.search(oQuery).catch((err: any) => console.log(err))

				let oReturn: any = {}

				if (result && result.body && result.body.hits && result.body.hits.hits) {

					let { hits } = result.body.hits
					let aReturn: any[] = []

					for (let cMatch: number = 0; cMatch < hits.length; cMatch++) {
					// hits.foreach((oHit: any) => {
						let oDocument = hits[cMatch]
						// console.log('len: ', oDocument)
						aReturn.push(elasticDocumentToObject(oDocument._source))
					}

					let iSum: number = aReturn.reduce((iTotal: number, oExpense: Expense) => iTotal + oExpense.Amount, 0)

					oReturn = {
						totalExpenditure: iSum,
						numberOfExpenses: aReturn.length,
						expenses: aReturn
					}
				}

				if (result && result.body && result.body.aggregations) {
					const aggDump = result.body.aggregations

					if (aggDump.category_spending_breakdown) {
						let aCategories = aggDump.category_spending_breakdown.buckets.map((oBucket: any) => {
							return { 
								key: oBucket.key,
								doc_count: oBucket.doc_count,
								total: oBucket.unit_total.value,
							}
						})

						oReturn['spending_by_category'] = aCategories
					}
					if (aggDump.time_spending_breakdown) {
						
						let aCategories = aggDump.time_spending_breakdown.buckets.map((oBucket: any) => {
							return { 
								key: oBucket.key_as_string,
								doc_count: oBucket.doc_count,
								total: oBucket.unit_total.value,
							}
						})
						
						oReturn['spending_over_time'] = aCategories
					}
				}
				return oReturn
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
