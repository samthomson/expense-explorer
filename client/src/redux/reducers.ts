import * as moment from 'moment'
import { Action } from './actions'
import { Store } from './store'

const initialState: Store.App = {
	iDate: moment().valueOf(),
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
				iDate: action.iDate,
			}
		case 'CHANGE_MONTH':
			const { bBackwards } = action
			const { iDate } = state

			let oDate = moment(iDate)

			oDate = bBackwards ? oDate.subtract(1, 'months') : oDate.add(1, 'months')
			
			return {
				...state,
				iDate: oDate.valueOf(),
				oSummary: {}
			}
		case 'GET_SUMMARY_SUCCEEDED':
			return {
				...state,
				oSummary: action.oSummary
			}
	}

	return state
}
