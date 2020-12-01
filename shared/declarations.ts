export type Summary = {
	spendingByCategory?: Category[]
	spendingBySubcategory?: Category[]
	spendingOverTime?: TimeUnit[]
	projectedSpendingOverTime?: TimeUnit[] | null
	averagePerUnit?: number
	medianPerUnit?: number
	modePerUnit?: number
	projectionForScope?: number | null
	expenses?: Expense[]
	totalExpenditure?: number
	numberOfExpenses?: number
	prospectiveBudgetForForecast?: number
}

export type Expense = {
	amount: number
	vendor: string
	category: string
	subcategory: string
	date: string
}

export type Category = {
	category: string
	expenseCount: number
	percent: number
	total: number
}

export type PossibleTimeUnits = {
	[key: string]: TimeUnit | {}
}

export type TimeUnit = {
	date: string
	total: number
	expenseCount: number
}

export type Filter = {
	term: string // Category, Subcategory
	match: string // food,utility,transport,prepared
}

type ElasticExpense = {
	_source: {
		Date: string,
		Type: string,
		Category: string,
		Subcategory: string,
		Vendor: string,
		Amount: number,
		Fullcategory: string
	}
}

export type CategorySpendingBreakdown = {
	buckets: Array<{
		key: string,
		doc_count: number,
		unit_total: {
			value: number
		}
	}>
}

export type TimeSpendingBreakdown = {
	buckets: Array<{
		key_as_string: string,
		key: number,
		doc_count: number,
		unit_total: {
			value: number
		}
	}>
}

export type ElasticSummaryResponse = {
	body: {
		hits: {
			hits: ElasticExpense[]
		}
		aggregations: {
			category_spending_breakdown: CategorySpendingBreakdown,
			subcategory_spending_breakdown: CategorySpendingBreakdown,
			time_spending_breakdown: TimeSpendingBreakdown
		}
	}
}
export type Scope = 'month' | 'year'