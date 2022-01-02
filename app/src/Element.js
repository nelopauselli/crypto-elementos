import React, { Component } from 'react'
import blockchainAdapter from './services/BlockchainAdapter';

import WalletContext from './WalletContext';

import "./Element.css";
import Address from './Address';

class Element extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contract: null,
            name: "...",
            symbol: null,
            balance: null
        }
    }

    getData() {
        fetch('./json/elemento.json')
            .then(response => response.json())
            .then(async (abi) => {
                const { address } = this.props;
                console.log(`cargando elemento de la dirección ${address}`);
                let contract = blockchainAdapter.Contract(this.props.address, abi);

                let name = await contract.name();
                let symbol = await contract.symbol();

                this.setState({
                    contract: contract,
                    name: name,
                    symbol: symbol,
                });

                localStorage.setItem(address, JSON.stringify({ address: address, name: name, symbol: symbol }));

                setTimeout(() => {
                    this.reloadBalance();
                }, 1000);
            });
    }

    async reloadBalance() {
        let wallet = this.context;
        console.log(wallet);

        if (!this.state.contract || !wallet) {
            this.setState({
                balance: undefined
            });
            setTimeout(() => {
                this.reloadBalance();
            }, 1000);
            return;
        }

        console.log(`cargando balance de ${this.state.name} para ${wallet}`);
        let balance = await this.state.contract.balanceOf(wallet);
        console.log(`Balance of ${this.state.name}: ${balance}`);

        this.setState({
            balance: parseInt(balance)
        });

        setTimeout(() => {
            this.reloadBalance();
        }, 30000);
    }

    componentDidMount() {
        this.getData();
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

    render() {
        const element = this.state;
        return element ? (
            <div className="Element-card">
                <img className="Element-icon" src="/logo192.png" alt="..." />
                <div className="Element-body">
                    <h3>
                        <div>
                            {element.name}
                            <img className="Element-addToMetamask" onClick={this.addToMetamask} src="img/metamask.svg" alt="Agregar a Metamask" title="Agregar a Metamask" />
                        </div>
                        <div>
                            <Address value={this.props.address}></Address>
                        </div>
                    </h3>
                    <div>{element.balance} {element.symbol}</div>
                    <p>{element.description}</p>
                </div>
            </div>
        ) : (<div></div>);
    }
}

Element.contextType = WalletContext;
export default Element;
