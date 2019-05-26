type Expense = {
	Category: string //'Food/Drink',
	Date: string //'06/01/2018',
	ID: string // '6B1A25B8-5BCD-431A-9190-73F32F91ACC3' }
	Subcategory: string // 'Fast Food',
	Type: string //'N/A',
	Vendor: string // 'Pad thai',
}

export interface IElasticExpenseDocument extends Expense {
	_id?: string // auto set by elastic (Since we don't explicitly set it)
	Amount: number // -76,55,
	Fullcategory: string
}

export interface ICSVExpenseRow extends Expense {
	Amount: string // '-76,55',
	Payment: string // 'N/A',
	Currency: string // 'DKK',
	Note: string // 'GBP: 9,00 £\nExchange rate: 8.50545829\n',
}