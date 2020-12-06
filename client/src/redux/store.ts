import { Filter, Summary } from '@shared/declarations'
import moment from 'moment'

export namespace Store {
	export type App = {
		// nDate: number // unix epoch - milliseconds
		nDate: moment.Moment
		// endDate: moment.Moment
		oSummary: Summary | null
		filter: Filter | null
		sScope: string // month / year / custom
		nYearlyBudget?: number
	}
}
