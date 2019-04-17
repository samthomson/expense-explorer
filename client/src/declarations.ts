export type Summary = {
	spending_by_category: any[]
	spending_over_time: any[]
	expenses: Expense[]
	totalExpenditure: number
	numberOfExpenses: number
}

export type Expense = {
	amount: number,
	vendor: string,
	category: string,
	subcategory: string,
	date: string
}