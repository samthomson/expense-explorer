export type Summary = {
	expenses: Expense[]
	totalExpenditure: number
	numberOfExpenses: number
}

export type Expense = {
	amount: number,
	vendor: string,
	category: string,
	subcategory: string
}