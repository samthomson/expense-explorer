export type Summary = {
	spending_by_category: Category[]
	spending_by_subcategory: Category[]
	spending_over_time: TimeUnit[]
	projected_spending_over_time: TimeUnit[]
	average_per_unit: number
	median_per_unit: number
	mode_per_unit: number
	projection_for_scope: number
	expenses: Expense[]
	totalExpenditure: number
	numberOfExpenses: number
	prospective_budget_for_forecast: number
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
	expense_count: number
	percent: number
	total: number
}

export type TimeUnit = {
	date: number
	total: number
}

export type Filter = {
	term: string // Category, Subcategory
	match: string // food,utility,transport,prepared
}
