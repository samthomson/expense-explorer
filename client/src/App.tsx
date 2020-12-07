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
	changeMonth as changeMonthAction,
	changeScope as changeScopeAction,
	getSummary as getSummaryAction,
	setBudget as setBudgetAction,
	setFilter as setFilterAction,
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

const App: React.StatelessComponent<IAppProps> = ({initialDate, filter, oSummary, sScope, nYearlyBudget, changeMonth, changeScope, getSummary, setBudget, setFilter}) => {
	
	
	const scopeLabel = (date: moment.Moment, currentScope: string) => {
		const sFormat = currentScope === 'month' ? 'MMMM YYYY' : 'Y'
		return date.format(sFormat)
	}


	const eChangeMonth = (bBackwards: boolean) => {
		changeMonth(bBackwards)
		getSummary()
	}

	const eChangeScope = (newScope: SharedTypes.Scope) => {
		changeScope(newScope)
		getSummary()
	}

	const eChangeBudget = (fBudget: number) => {
		setBudget(fBudget)
		getSummary()
	}

	const eSetFilter = (term: string, match: string) => {
		setFilter({ term, match })
		getSummary()
	}
	
	const eRemoveFilter = () => {
		setFilter(null)
		getSummary()
	}

	

	if (!oSummary) {
		return (<React.Fragment>...no data.. (loading?)</React.Fragment>)
	}

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
						<ScopeInput scope={sScope} changeScope={(newScope: SharedTypes.Scope) => eChangeScope(newScope)} />
						{sScope === 'custom' && <DateEntry />}
					</div>
					<div className="column centered-text">
						{/* current period */}
						<h2>
							{scopeLabel(initialDate, sScope)}
							{filter && (
								<span>
									&nbsp;(&nbsp;
									{filter.term}:{filter.match}
									<a onClick={() => eRemoveFilter()}>
										<i className="icon trash" />
									</a>
									&nbsp;)
								</span>
							)}
						</h2>
					</div>
					<div className="column">
						{/* date navigation */}
						<div className="ui small buttons right floated">
							<button
								className="ui labeled icon button"
								onClick={() => eChangeMonth(true)}
							>
								<i className="left chevron icon" />
								Back
							</button>
							<button
								className="ui right labeled icon button"
								onClick={() => eChangeMonth(false)}
							>
								Forward
								<i className="right chevron icon" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* render expenses for current date */}
			{!!totalExpenditure && totalExpenditure > 0 && spendingOverTime && spendingByCategory && spendingBySubcategory && expenses && oSummary.averagePerUnit && (
				<div>
					<br />
					<SpendingSummary oSummary={oSummary} nYearlyBudget={nYearlyBudget} scope={sScope} initialDate={initialDate} setBudget={eChangeBudget} />
					<SpendingOverTime initialDate={initialDate} scope={sScope} summary={oSummary} timeunits={spendingOverTime} />
					<br />
					<CategoryExpenses
						categories={spendingByCategory}
						eSetFilter={eSetFilter}
						sCategoryName={'Category'}
					/>
					<br />
					<CategoryExpenses
						categories={spendingBySubcategory}
						eSetFilter={eSetFilter}
						sCategoryName={'Subcategory'}
					/>
					<br />
					<div>
						<h3>Expenses</h3>
						<ExpenseTable
							eSetFilter={eSetFilter}
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
	changeMonth: (bBackwards: boolean) => dispatch(changeMonthAction(bBackwards)),
	changeScope: (sScope: string) => dispatch(changeScopeAction(sScope)),
	getSummary: () => dispatch(getSummaryAction()),
	setBudget: (fYearlyBudget: number) => dispatch(setBudgetAction(fYearlyBudget)),
	setFilter: (filter: Filter | null) => dispatch(setFilterAction(filter)),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(App)
