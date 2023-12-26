import { Category } from '@shared/declarations'
import React, { useMemo } from 'react'
// @ts-ignore
import { Pie as PieChart } from 'react-chartjs'
import { useSortBy, useTable } from 'react-table'
import NumberDisplay from 'src/components/NumberDisplay'
import { CategoryColors } from 'src/declarations'

interface IProps {
	categories: Category[]
	sCategoryName: 'Category' | 'Subcategory'
	eSetFilter: (term: string, match: string) => void
}

const CategoryExpenses: React.FC<IProps> = ({
	categories,
	sCategoryName,
	eSetFilter,
}) => {
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
			label: `${oP.category}: $${Number(oP.total).toFixed(0)} - ${Number(
				oP.percent,
			).toFixed(0)}%`,
			color: oCategoryColours[oP.category]
				? oCategoryColours[oP.category]
				: `hsla(${Math.random() * 360}, 100%, 50%, 1)`,
		}
	})

	// @ts-ignore
	const Table: React.FC<{ columns; data }> = ({
		columns: tableColumns,
		data: dataTable,
	}) => {
		const {
			getTableProps,
			getTableBodyProps,
			headerGroups,
			rows,
		} = useTable(
			{
				columns: tableColumns,
				data: dataTable,
			},
			useSortBy,
		)

		return (
			<>
				<table {...getTableProps()} className="ui celled table">
					<thead>
						{headerGroups.map(
							// @ts-ignore
							headerGroup => (
								<tr {...headerGroup.getHeaderGroupProps()}>
									{headerGroup.headers.map(
										// @ts-ignore
										column => (
											<th
												{...column.getHeaderProps(
													column.getSortByToggleProps(),
												)}
											>
												{column.render('Header')}
												<span>
													{column.isSorted
														? column.isSortedDesc
															? ' 🔽'
															: ' 🔼'
														: ''}
												</span>
											</th>
										),
									)}
								</tr>
							),
						)}
					</thead>
					<tbody {...getTableBodyProps()}>
						{rows.map((
							// @ts-ignore
							oSingleCategory,
							// @ts-ignore
							i,
						) => {
							const {
								category,
								expenseCount,
								percent,
								total,
							} = oSingleCategory.original

							const asCategoryParts = category.split('_')
							const sDisplayCategory: string =
								asCategoryParts[asCategoryParts.length - 1]

							return (
								<tr key={i}>
									<td>
										<a
											onClick={() =>
												eSetFilter(
													sCategoryName,
													sDisplayCategory,
												)
											}
										>
											{category.replace('_', ' / ')}
										</a>
									</td>
									<td>{expenseCount}</td>
									<td>
										$
										<NumberDisplay
											value={Number(total.toFixed(2))}
										/>
									</td>
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
				<br />
			</>
		)
	}

	const columns = useMemo(
		() => [
			{
				Header: 'Category',
				accessor: 'category',
			},
			{
				Header: 'Expense count',
				accessor: 'expenseCount',
			},
			{
				Header: 'Total',
				accessor: 'total',
			},
			{
				Header: 'Percent',
				accessor: 'percent',
			},
		],
		[],
	)

	const data = useMemo(() => categories, [categories])

	return (
		<div>
			{categories.length > 0 && (
				<div>
					<h3>Spending by {sCategoryName}</h3>
					<div className="ui grid">
						<div className="eight wide column">
							<Table columns={columns} data={data} />
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
			)}
		</div>
	)
}

export default CategoryExpenses
