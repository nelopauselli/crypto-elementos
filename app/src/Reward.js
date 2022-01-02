import React, { Component } from 'react'
import { ethers } from 'ethers';

import "./Reward.css";

class Reward extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contract: null,
            address: null,
            name: null,
            symbol: null,
            subscribed: null,
            pending: null,
            description: null
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

        fetch('./json/hidrogeno.json')
            .then(response => response.json())
            .then(async (abi) => {
                const address = this.props.address;
                console.log(`cargando elemento de la dirección ${address} para la cuenta ${this.props.account}`);
                let contract = new ethers.Contract(this.props.address, abi, signer);

                let name = await contract.name();
                let symbol = await contract.symbol();

                this.setState({
                    contract: contract,
                    address: address,
                    name: name,
                    symbol: symbol
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
            return;
        }

        console.log(`cargando pendiente de ${this.state.name} para ${this.props.account}`);
        let subscribed = await this.state.contract.subscribed();
        let pending = await this.state.contract.pendingReward();
        console.log(`Pending of ${this.state.name}: ${pending}`);
        let description = subscribed
            ? `Usted tiene ${pending} ${this.state.symbol} pendientes de reclamar`
            : `Usted no está subscripto a este generador de ${this.state.symbol}`;

        this.setState({
            subscribed: subscribed,
            pending: parseInt(pending),
            description: description
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

    async subscribe() {
        await this.state.subscribe();
    }

    async getPendingReward() {
        await this.state.contract.pendingReward(); //.call({ from: this.accountAddress }).then(value => this.pending(value));
    }

    async claim() {
        await this.state.contract.claim(); //.send({ from: this.accountAddress, gas: 470000, gasPrice: 0 });
    }

    render() {
        const reward = this.state;
        return reward ? (
            <div className="Reward-card">
                <img className="Reward-icon" src="/logo192.png" alt="..." />
                <div className="Reward-body">
                    <h3>{reward.name}</h3>
                    <p>{reward.description}</p>
                </div>
                <div className="Reward-footer">
                    <button className="Reward-button" onClick={() => this.claim()}>
                        Reclamar
                    </button>
                </div>
            </div>
        ) : (<div></div>);
    }
}

export default Reward;