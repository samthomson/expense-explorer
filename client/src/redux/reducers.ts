import { Action } from './actions'
import { Store } from './store'

const initialState: Store.App = {
	sDate: ''
}

export function appReducers(
	state: Store.App = initialState,
	action: Action,
): Store.App {
	switch (action.type) {
		case 'SET_DATE':
			return {
				...state,
				sDate: action.sDate,
			}
	}

	return state
}
