import react from "react";

class Collapsible extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
		};
		this.togglePanel = this.togglePanel.bind(this);
	}

	togglePanel(e) {
		this.setState({ open: !this.state.open });
	}

	componentDidUpdate() {}

	render() {
		return (
			<div>
				<div onClick={(e) => this.togglePanel(e)} className="header">
					{this.props.title}
				</div>
				{this.state.open ? (
					<div className="content">{this.props.children}</div>
				) : null}
			</div>
		);
	}
}

class App extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div>
				<Collapsible title="Header">
					<div>
						<p>Content of Collapsible</p>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
							enim ad minim veniam, quis nostrud exercitation ullamco laboris
							nisi ut aliquip ex ea commodo consequat.
						</p>
					</div>
				</Collapsible>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("root"));
