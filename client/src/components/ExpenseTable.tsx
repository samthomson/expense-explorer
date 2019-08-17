import { Expense } from '@shared/declarations'
import * as moment from 'moment'
import * as React from 'react'

interface IProps {
	eSetFilter: (term: string, match: string) => void
	expenses: Expense[]
}

export class ExpenseTable extends React.Component<IProps, {}> {
	constructor(props: IProps) {
		super(props)
	}

	public render() {
		const { expenses } = this.props

		return (
			<div>
				{expenses.length > 0 && (
					<table className="ui celled table">
						<thead>
							<tr>
								<th>usd</th>
								<th>item</th>
								<th>category</th>
								<th>subcategory</th>
								<th>date</th>
							</tr>
						</thead>
						<tbody>
							{expenses.map((oSingleExpense, i) => {
								const {
									category,
									subcategory,
									vendor,
								} = oSingleExpense
								return (
									<tr key={i}>
										<td>
											${oSingleExpense.amount.toFixed(2)}
										</td>
										<td>
											<a
												onClick={() =>
													this.props.eSetFilter(
														'Vendor',
														vendor,
													)
												}
											>
												{vendor}
											</a>
										</td>
										<td>
											<a
												onClick={() =>
													this.props.eSetFilter(
														'Category',
														category,
													)
												}
											>
												{category}
											</a>
										</td>
										<td>
											<a
												onClick={() =>
													this.props.eSetFilter(
														'Subcategory',
														subcategory,
													)
												}
											>
												{subcategory}
											</a>
										</td>
										<td>
											{this.sRenderPiciliLink(
												oSingleExpense.date,
											)}
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				)}
				{expenses.length === 0 && <div>... no expense data</div>}
			</div>
		)
	}

	private sRenderPiciliLink(sDate: string) {
		const oTargetDate: moment.Moment = moment(sDate, 'MM/DD/YYYY') // format that went into elastic (raw)
		const sDisplayDate: string = oTargetDate.format('ddd Do MMM')
		const sQueryValueDate: string = oTargetDate.format('DD/MM/YYYY')
		const sPiciliURL: string = `https://test-instance.picili.com/1/calendar?filters=[{"type":"calendar","display":"${sDisplayDate}","value":"day:${sQueryValueDate}"}]`

		return (
			<a target="_blank" href={sPiciliURL}>
				{sDisplayDate}
			</a>
		)
	}
}

export default ExpenseTable
