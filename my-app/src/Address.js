import React, { Component } from 'react'

import './Address.css';

class Address extends Component {
    render() {
        return (<span className="Address-value">{this.props.value.substr(0, 6)}...{this.props.value.substr(this.props.value.length-5, 5)}</span>);
    }
}

export default Address;