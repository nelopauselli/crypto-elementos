import React, { useEffect, useState } from 'react';

import blockchainAdapter from './services/BlockchainAdapter';

import Element from './Element';
import Reward from './Reward';
import Merger from './Merger';

import './Dashboard.css';

function Dashboard() {
    const [elements, setElements] = useState([]);
    const [mergers, setMergers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            console.log("Dashboard.fetchData");
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
            setElements(elementos);

            let fusionadoresSize = await cosmos.contarFusionadores();
            console.log("hay " + fusionadoresSize + " fusionadores registrados");
            let fusionadoresLength = parseInt(fusionadoresSize);

            let mergers = Array(fusionadoresLength);
            for (let index = 0; index < fusionadoresLength; index++) {
                let mergerAddress = await cosmos.obtenerFusionador(index);
                console.log('Fusionador: ', mergerAddress);
                mergers[index] = mergerAddress;
            }
            setMergers(mergers);
        }
        fetchData();
    }, []);

    return (
        <div className="Dashboard-body">
            <Reward></Reward>
            {elements.map(e => (<Element key={e} address={e}></Element>))}
            {mergers.map(m => (<Merger key={m} address={m} elements={elements}></Merger>))}
        </div>
    );
}

export default Dashboard;