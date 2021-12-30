import React, { Component } from 'react'
import { ethers } from 'ethers';

import "./Element.css";

class Element extends Component {
    constructor(props) {
        super(props);
        this.setState({
            name: "loading...",
            symbol: '?',
            balance: NaN,
            description: ''
        });
    }
    getData() {
        const { ethereum } = window;

        if (!ethereum) {
            console.error('No encontramos billetera compatible. :(');
            return;
        }

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        fetch('./json/elemento.json')
            .then(response => response.json())
            .then(async (abi) => {
                console.log(`cargando elemento de la dirección ${this.props.address} para la cuenta ${this.props.account}`);
                let contract = new ethers.Contract(this.props.address, abi, signer);

                let name = await contract.name();
                let symbol = await contract.symbol();
                let balance = await contract.balanceOf(this.props.account);
                console.log(`Balance of ${name}: ${balance}`);

                this.setState({
                    contract: contract,
                    name: name,
                    symbol: symbol,
                    balance: parseInt(balance)
                });
            });
    }

    componentDidMount() {
        this.getData()
    }

    addToMetamask(element) {
        alert(`TODO: add token ${element.symbol} to metamask`);
    }

    fusionar(element) {
        alert(`TODO: fusionar en ${element.symbol}`);
    }

    render() {
        const element = this.state;
        return element ? (
            <div className="Element-card">
                <img className="Element-icon" src="/logo192.png" alt="..." />
                <div className="Element-body">
                    <div className="Element-addToMetamask">
                        <button onClick={() => this.addToMetamask(element)}>
                            <img className="img-button" src="img/metamask.png" alt="Agregar a Metamask" title="Agregar a Metamask" />
                        </button>
                    </div>
                    <h3>{element.symbol}</h3>
                    <h5>{element.name}</h5>
                    <div>{element.balance}</div>
                    <p>{element.description}</p>
                </div>
                <div className="Element-footer">
                    <button className="btn btn-primary" onClick={() => this.fusionar()}>
                        Fusionar en <span data-bind="text: $data.to.name"></span>
                    </button>
                </div>
            </div>
        ) : (<div></div>);
    }
}

export default Element;