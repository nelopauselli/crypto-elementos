import React, { Component } from 'react';
import Address from './Address';

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

        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        console.log(`Encontramos ${accounts.length} direcciones`);
        if (accounts.length) {
            this.setState({ account: accounts[0] });
            this.props.onChange(accounts[0]);
        }
    }

    componentDidMount() {
        this.connect();
    }

    render() {
        return (this.state.account
            ? (<Address value={this.state.account}></Address>)
            : (<button onClick={this.connect}>Conectar billetera</button>)
        );
    }
}

export default Wallet;