import { Filter, Summary } from '@shared/declarations'
import moment from 'moment'

export namespace Store {
	export type App = {
		// initialDate: number // unix epoch - milliseconds
		initialDate: moment.Moment
		// endDate: moment.Moment
		oSummary: Summary | null
		filter: Filter | null
		sScope: string // month / year / custom
		nYearlyBudget?: number
	}
}
