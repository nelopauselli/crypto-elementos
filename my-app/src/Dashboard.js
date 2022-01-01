import React, { Component } from 'react';
import { ethers } from 'ethers';

import Wallet from './Wallet';
import Element from './Element';
import Reward from './Reward';

import './Dashboard.css';


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: 'Cargando...',
            account: null,
            elements: [],
            rewards: [],
        };
        this.onWalletChange = this.onWalletChange.bind(this);
    }

    async getData() {
        const { ethereum } = window;

        if (!ethereum) {
            console.error('No encontramos billetera compatible. :(');
            return;
        }

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        fetch('./json/settings.json')
            .then(response => response.json())
            .then(settings => {
                fetch('./json/root.json')
                    .then(response => response.json())
                    .then(async (abi) => {
                        console.log(abi);

                        let root = new ethers.Contract(settings.root, abi, signer);

                        let elementosSize = await root.contarElementos();
                        console.log("hay " + elementosSize + " elementos registrados");
                        let elementosLength = parseInt(elementosSize);

                        let elementos = Array(elementosLength);
                        for (let index = 0; index < elementosLength; index++) {
                            let elementAddress = await root.obtenerElemento(index);
                            console.log('Elemento: ', elementAddress);
                            elementos[index] = elementAddress;
                        }

                        let fusionadoresSize = await root.contarFusionadores();
                        console.log("hay " + fusionadoresSize + " fusionadores registrados");
                        let fusionadoresLength = parseInt(fusionadoresSize);

                        let fusionadores = Array(fusionadoresLength);
                        for (let index = 0; index < fusionadoresLength; index++) {
                            let fusionadorAddress = await root.obtenerFusionador(index);
                            console.log('Fusionador: ', fusionadorAddress);
                            fusionadores[index] = fusionadorAddress;
                        }

                        let rewards = Array(1);
                        rewards[0] = settings.rewards;

                        this.setState({ account: this.state.account, elements: elementos, rewards: rewards });
                    });
            });
    }

    onWalletChange(account){
        console.log(`Cuenta: ${account}`);
        this.setState({account: account});
    }

    componentDidMount() {
        this.getData()
    }

    render() {
        return (
            <div>
                <div>
                    <Wallet onChange={this.onWalletChange}></Wallet>
                </div>
                <div className="Dashboard-body">
                    {this.state.rewards.map(r => (<Reward key={r} address={r} account={this.state.account}></Reward>))}
                    {this.state.elements.map(e => (<Element key={e} address={e} account={this.state.account}></Element>))}
                </div>
            </div>
        );
    }
}

export default Dashboard;