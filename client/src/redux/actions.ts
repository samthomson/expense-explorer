import { Summary } from '@shared/declarations'

export enum ActionType {
	CHANGE_MONTH = 'CHANGE_MONTH',
	CHANGE_SCOPE = 'CHANGE_SCOPE',
	GET_SUMMARY = 'GET_SUMMARY',
	GET_SUMMARY_SUCCEEDED = 'GET_SUMMARY_SUCCEEDED',
	SET_BUDGET = 'SET_BUDGET',
	SET_DATE = 'SET_DATE',
}

export type Action =
	| {
			type: ActionType.SET_DATE
			iDate: number
	  }
	| {
			type: ActionType.SET_BUDGET
			fYearlyBudget: number
	  }
	| {
			type: ActionType.GET_SUMMARY
			iDate: number
	  }
	| {
			type: ActionType.GET_SUMMARY_SUCCEEDED
			oSummary: Summary
	  }
	| {
			type: ActionType.CHANGE_MONTH
			bBackwards: boolean
			oSummary: Summary
	  }
	| {
			type: ActionType.CHANGE_SCOPE
			sScope: string
	  }

export const setDate = (iDate: number): Action => {
	return {
		type: ActionType.SET_DATE,
		iDate,
	}
}

export const setBudget = (fYearlyBudget: number): Action => {
	return {
		type: ActionType.SET_BUDGET,
		fYearlyBudget,
	}
}

export const getSummary = (iDate: number): Action => {
	return {
		iDate,
		type: ActionType.GET_SUMMARY,
	}
}
export const getSummarySucceded = (oSummary: Summary): Action => {
	return {
		type: ActionType.GET_SUMMARY_SUCCEEDED,
		oSummary,
	}
}

export const changeMonth = (bBackwards: boolean) => {
	return {
		type: 'CHANGE_MONTH',
		bBackwards,
	}
}

export const changeScope = (sScope: string) => {
	return {
		type: 'CHANGE_SCOPE',
		sScope,
	}
}
