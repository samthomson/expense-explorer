import { Filter, Summary } from '@shared/declarations'

export namespace Store {
	export type App = {
		nDate: number // unix epoch - milliseconds
		oSummary: Summary | null
		filter: Filter | null
		sScope: string // month / year
		nYearlyBudget: number | null
	}
}
