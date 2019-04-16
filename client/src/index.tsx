import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, Store as ReduxStore } from 'redux'
import { getSummary } from './redux/actions'

import App from './App'
// import './index.css'
import { appReducers } from './redux/reducers'
import { Store } from './redux/store'
// import registerServiceWorker from './registerServiceWorker';

// import socketMiddleware from './socketMiddleware';

const store: ReduxStore<Store.App> = createStore(appReducers)

store.dispatch(getSummary(4, 2019))


ReactDOM.render(
	<div>
		<Provider store={store}>
			<App />
		</Provider>
	</div>,
	document.getElementById('root') as HTMLElement
);
// registerServiceWorker();
