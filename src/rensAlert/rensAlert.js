
import React from 'react';
import ReactDOM from 'react-dom';

import './rensAlert.scss';
import autobind from 'class-autobind';

function mergeObject(target) {
	for (let i = 1; i < arguments.length; i++) {
		const source = arguments[i];
		for (const key in source) {
			if (source.hasOwnProperty(key)) {
				target[key] = source[key];
			}
		}
	}
	return target;
}

class RensAlert {
	popup(props) {
		const key = `RensAlertPopup.${Math.random()}`;

		const mergedProps = mergeObject({
			title: 'Popup',
			text: 'Rens is super cool',
			time: 0,
		}, props);

		const rensAlertContainer = document.getElementById('rensAlert');
		if (rensAlertContainer) {
			ReactDOM.render(<Popup key={key} id={key} options={mergedProps}/>, rensAlertContainer);
		}
	}

	accept(props) {
		const key = `RensAlertAccept.${Math.random()}`;

		const mergedProps = mergeObject({
			title: 'Accept',
			text: 'Rens is nog steeds super cool',
			accept: 'Ok',
			time: 0,
		}, props);

		const rensAlertContainer = document.getElementById('rensAlert');
		if (rensAlertContainer) {
			ReactDOM.render(<Accept key={key} id={key} options={mergedProps}/>, document.getElementById('rensAlert'));
		}
	}

	confirm(props) {
		const key = `RensAlertConfirm.${Math.random()}`;

		const mergedProps = mergeObject({
			title: 'Confirm',
			text: 'Rens is BEST',
			accept: 'Accept',
			decline: 'Decline',
			time: 0,
		}, props);

		const rensAlertContainer = document.getElementById('rensAlert');
		if (rensAlertContainer) {
			ReactDOM.render(<Confirm key={key} id={key} options={mergedProps}/>, document.getElementById('rensAlert'));
		}
	}

	input(props) {
		const key = `RensAlertInput.${Math.random()}`;

		const mergedProps = mergeObject({
			title: 'Input',
			text: 'Rens is BEST!!',
			accept: 'Accept',
			decline: 'Decline',
			time: 0,
		}, props);

		const rensAlertContainer = document.getElementById('rensAlert');
		if (rensAlertContainer) {
			ReactDOM.render(<Input key={key} id={key} options={mergedProps}/>, document.getElementById('rensAlert'));
		}
	}
}

export class RensAlertContainer extends React.Component {
	render() {
		return (
			<div id="rensAlert">
				{this.props.children}
			</div>
		);
	}
}

class Popup extends React.Component {
	constructor(props) {
		super(props);
		autobind(this);

		this.state = props.options;
		this.closeTimeout = null;
		this.preTransitionStyle = new Map();

		this.transitionStartTimeout = null;
		this.transitionStopTimeout = null;

		if (this.state.time !== 0) {
			this.closeTimeout = setTimeout(() => {
				this.onClose(); 
			}, this.state.time);
		}

		if (this.state.transition) {
			this.transitionStartTimeout = setTimeout(() => {
				const pop = document.querySelector('.popup');
				const currentStyle = this.state.style == null ? { } : { ...this.state.style };
				const totalStyle = mergeObject(currentStyle, this.state.transition.style);

				Object.entries(totalStyle).forEach(([key, value]) => {
					this.preTransitionStyle.set(key, pop.style[key]);
					pop.style[key] = value;
				});
			}, 100);

			if (this.state.transition.time !== 0) {
				this.transitionStopTimeout = setTimeout(() => {
					const pop = document.querySelector('.popup');
					this.preTransitionStyle.forEach((val, key) => {
						pop.style[key] = val;
					});
				}, this.state.transition.time);
			} 
		}
	}

	componentWillUnmount() {
		if (this.transitionStartTimeout) {
			clearTimeout(this.transitionStartTimeout);
		}

		if (this.transitionStopTimeout) {
			clearTimeout(this.transitionStopTimeout);
		}

		if (this.closeTimeout) {
			clearTimeout(this.closeTimeout);
			const element = document.getElementById(this.props.id);
			if (element) element.style.display = 'none';
		}
	}

