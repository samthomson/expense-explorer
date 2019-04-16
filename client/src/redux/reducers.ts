import { Action } from './actions'
import { Store } from './store'

const initialState: Store.App = {
	sDate: '',
	oSummary: {}
}

import ApolloClient from 'apollo-boost'
import gql from 'graphql-tag'

const client = new ApolloClient({
  uri: 'http://localhost:3300'
})


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
			}).then(data => {
				console.log(data)
				// return data
			})


			return {
				...state,
				oSummary: {}
			}
	}

	return state
}
