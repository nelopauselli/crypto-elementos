import React, { Component } from 'react'
import { ethers } from 'ethers';

import "./Element.css";
import Address from './Address';

class Element extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contract: null,
            name: null,
            symbol: null,
            balance: null
        }
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
                const address = this.props.address;
                console.log(`cargando elemento de la dirección ${address}`);
                let contract = new ethers.Contract(this.props.address, abi, signer);

                let name = await contract.name();
                let symbol = await contract.symbol();

                this.setState({
                    contract: contract,
                    name: name,
                    symbol: symbol,
                });
            });
    }

    async reloadBalance() {
        if (!this.state.contract || !this.props.account) {
            this.setState({
                balance: undefined
            });
            setTimeout(() => {
                this.reloadBalance();
            }, 1000);
        }

        console.log(`cargando balance de ${this.state.name} para ${this.props.account}`);
        let balance = await this.state.contract.balanceOf(this.props.account);
        console.log(`Balance of ${this.state.name}: ${balance}`);

        this.setState({
            balance: parseInt(balance)
        });

        setTimeout(() => {
            this.reloadBalance();
        }, 5000);
    }

    componentDidMount() {
        this.getData();
        setTimeout(() => {
            this.reloadBalance();
        }, 500);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
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
                    <div>
                        <Address value={this.props.address}></Address>
                    </div>
                    <img className="Element-addToMetamask" onClick={() => this.addToMetamask()} src="img/metamask.png" alt="Agregar a Metamask" title="Agregar a Metamask" />
                    <div>{element.balance} {element.symbol}</div>
                    <p>{element.description}</p>
                </div>
                <div className="Element-footer">
                    <button className="Element-button" onClick={() => this.fusionar()}>
                        Fusionar
                    </button>
                </div>
            </div>
        ) : (<div></div>);
    }
}

export default Element;