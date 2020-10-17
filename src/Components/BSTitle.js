import React, { Component } from 'react';
import '../scss/bsTitle.scss';

export default class BSTitle extends Component {
    render() {
        return (
            <div class="bs-title">
                <h2>Welcome to</h2>
                <h1 className="title">BattleShips</h1>
                <svg className="wave one" viewBox="0 0 500 150" preserveAspectRatio="none">
                    <path d="M0.00,49.98 C184.53,88.12 348.19,-11.55 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"></path>
                </svg>
                <svg className="boat" viewBox="0 2.5 12.7 7" preserveAspectRatio="none">
                    <g xmlns="http://www.w3.org/2000/svg" transform="translate(0,-284.29999)">
                        <path d="m 0.52917,291.68703 2.13008,2.38021 a 1.264092,1.264092 0 0 0 0.94207,0.42117 h 6.7541 a 1.264092,1.264092 0 0 0 1.15395,-0.74673 l 0.66146,-1.47484 H 7.98295 l -2.73523,-0.57981 z m 2.39932,0.76791 h 1.09296 a 0.09548,0.09548 0 0 1 0,0.19069 H 2.92849 a 0.09548,0.09548 0 0 1 0,-0.19069 z" fill="#000000" stroke="none" />
                        <path d="m 2.19292,290.78393 -1.3966,-1.25399 a 0.0954758,0.0954758 0 0 0 -0.1274,0.14209 l 1.3392,1.20233 a 0.85469468,0.85469468 0 0 0 -0.3844,0.62164 h 1.6983 a 0.85469468,0.85469468 0 0 0 -1.1291,-0.71207 z" fill="#000000" stroke="none" />
                        <path d="m 7.30812,289.4944 h -0.8933 v -2.58833 a 0.09555592,0.09555592 0 0 0 -0.1911,0 v 2.58833 h -0.8932 v -1.75283 a 0.0954758,0.0954758 0 0 0 -0.1904,0 v 1.75283 h -0.8961 v 2.0016 h 1.0235 l 2.7357,0.57971 h 0.3921 v -2.58131 h -0.8961 v -1.75283 a 0.09555592,0.09555592 0 0 0 -0.1911,0 z" fill="#000000" stroke="none" />
                    </g>
                </svg>
                <svg className="wave two" viewBox="0 0 500 150" preserveAspectRatio="none">
                    <path d="M0.00,49.98 C154.06,16.08 306.99,81.22 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"></path>
                </svg>
                <svg className="wave three" viewBox="0 0 500 150" preserveAspectRatio="none">
                    <path d="M0.00,49.98 C109.47,69.37 292.88,30.88 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"></path>
                </svg>
            </div>
        )
    }
}
