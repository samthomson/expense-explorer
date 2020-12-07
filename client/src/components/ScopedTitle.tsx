
import * as SharedTypes from '@shared/declarations'
import * as moment from 'moment'
import * as React from 'react'

interface IProps {
	initialDate: moment.Moment
	endDate: moment.Moment
	filter: SharedTypes.Filter
	sScope: SharedTypes.Scope
	removeFilter: () => void
}

const ScopedTitle: React.StatelessComponent<IProps> = ({filter, initialDate, endDate, sScope, removeFilter}) => {

	const scopeLabel = (() => {
		if(sScope === 'month' || sScope === 'year') {
			const sFormat = sScope === 'month' ? 'MMMM YYYY' : 'Y'
			return initialDate.format(sFormat)
		} 
		
		// assume 'custom'
		const sameYear = initialDate.year() === endDate.year()
		const format = sameYear ? 'MMM Do' : 'MMM Do, YYYY'
		let title = `${initialDate.format(format)} - ${endDate.format(format)}`
		if (sameYear) {
			title += ` (${initialDate.year()})`
		}
		return title
	})()

	return (
		<h2>
			{scopeLabel}
			{filter && (
				<span>
					&nbsp;(&nbsp;
					{filter.term}:{filter.match}
					<a onClick={removeFilter}>
						<i className="icon trash" />
					</a>
					&nbsp;)
				</span>
			)}
		</h2>
	)
}

export default ScopedTitle
