import React, { useEffect, useState, useContext, useCallback } from 'react'
import Amount from './Amount';
import blockchainAdapter from './services/BlockchainAdapter';

import WalletContext from './WalletContext';

import "./Reward.css";

function Reward() {
    const [name, setName] = useState('...');
    const [symbol, setSymbol] = useState(null);
    const [pending, setPending] = useState(null);
    const wallet = useContext(WalletContext);

    const reloadPending = useCallback(async () => {
        let cosmos = await blockchainAdapter.CosmosContract();
        if (!cosmos || !wallet) return;

        console.log(`cargando pendiente de ${name} para ${wallet}`);

        let value = parseInt(await cosmos.pendingReward());
        console.log(`Pending of ${name}: ${value}`);

        setPending(value);
    }, [name, wallet]);

    useEffect(() => {
        async function fetchData() {
            let cosmos = await blockchainAdapter.CosmosContract();
            let elementAddr = await cosmos.obtenerElementoClaimable();
            let element = await blockchainAdapter.ElementContract(elementAddr);

            setName(await element.name());
            setSymbol(await element.symbol());

            reloadPending();
            blockchainAdapter.onBlock(reloadPending);
        }
        fetchData();
    }, [reloadPending]);

    const claim = async () => {
        let contract = await blockchainAdapter.CosmosContract();
        await contract.claim();
    }

    return (
        <div className="Reward-card">
            <img className="Reward-icon" src="/logo192.png" alt="..." />
            <div className="Reward-body">
                <h3>{name}</h3>
                <p>Usted tiene <Amount value={pending} unit={symbol}></Amount> pendientes de reclamar</p>
            </div>
            <div className="Reward-footer">
                <button className="Reward-button" onClick={claim}>
                    Reclamar
                </button>
            </div>
        </div>
    );
}

export default Reward;