import React, { Component } from 'react'
import { ethers } from 'ethers';

import "./Element.css";

class Element extends Component {
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
                const address = this.props.address;
                console.log(`cargando elemento de la dirección ${address} para la cuenta ${this.props.account}`);
                let contract = new ethers.Contract(this.props.address, abi, signer);

                let name = await contract.name();
                let symbol = await contract.symbol();
                let balance = await contract.balanceOf(this.props.account);
                console.log(`Balance of ${name}: ${balance}`);

                this.setState({
                    contract: contract,
                    address: address,
                    name: name,
                    symbol: symbol,
                    balance: parseInt(balance)
                });
            });
    }

    componentDidMount() {
        this.getData()
    }

    async addToMetamask() {
        const { ethereum } = window;

        if (!ethereum) {
            console.error('No encontramos billetera compatible. :(');
            return;
        }

        const element = this.state;

        console.log(`agregando token ${element.symbol} a metamask`);

        const tokenAddress = element.address;
        const tokenSymbol = element.symbol;
        const tokenDecimals = 0;
        const tokenImage = 'https://cryptoelementos.web.app/img/atom.png';

        try {
            // wasAdded is a boolean. Like any RPC method, an error may be thrown.
            const wasAdded = await ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20', // Initially only supports ERC20, but eventually more!
                    options: {
                        address: tokenAddress, // The address that the token is at.
                        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                        decimals: tokenDecimals, // The number of decimals in the token
                        image: tokenImage, // A string url of the token logo
                    },
                },
            });

            if (wasAdded) {
                console.log('Thanks for your interest!');
            } else {
                console.log('Your loss!');
            }
        } catch (error) {
            console.log(error);
        }
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
                    <h3>{element.name}</h3>
                    <img className="Element-addToMetamask" onClick={()=> this.addToMetamask()} src="img/metamask.png" alt="Agregar a Metamask" title="Agregar a Metamask" />
                    <div>{element.balance} {element.symbol}</div>
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