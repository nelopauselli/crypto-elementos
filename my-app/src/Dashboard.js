import React, { Component } from 'react';
import { ethers } from 'ethers';

import Element from './Element';
import './Dashboard.css';


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: null,
            elements: []
        };
    }

    async initWallet() {
        const { ethereum } = window;
        if (!ethereum) {
            alert('No encontramos billetera compatible. :(');
            return;
        }

        console.log("usando ethereum");

        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        console.log(`Encontramos ${accounts.length} direcciones`);
        if (accounts.length) {
            this.setState({ account: accounts[0], elements: [] });
        }
    }

    async getData() {
        await this.initWallet();

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
                            elementos[index]=elementAddress;
                        }

                        let fusionadoresSize = await root.contarFusionadores();
                        console.log("hay " + fusionadoresSize + " fusionadores registrados");
                        let fusionadoresLength = parseInt(fusionadoresSize);
                        
                        let fusionadores = Array(fusionadoresLength);
                        for (let index = 0; index < fusionadoresLength; index++) {
                            let fusionadorAddress = await root.obtenerFusionador(index);
                            console.log('Fusionador: ', fusionadorAddress);
                            fusionadores[index]=fusionadorAddress;
                        }

                        this.setState({account: this.state.account, elements : elementos});
                    });

                fetch('./json/hidrogeno.json')
                    .then(response => response.json())
                    .then(abi => {
                        // let reward = new Reward(abi, settings.rewards, self.accountAddress);
                        // self.rewards.push(reward);
                    });

            });

        
        // var data = [
        //     { symbol: "H", name: "Hidrogeno", balance: NaN, descrption: 'El elemento original' },
        //     { symbol: "He", name: "Helio", balance: NaN, descrption: 'Inflar globos' },
        //     { symbol: "Li", name: "Litio", balance: NaN, descrption: 'Usado en baterias' },
        //     { symbol: "Be", name: "Berilio", balance: NaN, descrption: 'bla bla' },
        //     { symbol: "B", name: "Boro", balance: NaN, descrption: 'bla bla' },
        //     { symbol: "C", name: "Carbono", balance: NaN, descrption: 'bla bla' },
        //     { symbol: "N", name: "Nitrogeno", balance: NaN, descrption: 'bla bla' },
        //     { symbol: "O", name: "Oxigeno", balance: NaN, descrption: 'bla bla' },
        //     { symbol: "F", name: "Fluor", balance: NaN, descrption: 'bla bla' },
        //     { symbol: "Ne", name: "Neon", balance: NaN, descrption: 'bla bla' },
        //     { symbol: "Na", name: "Sodio", balance: NaN, descrption: 'bla bla' },
        //     { symbol: "Mg", name: "Magnesio", balance: NaN, descrption: 'bla bla' },
        //     { symbol: "Al", name: "Aluminio", balance: NaN, descrption: 'bla bla' },
        //     { symbol: "Si", name: "Silicio", balance: NaN, descrption: 'bla bla' },
        // ];
        //this.setState({ elements: data })
    }
    
    componentDidMount() {
        this.getData()
    }

    render() {
        return (
            <div >
                <div>{this.state.account}</div>
                <div className="Dashboard-body">
                    {this.state.elements.map(e => (<Element address={e} account={this.state.account}></Element>))}
                </div>
            </div>
        );
    }
}

export default Dashboard;
