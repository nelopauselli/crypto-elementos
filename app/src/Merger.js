import React, { Component } from 'react'
import blockchainAdapter from './services/BlockchainAdapter';

import "./Merger.css";
import Address from './Address';
import ElementSelector from './ElementSelector';

class Merger extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "Fusionador",
            from: props.elements[0],
            to: props.elements[0],
            quantity: 0
        }

        this.fusionar = this.fusionar.bind(this);
        this.onChangeFrom = this.onChangeFrom.bind(this);
        this.onQuantityChange = this.onQuantityChange.bind(this);
        this.onChangeTo = this.onChangeTo.bind(this);
    }

    onChangeFrom(e) {
        console.log(e.target.value);
        this.setState({ from: e.target.value });
    }

    onQuantityChange(e) {
        console.log(e.target.value);
        this.setState({ quantity: parseInt(e.target.value) });
    }

    onChangeTo(e) {
        console.log(e.target.value);
        this.setState({ to: e.target.value });
    }

    approve() {
        alert("TODO: approve")
    }

    async fusionar() {
        console.log(`cargando fusionador de la dirección ${this.props.address}`);
        let contract = await blockchainAdapter.MergerContract(this.props.address);

        const { from, to, quantity } = this.state;

        console.log(`fusionando ${from} x ${quantity} => ${to}`);
        contract.fusionar(from, to, quantity);
    }

    render() {
        const merger = this.state;
        return merger ? (
            <div className="Merger-card">
                <img className="Merger-icon" src="/logo192.png" alt="..." />
                <div className="Merger-body">
                    <h3>
                        <div>
                            {merger.name}
                        </div>
                        <div>
                            <Address value={this.props.address}></Address>
                        </div>
                    </h3>
                    <div>
                        <input className="Merger-quantity" value={this.state.quantity} onChange={this.onQuantityChange}></input>
                        <ElementSelector className="Merger-selector" source={this.props.elements} onChange={this.onChangeFrom}></ElementSelector>
                        &nbsp;&gt;
                        <ElementSelector className="Merger-selector" source={this.props.elements} onChange={this.onChangeTo}></ElementSelector>
                    </div>
                </div>
                <div className="Merger-footer">
                    <button className="Merger-button" onClick={this.approve}>
                        Aprobar
                    </button>
                    <button className="Merger-button" onClick={this.fusionar}>
                        Fusionar
                    </button>
                </div>
            </div>
        ) : (<div></div>);
    }
}

export default Merger;
