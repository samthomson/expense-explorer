import * as SharedTypes from '@shared/declarations'
import * as moment from 'moment'
import * as React from 'react'
import NumberDisplay from 'src/components/NumberDisplay'

interface IProps {
	nYearlyBudget?: number
	oSummary: SharedTypes.Summary
	scope: SharedTypes.Scope
	initialDate: moment.Moment
	setBudget: (newBudget: number) => void
}

const SpendingSummary: React.StatelessComponent<IProps> = ({
	oSummary,
	scope: sScope,
	nYearlyBudget,
	initialDate,
	setBudget,
}) => {
	// todo: defaults of -1 to shut linter up, later types should be updated to be non nullable, that means changing API elastic.ts file
	const {
		averagePerUnit = -1,
		medianPerUnit = -1,
		modePerUnit = -1,
		numberOfExpenses,
		projectionForScope,
		prospectiveBudgetForForecast,
		totalExpenditure = -1,
	} = oSummary

	const sDisplayPeriod: string = sScope === 'year' ? 'month' : 'day'

	// is the current date within the current month/year. e.g. if current date is may 12th, and it is may 19th. Then it is in the current period (both month and year scope)
	const bInCurrentPeriod: boolean = initialDate.isSame(
		new Date(),
		// @ts-ignore
		sScope,
	)

	return (
		<div className="ui grid">
			<div className="five wide column">
				total expenditure:{' '}
				<strong>
					$
					<NumberDisplay
						value={Number(totalExpenditure.toFixed(2))}
					/>
				</strong>
				<br />
				expenses: {numberOfExpenses}
				<br />
				mean average per {sDisplayPeriod}:$
				<NumberDisplay value={Number(averagePerUnit.toFixed(2))} />
			</div>
			<div className="five wide column">
				<span title="the most frequently appearing value">mode</span>{' '}
				per {sDisplayPeriod}: $
				<NumberDisplay value={Number(modePerUnit.toFixed(2))} />
				<br />
				<span title="cumulative total divided by number of items - the classic average">
					mean
				</span>{' '}
				per {sDisplayPeriod}: $
				<NumberDisplay value={Number(averagePerUnit.toFixed(2))} />
				<br />
				<span title="the middle value if all values are ordered">
					median
				</span>{' '}
				per {sDisplayPeriod}: $
				<NumberDisplay value={Number(medianPerUnit.toFixed(2))} />
			</div>
			<div className="six wide column">
				{bInCurrentPeriod && (
					<div>
						{/* only show projection data if the current period is incomplete */}
						{projectionForScope && (
							<span>projection for {sScope}:&nbsp;</span>
						)}
						{projectionForScope && (
							<span>
								$
								<NumberDisplay
									value={Number(
										projectionForScope.toFixed(2),
									)}
								/>
							</span>
						)}
						<br />
						{/* only show projection data if the current period is incomplete */}
						<div className="ui input">
							target budget for {sScope}:&nbsp;
							<input
								type="text"
								value={nYearlyBudget || ''}
								onChange={e =>
									setBudget(Number(e.currentTarget.value))
								}
							/>
						</div>
						{nYearlyBudget && prospectiveBudgetForForecast && (
							<div>
								spend up to $
								<NumberDisplay
									value={Number(
										prospectiveBudgetForForecast.toFixed(2),
									)}
								/>
								&nbsp; per {sDisplayPeriod} to come in at $
								{nYearlyBudget} for the {sScope}.
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default SpendingSummary
