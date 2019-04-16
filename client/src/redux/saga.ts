import { all, put, takeLatest } from 'redux-saga/effects'

import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'
import { Action, getSummarySucceded } from './actions';


const client = new ApolloClient({
	link: createHttpLink({
		uri: 'http://localhost:3300/graphql',
		credentials: 'include'
	}),
	cache: new InMemoryCache()
})


// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* getSummery(action: Action) {
   	try {
		const data = yield client.query({
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

		console.log(data)

		if (data && data.data && data.data.summary) {
			const { summary } = data.data

			console.log('got summary, now calling succeeded')

			yield put(getSummarySucceded(summary))
		}else {
			// return {...state}
			put(getSummarySucceded({}))
		}


		// let summary = {}
		// yield put({type: "GET_SUMMARY_SUCCEEDED", summary});
   	} catch (e) {
	   console.log(e.message)
    //   yield put({type: "USER_FETCH_FAILED", message: e.message});
   }
}

function* watchGetSummary() {
	yield takeLatest("GET_SUMMARY", getSummery);
}

export default function* rootSaga() {
	yield all([
		watchGetSummary()
	])
  }