	onClose() {
		this.setState({ style: { display: 'none' }});
		if (this.state.onClose !== undefined) {
			this.state.onClose();
		}
	}

	render() {
		return (
			<div style={this.state.style} id={this.props.id} className="popup">
				<div className="top">
					<button onClick={this.onClose}>X</button>
				</div>
				<div className="content">
					<h3>{this.state.title}</h3>
					<p>{this.state.text}</p>
				</div>
				<div className="buttons">

				</div>
			</div>
		);
	}
}

class Accept extends React.Component {
	constructor(props) {
		super(props);
		autobind(this);

		this.state = props.options;
		this.closeTimeout = null;

		this.preTransitionStyle = new Map();

		this.transitionStartTimeout = null;
		this.transitionStopTimeout = null;

		if (this.state.time !== 0) {
			this.closeTimeout = setTimeout(() => {
				this.onClose(); 
			}, this.state.time);
		}

		if (this.state.transition) {
			this.transitionStartTimeout = setTimeout(() => {
				const pop = document.querySelector('.accept');
				const currentStyle = this.state.style == null ? { } : { ...this.state.style };
				const totalStyle = mergeObject(currentStyle, this.state.transition.style);

				Object.entries(totalStyle).forEach(([key, value]) => {
					this.preTransitionStyle.set(key, pop.style[key]);
					pop.style[key] = value;
				});
			}, 100);

			if (this.state.transition.time !== 0) {
				this.transitionStopTimeout = setTimeout(() => {
					const pop = document.querySelector('.accept');
					this.preTransitionStyle.forEach((val, key) => {
						pop.style[key] = val;
					});
				}, this.state.transition.time);
			} 
		}
	}

	componentWillUnmount() {
		if (this.closeTimeout) {
			clearTimeout(this.closeTimeout);
			const element = document.getElementById(this.props.id);
			if (element) element.style.display = 'none';
		}
	}

	onClose() {
		this.setState({ style: { display: 'none' }});
		if (this.state.onClose !== undefined) {
			this.state.onClose();
		}
	}

	onAccept() {
		this.setState({ style: { display: 'none' }});
		if (this.state.onAccept !== undefined) {
			this.state.onAccept();
		}
	}

	render() {
		return (
			<div style={this.state.style} id={this.props.id} className="accept">
				<div className="top">
					<button onClick={this.onClose}>X</button>
				</div>
				<div className="content">
					<h3>{this.state.title}</h3>
					<p>{this.state.text}</p>
				</div>
				<div className="buttons">
					<button className="acceptButton" onClick={this.onAccept}>Accept</button>
				</div>
			</div>
		);
	}
}

class Confirm extends React.Component {
	constructor(props) {
		super(props);
		autobind(this);

		this.state = props.options;
		this.closeTimeout = null;

		this.preTransitionStyle = new Map();

		this.transitionStartTimeout = null;
		this.transitionStopTimeout = null;

		if (this.state.time !== 0) {
			this.closeTimeout = setTimeout(() => {
				this.onClose(); 
			}, this.state.time);
		}

		if (this.state.transition) {
			this.transitionStartTimeout = setTimeout(() => {
				const pop = document.querySelector('.confirm');
				const currentStyle = this.state.style == null ? { } : { ...this.state.style };
				const totalStyle = mergeObject(currentStyle, this.state.transition.style);

				Object.entries(totalStyle).forEach(([key, value]) => {
					this.preTransitionStyle.set(key, pop.style[key]);
					pop.style[key] = value;
				});
			}, 100);

			if (this.state.transition.time !== 0) {
				this.transitionStopTimeout = setTimeout(() => {
					const pop = document.querySelector('.confirm');
					this.preTransitionStyle.forEach((val, key) => {
						pop.style[key] = val;
					});
				}, this.state.transition.time);
			} 
		}
	}

