import * as moment from 'moment'
import * as React from 'react'
import { connect } from 'react-redux'
import { changeMonth, getSummary } from './redux/actions'
import { Store } from './redux/store'

import { Summary } from './declarations'

interface IAppProps {
	iDate: number
	oSummary: Summary
	changeMonth: (bBackwards: boolean) => {}
	getSummary: (iDate: number) => {}
}

class App extends React.Component<IAppProps, {}> {

	public socket: any;
	
    constructor(props: any) {
        super(props)
	}
	
	public eChangeMonth(bBackwards: boolean) {
		this.props.changeMonth(bBackwards)
		this.props.getSummary(this.props.iDate)
	}

    public render() {
		const {
			iDate,
			oSummary
		} = this.props
		const {
			expenses,
			numberOfExpenses,
			totalExpenditure
		} = oSummary

        return (
            <div className="App ui container">
				<p>expense explorer</p>
				{/* date navigation */}
				<p>
					<a onClick={() => this.eChangeMonth(true)}>left</a>
					 - {moment(iDate).format('MMMM YYYY')} - 
					<a onClick={() => this.eChangeMonth(false)}>right</a>
				</p>
				{/* render expenses for current date */}
				{totalExpenditure && (
					<div>
						<p>total expenditure (dkk): {totalExpenditure.toFixed(0)} (${(totalExpenditure * 0.15).toFixed(2)})</p>
						<p>total expenses: {numberOfExpenses}</p>

						<hr />
						{expenses.map(
							(oSingleExpense, i) => <div key={i}>
							{oSingleExpense.amount} {oSingleExpense.vendor}{oSingleExpense.category}{oSingleExpense.subcategory}
							</div>
						)}
					</div>
				)}
			</div>
        )
    }
}

const mapStateToProps = (state: Store.App) => {
	const { iDate, oSummary } = state
	return {
		iDate,
		oSummary
	}
}

const mapDispatchToProps = (dispatch: any) => ({
	changeMonth: (bBackwards: boolean) => dispatch(changeMonth(bBackwards)),
	getSummary: (iDate: number) => dispatch(getSummary(iDate))
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App)