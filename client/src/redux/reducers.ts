import * as moment from 'moment'
import { Action } from './actions'
import { Store } from './store'

const initialState: Store.App = {
	iDate: moment().unix(),
	oSummary: {},
	sScope: 'month'
}

export function appReducers(
	state: Store.App = initialState,
	action: Action,
): Store.App {
	switch (action.type) {
		case 'SET_DATE':
			return {
				...state,
				iDate: action.iDate,
			}
			case 'CHANGE_MONTH':
				const { bBackwards } = action
				const { iDate, sScope } = state
	
				let oDate = moment.unix(iDate)
				const sOffsetUnit = (sScope === 'month') ? 'months' : 'years'
	
				oDate = bBackwards ? oDate.subtract(1, sOffsetUnit) : oDate.add(1, sOffsetUnit)
				
				return {
					...state,
					iDate: oDate.unix(),
					oSummary: {}
				}
			case 'CHANGE_SCOPE':
				let sScopeFromAction = action.sScope
	
				sScopeFromAction = (sScopeFromAction === 'month') ? sScopeFromAction : 'year'
				
				return {
					...state,
					sScope: sScopeFromAction,
				}
		case 'GET_SUMMARY_SUCCEEDED':
			return {
				...state,
				oSummary: action.oSummary
			}
	}

	return state
}
