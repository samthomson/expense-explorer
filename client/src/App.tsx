import * as moment from 'moment'
import * as React from 'react'
// @ts-ignore
import { Line as LineChart, Pie as PieChart } from  'react-chartjs'
import { connect } from 'react-redux'
import './../node_modules/semantic-ui-css/semantic.min.css'
import './App.css'
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
	private USDDKKOffset: number = 0.15

	
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
				{totalExpenditure && (
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
			numberOfExpenses,
			projection_for_scope,
			totalExpenditure
		} = this.props.oSummary
		return (
			<table className="ui table">
				<tbody>
					<tr>
						<td>total expenditure</td>
						<td className="collapsing">{totalExpenditure.toFixed(0)} (${(totalExpenditure * this.USDDKKOffset).toFixed(2)})</td>

						<td>expenses</td>
						<td className="collapsing">{numberOfExpenses}</td>
					</tr>
					<tr>
						<td>average per day/month</td>
						<td className="collapsing">{average_per_unit.toFixed(2)} (${(average_per_unit * this.USDDKKOffset).toFixed(2)})</td>

						<td>projection for month/year</td>
						<td className="collapsing">{projection_for_scope.toFixed(0)} (${(projection_for_scope * this.USDDKKOffset).toFixed(2)})</td>
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

			const dataPoints = timeunits.map(oP => Number(oP.total))
			const dataLabels = timeunits.map(oP => oP.date)

			const chartData = {
				labels: dataLabels,
				datasets: [
					{
						label: "Spending over time",
						fillColor: "rgba(220,220,220,0.2)",
						strokeColor: "rgba(220,220,220,1)",
						pointColor: "rgba(220,220,220,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
						data: dataPoints,
					}
				]
			}

			return (
				<div>
					<LineChart data={chartData} options={chartOptions} width="100%" height="180" />
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
			'Business/Offtice': 'teal',
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
										<th>Total DKK</th>
										<th>Total USD</th>
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
													<td>{oSingleCategory.total.toFixed(2)}</td>
													<td>{(oSingleCategory.total * this.USDDKKOffset).toFixed(2)}</td>
													<td>{oSingleCategory.expense_count}</td>
													<td>{oSingleCategory.percent.toFixed(0)}</td>
												</tr>
											)
										}
									)}
								</tbody>
							</table>
						</div>
						<div className="eight wide column">
							<PieChart data={chartData} options={chartOptions} width="600" height="250" />
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
											<td>{oSingleExpense.amount} (${(oSingleExpense.amount * this.USDDKKOffset).toFixed(2)})</td>
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