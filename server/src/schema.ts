import {
	GraphQLID,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
	GraphQLFloat,
	GraphQLInt,
	GraphQLList,
} from 'graphql'
import * as moment from 'moment'
import { Expense } from './declarations'
import { Summary } from '@shared/declarations'
import { anMode } from './lib/helper'

const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://elasticsearch:9200' })

const ExpenseType = new GraphQLObjectType({
	name: 'ExpenseType',
	fields: () => ({
		id: { type: GraphQLID },
		vendor: { type: GraphQLString },
		category: { type: GraphQLString },
		subcategory: { type: GraphQLString },
		date: { type: GraphQLString },
		amount: { type: GraphQLFloat },
	}),
})

const CategorySpendType = new GraphQLObjectType({
	name: 'CategorySpend',
	fields: () => ({
		category: { type: GraphQLString },
		expense_count: { type: GraphQLInt },
		total: { type: GraphQLFloat },
		percent: { type: GraphQLFloat },
	}),
})
const TimeSpendType = new GraphQLObjectType({
	name: 'TimeSpend',
	fields: () => ({
		date: { type: GraphQLString },
		expense_count: { type: GraphQLInt },
		total: { type: GraphQLFloat },
	}),
})
const ProjectedTimeSpendType = new GraphQLObjectType({
	name: 'ProjectedTimeSpend',
	fields: () => ({
		date: { type: GraphQLString },
		total: { type: GraphQLFloat },
	}),
})

const SummaryType = new GraphQLObjectType({
	name: 'SummaryType',
	fields: () => ({
		totalExpenditure: { type: GraphQLFloat },
		numberOfExpenses: { type: GraphQLInt },
		expenses: { type: GraphQLList(ExpenseType) },
		spending_over_time: {
			type: GraphQLList(TimeSpendType),
		},
		projected_spending_over_time: {
			type: GraphQLList(ProjectedTimeSpendType),
		},
		spending_by_category: {
			type: GraphQLList(CategorySpendType),
		},
		spending_by_subcategory: {
			type: GraphQLList(CategorySpendType),
		},
		average_per_unit: { type: GraphQLFloat },
		median_per_unit: { type: GraphQLFloat },
		mode_per_unit: { type: GraphQLFloat },
		projection_for_scope: { type: GraphQLFloat },
		prospective_budget_for_forecast: { type: GraphQLFloat },
	}),
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
					id,
				})
				if (result && result.body && result.body._source) {
					let oExpense = result.body._source
					return {
						...oExpense,
						vendor: oExpense.Vendor,
						category: oExpense.Category,
						subcategory: oExpense.Subcategory,
						amount: oExpense.Amount,
						date: oExpense.Date,
					}
				} else {
					return {}
				}
			},
		},
		summary: {
			type: SummaryType,
			args: {
				date: {
					type: new GraphQLNonNull(GraphQLInt),
					description:
						'unix epoch date: number of seconds since 1970',
				},
				budget: { type: GraphQLInt },
				scope: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve: async (parentValue, { date, scope, budget }) =>
				await getSummary(date, scope, budget),
		},
	}),
})

let elasticDocumentToObject = (oDocument: any) => {
	return {
		...oDocument,
		vendor: oDocument.Vendor,
		category: oDocument.Category,
		subcategory: oDocument.Subcategory,
		amount: oDocument.Amount,
		date: oDocument.Date,
	}
}

export default new GraphQLSchema({
	query: RootQuery,
})

const fMedian = (afValues: number[]) => {
	if (afValues.length === 0) return 0

	afValues.sort((a, b) => {
		return a - b
	})

	const half = Math.floor(afValues.length / 2)

	if (afValues.length % 2) return afValues[half]

	return (afValues[half - 1] + afValues[half]) / 2
}

