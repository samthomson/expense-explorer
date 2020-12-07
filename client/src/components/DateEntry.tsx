import moment from 'moment'
import * as React from 'react'
import { connect } from 'react-redux'
import { Action, getSummary as getSummaryAction, setDates as setDatesAction } from 'src/redux/actions'
import { Store } from 'src/redux/store'

interface IProps {
	initialDate: moment.Moment
	endDate: moment.Moment
	getSummary: () => {}
	setDates: (initialDate: moment.Moment, endDate: moment.Moment) => {}
}

const DateEntry: React.StatelessComponent<IProps> = ({
	initialDate,
	endDate,
	getSummary,
	setDates
}) => {

	const [firstDate, setFirstDate] = React.useState(initialDate.format('DD/MM/Y'))
	const [secondDate, setSecondDate] = React.useState(endDate.format('DD/MM/Y'))

	const updateDates = () => {
		// todo: validate dates?
		setDates(moment(firstDate), moment(secondDate))
		getSummary()
	}

	return (
		<React.Fragment>
			<input type="text" value={firstDate} onChange={e => setFirstDate(e.currentTarget.value)} />
			<input type="text" value={secondDate} onChange={e => setSecondDate(e.currentTarget.value)} />
			<button type="submit" onClick={updateDates}>update</button>
		</React.Fragment>
	)
}

const mapStateToProps = (state: Store.App) => {
	return {
		initialDate: state.initialDate,
		endDate: state.endDate,
	}
}

const mapDispatchToProps = (dispatch: React.Dispatch<Action>) => ({
	getSummary: () => dispatch(getSummaryAction()),
	setDates: (initialDate: moment.Moment, endDate: moment.Moment) =>
		dispatch(setDatesAction(initialDate, endDate)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DateEntry)
