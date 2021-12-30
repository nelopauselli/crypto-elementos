import React, { Component } from 'react'
import "./Element.css";

class Element extends Component {
    constructor(props) {
        super(props);
    }

    addToMetamask(element) {
        alert(`TODO: add token ${element.symbol} to metamask`);
    }

    addToMetamask(element) {
        alert(`TODO: fusionar en ${element.symbol}`);
    }

    render() {
        return (
            <div className="Element-card">
                <img className="Element-icon" src="/logo192.png" alt="..." />
                <div className="Element-body">
                    <div className="Element-addToMetamask">
                        <button onClick={() => this.addToMetamask(this.props.element)}>
                            <img class="img-button" src="img/metamask.png" alt="Agregar a Metamask" title="Agregar a Metamask" />
                        </button>
                    </div>
                    <h3>{this.props.element.symbol}</h3>
                    <h5>{this.props.element.name}</h5>
                    <div>{this.props.element.balance}</div>
                    <p>{this.props.element.description}</p>
                </div>
                <div className="Element-footer">
                    <button class="btn btn-primary" onClick={()=>this.fusionar()}>
                        Fusionar en <span data-bind="text: $data.to.name"></span>
                    </button>
                </div>
            </div>
        );
    }
}

export default Element;