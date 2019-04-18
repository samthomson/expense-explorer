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
		category: { type: GraphQLString },
		expense_count: { type: GraphQLInt },
		total: { type: GraphQLFloat },
		percent: { type: GraphQLFloat }
	})
})
const TimeSpendType = new GraphQLObjectType({
	name: 'TimeSpend',
	fields: () => ({
		date: { type: GraphQLString },
		expense_count: { type: GraphQLInt },
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
		},
		average_per_unit: { type: GraphQLFloat },
		projection_for_scope: { type: GraphQLFloat }
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
				const sAggregationScopePeriod: any = (scope === 'month') ? 'day' : 'month'
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
									interval: sAggregationScopePeriod
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

					if (aggDump.category_spending_breakdown && aggDump.time_spending_breakdown) {

						const fTotalExpenditureForScopedPeriod: number = aggDump.category_spending_breakdown.buckets.reduce((iTotal: number, oBucket: any) => iTotal + oBucket.unit_total.value, 0)
						
						//
						// spending by category
						//

						const aCategorySpending = aggDump.category_spending_breakdown.buckets.map((oBucket: any) => {
							return { 
								category: oBucket.key,
								expense_count: oBucket.doc_count,
								total: oBucket.unit_total.value,
								percent: (oBucket.unit_total.value / fTotalExpenditureForScopedPeriod) * 100
							}
						})
						oReturn['spending_by_category'] = aCategorySpending

						//
						// spending over time
						//

						// build up empty state objects
						let oPossibleTimeUnits: any = {}
						// dates of the month
						if (scope === 'month') {
							// get all dates for the month
							const iNumberOfDays: number = oQueriedDate.daysInMonth() // get number of days in current month
							for (let cUnitCreate = 0; cUnitCreate < iNumberOfDays; cUnitCreate++) {
								oPossibleTimeUnits[(cUnitCreate + 1)] = {}
							}
						}
						// months of the year
						if (scope === 'year') {
							for (let cUnitCreate = 0; cUnitCreate < 12; cUnitCreate++) {
								oPossibleTimeUnits[(cUnitCreate + 1)] = {}
							}
						}

						let fNumberOfUnits: number = aggDump.time_spending_breakdown.buckets.length

						// current year and year mode
						if (scope === 'year' && moment(oQueriedDate).isSame(new Date(), scope)) {
							// get exact monthly average
							const cDayNumberOfYear: number = moment().dayOfYear()
							const fDecimalMonthsThroughYear: number = cDayNumberOfYear / 365 * 12
							fNumberOfUnits = fDecimalMonthsThroughYear
						}
						
						// for each possible time unit, see if we have matching data - or return zeros (missing dates)
						let aTimeUnitSpending = Object.keys(oPossibleTimeUnits).map((sKey: string) => {

							const aoMatchingTimePeriods: any[] = aggDump.time_spending_breakdown.buckets.filter((oSpendingSummary: any) => { 
								let oPeriodDate = moment(oSpendingSummary.key_as_string, 'MM/DD/Y')

								if (scope === 'month') {
									return oPeriodDate.date() === Number(sKey)
								} else {
									return (oPeriodDate.month()+1) === Number(sKey)
								}
							})
								
							return {
								date: sKey,
								expense_count: aoMatchingTimePeriods.length > 0 ? aoMatchingTimePeriods[0].doc_count : 0,
								total: aoMatchingTimePeriods.length > 0 ? aoMatchingTimePeriods[0].unit_total.value.toFixed(0) : 0,
							}
						})
						
						aggDump.time_spending_breakdown.buckets.map((oBucket: any) => {
							return { 
								date: oBucket.key_as_string,
								expense_count: oBucket.doc_count,
								total: (oBucket.unit_total.value).toFixed(0),
							}
						})	
						oReturn['spending_over_time'] = aTimeUnitSpending	
						
						//
						// summary stats
						//

						const fAverage: number = fTotalExpenditureForScopedPeriod / fNumberOfUnits
						oReturn['average_per_unit'] = fAverage

						// projection = average_per_unit * number of units (year scope - 12, month scope - number of days in current month)
						if (moment(oQueriedDate).isSame(new Date(), scope)) {
							const iNumberOfUnits: number = scope === 'year' ? 12 : oQueriedDate.daysInMonth()
							oReturn['projection_for_scope'] = fAverage * iNumberOfUnits
						} else {
							oReturn['projection_for_scope'] = null
						}
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
