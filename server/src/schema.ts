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
				scope: { type: new GraphQLNonNull(GraphQLString) },
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
