import * as moment from 'moment'
import * as React from 'react'
import { connect } from 'react-redux'
import { Store } from './redux/store'

import { Summary } from './declarations'

interface IAppProps {
	oDate: moment.Moment
	oSummary: Summary
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
		} = this.props.oSummary

        return (
            <div className="App ui container">
				<p>expense explorer</p>
				<p>{this.props.oDate.format()}</p>
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
	const { oDate, oSummary } = state
	return {
		oDate,
		oSummary
	}
}

export default connect(
	mapStateToProps
)(App)