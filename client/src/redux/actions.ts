import * as moment from 'moment'

export type Action =
	{
		type: 'SET_DATE'
		oDate: moment.Moment
	} | {
		type: 'GET_SUMMARY'
		year: number
		month: number
	} | {
		type: 'GET_SUMMARY_SUCCEEDED'
		oSummary: {}
	}



export const setDate = (oDate: moment.Moment): Action => {
	return {
		type: 'SET_DATE',
		oDate
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