import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore, Store as ReduxStore } from 'redux'
import { getSummary } from './redux/actions'

import App from './App'
// import './index.css'
import { appReducers } from './redux/reducers'
import { Store } from './redux/store'
// import registerServiceWorker from './registerServiceWorker';

// import socketMiddleware from './socketMiddleware';
import createSagaMiddleware from 'redux-saga'
import mySaga from './redux/saga'

const sagaMiddleware = createSagaMiddleware()

const store: ReduxStore<Store.App> = createStore(
	appReducers,
	applyMiddleware(sagaMiddleware)
)

// store.dispatch(getSummary(4, 2019))
sagaMiddleware.run(mySaga)

setTimeout(() => {
	store.dispatch(getSummary(4, 2019))
}, 1000)

ReactDOM.render(
	<div>
		<Provider store={store}>
			<App />
		</Provider>
	</div>,
	document.getElementById('root') as HTMLElement
);
// registerServiceWorker();
