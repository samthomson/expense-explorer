
export type Action =
	{
		type: 'SET_DATE'
		sDate: string
	} | {
		type: 'GET_SUMMARY'
		year: number
		month: number
	} | {
		type: 'GET_SUMMARY_SUCCEEDED'
		oSummary: {}
	}



export const setDate = (sDate: string): Action => {
	return {
		type: 'SET_DATE',
		sDate
	}
}
  
export const getSummary = (month: number, year: number): Action => {
	return {
		year,
		month,
		type: 'GET_SUMMARY',
	}
}
export const getSummarySucceded = (oSummary: {}): Action => {
	return {
		type: 'GET_SUMMARY_SUCCEEDED',
		oSummary
	}
}