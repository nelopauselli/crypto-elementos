import React, { Component } from 'react'
import blockchainAdapter from './services/BlockchainAdapter';

import WalletContext from './WalletContext';

import "./Reward.css";

class Reward extends Component {
    constructor(props) {
        super(props);

        this.state = {
            address: null,
            name: null,
            symbol: null,
            pending: null
        }
    }

    async getData() {
        let cosmos = await blockchainAdapter.CosmosContract();
        let elementAddr = await cosmos.obtenerElementoClaimable();
        let element = await blockchainAdapter.ElementContract(elementAddr);

        let name = await element.name();
        let symbol = await element.symbol();

        this.setState({
            name: name,
            symbol: symbol
        });

        this.reloadPending();
    }

    async reloadPending() {
        let cosmos = await blockchainAdapter.CosmosContract();
        let wallet = this.context;

        if (!cosmos || !wallet) {
            this.setState({
                pending: null
            });
            setTimeout(() => {
                this.reloadPending();
            }, 1000);
            return;
        }

        console.log(`cargando pendiente de ${this.state.name} para ${wallet}`);

        let pending = await cosmos.pendingReward();
        console.log(`Pending of ${this.state.name}: ${pending}`);

        this.setState({
            pending: parseInt(pending),
        });

        setTimeout(() => {
            this.reloadPending();
        }, 5000);
    }

    componentDidMount() {
        this.getData();
    }

    async subscribe() {
        await this.state.subscribe();
    }

    async getPendingReward() {
        let contract = await blockchainAdapter.CosmosContract();
        await contract.pendingReward();
    }

    async claim() {
        let contract = await blockchainAdapter.CosmosContract();
        await contract.claim();
    }

    render() {
        const reward = this.state;
        return reward && reward.symbol ? (
            <div className="Reward-card">
                <img className="Reward-icon" src="/logo192.png" alt="..." />
                <div className="Reward-body">
                    <h3>{reward.name}</h3>
                    <p>Usted tiene {reward.pending} {reward.symbol} pendientes de reclamar</p>
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