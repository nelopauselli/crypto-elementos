import React, { Component } from 'react'

import "./ElementSelector.css";

class ElementSelector extends Component {
    constructor(props) {
        super(props);
        this.state = { elements: [] }
    }

    componentDidMount() {
        let elements = this.props.source.map(e => {
            let item = localStorage.getItem(e);
            if (item) return JSON.parse(item);
            return { address: e, name: e };
        });
        this.setState({ elements: elements });
    }

    render() {
        return (
            <select className={this.props.className} onChange={e => this.props.onChange(e)}>
                {this.state.elements.map(e => <option key={e.address} value={e.address}>{e.name}</option>)}
            </select>
        )
    }
}

export default ElementSelector;
