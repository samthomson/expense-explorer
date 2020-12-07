
import * as SharedTypes from '@shared/declarations'
import * as React from 'react'

interface IProps {
	scope: SharedTypes.Scope
	changeScope: (scope: SharedTypes.Scope) => void
}

const ScopeSelect: React.StatelessComponent<IProps> = ({scope, changeScope}) => {

	return (
		<div className="ui small buttons">
			<button
				onClick={() => changeScope('month')}
				className={
					'ui button' + (scope === 'month' ? ' active' : '')
				}
			>
				month
			</button>
			<div className="or" />
			<button
				onClick={() => changeScope('year')}
				className={
					'ui button' + (scope === 'year' ? ' active' : '')
				}
			>
				year
			</button>

			<div className="or" />
			<button
				onClick={() => changeScope('custom')}
				className={
					'ui button' + (scope === 'custom' ? ' active' : '')
				}
			>
				custom
			</button>
		</div>
	)
}

export default ScopeSelect
