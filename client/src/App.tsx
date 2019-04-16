import * as React from 'react'
import { connect } from 'react-redux'
import { Store } from './redux/store'

import { Summary } from './declarations'

interface IAppProps {
	date: string
	summary: Summary
}

class App extends React.Component<IAppProps, {}> {

	public socket: any;
	
    constructor(props: any) {
        super(props)
    }

    public render() {
		const {
			numberOfExpenses,
			totalExpenditure
		} = this.props.summary

        return (
            <div className="App ui container">
				<p>expense explorer</p>
				<p>{this.props.date}</p>
				{totalExpenditure && (
					<div>
						<p>total expenditure (dkk): {totalExpenditure.toFixed(0)} (${(totalExpenditure * 0.15).toFixed(2)})</p>
						<p>total expenses: {numberOfExpenses}</p>
					</div>
				)}
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