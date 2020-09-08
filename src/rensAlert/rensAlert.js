
import React from 'react';

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

function genRandomString() {
	return Math.random().toString().split('.')[1];
}

export const RensAlertSpawnType = {
	PUSH: 0, REPLACE: 1, REPLACE_SAME_TYPE: 2
};

const ModalType = {
	POPUP: 0, ACCEPT: 1, CONFIRM: 2, INPUT: 3
};

class RensAlert {
	constructor() {
		this.container = React.createRef();
	}

	popup(props) {
		const key = `popup${genRandomString()}`;

		const mergedProps = mergeObject({
			title: 'Popup',
			text: 'Rens is super cool',
			spawn: RensAlertSpawnType.REPLACE,
			type: ModalType.POPUP
		}, props);

		this.container.current.addModal(<Popup key={key} id={key} options={mergedProps} onClose={this.container.current.onClose}/>, mergedProps);
	}

	accept(props) {
		const key = `accept${genRandomString()}`;

		const mergedProps = mergeObject({
			title: 'Accept',
			text: 'Rens is nog steeds super cool',
			accept: 'Ok',
			spawn: RensAlertSpawnType.REPLACE,
			type: ModalType.ACCEPT
		}, props);

		this.container.current.addModal(<Accept key={key} id={key} options={mergedProps} onClose={this.container.current.onClose}/>, mergedProps);
	}

	confirm(props) {
		const key = `confirm${genRandomString()}`;

		const mergedProps = mergeObject({
			title: 'Confirm',
			text: 'Rens is BEST',
			accept: 'Accept',
			decline: 'Decline',
			spawn: RensAlertSpawnType.REPLACE,
			type: ModalType.CONFIRM
		}, props);

		this.container.current.addModal(<Confirm key={key} id={key} options={mergedProps} onClose={this.container.current.onClose}/>, mergedProps);
	}

	input(props) {
		const key = `input${genRandomString()}`;

		const mergedProps = mergeObject({
			title: 'Input',
			text: 'Rens is BEST!!',
			accept: 'Accept',
			decline: 'Decline',
			spawn: RensAlertSpawnType.REPLACE,
			type: ModalType.INPUT
		}, props);

		this.container.current.addModal(<Input key={key} id={key} options={mergedProps} onClose={this.container.current.onClose}/>, mergedProps);
	}
}

export class RensAlertContainer extends React.Component {
	constructor(props) {
		super(props);
		autobind(this);

		this.state = { modals: [] };
	}

	onClose(id) {
		const modals = this.state.modals;
		modals.splice(modals.findIndex((m) => m.props.id === id), 1);
		this.setState({ modals });
	}

	addModal(modal, props) {
		let modals = this.state.modals;
		
		switch (props.spawn) {
			case RensAlertSpawnType.REPLACE:
				modals = [];
				modals.push(modal);
				break;
			case RensAlertSpawnType.REPLACE_SAME_TYPE:
				modals = modals.filter((m) => m.props.options.type !== props.type);
				modals.unshift(modal);
				break;
			case RensAlertSpawnType.PUSH:
			default:
				modals.unshift(modal);
				break;
		}
		
		this.setState({ modals });
	}

	render() {
		return (
			<div id="rensAlert">
				{this.state.modals}
			</div>
		);
	}
}

class Modal extends React.Component {
	constructor(props) {
		super(props);
		autobind(this);

		this.state = mergeObject({ 
			replace: true,
			time: 0,
			style: {}
		}, { id: props.id, ...props.options });
		this.preTransitionStyle = new Map();

		this.timeouts = [];

		if (this.state.time !== 0) {
			this.closeTimeout = setTimeout(() => {
				this.onClose(); 
			}, this.state.time);
		}

		if (this.state.transition) {
			this.addTransitions();
		}
	}

	addTransitions() {
		if (this.state.transition) {
			if (this.state.transition.open) {
				let startAfter = this.state.transition.open.startAfter;
				if (!startAfter) startAfter = 100;

				this.timeouts.push(
					setTimeout(() => {
						const modal = document.querySelector(`#${this.props.id}`);
						const currentStyle = { ...this.state.style };
						const totalStyle = mergeObject(currentStyle, this.state.transition.open.style);
			
						Object.entries(totalStyle).forEach(([key, value]) => {
							this.preTransitionStyle.set(key, modal.style[key]);
							modal.style[key] = value;
						});
					}, startAfter)
				);
			}

			if (this.state.transition.close) {
				let startAfter = this.state.transition.close.startAfter;
				if (startAfter) {
					this.timeouts.push(
						setTimeout(() => {
							const modal = document.querySelector(`#${this.props.id}`);
							if (!modal) return;

							Object.entries({ ...this.state.transition.close.style }).forEach(([key, value]) => modal.style[key] = value);
						}, startAfter)
					);

					let closeAfter = this.state.transition.close.time;
					if (!closeAfter) closeAfter = 0;

					closeAfter += startAfter;
					this.timeouts.push(
						setTimeout(() => {
							this.onClose();
						}, closeAfter)
					);
				}
			}
		}
	}

	componentWillUnmount() {
		this.timeouts.forEach((t) => clearTimeout(t));
	}

	onClose() {
		this.props.onClose(this.state.id);
		if (this.state.onClose) this.state.onClose();
	}

	onAccept(val) {
		this.props.onClose(this.state.id);
		if (this.state.onAccept) this.state.onAccept(val);
	}

	onDecline() {
		this.props.onClose(this.state.id);
		if (this.state.onDecline) this.state.onDecline();
	}

	render() { return <h1>hoi</h1>; }
}

class Popup extends Modal {
	addTransitions() { super.addTransitions(); }

	componentWillUnmount() { super.componentWillUnmount(); }

	onClose() { super.onClose(); }

	render() {
		return (
			<div style={this.state.style} id={this.props.id} onClick={this.onClick} className="popup">
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

class Accept extends Modal {
	addTransitions() { super.addTransitions(); }

	componentWillUnmount() { super.componentWillUnmount(); }

	onClose() { super.onClose(); }

	onAccept() { super.onAccept(); }

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

class Confirm extends Modal {
	addTransitions() { super.addTransitions(); }

	componentWillUnmount() { super.componentWillUnmount(); }

	onClose() { super.onClose(); }

	onAccept() { super.onAccept(); }

	onDecline() { super.onDecline(); }

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
	addTransitions() { super.addTransitions(); }

	componentWillUnmount() { super.componentWillUnmount(); }

	onClose() { super.onClose(); }

	onAccept(val) { super.onAccept(val); }

	onDecline() { super.onDecline(); }

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
					<button className="acceptButton" onClick={() => this.onAccept(this.state.inputValue)}>{this.state.accept}</button>
					<button className="declineButton" onClick={this.onDecline}>{this.state.decline}</button>
				</div>
			</div>
		);
	}
}

const rensAlert = new RensAlert();
export default rensAlert;
