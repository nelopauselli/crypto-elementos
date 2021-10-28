async function initWeb3() {
    if (window.ethereum !== undefined) {
        console.log("usando ethereum");
        document.web3 = new Web3(window.ethereum);
    } else if (window.web3 !== undefined) {
        console.log("usando web3");
        document.web3 = new Web3(window.web3.currentProvider);
    } else {
        console.log("usando bsc por default");
        document.web3 = new Web3('https://bsc-dataseed1.binance.org:443');
    }
}

function Element(contract, accountAddress) {
    let self = this;

    this.contract = contract;
    this.name = ko.observable("...");
    this.symbol = ko.observable("...");
    this.masaAtomica = ko.observable("...");
    this.balance = ko.observable("...");
    this.enabled = ko.observable(true);

    this.contract.methods.name().call().then(value => self.name(value));
    this.contract.methods.symbol().call().then(value => self.symbol(value));
    //this.contract.methods._masaAtomica().call().then(value => self.masaAtomica(value));
    self.masaAtomica(1.004)
    this.contract.methods.balanceOf(accountAddress).call().then(value => self.balance(value));
    this.accountAddress = accountAddress;

    this.claimable = self.contract.methods.claim !== undefined;

    this.claim = function () {
        self.contract.methods.claim()
            .send({
                from: self.accountAddress,
                gas: 470000,
                //value: 1000000000000000000, // in WEI, which is equivalent to 1 ether
                gasPrice: 0
            })
            .then(value => {
                console.log(value);
                self.contract.methods.balanceOf(self.accountAddress)
                    .call()
                    .then(value => self.balance(value));
            });
    }
}

function ViewModel(accountAddress) {
    var self = this;
    this.elementos = ko.observableArray();
    this.accountAddress = accountAddress;

    fetch('./json/hidrogeno.json')
        .then(response => response.json())
        .then(abi => {
            let contract = new document.web3.eth.Contract(abi, '0x3bF7f20Bf351C038561c8Cf7aAb0C7C09dEa35dB');
            let element = new Element(contract, self.accountAddress)
            self.elementos.push(element);
        });

    // this.elementos.push({ name: "Helio", symbol: "He", masaAtomica: 4.003, balance: ko.observable(8000), enabled: ko.observable(true) });
    // this.elementos.push({ name: "Carbono", symbol: "C", masaAtomica: 12.01, balance: ko.observable(20), enabled: ko.observable(true) });
    // this.elementos.push({ name: "Nitrógeno", symbol: "N", masaAtomica: 14.0067, balance: ko.observable(0), enabled: ko.observable(true) });
    // this.elementos.push({ name: "Oxígeno", symbol: "O", masaAtomica: 15.9994, balance: ko.observable(0), enabled: ko.observable(false) });

    this.origen = ko.observable();
    this.cantidad = ko.observable();
    this.destino = ko.observable();
    this.fusionar = function () {
        var origen = this.origen();
        var destino = this.destino();

        if (origen.balance() >= this.cantidad()) {
            origen.balance(origen.balance() - this.cantidad());
            var masaAtomica = this.cantidad() * parseInt(origen.masaAtomica);
            var nuevaMateria = parseInt(masaAtomica / parseInt(destino.masaAtomica));
            setTimeout(function () {
                destino.balance(destino.balance() + nuevaMateria);
            }, 500);
        }
    }
}

function loadWalletAsync() {
    return new Promise(resolve => {
        if (window.ethereum !== undefined) {
            window.ethereum.on('accountsChanged', function (accounts) {
                if (accounts[0]) {
                    return resolve(accounts[0]);
                }
            });

            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(accounts => {
                    if (accounts.length > 0) {
                        const account = accounts[0];
                        if (account) {
                            return resolve(account);
                        }
                    }
                });
        }
    });
}

(function (ko, Web3) {
    initWeb3()
        .then(loadWalletAsync)
        .then((address) => {
            console.log(address);
            var vm = new ViewModel(address);
            console.log(vm);
            ko.applyBindings(vm);
        });

})(ko, Web3);