import {
	GraphQLID,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
	GraphQLFloat
} from 'graphql'

const ExpenseType = new GraphQLObjectType({
	name:  'ExpenseType',
	fields: () => ({
		id: { type: GraphQLID },
		vendor: { type: GraphQLString },
		category: { type: GraphQLString },
		subcategory: { type: GraphQLString },
		date: { type: GraphQLString },
		Amount: { type: GraphQLFloat }
	})
})

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: () => ({
		expense: {
			type: ExpenseType,
			args: { id: { type: new GraphQLNonNull(GraphQLID) } },
			resolve(parentValue, { id }) {
				return {id, vendor: 'sas', category: 'fdsfds', subcategory: 'hgh', date: 'gfdgfd', Amount: 789.56}
			}
		}
	})
})

export default new GraphQLSchema({
  query: RootQuery
})
