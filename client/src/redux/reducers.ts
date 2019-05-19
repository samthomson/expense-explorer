import * as moment from 'moment'
import { Action, ActionType } from './actions'
import { Store } from './store'

const initialState: Store.App = {
	iDate: moment().unix(),
	oSummary: {},
	sScope: 'month',
	fYearlyBudget: null,
}

export function appReducers(
	state: Store.App = initialState,
	action: Action,
): Store.App {
	switch (action.type) {
		case ActionType.SET_DATE:
			return {
				...state,
				iDate: action.iDate,
			}
		case ActionType.SET_BUDGET:
			return {
				...state,
				fYearlyBudget: action.fYearlyBudget,
			}
		case ActionType.CHANGE_MONTH:
			const { bBackwards } = action
			const { iDate, sScope } = state

			let oDate = moment.unix(iDate)
			const sOffsetUnit = sScope === 'month' ? 'months' : 'years'

			oDate = bBackwards
				? oDate.subtract(1, sOffsetUnit)
				: oDate.add(1, sOffsetUnit)

			return {
				...state,
				iDate: oDate.unix(),
				oSummary: {},
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
