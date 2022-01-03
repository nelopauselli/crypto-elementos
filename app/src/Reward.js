import React, { Component } from 'react'
import blockchainAdapter from './services/BlockchainAdapter';

import WalletContext from './WalletContext';

import "./Reward.css";

class Reward extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: null,
            symbol: null,
            subscribed: null,
            pending: null,
            description: null
        }
    }

    async getData() {
        let contract = await blockchainAdapter.RewardContract(this.props.address);

        let name = await contract.name();
        let symbol = await contract.symbol();

        this.setState({
            name: name,
            symbol: symbol
        });
    }

    async reloadBalance() {
        let contract = await blockchainAdapter.RewardContract(this.props.address);
        let wallet = this.context;

        if (!contract || !wallet) {
            this.setState({
                balance: undefined
            });
            setTimeout(() => {
                this.reloadBalance();
            }, 1000);
            return;
        }

        console.log(`cargando pendiente de ${this.state.name} para ${wallet}`);
        let subscribed = await contract.subscribed();
        let pending = await contract.pendingReward();
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
        let contract = await blockchainAdapter.RewardContract(this.props.address);
        await contract.pendingReward();
    }

    async claim() {
        let contract = await blockchainAdapter.RewardContract(this.props.address);
        await contract.claim();
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

Reward.contextType = WalletContext;
export default Reward;