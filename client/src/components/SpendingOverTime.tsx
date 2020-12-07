
import * as SharedTypes from '@shared/declarations'
import moment from 'moment'
import * as React from 'react'
// @ts-ignore
import { Line as LineChart} from 'react-chartjs'

interface IProps {
	initialDate: moment.Moment
	scope: SharedTypes.Scope
	summary: SharedTypes.Summary
	timeunits: SharedTypes.TimeUnit[]
}

const SpendingOverTime: React.StatelessComponent<IProps> = ({
	initialDate,
	scope,
	summary,
	timeunits
}) => {

	if (timeunits.length === 0) {
		return <React.Fragment>awaiting data</React.Fragment>
	}

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			yAxes: [
				{
					ticks: {
						beginAtZero: true,
					},
				},
			],
		},
	}

	const afSpendingOverTime: number[] = timeunits.map(oP =>
		Number(oP.total),
	)
	const dataLabels = timeunits.map(oP => {
		// make nice date rendered label
		if (scope === 'month') {
			// create from currently selected date so that we can correctly render the number of that months days on the x axis
			return moment(initialDate) 
				.date(Number(oP.date))
				.format('Do')
		}
		if (scope === 'year') {
			// a year only ever has 12 months..
			return moment() 
				.month(Number(oP.date) - 1)
				.format('MMM')
		}
		// custom
		return moment(oP.date, 'MM/DD/Y').format('DD/MM/YY')
	})

	const aDataSets = [
		{
			label: 'Spending over time',
			fillColor: 'rgba(151,187,205,0.2)',
			strokeColor: 'rgba(151,187,205,1)',
			pointColor: 'rgba(151,187,205,1)',
			pointStrokeColor: '#fff',
			pointHighlightFill: '#fff',
			pointHighlightStroke: 'rgba(151,187,205,1)',
			data: afSpendingOverTime,
		},
	]

	if (summary.projectedSpendingOverTime) {
		// render projection data too
		const afSpendingProjection = summary.projectedSpendingOverTime.map(
			oItem => Number(oItem.total.toFixed(2)),
		)

		aDataSets.push({
			label: 'Projected Spending',
			fillColor: 'rgba(220,220,220,0.2)',
			strokeColor: 'rgba(220,220,220,1)',
			pointColor: 'rgba(220,220,220,1)',
			pointStrokeColor: '#fff',
			pointHighlightFill: '#fff',
			pointHighlightStroke: 'rgba(220,220,220,1)',
			data: afSpendingProjection,
		})

		// console.log(afSpendingProjection)
		// and if they have a target adjusted forecast
		if (summary.prospectiveBudgetForForecast) {
			// render projection data too
			// const afAdjustedProjection = this.props.oSummary.projectedSpendingOverTime.map(oItem => this.props.oSummary.prospectiveBudgetForForecast)
			// console.log(afAdjustedProjection)
			// not working :(
			// aDataSets.push(
			// 	{
			// 		label: "Adjusted budget",
			// 		fillColor: "rgba(50,50,50,0.2)",
			// 		strokeColor: "rgba(50,50,50,1)",
			// 		pointColor: "rgba(50,50,50,1)",
			// 		pointStrokeColor: "#fff",
			// 		pointHighlightFill: "#fff",
			// 		pointHighlightStroke: "rgba(50,50,50,1)",
			// 		data: afAdjustedProjection,
			// 	}
			// )
		}
	}

	const chartData = {
		labels: dataLabels,
		datasets: aDataSets,
	}

	return (
		<div>
			<LineChart
				data={chartData}
				options={chartOptions}
				width="100%"
				height="300"
			/>
		</div>
	)
}

export default SpendingOverTime


