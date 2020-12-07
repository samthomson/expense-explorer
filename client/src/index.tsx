import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore, Store as ReduxStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import { getSummary } from './redux/actions'

import App from './App'
import { appReducers } from './redux/reducers'
import rootSaga from './redux/saga'
import { Store } from './redux/store'

const sagaMiddleware = createSagaMiddleware()


const store: ReduxStore<Store.App> = createStore(
	appReducers,
	composeWithDevTools(applyMiddleware(sagaMiddleware)),
)

sagaMiddleware.run(rootSaga)

store.dispatch(getSummary(store.getState().initialDate))

ReactDOM.render(
	<div>
		<Provider store={store}>
			<App />
		</Provider>
	</div>,
	document.getElementById('root') as HTMLElement,
)
