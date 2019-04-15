import {
	GraphQLID,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
	GraphQLFloat
} from 'graphql'

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

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: () => ({
		expense: {
			type: ExpenseType,
			args: { id: { type: new GraphQLNonNull(GraphQLID) } },
			resolve: async (parentValue, { id }) => {
				const result = await client.get({
					index: 'expense-explorer-index',
					type: 'expense',
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
		}
	})
})

export default new GraphQLSchema({
  query: RootQuery
})