	componentWillUnmount() {
		if (this.closeTimeout) {
			clearTimeout(this.closeTimeout);
			const element = document.getElementById(this.props.id);
			if (element) element.style.display = 'none';
		}
	}

	onClose() {
		this.setState({ style: { display: 'none' }});
		if (this.state.onClose !== undefined) {
			this.state.onClose();
		}
	}

	onAccept() {
		this.setState({ style: { display: 'none' }});
		if (this.state.onAccept !== undefined) {
			this.state.onAccept();
		}
	}

	onDecline() {
		this.setState({ style: { display: 'none' }});
		if (this.state.onDecline !== undefined) {
			this.state.onDecline();
		}
	}

	render() {
		return (
			<div style={this.state.style} id={this.props.id} className="confirm">
				<div className="top">
					<button onClick={this.onClose}>X</button>
				</div>
				<div className="content">
					<h3>{this.state.title}</h3>
					<p>{this.state.text}</p>
				</div>
				<div className="buttons">
					<button className="acceptButton" onClick={this.onAccept}>{this.state.accept}</button>
					<button className="declineButton" onClick={this.onDecline}>{this.state.decline}</button>
				</div>
			</div>
		);
	}
}

class Input extends React.Component {
	constructor(props) {
		super(props);
		autobind(this);

		this.state = props.options;
		this.state.inputValue = '';
		this.closeTimeout = null;

		this.preTransitionStyle = new Map();

		this.transitionStartTimeout = null;
		this.transitionStopTimeout = null;

		if (this.state.time !== 0) {
			this.closeTimeout = setTimeout(() => {
				this.onClose(); 
			}, this.state.time);
		}

		if (this.state.transition) {
			this.transitionStartTimeout = setTimeout(() => {
				const pop = document.querySelector('.input');
				const currentStyle = this.state.style == null ? { } : { ...this.state.style };
				const totalStyle = mergeObject(currentStyle, this.state.transition.style);

				Object.entries(totalStyle).forEach(([key, value]) => {
					this.preTransitionStyle.set(key, pop.style[key]);
					pop.style[key] = value;
				});
			}, 100);

			if (this.state.transition.time !== 0) {
				this.transitionStopTimeout = setTimeout(() => {
					const pop = document.querySelector('.input');
					this.preTransitionStyle.forEach((val, key) => {
						pop.style[key] = val;
					});
				}, this.state.transition.time);
			} 
		}
	}

	componentWillUnmount() {
		if (this.closeTimeout) {
			clearTimeout(this.closeTimeout);
			const element = document.getElementById(this.props.id);
			if (element) element.style.display = 'none';
		}
	}

	onClose() {
		this.setState({ style: { display: 'none' }});
		if (this.state.onClose !== undefined) {
			this.state.onClose();
		}
	}

	onAccept() {
		this.setState({ style: { display: 'none' }});
		if (this.state.onAccept !== undefined) {
			this.state.onAccept(this.state.inputValue);
		}
	}

	onDecline() {
		this.setState({ style: { display: 'none' }});
		if (this.state.onDecline !== undefined) {
			this.state.onDecline(this.state.inputValue);
		}
	}

	onChange(e) {
		this.setState({ inputValue: e.target.value });
	}

	render() {
		return (
			<div style={this.state.style} id={this.props.id} className="input">
				<div className="top">
					<button onClick={this.onClose}>X</button>
				</div>
				<div className="content">
					<h3>{this.state.title}</h3>
					<p>{this.state.text}</p>
					<input type="text" onChange={this.onChange} value={this.state.inputValue}></input>
				</div>
				<div className="buttons">
					<button className="acceptButton" onClick={this.onAccept}>{this.state.accept}</button>
					<button className="declineButton" onClick={this.onDecline}>{this.state.decline}</button>
				</div>
			</div>
		);
	}
}

const rensAlert = new RensAlert();
export default rensAlert;
