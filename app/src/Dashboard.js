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
        let cosmos = await blockchainAdapter.CosmosContract();

        let elementosSize = await cosmos.contarElementos();
        console.log("hay " + elementosSize + " elementos registrados");
        let elementosLength = parseInt(elementosSize);

        let elementos = Array(elementosLength);
        for (let index = 0; index < elementosLength; index++) {
            let elementAddress = await cosmos.obtenerElemento(index);
            console.log('Elemento: ', elementAddress);
            elementos[index] = elementAddress;
        }

        let fusionadoresSize = await cosmos.contarFusionadores();
        console.log("hay " + fusionadoresSize + " fusionadores registrados");
        let fusionadoresLength = parseInt(fusionadoresSize);

        let mergers = Array(fusionadoresLength);
        for (let index = 0; index < fusionadoresLength; index++) {
            let mergerAddress = await cosmos.obtenerFusionador(index);
            console.log('Fusionador: ', mergerAddress);
            mergers[index] = mergerAddress;
        }

        this.setState({
            elements: elementos,
            mergers: mergers
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
                <Reward></Reward>
                {this.state.elements.map(e => (<Element key={e} address={e}></Element>))}
                {this.state.mergers.map(m => (<Merger key={m} address={m} elements={this.state.elements}></Merger>))}
            </div>
        );
    }
}

Dashboard.contextType = WalletContext;
export default Dashboard;