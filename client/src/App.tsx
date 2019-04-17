import * as moment from 'moment'
import * as React from 'react'
import { connect } from 'react-redux'
import { changeMonth, changeScope, getSummary } from './redux/actions'
import { Store } from './redux/store'

import { Summary } from './declarations'

interface IAppProps {
	iDate: number
	oSummary: Summary
	sScope: string
	changeMonth: (bBackwards: boolean) => {}
	changeScope: (sScope: string) => {}
	getSummary: (iDate: number) => {}
}

class App extends React.Component<IAppProps, {}> {

	public socket: any;
	
    constructor(props: any) {
        super(props)
	}

    public render() {
		const {
			iDate,
			oSummary,
			sScope
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
					<strong>{sScope}</strong> mode: <a onClick={() => this.eChangeScope('month')}>month</a> or <a onClick={() => this.eChangeScope('year')}>year</a>
					
				</p>
				<p>
					<a onClick={() => this.eChangeMonth(true)}>left</a>
					 - {this.renderScopeLabel(iDate, sScope)} - 
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
														{this.sRenderPiciliLink(oSingleExpense.date)}
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
	
	private eChangeMonth(bBackwards: boolean) {
		this.props.changeMonth(bBackwards)
		this.props.getSummary(this.props.iDate)
	}
	
	private eChangeScope(sScope: string) {
		this.props.changeScope(sScope)
		this.props.getSummary(this.props.iDate)
	}
	
	private renderScopeLabel(iDate: number, sScope: string) {
		const sFormat: string = (sScope === 'month') ? 'MMMM YYYY' : 'Y'
		return (
			moment.unix(iDate).format(sFormat)
		)
	}
	
	private sRenderPiciliLink(sDate: string) {
		const oTargetDate: moment.Moment = moment(sDate)
		const sDisplayDate: string = oTargetDate.format('ddd Do')
		const sQueryValueDate: string = oTargetDate.format('DD/MM/YYYY')
		const sPiciliURL: string = `https://test-instance.picili.com/1/calendar?filters=[{"type":"calendar","display":"${sDisplayDate}","value":"day:${sQueryValueDate}"}]`

		return (
			<a
				target="_blank"
				href={sPiciliURL}
			>{sDisplayDate}</a>
		)
	}
}

const mapStateToProps = (state: Store.App) => {
	const { iDate, oSummary, sScope } = state
	return {
		iDate,
		oSummary,
		sScope
	}
}

const mapDispatchToProps = (dispatch: any) => ({
	changeMonth: (bBackwards: boolean) => dispatch(changeMonth(bBackwards)),
	changeScope: (sScope: string) => dispatch(changeScope(sScope)),
	getSummary: (iDate: number) => dispatch(getSummary(iDate))
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App)