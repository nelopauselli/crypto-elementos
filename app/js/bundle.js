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


function ViewModel(accountAddress) {
    var self = this;
    this.elementos = ko.observableArray();
    this.accountAddress = accountAddress;

    fetch('./json/hidrogeno.json')
        .then(response => response.json())
        .then(abi => {
            let address = '0x3bF7f20Bf351C038561c8Cf7aAb0C7C09dEa35dB';
            let contract = new document.web3.eth.Contract(abi, address);
            let element = {
                contract: contract,
                name: ko.observable("..."),
                symbol: ko.observable("..."),
                masaAtomica: 1.008,
                balance: ko.observable(10000021),
                enabled: ko.observable(true)
            }
            self.elementos.push(element);
            contract.methods.name().call().then(value => element.name(value));
            contract.methods.symbol().call().then(value => element.symbol(value));
            contract.methods.balanceOf(self.accountAddress).call().then(value => element.balance(value));
        });

    this.elementos.push({ name: "Helio", symbol: "He", masaAtomica: 4.003, balance: ko.observable(8000), enabled: ko.observable(true) });
    this.elementos.push({ name: "Carbono", symbol: "C", masaAtomica: 12.01, balance: ko.observable(20), enabled: ko.observable(true) });
    this.elementos.push({ name: "Nitrógeno", symbol: "N", masaAtomica: 14.0067, balance: ko.observable(0), enabled: ko.observable(true) });
    this.elementos.push({ name: "Oxígeno", symbol: "O", masaAtomica: 15.9994, balance: ko.observable(0), enabled: ko.observable(false) });

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

async function loadWalletAsync() {
    return new Promise(resolve => {
        if (window.ethereum !== undefined) {
            window.ethereum.on('accountsChanged', function (accounts) {
                console.log(accounts);
                if (accounts[0]) {
                    resolve(accounts[0]);
                }
            });

            window.ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
                if (accounts.length > 0) {
                    const account = accounts[0];
                    if (account) {
                        resolve(account);
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
            var vm = new ViewModel(address);
            console.log(vm);
            ko.applyBindings(vm);
        });

})(ko, Web3);