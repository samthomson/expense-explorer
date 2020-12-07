import * as moment from 'moment'
import { Action, ActionType } from './actions'
import { Store } from './store'

const initialState: Store.App = {
	initialDate: moment(),
	endDate: moment().add(1, 'days'),
	oSummary: null,
	filter: null,
	sScope: 'month',
	nYearlyBudget: undefined,
}

export function appReducers(
	state: Store.App = initialState,
	action: Action,
): Store.App {
	switch (action.type) {
		case ActionType.SET_DATE:
			return {
				...state,
				initialDate: action.initialDate,
				endDate: action.endDate,
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
			const { initialDate, sScope } = state

			let oDate = initialDate.clone()
			const sOffsetUnit = sScope === 'month' ? 'months' : 'years'

			oDate = bBackwards
				? oDate.subtract(1, sOffsetUnit)
				: oDate.add(1, sOffsetUnit)

			return {
				...state,
				initialDate: oDate,
				oSummary: null,
			}
		case ActionType.CHANGE_SCOPE:
			return {
				...state,
				sScope: action.sScope
			}
		case ActionType.GET_SUMMARY_SUCCEEDED:
			return {
				...state,
				oSummary: action.oSummary,
			}
	}

	return state
}
