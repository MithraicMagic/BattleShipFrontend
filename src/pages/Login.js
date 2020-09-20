import autobind from 'class-autobind';
import React, { Component } from 'react';
import rensAlert from '../rensAlert/rensAlert';

import '../scss/login.scss';

export default class Login extends Component {
    constructor(props) {
        super(props);
        autobind(this);
    }

    submit(e) {
        e.preventDefault();
        if (e.target.classList.contains('login-form')) {
            this.toggleButton(true);
            this.login();
            this.toggleButton(true);
        } else {
            this.toggleButton(false);
            this.signUp();
            this.toggleButton(false);
        }
    }

    toggleButton(isLogin) {
        if (isLogin) {
            const button = document.getElementById('log-btn');
            button.innerText = button.disabled ? 'Login' : 'Logging In...';
            button.disabled = !button.disabled;
        } else {
            const button = document.getElementById('reg-btn');
            button.innerText = button.disabled ? 'Sign Up' : 'Signing Up...';
            button.disabled = !button.disabled;
        }
    }

    login() {
        const email = document.getElementById('log-email').value;
        const password = document.getElementById('log-pw').value;

        if (!email || !password) {
            rensAlert.popup({ title: 'Whoops!', text: 'Some credentials are missing, be sure to fill out all fields!' });
            return;
        }

        fetch(process.env.REACT_APP_API_URL + '/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        })
            .then(res => {
                if (res.ok) {
                    rensAlert.popup({ title: 'Yay!', text: 'Login successful!' });
                    sessionStorage.setItem('jwtoken', res.json().jwt)
                    this.props.history.push('/')
                }
            });
    }

    signUp() {
        const username = document.getElementById('reg-un').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-pw').value;
        const confirmPassword = document.getElementById('reg-pwc').value;

        if (!username || !email || !password || !confirmPassword) {
            rensAlert.popup({ title: 'Whoops!', text: 'Some credentials are missing, be sure to fill out all fields!' });
            return;
        }

        if (username.length < 4 || username.length > 20) {
            rensAlert.popup({ title: 'Oh no!', text: 'Your username has to be longer than 4 characters and shorter than 20 😞' });
            return;
        }

        if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            rensAlert.popup({ title: 'Oh no..', text: 'The format of your email seems to not be valid!' });
            return;
        }

        if (password !== confirmPassword) {
            rensAlert.popup({ title: 'Ooooopsie', text: 'The password confirmation you have entered is not equal to the password you entered, try again!' });
            return;
        }

        fetch(process.env.REACT_APP_API_URL + '/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        })
            .then(res => {
                if (res.ok) {
                    rensAlert.popup({ title: 'Yay!', text: 'You successfully signed up and can now login with your new account!' });
                    document.querySelector('.register-form').reset();
                }
            });
    }

    render() {
        return (
            <div className="login-page">
                <h1>Sign In or Sign Up!</h1>
                <div className="forms-container">
                    <form className="login-form" onSubmit={this.submit}>
                        <input type="email" id="log-email" placeholder="E-Mail" />
                        <input type="password" id="log-pw" placeholder="Password" />
                        <button id="log-btn">Sign In</button>
                    </form>
                    <hr />
                    <form className="register-form" onSubmit={this.submit}>
                        <input type="text" id="reg-un" placeholder="Username" />
                        <input type="email" id="reg-email" placeholder="E-Mail" />
                        <input type="password" id="reg-pw" placeholder="Password" />
                        <input type="password" id="reg-pwc" placeholder="Confirm Password" />
                        <button id="reg-btn">Sign Up</button>
                    </form>
                </div>
                <div>
                    <button onClick={() => this.props.history.push('/')}>Go Home</button>
                </div>
            </div>
        )
    }
}
