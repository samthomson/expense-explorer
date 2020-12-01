import * as moment from 'moment'
import { Action, ActionType } from './actions'
import { Store } from './store'

const initialState: Store.App = {
	nDate: moment().unix(),
	oSummary: null,
	filter: null,
	sScope: 'month',
	nYearlyBudget: null,
}

export function appReducers(
	state: Store.App = initialState,
	action: Action,
): Store.App {
	switch (action.type) {
		case ActionType.SET_DATE:
			return {
				...state,
				nDate: action.nDate,
			}
		case ActionType.SET_BUDGET:
			return {
				...state,
				nYearlyBudget: action.nYearlyBudget,
			}
		case ActionType.SET_FILTER:
			return {
				...state,
				filter: action.filter,
			}
		case ActionType.CHANGE_MONTH:
			const { bBackwards } = action
			const { nDate, sScope } = state

			let oDate = moment.unix(nDate)
			const sOffsetUnit = sScope === 'month' ? 'months' : 'years'

			oDate = bBackwards
				? oDate.subtract(1, sOffsetUnit)
				: oDate.add(1, sOffsetUnit)

			return {
				...state,
				nDate: oDate.unix(),
				oSummary: null,
			}
		case ActionType.CHANGE_SCOPE:
			let sScopeFromAction = action.sScope

			sScopeFromAction =
				sScopeFromAction === 'month' ? sScopeFromAction : 'year'

			return {
				...state,
				sScope: sScopeFromAction,
			}
		case ActionType.GET_SUMMARY_SUCCEEDED:
			return {
				...state,
				oSummary: action.oSummary,
			}
	}

	return state
}
