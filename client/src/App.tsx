import * as moment from 'moment'
import * as React from 'react'
// @ts-ignore
import { Line as LineChart, Pie as PieChart } from  'react-chartjs'
import { connect } from 'react-redux'
import './../node_modules/semantic-ui-css/semantic.min.css'
import './App.css'
import { changeMonth, changeScope, getSummary } from './redux/actions'
import { Store } from './redux/store'

import NumberDisplay from './components/NumberDisplay'

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
			spending_by_category,
			spending_over_time,
			expenses,
			totalExpenditure
		}: Summary = oSummary
		
        return (
            <div className="App ui container">
				<h1>expense explorer</h1>
				<div className="ui grid">
					<div className="three column row">
						<div className="column">
							{/* month / year changer */}
							<div className="ui small buttons">
								<button onClick={() => this.eChangeScope('month')} className={'ui button' + (sScope === 'month' ? ' active' : '')}>month</button>
								<div className="or"/>
								<button onClick={() => this.eChangeScope('year')} className={'ui button' + (sScope === 'year' ? ' active' : '')}>year</button>
							</div>
						</div>
						<div className="column centered-text">
							{/* current period */}
							<h2>{this.renderScopeLabel(iDate, sScope)}</h2>
						</div>
						<div className="column">
							{/* date navigation */}
							<div className="ui small buttons right floated">
								<button className="ui labeled icon button" onClick={() => this.eChangeMonth(true)}>
									<i className="left chevron icon" />
									Back
								</button>
								<button className="ui right labeled icon button" onClick={() => this.eChangeMonth(false)}>
									Forward
									<i className="right chevron icon" />
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* render expenses for current date */}
				{(typeof totalExpenditure !== 'undefined') && totalExpenditure > 0 && (
					<div>
						<br />
						{this.renderSummary()}
						{this.renderSpendingOverTime(spending_over_time)}
						<br />
						{this.renderCategorySpending(spending_by_category)}
						<br />
						{this.renderExpenses(expenses)}
						
					</div>
				)}
				{(typeof totalExpenditure !== 'undefined') && totalExpenditure === 0 && (
					<div>
						<br />
						<h2 className="centered-text">no expense data for current period..</h2>
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
	
	private renderSummary() {
		const {
			average_per_unit,
			median_per_unit,
			mode_per_unit,
			numberOfExpenses,
			projection_for_scope,
			totalExpenditure
		} = this.props.oSummary
		const { sScope } = this.props

		return (
			<table className="ui table">
				<tbody>
					<tr>
						<td>total expenditure</td>
						<td className="collapsing">
							<strong>$<NumberDisplay number={Number(totalExpenditure.toFixed(2))} /></strong>
						</td>

						<td>expenses</td>
						<td className="collapsing">{numberOfExpenses}</td>
					</tr>
					<tr>
						<td>
							mean average per {sScope === 'year' && 'month'}{sScope === 'month' && 'day'}<br/>
							median per {sScope === 'year' && 'month'}{sScope === 'month' && 'day'}<br/>
							mode per {sScope === 'year' && 'month'}{sScope === 'month' && 'day'}
						</td>
						<td className="collapsing">
							$<NumberDisplay number={Number(average_per_unit.toFixed(2))} /><br />
							${median_per_unit.toFixed(2)}<br />
							${mode_per_unit.toFixed(2)}
						</td>
						{/* only show projection data if the current period is incomplete */}
						{projection_for_scope && (
							<td>projection for {sScope}</td>
						)}
						{projection_for_scope && (
							<td className="collapsing">
								$<NumberDisplay number={Number(projection_for_scope.toFixed(2))} />
							</td>
						)}
					</tr>
				</tbody>
			</table>
		)
	}
	
	private renderSpendingOverTime(timeunits: any[]) {

		if (timeunits.length > 0) {

			const chartOptions = {
				responsive: true,
				maintainAspectRatio: false
			}

			const afSpendingOverTime: number[] = timeunits.map(oP => Number(oP.total))
			const dataLabels = timeunits.map(oP => {
				// make nice date rendered label
				return (this.props.sScope === 'month') ? moment().date(Number(oP.date)).format("Do") : moment().month((Number(oP.date)-1)).format("MMM")
			})

			const chartData = {
				labels: dataLabels,
				datasets: [
					{
						label: "Spending over time",
						fillColor: "rgba(151,187,205,0.2)",
						strokeColor: "rgba(151,187,205,1)",
						pointColor: "rgba(151,187,205,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(151,187,205,1)",
						data: afSpendingOverTime,
					}
				]
			}

			if (this.props.oSummary.projected_spending_over_time) {
				// render projection data too
				const afSpendingProjection = this.props.oSummary.projected_spending_over_time.map(oItem => oItem.total)
				
				chartData.datasets.push(
					{
						label: "Projected Spending",
						fillColor: "rgba(220,220,220,0.2)",
						strokeColor: "rgba(220,220,220,1)",
						pointColor: "rgba(220,220,220,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
						data: afSpendingProjection,
					}
				)
			}

			return (
				<div>
					<LineChart data={chartData} options={chartOptions} width="100%" height="300" />
				</div>
			)
		} else {
			return 'awaiting data'
		}
	}

	private renderCategorySpending(categories: any[]) {

		const chartOptions = {
			responsive: true,
			maintainAspectRatio: false
		}

		const oCategoryColours: any = {
			'Auto/Transportation': 'green',		
			'Bills/Utilities': 'blue',
			'Entertainment': 'orange',
			'Food/Drink': 'red',
			'Miscellaneous': 'yellow',
			'Personal Care': 'purple',
			'Shopping': 'pink',
			'Business/Office': 'teal',
			'Health': 'lime',
			'Travel': 'maroon',
		}

		const chartData = categories.map(oP => {
			return {
				value: (Number(oP.percent)).toFixed(0),
				label: oP.category,
				color: oCategoryColours[oP.category] ? oCategoryColours[oP.category] : 'white'
			}
		})

		return (
			categories.length > 0 && (
				<div>
					<h3>Spending by category</h3>
					<div className="ui grid">
						<div className="eight wide column">
							<table className="ui celled table">
								<thead>
									<tr>
										<th>Category</th>
										<th>Total</th>
										<th># expenses</th>
										<th>%</th>
									</tr>
								</thead>
								<tbody>
									{categories.map(
										(oSingleCategory, i) => {
											return (
												<tr key={i}>
													<td>{oSingleCategory.category}</td>
													<td>${oSingleCategory.total.toFixed(2)}</td>
													<td>{oSingleCategory.expense_count}</td>
													<td>{(oSingleCategory.percent > 1) ? oSingleCategory.percent.toFixed(0) : oSingleCategory.percent.toFixed(1)}%</td>
												</tr>
											)
										}
									)}
								</tbody>
							</table>
						</div>
						<div className="eight wide column">
							<PieChart data={chartData} options={chartOptions} width="100%" height="250" />
						</div>
					</div>
				</div>
			)
		)
	}
	
	private renderExpenses(expenses: any[]) {
		return (
			expenses.length > 0 && (
				<div>
					<h3>expenses</h3>
					<table className="ui celled table">
						<thead>
							<tr>
								<th>usd</th>
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
											<td>${oSingleExpense.amount.toFixed(2)}</td>
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
				</div>
			)
		)
	}
	
	private renderScopeLabel(iDate: number, sScope: string) {
		const sFormat: string = (sScope === 'month') ? 'MMMM YYYY' : 'Y'
		return (
			moment.unix(iDate).format(sFormat)
		)
	}
	
	private sRenderPiciliLink(sDate: string) {
		const oTargetDate: moment.Moment = moment(sDate, "MM/DD/YYYY") // format that went into elastic (raw)
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