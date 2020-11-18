export type Summary = {
	spending_by_category?: Category[]
	spending_by_subcategory?: Category[]
	spending_over_time?: TimeUnit[]
	projected_spending_over_time?: TimeUnit[] | null
	average_per_unit?: number
	median_per_unit?: number
	mode_per_unit?: number
	projection_for_scope?: number | null
	expenses?: Expense[]
	totalExpenditure?: number
	numberOfExpenses?: number
	prospective_budget_for_forecast?: number
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

export type PossibleTimeUnits = {
	[key: string]: TimeUnit | {}
}

export type TimeUnit = {
	date: string
	total: number
	expense_count: number
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

export type ElasticSummaryResponse = {
	body: {
		hits: {
			hits: ElasticExpense[]
		}
		aggregations: {
			category_spending_breakdown: {
				buckets: {
					key: string,
					doc_count: number,
					unit_total: {
						value: number
					}
				}[]
			},
			subcategory_spending_breakdown: {
				buckets: {
					key: string,
					doc_count: number,
					unit_total: {
						value: number
					}
				}[]
			},
			time_spending_breakdown: {
				buckets: {
					key_as_string: string,
					key: number,
					doc_count: number,
					unit_total: {
						value: number
					}
				}[]
			}
		}
	}
}