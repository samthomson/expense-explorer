export type Action =
	{
		type: 'SET_DATE'
		iDate: number
	} | {
		type: 'SET_BUDGET'
		fYearlyBudget: number
	} | {
		type: 'GET_SUMMARY'
		iDate: number
	} | {
		type: 'GET_SUMMARY_SUCCEEDED'
		oSummary: {}
	} | {
		type: 'CHANGE_MONTH'
		bBackwards: boolean
		oSummary: {}
	} | {
		type: 'CHANGE_SCOPE'
		sScope: string
	}



export const setDate = (iDate: number): Action => {
	return {
		type: 'SET_DATE',
		iDate
	}
}

export const setBudget = (fYearlyBudget: number): Action => {
	return {
		type: 'SET_BUDGET',
		fYearlyBudget
	}
}
  
export const getSummary = (iDate: number): Action => {
	return {
		iDate,
		type: 'GET_SUMMARY',
	}
}
export const getSummarySucceded = (oSummary: {}): Action => {
	return {
		type: 'GET_SUMMARY_SUCCEEDED',
		oSummary
	}
}

export const changeMonth = (bBackwards: boolean) => {
	return {
		type: 'CHANGE_MONTH',
		bBackwards
	}
}

export const changeScope = (sScope: string) => {
	return {
		type: 'CHANGE_SCOPE',
		sScope
	}
}
