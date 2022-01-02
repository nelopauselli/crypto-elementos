import React, { Component } from 'react'

import './Address.css';

class Address extends Component {
    constructor(props) {
        super(props);
        this.state = { address: null };

        this.copy = this.copy.bind(this);
    }

    copy() {
        navigator.clipboard.writeText(this.state.address);
    }

    componentDidMount(){
        this.setState({address: this.props.value})
    }

    render() {
        return (
            this.state.address && 
            <span className="Address">
                <span className="Address-value">{this.state.address.substr(0, 6)}...{this.state.address.substr(this.state.address.length - 5, 5)}</span>
                <img src="/img/copy.svg" className="Address-copy" onClick={this.copy} alt="copy" title="copy address"></img>
            </span>
        );
    }
}

export default Address;