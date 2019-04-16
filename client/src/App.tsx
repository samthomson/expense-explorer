import * as moment from 'moment'
import * as React from 'react'
import { connect } from 'react-redux'
import { changeMonth } from './redux/actions'
import { Store } from './redux/store'

import { Summary } from './declarations'

interface IAppProps {
	oDate: moment.Moment
	oSummary: Summary
	changeMonth: (bBackwards: boolean) => {}
}

class App extends React.Component<IAppProps, {}> {

	public socket: any;
	
    constructor(props: any) {
        super(props)
    }

    public render() {
		const {
			oDate,
			oSummary
		} = this.props
		const {
			numberOfExpenses,
			totalExpenditure
		} = oSummary

        return (
            <div className="App ui container">
				<p>expense explorer</p>
				{/* date navigation */}
				<p>
					<a onClick={() => this.props.changeMonth(true)}>left</a>
					 - {oDate.format()} - 
					<a onClick={() => this.props.changeMonth(false)}>right</a>
				</p>
				{/* render expenses for current date */}
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
	console.log('mapStateToProps: ', state)
	const { oDate, oSummary } = state
	return {
		oDate,
		oSummary
	}
}

const mapDispatchToProps = (dispatch: any) => ({
	changeMonth: (bBackwards: boolean) => dispatch(changeMonth(bBackwards))
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App)