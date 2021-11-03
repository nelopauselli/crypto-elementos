async function initWeb3() {
    if (window.ethereum !== undefined) {
        console.log("usando ethereum");
        document.web3 = new Web3(window.ethereum);
    } else if (window.web3 !== undefined) {
        console.log("usando web3");
        document.web3 = new Web3(window.web3.currentProvider);
    } else {
        alert('No encontramos billetera compatible. :(');
    }
}

function Fusionador(abi, address, accountAddress) {
    let self = this;

    this.contract = new document.web3.eth.Contract(abi, '0xaae9095bE1BF40989948a461f2C760B98F9c4e66');
    this.address = address;

    this.accountAddress = accountAddress;
    this.fusionar = function (origen, cantidad, destino) {
        console.log(origen.address);
        console.log(cantidad);
        console.log(destino.address);

        return self.contract.methods.fusionar(origen.address, destino.address, cantidad)
            .send({
                from: self.accountAddress,
                gas: 470000,
                //value: 1000000000000000000, // in WEI, which is equivalent to 1 ether
                gasPrice: 0
            })
            .then(response => console.log(response));
    }
}

function Element(abi, address, accountAddress, masaAtomica) {
    let self = this;

    this.contract = new document.web3.eth.Contract(abi, address);
    this.address = address;
    this.name = ko.observable("...");
    this.symbol = ko.observable("...");
    this.masaAtomica = masaAtomica;
    this.balance = ko.observable("...");
    this.enabled = ko.observable(true);

    this.contract.methods.name().call().then(value => self.name(value));
    this.contract.methods.symbol().call().then(value => self.symbol(value));
    //this.contract.methods._masaAtomica().call().then(value => self.masaAtomica(value));
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
            .then(self.refreshBalance);
    }

    this.refreshBalance = function () {
        return self.contract.methods.balanceOf(self.accountAddress)
            .call()
            .then(value => self.balance(value));
    }
}

function ViewModel(accountAddress) {
    var self = this;
    this.elementos = ko.observableArray();
    this.accountAddress = accountAddress;

    fetch('./json/settings.json')
        .then(response => response.json())
        .then(settings => {
            fetch('./json/root.json')
                .then(response => response.json())
                .then(abi => {
                    let root = new document.web3.eth.Contract(abi, settings.root);
                    root.methods.contarElementos().call().then(value => {
                        let length = parseInt(value);
                        for (let index = 0; index < length; index++) {
                            root.methods.obtenerElemento(index).call().then(address => {
                                console.log(address);
                                fetch('./json/elemento.json')
                                    .then(response => response.json())
                                    .then(abi => {
                                        let element = new Element(abi, address, self.accountAddress)
                                        self.elementos.push(element);
                                    });
                            });
                        }
                    });
                    root.methods.contarFusionadores().call().then(value => {
                        console.log("hay " + value + " fusionadores registrados");
                    });
                });
        });
    // fetch('./json/hidrogeno.json')
    //     .then(response => response.json())
    //     .then(abi => {
    //         let element = new Element(abi, '0x3bF7f20Bf351C038561c8Cf7aAb0C7C09dEa35dB', self.accountAddress, 1.004)
    //         self.elementos.push(element);
    //     });
    // fetch('./json/helio.json')
    //     .then(response => response.json())
    //     .then(abi => {
    //         let element = new Element(abi, '0x7e4c84851eaE19Cae6B522baB1644875CdD76B40', self.accountAddress, 4.002602)
    //         self.elementos.push(element);
    //     });

    fetch('./json/fusionador.json')
        .then(response => response.json())
        .then(abi => {
            let fusionador = new Fusionador(abi, '0xaae9095bE1BF40989948a461f2C760B98F9c4e66', self.accountAddress)
            self.fusionador = fusionador;
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

        var balance = parseInt(origen.balance());
        var cantidad = parseInt(this.cantidad());

        if (balance >= cantidad) {
            self.fusionador.fusionar(origen, cantidad, destino)
                .then(() => {
                    origen.refreshBalance();
                    destino.refreshBalance();
                });
        } else {
            alert(`balance insuficiente. Usted solo dispone de ${balance} ${origen.name()}`);
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
            ko.applyBindings(vm);
        });
})(ko, Web3);