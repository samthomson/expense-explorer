import { Summary } from '@shared/declarations'

export namespace Store {
	export type App = {
		iDate: number // unix epoch - milliseconds
		oSummary: Summary | null
		sScope: string // month / year
		fYearlyBudget: number | null
	}
}
