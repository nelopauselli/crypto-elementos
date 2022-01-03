import React, { Component } from 'react';
import Address from './Address';

import WalletContext from './WalletContext';

import './Wallet.css';

class Wallet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            account: null
        };
    }

    async connect() {
        const { ethereum } = window;
        if (!ethereum) {
            alert('No encontramos billetera compatible. :(');
            return;
        }

        console.log("usando ethereum");

        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log(`Encontramos ${accounts.length} direcciones`);
            if (accounts.length) {
                this.setState({ account: accounts[0] });
                this.props.onChange(accounts[0])
            }

            let self = this;
            ethereum.on('accountsChanged', function (accounts) {
                console.log(`Account change ${accounts.length}`);
                if (accounts.length) {
                    self.setState({ account: accounts[0] });
                    self.props.onChange(accounts[0])
                }
            });
        } catch (ex) {
            this.setState({ account: null });
        }
    }

    componentDidMount() {
        this.connect();
    }

    render() {
        return (
            <div className='Wallet-body'>
                {this.state.account
                    ? (<Address value={this.state.account}></Address>)
                    : (<button onClick={this.connect}>Conectar billetera</button>)}
            </div>
        );
    }
}

Wallet.contextType = WalletContext;
export default Wallet;