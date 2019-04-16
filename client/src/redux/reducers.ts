import { Action } from './actions'
import { Store } from './store'

const initialState: Store.App = {
	sDate: '',
	oSummary: {}
}



// const client = new ApolloClient({
// 	link: createHttpLink({ uri: 'http://api.githunt.com/graphql' })
//   })



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
		case 'GET_SUMMARY_SUCCEEDED':
			console.log('summary succeeded reducer: ', action.oSummary)
			return {
				...state,
				oSummary: action.oSummary,
			}
	}

	return state
}
