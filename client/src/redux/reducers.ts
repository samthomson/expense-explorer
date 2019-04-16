import * as moment from 'moment'
import { Action } from './actions'
import { Store } from './store'

const initialState: Store.App = {
	oDate: moment(),
	oSummary: {}
}


export function appReducers(
	state: Store.App = initialState,
	action: Action,
): Store.App {
	switch (action.type) {
		case 'SET_DATE':
			return {
				...state,
				oDate: action.oDate,
			}
		case 'CHANGE_MONTH':
			const { bBackwards } = action
			let { oDate } = state

			if (bBackwards) {
				oDate = oDate.subtract(1, 'months')
			} else {
				oDate = oDate.add(1, 'months')
			}
			console.log(oDate)
			return {
				...state,
				oDate
			}
		case 'GET_SUMMARY_SUCCEEDED':
			console.log('summary succeeded reducer: ', action.oSummary)
			return {
				...state,
				oSummary: action.oSummary,
			}
	}

	return state
}
