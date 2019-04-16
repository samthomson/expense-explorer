import { all, put, select, takeLatest } from 'redux-saga/effects'

import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'
import { Action, getSummarySucceded } from './actions'
import { Store } from './store'

import * as moment from 'moment'

const client = new ApolloClient({
	link: createHttpLink({
		uri: 'http://localhost:3300/graphql',
		credentials: 'include'
	}),
	cache: new InMemoryCache()
})

export const getIDate = (state: Store.App) => state.iDate

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* getSummary(action: Action) {
	// const oDate = moment(action.iDate)
	const oDate = moment(yield select(getIDate))
	
   	try {
		const data = yield client.query({
			query: gql`
				query GetSummary($month: Int!, $year: Int!) {					
					summary(month: $month, year: $year){
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
			variables: {
				month: Number(oDate.format('M')),
				year: Number(oDate.format('YYYY'))
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