const getSummary = async (
	nDate: number,
	sScope: 'month' | 'year',
	nBudget?: number,
): Promise<Summary> => {
	// build date range query
	const oQueriedDate = moment.unix(nDate)
	const sScopePeriod: any = sScope === 'month' ? 'month' : 'year'
	const sAggregationScopePeriod: any = sScope === 'month' ? 'day' : 'month'
	const sLowerDateRange = oQueriedDate.startOf(sScopePeriod).format('DD/MM/Y')
	const sUpperDateRange = oQueriedDate.endOf(sScopePeriod).format('DD/MM/Y')
	const nSize: number = 10000

	const oQuery = {
		index: process.env.ELASTIC_INDEX,
		body: {
			query: {
				range: {
					Date: {
						gte: sLowerDateRange,
						lte: sUpperDateRange,
						format: 'dd/MM/yyyy',
					},
				},
			},
			size: nSize,
			aggs: {
				time_spending_breakdown: {
					date_histogram: {
						field: 'Date',
						interval: sAggregationScopePeriod,
					},
					aggs: {
						unit_total: { sum: { field: 'Amount' } },
					},
				},
				category_spending_breakdown: {
					terms: { field: 'Category', size: nSize },
					aggs: {
						unit_total: { sum: { field: 'Amount' } },
					},
				},
				subcategory_spending_breakdown: {
					terms: { field: 'Fullcategory', size: nSize },
					aggs: {
						unit_total: { sum: { field: 'Amount' } },
					},
				},
			},
		},
	}

	// console.log(oQuery)
	const result = await client
		.search(oQuery)
		.catch((err: any) => console.log(err))

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

		let iSum: number = aReturn.reduce(
			(iTotal: number, oExpense: Expense) => iTotal + oExpense.Amount,
			0,
		)

		oReturn = {
			totalExpenditure: iSum,
			numberOfExpenses: aReturn.length,
			expenses: aReturn,
		}
	}

	if (result && result.body && result.body.aggregations) {
		const aggDump = result.body.aggregations

		if (
			aggDump.category_spending_breakdown &&
			aggDump.subcategory_spending_breakdown &&
			aggDump.time_spending_breakdown
		) {
			const fTotalExpenditureForScopedPeriod: number = aggDump.category_spending_breakdown.buckets.reduce(
				(iTotal: number, oBucket: any) =>
					iTotal + oBucket.unit_total.value,
				0,
			)

			//
			// spending by category
			//

			const aCategorySpending = aggDump.category_spending_breakdown.buckets.map(
				(oCategoryBucket: any) => {
					return {
						category: oCategoryBucket.key,
						expense_count: oCategoryBucket.doc_count,
						total: oCategoryBucket.unit_total.value,
						percent:
							(oCategoryBucket.unit_total.value /
								fTotalExpenditureForScopedPeriod) *
							100,
					}
				},
			)
			oReturn['spending_by_category'] = aCategorySpending

			//
			// spending by subcategory
			//
			const aSubcategorySpending = aggDump.subcategory_spending_breakdown.buckets.map(
				(oSubcategoryBucket: any) => {
					return {
						category: oSubcategoryBucket.key,
						expense_count: oSubcategoryBucket.doc_count,
						total: oSubcategoryBucket.unit_total.value,
						percent:
							(oSubcategoryBucket.unit_total.value /
								fTotalExpenditureForScopedPeriod) *
							100,
					}
				},
			)
			oReturn['spending_by_subcategory'] = aSubcategorySpending

			//
			// spending over time
			//

			// build up empty state objects
			let oPossibleTimeUnits: any = {}
			// dates of the month
			if (sScope === 'month') {
				// get all dates for the month
				const iNumberOfDays: number = oQueriedDate.daysInMonth() // get number of days in current month
				for (
					let cUnitCreate = 0;
					cUnitCreate < iNumberOfDays;
					cUnitCreate++
				) {
					oPossibleTimeUnits[cUnitCreate + 1] = {}
				}
			}
			// months of the year
			if (sScope === 'year') {
				for (let cUnitCreate = 0; cUnitCreate < 12; cUnitCreate++) {
					oPossibleTimeUnits[cUnitCreate + 1] = {}
				}
			}

			let fNumberOfUnits: number =
				aggDump.time_spending_breakdown.buckets.length

			// current year and year mode
			if (
				sScope === 'year' &&
				moment(oQueriedDate).isSame(new Date(), sScope)
			) {
				// get exact monthly average
				const cDayNumberOfYear: number = moment().dayOfYear()
				const fDecimalMonthsThroughYear: number =
					(cDayNumberOfYear / 365) * 12
				fNumberOfUnits = fDecimalMonthsThroughYear

				if (oReturn['totalExpenditure'] && nBudget) {
					oReturn['prospective_budget_for_forecast'] =
						(nBudget - oReturn['totalExpenditure']) /
						(12 - fDecimalMonthsThroughYear)
				}
			}
			if (
				sScope === 'month' &&
				moment(oQueriedDate).isSame(new Date(), sScope)
			) {
				// get exact monthly average
				const nPresentDateOfCurrentMonth: number = moment().date()
				const nTotalDaysInCurrentMonth: number = moment().daysInMonth()

				const fDecimalDaysThroughMonth: number =
					nPresentDateOfCurrentMonth / nTotalDaysInCurrentMonth

				if (oReturn['totalExpenditure'] && nBudget) {
					oReturn['prospective_budget_for_forecast'] =
						(nBudget - oReturn['totalExpenditure']) /
						(nTotalDaysInCurrentMonth - fDecimalDaysThroughMonth)
				}
			}

			// for each possible time unit, see if we have matching data - or return zeros (missing dates)
			let aTimeUnitSpending = Object.keys(oPossibleTimeUnits).map(
				(sKey: string) => {
					const aoMatchingTimePeriods: any[] = aggDump.time_spending_breakdown.buckets.filter(
						(oSpendingSummary: any) => {
							let oPeriodDate = moment(
								oSpendingSummary.key_as_string,
								'MM/DD/Y',
							)

							if (sScope === 'month') {
								return oPeriodDate.date() === Number(sKey)
							} else {
								return oPeriodDate.month() + 1 === Number(sKey)
							}
						},
					)

					return {
						date: sKey,
						expense_count:
							aoMatchingTimePeriods.length > 0
								? aoMatchingTimePeriods[0].doc_count
								: 0,
						total:
							aoMatchingTimePeriods.length > 0
								? aoMatchingTimePeriods[0].unit_total.value.toFixed(
										0,
								  )
								: 0,
					}
				},
			)

			aggDump.time_spending_breakdown.buckets.map((oBucket: any) => {
				return {
					date: oBucket.key_as_string,
					expense_count: oBucket.doc_count,
					total: oBucket.unit_total.value.toFixed(0),
				}
			})
			oReturn['spending_over_time'] = aTimeUnitSpending

			//
			// summary stats
			//
			const fAverage: number =
				fTotalExpenditureForScopedPeriod / fNumberOfUnits
			oReturn['average_per_unit'] = fAverage

			oReturn['median_per_unit'] = fMedian(
				aTimeUnitSpending.map(oItem => Number(oItem.total)),
			) // past period
			let aMaybeMode = anMode(
				aTimeUnitSpending.map(oItem => Number(oItem.total)),
			)
			oReturn['mode_per_unit'] =
				aMaybeMode && aMaybeMode.length > 0 ? aMaybeMode[0] : 0

			// projection = average_per_unit * number of units (year scope - 12, month scope - number of days in current month)
			if (moment(oQueriedDate).isSame(new Date(), sScope)) {
				// current scope
				// projected 'scope expenditure'
				const nNumberOfUnits: number =
					sScope === 'year' ? 12 : oQueriedDate.daysInMonth()
				oReturn['projection_for_scope'] = fAverage * nNumberOfUnits

				// projected dated spending
				const aSpendingProjection: any[] = aTimeUnitSpending.map(oP => {
					return {
						...oP,
						total: fAverage || 0,
					}
				})

				// projection data is from now until end of period, until now should be real data
				const nCurrentUnitTime =
					sScope === 'year' ? moment().month() + 1 : moment().date()
				// year mode - before current month, so in april, take month jan feb mar
				// april = 3, so we add one
				// month mode - before current date, so on 4th, take 1st 2nd 3rd
				// 18th = 18
				let aMedianData = []
				for (
					let cReplacePeriod = 0;
					cReplacePeriod < nCurrentUnitTime - 1;
					cReplacePeriod++
				) {
					// console.log(aTimeUnitSpending)
					aMedianData.push(aTimeUnitSpending[cReplacePeriod].total)
					aSpendingProjection[cReplacePeriod].total =
						aTimeUnitSpending[cReplacePeriod].total
				}
				// override median data
				oReturn['median_per_unit'] = fMedian(aMedianData) // current period
				let aMaybeMode = anMode(aMedianData)
				oReturn['mode_per_unit'] =
					aMaybeMode && aMaybeMode.length > 0 ? aMaybeMode[0] : 0

				oReturn['projected_spending_over_time'] = aSpendingProjection
			} else {
				oReturn['projection_for_scope'] = null
				oReturn['projected_spending_over_time'] = null
			}
		}
	}

	return oReturn
}
