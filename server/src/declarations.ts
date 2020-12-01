import * as SharedTypes from '@shared/declarations'
import * as moment from 'moment'

export type Expense = {
	Category: string //'Food/Drink',
	Date: string //'06/01/2018',
	ID?: string // '6B1A25B8-5BCD-431A-9190-73F32F91ACC3' }
	Subcategory: string // 'Fast Food',
	// Type: string //'N/A',
	Vendor: string // 'Pad thai',
}

export interface IElasticExpenseDocument extends Expense {
	_id?: string // auto set by elastic (Since we don't explicitly set it)
	Amount: number // -76,55,
	Fullcategory: string
}

export interface ICSVExpenseRow extends Expense {
	ID: string // '6B1A25B8-5BCD-431A-9190-73F32F91ACC3' }
	Amount: string // '-76,55',
	Payment: string // 'N/A',
	Currency: string // 'DKK',
	Note: string // 'GBP: 9,00 £\nExchange rate: 8.50545829\n',
}

export type BuildElasticQueryInput = {
	sLowerDateRange: string
	sUpperDateRange: string
	oFilter?: SharedTypes.Filter
	sScope: string
}

export type ExpenseData = {
	totalExpenditure: number
	numberOfExpenses: number,
	expenses: SharedTypes.Expense[],
}

export type SpendingOverTimeInput = {
	sScope: SharedTypes.Scope
	oQueriedDate: moment.Moment
	spendingOverTimeBucket: SharedTypes.TimeSpendingBreakdown
	totalExpenditure: number
	nBudget?: number
}

export type TimeUnitSpending = {
	date: string
	expenseCount: number
	total: number
}

export type SpendingOverTimeData = {
	spendingOverTime: TimeUnitSpending[]
	prospectiveBudgetForForecast?: number
}

export type SpendingProjection = {
	total: number
	date: string
	expenseCount: number
}

export type ProjectionData = {
	projectionForScope?: number
	projectedSpendingOverTime?: SpendingProjection[]
	modePerUnit?: number
	medianPerUnit?: number
}

export type ProjectionDataInput = {
	sScope: SharedTypes.Scope
	oQueriedDate: moment.Moment
	fAverage: number
	spendingOverTimeData: TimeUnitSpending[]
}
