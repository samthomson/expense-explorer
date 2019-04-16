import { Action } from './actions'
import { Store } from './store'

const initialState: Store.App = {
	sDate: '',
	oSummary: {}
}

import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'

const client = new ApolloClient({
	link: createHttpLink({
		uri: 'http://localhost:3300/graphql',
		credentials: 'include'
	}),
	cache: new InMemoryCache()
})


// const client = new ApolloClient({
// 	link: createHttpLink({ uri: 'http://api.githunt.com/graphql' })
//   })



export function appReducers(
	state: Store.App = initialState,
	action: Action,
): Store.App {
	switch (action.type) {
		case 'SET_DATE':
			return {
				...state,
				sDate: action.sDate,
			}
		case 'GET_SUMMARY':
			// call API
			// const { year, month } = action

			client.query({
				query: gql`
					query GetSummary {					
						summary(month: 3, year: 2019){
							totalExpenditure,
							numberOfExpenses,
							expenses {
								vendor,
								amount,
								category,
								subcategory,
								date
							}
						} 
					}
				`,
			})
			.then(data => {
				if (data && data.data && data.data.summary) {
					const { summary } = data.data

					const { expenses, totalExpenditure, numberOfExpenses } = summary
					console.log(expenses)
					console.log(totalExpenditure)
					console.log(numberOfExpenses)

					return {
						...state,
						oSummary: summary
					}
				}else { return {...state}}
			})
			.catch(error => {
				console.error(error)
				return {...state}
			})
			
			
	}

	return state
}
