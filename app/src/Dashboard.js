import React, { Component } from 'react';

import WalletContext from './WalletContext';
import blockchainAdapter from './services/BlockchainAdapter';

import Element from './Element';
import Reward from './Reward';
import Merger from './Merger';

import './Dashboard.css';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        //localStorage.clear();

        this.state = {
            message: 'Cargando...',
            elements: [],
            rewards: [],
            mergers: []
        };

        this.onMerge = this.onMerge.bind(this);
    }

    async getData() {
        fetch('./json/settings.json')
            .then(response => response.json())
            .then(settings => {
                fetch('./json/root.json')
                    .then(response => response.json())
                    .then(async (abi) => {
                        console.log(abi);

                        let root = blockchainAdapter.Contract(settings.root, abi);

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

                        let mergers = Array(fusionadoresLength);
                        for (let index = 0; index < fusionadoresLength; index++) {
                            let mergerAddress = await root.obtenerFusionador(index);
                            console.log('Fusionador: ', mergerAddress);
                            mergers[index] = mergerAddress;
                        }

                        let rewards = Array(1);
                        rewards[0] = settings.rewards;

                        this.setState({
                            elements: elementos,
                            rewards: rewards,
                            mergers: mergers
                        });
                    });
            });
    }

    onMerge(e) {
        console.log("onMerge");
        this.setState({
            mergeFrom: e.address,
            mergeBalance: e.balance
        });
    }

    componentDidMount() {
        this.getData()
    }

    render() {
        return (
            <div className="Dashboard-body">
                {this.state.rewards.map(r => (<Reward key={r} address={r}></Reward>))}
                {this.state.elements.map(e => (<Element key={e} address={e}></Element>))}
                {this.state.mergers.map(m => (<Merger key={m} address={m} elements={this.state.elements}></Merger>))}
            </div>
        );
    }
}

Dashboard.contextType = WalletContext;
export default Dashboard;