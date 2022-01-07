import React, { useState, useContext } from 'react'
import blockchainAdapter from './services/BlockchainAdapter';
import { BigNumber } from 'ethers';
import WalletContext from './WalletContext';

import "./Merger.css";
import Address from './Address';
import ElementSelector from './ElementSelector';

function Merger(props) {
    const wallet = useContext(WalletContext);
    const [address] = useState(props.address);
    const [elements] = useState(props.elements);    
    const [name] = useState('Fusionador');
    const [from, setFrom] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const [allowance, setAllowance] = useState(false);
    const [allowanced, setAllowanced] = useState(null);
    const [to, setTo] = useState(null);

    const onChangeFrom = async (e) => {
        const elementAddr = e.target.value;

        let elementFrom = await blockchainAdapter.ElementContract(elementAddr);
        let balance = await elementFrom.balanceOf(wallet);
        let allowance = await elementFrom.allowance(wallet, address);

        let quantity = BigNumber.from(balance);

        setFrom(elementAddr);
        setQuantity(parseInt(balance));
        setAllowance(allowance.gte(quantity));
        setAllowanced(allowance.gte(blockchainAdapter.UINT_256_AVG)
            ? 'mucho'
            : allowance.toString());
    }

    const onQuantityChange = async (e) => {
        let quantity = BigNumber.from(e.target.value);
        console.log(quantity);

        let elementFrom = await blockchainAdapter.ElementContract(from);
        let allowance = await elementFrom.allowance(wallet, address);

        setQuantity(quantity.toNumber());
        setAllowance(allowance.gte(quantity));
        setAllowanced(allowance.gte(blockchainAdapter.UINT_256_AVG)
            ? 'mucho'
            : allowance.toString());
    }

    const onChangeTo = (e) => {
        console.log(e.target.value);
        setTo(e.target.value);
    }

    const approve = async () => {
        let contract = await blockchainAdapter.ElementContract(from);
        let approved = await contract.approve(address, blockchainAdapter.UINT_256_MAX);
        console.log(approved);
    }

    const approveOne = async () => {
        let contract = await blockchainAdapter.ElementContract(from);
        let approved = contract.approve(address, quantity);
        console.log(approved);
    }

    const fusionar = async () => {
        console.log(`cargando fusionador de la dirección ${address}`);
        let contract = await blockchainAdapter.MergerContract(address);

        console.log(`fusionando ${from} x ${quantity} => ${to}`);
        contract.fusionar(from, to, quantity);
    }

    return (
        <div className="Merger-card">
            <img className="Merger-icon" src="/logo192.png" alt="..." />
            <div className="Merger-body">
                <h3>
                    <div>
                        {name}
                    </div>
                    <div>
                        <Address value={address}></Address>
                    </div>
                </h3>
                <div>
                    <ElementSelector className="Merger-selector" source={elements} onChange={onChangeFrom}></ElementSelector>
                    {
                        from ? (
                            <div>
                                <input className="Merger-quantity" value={quantity} onChange={onQuantityChange}></input>
                                <div>M&aacute;ximo autorizado: {allowanced}</div>
                            </div>
                        ) : (<div></div>)
                    }
                    {
                        allowance ? (
                            <ElementSelector className="Merger-selector" source={elements} onChange={onChangeTo}></ElementSelector>
                        ) : from ? (
                            <div>
                                <button className="Merger-button" onClick={approve}>Aprobar por siempre</button>
                                <button className="Merger-button" onClick={approveOne}>Aprobar solo {quantity}</button>
                            </div>
                        ) : (<div></div>)
                    }

                </div>
            </div>
            <div className="Merger-footer">

                <button className="Merger-button" onClick={fusionar}>
                    Fusionar
                </button>
            </div>
        </div>
    )
}

export default Merger;
