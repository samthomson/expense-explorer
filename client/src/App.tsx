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
		const USDDKKOffset = 0.15

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
						<p>total expenditure (dkk): {totalExpenditure.toFixed(0)} (${(totalExpenditure * USDDKKOffset).toFixed(2)})</p>
						<p>total expenses: {numberOfExpenses}</p>

						<hr />
						{expenses.length > 0 && (
							<table>
								<thead>
									<tr>
										<th>dkk (usd)</th>
										<th>item</th>
										<th>category</th>
										<th>subcategory</th>
										<th>date</th>
									</tr>
								</thead>
								<tbody>
									{expenses.map(
										(oSingleExpense, i) => {
											return (
												<tr key={i}>
													<td>{oSingleExpense.amount} (${(oSingleExpense.amount * USDDKKOffset).toFixed(2)})</td>
													<td>{oSingleExpense.vendor}</td>
													<td>{oSingleExpense.category}</td>
													<td>{oSingleExpense.subcategory}</td>
													<td>
														<a
															target="_blank"
															href={this.sGetPiciliUrl(oSingleExpense.date)}
														>{oSingleExpense.date}</a>
													</td>
												</tr>
											)
										}
									)}
								</tbody>
							</table>
						)}
					</div>
				)}
			</div>
        )
    }
	
	private sGetPiciliUrl(sDate: string): string {
		const oTargetDate: moment.Moment = moment(sDate)
		const sDisplayDate: string = oTargetDate.format('ddd Do')
		const sQueryValueDate: string = oTargetDate.format('DD/MM/YYYY')
		return `https://test-instance.picili.com/1/calendar?filters=[{"type":"calendar","display":"${sDisplayDate}","value":"day:${sQueryValueDate}"}]`
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