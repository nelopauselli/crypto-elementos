import React, { Component } from 'react'

import "./ElementSelector.css";

class ElementSelector extends Component {
    render(){
        return (
            <div>
                <select onChange={e=>this.props.onChange(e)}>
                    {this.props.source.map(e=><option key={e} value={e}>{e}</option>)}
                </select>
            </div>
        )
    }
}

export default ElementSelector;
