import * as SharedTypes from '@shared/declarations'
import moment from 'moment'

export namespace Store {
	export type App = {
		// initialDate: number // unix epoch - milliseconds
		initialDate: moment.Moment
		endDate: moment.Moment
		oSummary: SharedTypes.Summary | null
		filter: SharedTypes.Filter | null
		sScope: SharedTypes.Scope // month / year / custom
		nYearlyBudget?: number
	}
}
