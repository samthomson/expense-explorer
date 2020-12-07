
import * as React from 'react'

interface IProps {
	navigate: (forward: boolean) => void
}

const ScopeNavigation: React.StatelessComponent<IProps> = ({navigate}) => {

	return (
		<div className="ui small buttons right floated">
			<button
				className="ui labeled icon button"
				onClick={() => navigate(true)}
			>
				<i className="left chevron icon" />
				Back
			</button>
			<button
				className="ui right labeled icon button"
				onClick={() => navigate(false)}
			>
				Forward
				<i className="right chevron icon" />
			</button>
		</div>
	)
}

export default ScopeNavigation
