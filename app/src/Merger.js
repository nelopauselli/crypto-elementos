import React, { Component } from 'react'
import blockchainAdapter from './services/BlockchainAdapter';
import { BigNumber } from 'ethers';
import WalletContext from './WalletContext';

import "./Merger.css";
import Address from './Address';
import ElementSelector from './ElementSelector';

class Merger extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "Fusionador",
            from: null,
            quantity: 0,
            allowance: false,
            allowanced: null,
            to: null,
        }


        this.onChangeFrom = this.onChangeFrom.bind(this);
        this.onQuantityChange = this.onQuantityChange.bind(this);
        this.approve = this.approve.bind(this);
        this.approveOne = this.approveOne.bind(this);
        this.onChangeTo = this.onChangeTo.bind(this);
        this.fusionar = this.fusionar.bind(this);

    }

    async onChangeFrom(e) {
        const elementAddr = e.target.value;

        let from = await blockchainAdapter.ElementContract(elementAddr);
        let balance = await from.balanceOf(this.context);
        let allowance = await from.allowance(this.context, this.props.address);
      
        let quantity = BigNumber.from(balance);

        this.setState({ from: elementAddr, quantity: parseInt(balance), allowance: allowance.gte(quantity), allowanced: allowance.toString() });
    }

    async onQuantityChange(e) {
        let quantity = BigNumber.from(e.target.value);
        console.log(quantity);

        let from = await blockchainAdapter.ElementContract(this.state.from);
        let allowance = await from.allowance(this.context, this.props.address);

        this.setState({ quantity: quantity.toNumber(), allowance: allowance.gte(quantity), allowanced: allowance.toString() });
    }

    onChangeTo(e) {
        console.log(e.target.value);
        this.setState({ to: e.target.value });
    }

    async approve() {
        let contract = await blockchainAdapter.ElementContract(this.state.from);
        let approved = await contract.approve(this.props.address, blockchainAdapter.UINT_256_MAX);
        console.log(approved);
    }

    async approveOne() {
        let contract = await blockchainAdapter.ElementContract(this.state.from);
        let approved = contract.approve(this.props.address, this.state.quantity);
        console.log(approved);
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
                        <ElementSelector className="Merger-selector" source={this.props.elements} onChange={this.onChangeFrom}></ElementSelector>
                        {
                            this.state.from ? (
                                <div>
                                <input className="Merger-quantity" value={this.state.quantity} onChange={this.onQuantityChange}></input>
                                <div>M&aacute;ximo autorizado: {this.state.allowanced}</div>
                                </div>
                            ) : (<div></div>)
                        }
                        {
                            this.state.allowance ? (
                                <ElementSelector className="Merger-selector" source={this.props.elements} onChange={this.onChangeTo}></ElementSelector>
                            ) : this.state.from ? (
                                <div>
                                    <button className="Merger-button" onClick={this.approve}>Aprobar por siempre</button>
                                    <button className="Merger-button" onClick={this.approveOne}>Aprobar solo {this.state.quantity}</button>
                                </div>
                            ) : (<div></div>)
                        }

                    </div>
                </div>
                <div className="Merger-footer">

                    <button className="Merger-button" onClick={this.fusionar}>
                        Fusionar
                    </button>
                </div>
            </div>
        ) : (<div></div>);
    }
}

Merger.contextType = WalletContext;
export default Merger;
