import * as React from 'react'

interface IProps {
	number: number
}

export class NumberDisplay extends React.Component<IProps, {}> {
	constructor(props: IProps) {
		super(props)
	}

	public render() {
		return <span>{numberWithCommas(this.props.number)}</span>
	}
}

const numberWithCommas = (x: number) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export default NumberDisplay
