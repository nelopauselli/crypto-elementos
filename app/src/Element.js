import React, { useContext, useEffect, useState, useCallback } from 'react'
import blockchainAdapter from './services/BlockchainAdapter';

import WalletContext from './WalletContext';

import "./Element.css";
import Address from './Address';

function Element(props) {
    const [address] = useState(props.address);
    const [name, setName] = useState('...');
    const [symbol, setSymbol] = useState(null);
    const [balance, setBalance] = useState(null);
    const [description, setDescription] = useState(null);
    const wallet = useContext(WalletContext);

    const reloadBalance = useCallback(async () => {
        let contract = await blockchainAdapter.ElementContract(address);
        if (!contract || !wallet) return;

        console.log(`cargando balance de ${name} para ${wallet}`);
        let value = parseInt(await contract.balanceOf(wallet));
        console.log(`Balance of ${name}: ${value}`);

        if (value !== balance)
            setBalance(value);
    }, [address, balance, name, wallet]);

    const addToMetamask = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            console.error('No encontramos billetera compatible. :(');
            return;
        }

        console.log(`agregando token ${symbol} a metamask`);

        const tokenAddress = address;
        const tokenSymbol = symbol;
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
    };

    useEffect(() => {
        async function fetchData() {
            console.log(`cargando elemento de la dirección ${address}`);

            let contract = await blockchainAdapter.ElementContract(address);

            let name = await contract.name();
            let symbol = await contract.symbol();

            setName(name);
            setSymbol(symbol);

            localStorage.setItem(address, JSON.stringify({ address: address, name: name, symbol: symbol }));
        
            await reloadBalance();
            blockchainAdapter.onBlock(reloadBalance);
        };
        fetchData();
    }, [address, reloadBalance])

    return (
        <div className="Element-card">
            <img className="Element-icon" src="/logo192.png" alt="..." />
            <div className="Element-body">
                <h3>
                    <div>
                        {name}
                        <img className="Element-addToMetamask" onClick={addToMetamask} src="img/metamask.svg" alt="Agregar a Metamask" title="Agregar a Metamask" />
                    </div>
                    <div>
                        <Address value={address}></Address>
                    </div>
                </h3>
                <div>{balance} {symbol}</div>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default Element;
