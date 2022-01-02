import React, { Component } from 'react';

import WalletContext from './WalletContext';

import Dashboard from './Dashboard';
import Wallet from './Wallet';


import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { account: null };

    this.onWalletChange = this.onWalletChange.bind(this);
  }

  onWalletChange(account) {
    console.log(`Cuenta: ${account}`);
    this.setState({ account: account });
  }

  render() {
    return (
      <div className="App">
        <header className="App-workspace">
          <div>crypto-elementos \\ Testnet //</div>
          <div>
            <Wallet onChange={this.onWalletChange}></Wallet>
          </div>
          <WalletContext.Provider value={this.state.account}>
            <Dashboard></Dashboard>
          </WalletContext.Provider>
        </header>
      </div>
    );
  }
}

export default App;
