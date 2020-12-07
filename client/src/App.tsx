import { Filter, Summary } from '@shared/declarations'
import * as SharedTypes from '@shared/declarations'
import * as moment from 'moment'
import * as React from 'react'
// @ts-ignore
import { Line as LineChart, Pie as PieChart } from 'react-chartjs'
import { connect } from 'react-redux'
import 'src/App.css'
import CategoryExpenses from 'src/components/CategoryExpenses'
import DateEntry from 'src/components/DateEntry'
import ExpenseTable from 'src/components/ExpenseTable'
import ScopeInput from 'src/components/ScopeInput'
import SpendingOverTime from 'src/components/SpendingOverTime'
import SpendingSummary from 'src/components/SpendingSummary'

import {
	Action,
	changeMonth,
	changeScope,
	getSummary,
	setBudget,
	setFilter,
} from 'src/redux/actions'
import { Store } from 'src/redux/store'
import './../node_modules/semantic-ui-css/semantic.min.css'

interface IAppProps {
	nYearlyBudget?: number
	initialDate: moment.Moment
	filter: Filter
	oSummary: Summary
	sScope: SharedTypes.Scope
	changeMonth: (bBackwards: boolean) => {}
	changeScope: (sScope: string) => {}
	getSummary: () => {}
	setBudget: (fYearlyBudget: number) => {}
	setFilter: (oSummary: Filter | null) => {}
}

class App extends React.Component<IAppProps, {}> {
	public renderError() {
		return '...no data.. (loading?)'
	}

	public renderDateInputUI() {
		return (
			<div className="ui small buttons right floated">
				<button
					className="ui labeled icon button"
					onClick={() => this.eChangeMonth(true)}
				>
					<i className="left chevron icon" />
					Back
				</button>
				<button
					className="ui right labeled icon button"
					onClick={() => this.eChangeMonth(false)}
				>
					Forward
					<i className="right chevron icon" />
				</button>
			</div>
		)
	}

	public renderEverything() {
		const { initialDate, filter, oSummary, sScope } = this.props
		const {
			spendingByCategory,
			spendingBySubcategory,
			spendingOverTime,
			expenses,
			totalExpenditure,
		}: Summary = oSummary
		return (
			<div className="App ui container">
				<h1>expense explorer</h1>
				<div className="ui grid">
					<div className="three column row">
						<div className="column">
							{/* month / year changer */}
							<ScopeInput scope={sScope} changeScope={(newScope: SharedTypes.Scope) => this.eChangeScope(newScope)} />
							{sScope === 'custom' && <DateEntry />}
						</div>
						<div className="column centered-text">
							{/* current period */}
							<h2>
								{this.renderScopeLabel(initialDate, sScope)}
								{filter && (
									<span>
										&nbsp;(&nbsp;
										{filter.term}:{filter.match}
										<a onClick={() => this.eRemoveFilter()}>
											<i className="icon trash" />
										</a>
										&nbsp;)
									</span>
								)}
							</h2>
						</div>
						<div className="column">
							{/* date navigation */}
							{this.renderDateInputUI()}
						</div>
					</div>
				</div>

				{/* render expenses for current date */}
				{!!totalExpenditure && totalExpenditure > 0 && spendingOverTime && spendingByCategory && spendingBySubcategory && expenses && oSummary.averagePerUnit && (
					<div>
						<br />
						<SpendingSummary oSummary={this.props.oSummary} nYearlyBudget={this.props.nYearlyBudget} scope={this.props.sScope} initialDate={this.props.initialDate} setBudget={this.eChangeBudget} />
						<SpendingOverTime initialDate={initialDate} scope={sScope} summary={oSummary} timeunits={spendingOverTime} />
						<br />
						<CategoryExpenses
							categories={spendingByCategory}
							eSetFilter={this.eSetFilter}
							sCategoryName={'Category'}
						/>
						<br />
						<CategoryExpenses
							categories={spendingBySubcategory}
							eSetFilter={this.eSetFilter}
							sCategoryName={'Subcategory'}
						/>
						<br />
						<div>
							<h3>Expenses</h3>
							<ExpenseTable
								eSetFilter={this.eSetFilter}
								expenses={expenses}
							/>
						</div>
					</div>
				)}
				{totalExpenditure === 0 && (
					<div>
						<br />
						<h2 className="centered-text">
							no expense data for current period..
						</h2>
					</div>
				)}
			</div>
		)
	}

	public render() {
		return this.props.oSummary
			? this.renderEverything()
			: this.renderError()
	}

	private eChangeMonth(bBackwards: boolean) {
		this.props.changeMonth(bBackwards)
		this.props.getSummary()
	}

	private eChangeScope(sScope: string) {
		this.props.changeScope(sScope)
		this.props.getSummary()
	}

	private eChangeBudget(fBudget: number) {
		this.props.setBudget(fBudget)
		this.props.getSummary()
	}

	private renderScopeLabel(date: moment.Moment, sScope: string) {
		const sFormat: string = sScope === 'month' ? 'MMMM YYYY' : 'Y'
		return date.format(sFormat)
	}

	private eSetFilter = (term: string, match: string) => {
		this.props.setFilter({ term, match })
		this.props.getSummary()
	}
	private eRemoveFilter = () => {
		this.props.setFilter(null)
		this.props.getSummary()
	}
}

const mapStateToProps = (state: Store.App) => {
	const { initialDate, filter, oSummary, sScope, nYearlyBudget } = state
	return {
		initialDate,
		filter,
		oSummary,
		sScope,
		nYearlyBudget,
	}
}

const mapDispatchToProps = (dispatch: React.Dispatch<Action>) => ({
	changeMonth: (bBackwards: boolean) => dispatch(changeMonth(bBackwards)),
	changeScope: (sScope: string) => dispatch(changeScope(sScope)),
	getSummary: () => dispatch(getSummary()),
	setBudget: (fYearlyBudget: number) => dispatch(setBudget(fYearlyBudget)),
	setFilter: (filter: Filter | null) => dispatch(setFilter(filter)),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(App)
