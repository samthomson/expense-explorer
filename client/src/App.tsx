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
import ScopedTitle from 'src/components/ScopedTitle'
import ScopeInput from 'src/components/ScopeInput'
import ScopeNavigation from 'src/components/ScopeNavigation'
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
	endDate: moment.Moment
	filter: Filter
	oSummary: Summary
	sScope: SharedTypes.Scope
	changeMonth: (bBackwards: boolean) => {}
	changeScope: (sScope: string) => {}
	getSummary: () => {}
	setBudget: (fYearlyBudget: number) => {}
	setFilter: (oSummary: Filter | null) => {}
}

const App: React.StatelessComponent<IAppProps> = ({initialDate, endDate, filter, oSummary, sScope, nYearlyBudget, changeMonth, changeScope, getSummary, setBudget, setFilter}) => {
	
	
	


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
						<ScopeInput scope={sScope} changeScope={(newScope: SharedTypes.Scope) => eChangeScope(newScope)} />
						{sScope === 'custom' && <DateEntry />}
					</div>
					<div className="column centered-text">
						<ScopedTitle initialDate={initialDate} endDate={endDate} sScope={sScope} filter={filter} removeFilter={() => eRemoveFilter()} />
						
					</div>
					<div className="column">
						<ScopeNavigation navigate={eChangeMonth}  />						
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
	const { initialDate, endDate, filter, oSummary, sScope, nYearlyBudget } = state
	return {
		initialDate,
		filter,
		oSummary,
		sScope,
		nYearlyBudget,
		endDate
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
