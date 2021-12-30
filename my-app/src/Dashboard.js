import React, { Component } from 'react'
import Element from './Element';

import './Dashboard.css';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            elements: []
        };
    }

    getData() {
        // axios.get('http://jsonplaceholder.typicode.com/users').then(res => {
        //   var data = res.data
        var data = [
            { symbol: "H", name: "Hidrogeno", balance: NaN, descrption: 'El elemento original' },
            { symbol: "He", name: "Helio", balance: NaN, descrption: 'Inflar globos' },
            { symbol: "Li", name: "Litio", balance: NaN, descrption: 'Usado en baterias' },
            { symbol: "Be", name: "Berilio", balance: NaN, descrption: 'bla bla' },
            { symbol: "B", name: "Boro", balance: NaN, descrption: 'bla bla' },
            { symbol: "C", name: "Carbono", balance: NaN, descrption: 'bla bla' },
            { symbol: "N", name: "Nitrogeno", balance: NaN, descrption: 'bla bla' },
            { symbol: "O", name: "Oxigeno", balance: NaN, descrption: 'bla bla' },
            { symbol: "F", name: "Fluor", balance: NaN, descrption: 'bla bla' },
            { symbol: "Ne", name: "Neon", balance: NaN, descrption: 'bla bla' },
            { symbol: "Na", name: "Sodio", balance: NaN, descrption: 'bla bla' },
            { symbol: "Mg", name: "Magnesio", balance: NaN, descrption: 'bla bla' },
            { symbol: "Al", name: "Aluminio", balance: NaN, descrption: 'bla bla' },
            { symbol: "Si", name: "Silicio", balance: NaN, descrption: 'bla bla' },
        ];
        this.setState({ elements: data })
        // })
    }
    componentDidMount() {
        this.getData()
    }

    render() {
        return (
            <div className="Dashboard-body">
                {this.state.elements.map(e => (<Element element={e}></Element>))}
            </div>
        );
    }
}

export default Dashboard;
