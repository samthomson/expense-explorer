import { Category } from '@shared/declarations'
import * as React from 'react'
import NumberDisplay from 'src/components/NumberDisplay'

// @ts-ignore
import { Pie as PieChart } from 'react-chartjs'
import { CategoryColors } from 'src/declarations'

interface IProps {
	categories: Category[]
	sCategoryName: 'Category' | 'Subcategory'
	eSetFilter: (term: string, match: string) => void
}

export class CategoryExpenses extends React.Component<IProps, {}> {
	constructor(props: IProps) {
		super(props)
	}

	public render() {
		const { categories, sCategoryName } = this.props

		const chartOptions = {
			responsive: true,
			maintainAspectRatio: false,
			tooltipTemplate: '<%= label %>',
		}

		// https://flatuicolors.com/palette/cn
		// https://flatuicolors.com/palette/nl
		const oCategoryColours: CategoryColors = {
			accomodation: '#EA2027', // red - red pigment
			food: '#2ed573', // green - ufo green
			working: '#a4b0be', // grey - peace
			recreation: '#1e90ff', // blue - clear chill
			transport: '#5758BB', // lavendar - circumorbital ring
			'non-food shopping': '#F79F1F', // orangish/gold - radiant yellow
			miscellaneous: '#833471', // light purple - hollyhock
			health: '#ff6b81', // pink - wild watermelon
			utility: '#747d8c', // darker grey - bay wharf
			giving: '#7bed9f', // light green - lime soap
		}

		const chartData = categories.map(oP => {
			return {
				value: Number(oP.percent).toFixed(0),
				label: `${oP.category}: $${Number(oP.total).toFixed(
					0,
				)} - ${Number(oP.percent).toFixed(0)}%`,
				color: oCategoryColours[oP.category]
					? oCategoryColours[oP.category]
					: `hsla(${Math.random() * 360}, 100%, 50%, 1)`,
			}
		})

		return (
			categories.length > 0 && (
				<div>
					<h3>Spending by {sCategoryName}</h3>
					<div className="ui grid">
						<div className="eight wide column">
							<table className="ui celled table">
								<thead>
									<tr>
										<th>{sCategoryName}</th>
										<th>Total</th>
										<th># expenses</th>
										<th>%</th>
									</tr>
								</thead>
								<tbody>
									{categories.map((oSingleCategory, i) => {
										const {
											category,
											expenseCount,
											percent,
											total,
										} = oSingleCategory

										const asCategoryParts = category.split(
											'_',
										)
										const sDisplayCategory: string =
											asCategoryParts[
											asCategoryParts.length - 1
											]

										return (
											<tr key={i}>
												<td>
													<a
														onClick={() =>
															this.props.eSetFilter(
																sCategoryName,
																sDisplayCategory,
															)
														}
													>
														{category.replace(
															'_',
															' / ',
														)}
													</a>
												</td>
												<td>
												$
												<NumberDisplay
													value={Number(
													total.toFixed(2),
													)}
												/></td>
												<td>{expenseCount}</td>
												<td>
													{percent > 1
														? percent.toFixed(0)
														: percent.toFixed(1)}
													%
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
						<div className="eight wide column">
							<PieChart
								data={chartData}
								options={chartOptions}
								width="100%"
								height="250"
							/>
						</div>
					</div>
				</div>
			)
		)
	}
}

export default CategoryExpenses
