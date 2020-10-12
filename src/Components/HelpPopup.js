import React, { Component } from 'react'

export default class HelpPopup extends Component {
    render() {
        return (
            <div>
                <button className="help-button" onClick={() => document.getElementById('popup-overlay').classList.toggle('hidden')}>Help</button>
                <div id="popup-overlay" className="help-popup hidden" onClick={(e) => {
                    if (e.target === document.getElementById('popup-overlay')) {
                        document.getElementById('popup-overlay').classList.toggle('hidden');
                    }
                }}>
                    <div>
                        <h1>Setup Guide</h1>
                        <hr/>
                        <h2><span className="colorful">Click</span> on a boat to select it</h2>
                        <h2><span className="colorful">Hover</span> over the grid while a boat is selected to preview placement</h2>
                        <h2>Press <span className="colorful">R</span> to rotate the ship you are holding</h2>
                        <hr/>
                        <h2><span className="colorful">Left Mouse Click</span> to place the ship on the field</h2>
                        <h2><span className="colorful">Right Mouse Click</span> to cancel placing the ship</h2>
                        <hr/>
                        <h2><button>Clear Grid</button> - Removes all placed boats from the field</h2>
                        <h2><button>Auto-Place Ships</button> - Automatically places all boats on the field</h2>
                    </div>
                </div>
            </div>
        )
    }
}
