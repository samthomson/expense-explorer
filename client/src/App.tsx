import * as React from 'react'
import { connect } from 'react-redux'

// import AddBot from './components/AddBot'

// interface IAppProps {
// }

class App extends React.Component<{}, {}> {

	public socket: any;
	
    constructor(props: any) {
        super(props)
    }

    public render() {
		const {
		} = this.props

        return (
            <div className="App ui container">
				<p>expense explorer</p>
			</div>
        )
    }
}

export default connect(
	null,
	null
)(App)