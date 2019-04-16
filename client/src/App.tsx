import * as React from 'react'
import { connect } from 'react-redux'
import { Store } from './redux/store'

// import AddBot from './components/AddBot'

interface IAppProps {
	date: string
	summary: {totalExpenditure: number}
}

class App extends React.Component<IAppProps, {}> {

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
				<p>{this.props.date}</p>
				<p>{this.props.summary.totalExpenditure}</p>
			</div>
        )
    }
}

const mapStateToProps = (state: Store.App) => {
	console.log('summary: ', state.oSummary)
	return {
		date: state.sDate,
		summary: state.oSummary
	}
}

export default connect(
	mapStateToProps,
	null
)(App)