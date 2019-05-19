import { all, put, select, takeLatest } from 'redux-saga/effects'

import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'
import { ActionType, getSummaryFailed, getSummarySucceded } from './actions'
import { Store } from './store'

const client = new ApolloClient({
	link: createHttpLink({
		uri: 'http://localhost:3300/graphql',
		credentials: 'include',
	}),
	cache: new InMemoryCache(),
})

export const getIDate = (state: Store.App) => state.nDate
export const getScope = (state: Store.App) => state.sScope
export const getFilter = (state: Store.App) => state.oFilter
export const getBudget = (state: Store.App) => state.nYearlyBudget

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* getSummary() {
	const nDate = yield select(getIDate) // epoch seconds
	const sScope = yield select(getScope) // month / year
	const nBudget = yield select(getBudget)
	const oFilter = yield select(getFilter)

	console.log('selected filter: ', oFilter)

	try {
		const data = yield client.query({
			query: gql`
				query GetSummary(
					$date: Int!
					$scope: String!
					$budget: Int
					$filter: Filter
				) {
					summary(
						date: $date
						scope: $scope
						budget: $budget
						filter: $filter
					) {
						totalExpenditure
						numberOfExpenses
						average_per_unit
						median_per_unit
						mode_per_unit
						projection_for_scope
						prospective_budget_for_forecast
						projected_spending_over_time {
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
						spending_by_category {
							category
							expense_count
							total
							percent
						}
						spending_by_subcategory {
							category
							expense_count
							total
							percent
						}
						spending_over_time {
							date
							expense_count
							total
						}
					}
				}
			`,
			variables: {
				date: nDate,
				scope: sScope,
				budget: nBudget,
				filter: oFilter,
			},
		})

		if (data && data.data && data.data.summary) {
			const { summary } = data.data

			yield put(getSummarySucceded(summary))
		} else {
			put(getSummaryFailed())
		}
	} catch (e) {
		console.log('error getting summary? ', e.message)
		// yield put({type: "USER_FETCH_FAILED", message: e.message});
	}
}

function* watchGetSummary() {
	yield takeLatest(ActionType.GET_SUMMARY, getSummary)
}

export default function* rootSaga() {
	yield all([watchGetSummary()])
}
