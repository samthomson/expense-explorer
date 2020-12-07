import * as React from 'react'

interface IProps {
	value: number
}

const NumberDisplay: React.StatelessComponent<IProps> = ({value}) => {

	const numberWithCommas = (x: number) => {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	}

	return (<span>{numberWithCommas(value)}</span>)
}

export default NumberDisplay
