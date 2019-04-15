import * as React from 'react'
import * as ReactDOM from 'react-dom'
// import { Provider } from 'react-redux'
// import { applyMiddleware, createStore, Store as ReduxStore } from 'redux'

// import App from './App'
// import './index.css'
// import { appReducers } from './redux/reducers'
// import { Store } from './redux/store'
// import registerServiceWorker from './registerServiceWorker';

// import socketMiddleware from './socketMiddleware';

// const createStoreWithMiddleware = applyMiddleware(
// 	socketMiddleware
// )(createStore);

// const store: ReduxStore<Store.App> = createStoreWithMiddleware(
// 	appReducers
// )

ReactDOM.render(
	<div>
		expense explorer
		{/* <Provider store={store}>
			<App />
		</Provider> */}
	</div>,
	document.getElementById('root') as HTMLElement
);
// registerServiceWorker();
