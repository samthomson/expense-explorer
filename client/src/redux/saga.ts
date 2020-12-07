import { all, put, select, takeLatest } from 'redux-saga/effects'

import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'
// import * as moment from 'moment'
import { ActionType, getSummaryFailed, getSummarySucceded } from './actions'
import { Store } from './store'

const client = new ApolloClient({
	link: createHttpLink({
		uri: `http://${window.location.hostname}:3300/graphql`,
		credentials: 'include',
	}),
	cache: new InMemoryCache(),
})

export const getIDate = (state: Store.App) => state.initialDate
const getEndDate = (state: Store.App) => state.endDate
export const getScope = (state: Store.App) => state.sScope
export const getFilter = (state: Store.App) => state.filter
export const getBudget = (state: Store.App) => state.nYearlyBudget


// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* getSummary() {
	const date = yield select(getIDate) 
	const endDate = yield select(getEndDate) 
	const scope = yield select(getScope) // month / year
	const budget = yield select(getBudget)
	const filter = yield select(getFilter)

	try {
		const data = yield client.query({
			query: gql`
				query GetSummary(
					$expenseSummaryInput: ExpenseSummaryInput!
				) {
					summary(
						expenseSummaryInput: $expenseSummaryInput
					) {
						totalExpenditure
						numberOfExpenses
						averagePerUnit
						medianPerUnit
						modePerUnit
						projectionForScope
						prospectiveBudgetForForecast
						projectedSpendingOverTime {
							date
							total
						}
						expenses {
							vendor
							amount
							category
							subcategory
							date
						}
						spendingByCategory {
							category
							expenseCount
							total
							percent
						}
						spendingBySubcategory {
							category
							expenseCount
							total
							percent
						}
						spendingOverTime {
							date
							expenseCount
							total
						}
					}
				}
			`,
			variables: {
				expenseSummaryInput: {
					date: date.format(),
					endDate: endDate.format(),
					scope: scope.toUpperCase(),
					budget,
					filter
				}
			},
		})

		yield put(getSummarySucceded(data.data.summary))

	} catch (e) {
		console.log('error getting summary? ', e.message)
		put(getSummaryFailed())
		// yield put({type: "USER_FETCH_FAILED", message: e.message});
	}
}

function* watchGetSummary() {
	yield takeLatest(ActionType.GET_SUMMARY, getSummary)
}

export default function* rootSaga() {
	yield all([watchGetSummary()])
}
