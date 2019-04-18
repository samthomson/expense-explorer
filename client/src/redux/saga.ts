import { all, put, select, takeLatest } from 'redux-saga/effects'

import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'
import { Action, getSummarySucceded } from './actions'
import { Store } from './store'

const client = new ApolloClient({
	link: createHttpLink({
		uri: 'http://localhost:3300/graphql',
		credentials: 'include'
	}),
	cache: new InMemoryCache()
})

export const getIDate = (state: Store.App) => state.iDate
export const getScope = (state: Store.App) => state.sScope

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* getSummary(action: Action) {
	const iDate = yield select(getIDate) // epoch seconds
	const sScope = yield select(getScope) // month / year
	
   	try {
		const data = yield client.query({
			query: gql`
				query GetSummary($date: Int!, $scope: String!) {					
					summary(date: $date, scope: $scope){
						totalExpenditure,
						numberOfExpenses,
						average_per_unit,
						median_per_unit,
						projection_for_scope,
						expenses {
							vendor,
							amount,
							category,
							subcategory,
							date
						},
						spending_by_category {
							category,
							expense_count,
							total,
							percent
						},
						spending_over_time {
							date,
							expense_count,
							total
						}
					} 
				}
			`,
			variables: {
				date: iDate,
				scope: sScope
			}
		})

		if (data && data.data && data.data.summary) {
			const { summary } = data.data

			yield put(getSummarySucceded(summary))
		}else {
			// return {...state}
			put(getSummarySucceded({}))
		}
   	} catch (e) {
		console.log('error getting summary? ', e.message)
	   // yield put({type: "USER_FETCH_FAILED", message: e.message});
   }
}

function* watchGetSummary() {
	yield takeLatest("GET_SUMMARY", getSummary);
}

export default function* rootSaga() {
	yield all([
		watchGetSummary()
	])
  }