import { Summary } from '@shared/declarations'

export enum ActionType {
	CHANGE_MONTH = 'CHANGE_MONTH',
	CHANGE_SCOPE = 'CHANGE_SCOPE',
	GET_SUMMARY = 'GET_SUMMARY',
	GET_SUMMARY_SUCCEEDED = 'GET_SUMMARY_SUCCEEDED',
	GET_SUMMARY_FAILED = 'GET_SUMMARY_FAILED',
	SET_BUDGET = 'SET_BUDGET',
	SET_DATE = 'SET_DATE',
}

export type Action =
	| {
			type: ActionType.SET_DATE
			nDate: number
	  }
	| {
			type: ActionType.SET_BUDGET
			nYearlyBudget: number
	  }
	| {
			type: ActionType.GET_SUMMARY
			nDate: number
	  }
	| {
			type: ActionType.GET_SUMMARY_SUCCEEDED
			oSummary: Summary
	  }
	| {
			type: ActionType.GET_SUMMARY_FAILED
	  }
	| {
			type: ActionType.CHANGE_MONTH
			bBackwards: boolean
			oSummary: Summary | null
	  }
	| {
			type: ActionType.CHANGE_SCOPE
			sScope: string
			oSummary: Summary | null
	  }

export const setDate = (nDate: number): Action => {
	return {
		type: ActionType.SET_DATE,
		nDate,
	}
}

export const setBudget = (nYearlyBudget: number): Action => {
	return {
		type: ActionType.SET_BUDGET,
		nYearlyBudget,
	}
}

export const getSummary = (nDate: number): Action => {
	return {
		nDate,
		type: ActionType.GET_SUMMARY,
	}
}

export const getSummarySucceded = (oSummary: Summary): Action => {
	return {
		type: ActionType.GET_SUMMARY_SUCCEEDED,
		oSummary,
	}
}

export const getSummaryFailed = (): Action => {
	return {
		type: ActionType.GET_SUMMARY_FAILED,
	}
}

export const changeMonth = (bBackwards: boolean): Action => {
	return {
		type: ActionType.CHANGE_MONTH,
		bBackwards,
		oSummary: null,
	}
}

export const changeScope = (sScope: string): Action => {
	return {
		type: ActionType.CHANGE_SCOPE,
		sScope,
		oSummary: null,
	}
}
