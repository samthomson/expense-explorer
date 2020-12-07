import * as React from 'react'

interface IProps {
	number: number
}

const NumberDisplay: React.StatelessComponent<IProps> = ({number}) => {

	const numberWithCommas = (x: number) => {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	}

	return (<span>{numberWithCommas(number)}</span>)
}

export default NumberDisplay
