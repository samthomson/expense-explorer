export type Summary = {
	spending_by_category: any[]
	spending_by_subcategory: any[]
	spending_over_time: any[]
	projected_spending_over_time: any[]
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
