import React, { Component } from 'react'

import './Address.css';

class Address extends Component {
    constructor(props){
        super(props);
        this.copy = this.copy.bind(this);

    }
    copy() {
        navigator.clipboard.writeText(this.props.value);
    }

    render() {
        return (
            <span className="Address">
                <span className="Address-value">{this.props.value.substr(0, 6)}...{this.props.value.substr(this.props.value.length-5, 5)}</span>
                <img src="/img/copy.svg" className="Address-copy" onClick={this.copy} alt="copy" title="copy address"></img>
            </span>
        );
    }
}

export default Address;