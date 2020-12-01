import {
	GraphQLID,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
	GraphQLFloat,
	GraphQLInt,
	GraphQLList,
	GraphQLInputObjectType,
	GraphQLEnumType,
} from 'graphql'
import * as moment from 'moment'
import { IElasticExpenseDocument } from './declarations'
import { getSummary, getDocument } from './lib/elastic'

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
		expenseCount: { type: GraphQLInt },
		total: { type: GraphQLFloat },
		percent: { type: GraphQLFloat },
	}),
})

const TimeSpendType = new GraphQLObjectType({
	name: 'TimeSpend',
	fields: () => ({
		date: { type: GraphQLString },
		expenseCount: { type: GraphQLInt },
		total: { type: GraphQLFloat },
	}),
})

const FilterInputType = new GraphQLInputObjectType({
	name: 'Filter',
	fields: () => ({
		term: { type: GraphQLString },
		match: { type: GraphQLString },
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
		spendingOverTime: {
			type: GraphQLList(TimeSpendType),
		},
		projectedSpendingOverTime: {
			type: GraphQLList(ProjectedTimeSpendType),
		},
		spendingByCategory: {
			type: GraphQLList(CategorySpendType),
		},
		spendingBySubcategory: {
			type: GraphQLList(CategorySpendType),
		},
		averagePerUnit: { type: GraphQLFloat },
		medianPerUnit: { type: GraphQLFloat },
		modePerUnit: { type: GraphQLFloat },
		projectionForScope: { type: GraphQLFloat },
		prospectiveBudgetForForecast: { type: GraphQLFloat },
	}),
})

const ScopeEnumType = new GraphQLEnumType({
	name: 'ScopeEnum',
	values: {
		MONTH: {
			value: 'month',
		},
		YEAR: {
			value: 'year',
		},
	},
})

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: () => ({
		expense: {
			type: ExpenseType,
			args: { id: { type: new GraphQLNonNull(GraphQLID) } },
			resolve: async (parentValue, { id }) => getDocument(id),
		},
		summary: {
			type: SummaryType,
			args: {
				date: {
					type: new GraphQLNonNull(GraphQLString),
					description:
						'ISO date eg 2020-01-16',
				},
				budget: { type: GraphQLInt },
				scope: { type: new GraphQLNonNull(ScopeEnumType) },
				filter: {
					type: FilterInputType,
					description:
						'an object containing term (column) and match (value) properties',
				},
			},
			resolve: async (parentValue, { date, scope, filter, budget }) =>
				await getSummary(
					date,
					scope,
					filter, //{ term: 'Category', match: 'utility' },
					budget,
				),
		},
	}),
})

export default new GraphQLSchema({
	query: RootQuery,
})
