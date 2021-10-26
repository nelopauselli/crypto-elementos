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

function ViewModel() {
    var self = this;
    this.elementos = ko.observableArray();
    this.elementos.push({ name: "Hidrógeno", symbol: "H", masaAtomica: 1.008, balance: ko.observable(10000021), enabled: ko.observable(true) });
    this.elementos.push({ name: "Helio", symbol: "He", masaAtomica: 4.003, balance: ko.observable(8000), enabled: ko.observable(true) });
    this.elementos.push({ name: "Carbono", symbol: "C", masaAtomica: 12.01, balance: ko.observable(20), enabled: ko.observable(true) });
    this.elementos.push({ name: "Nitrógeno", symbol: "N", masaAtomica: 14.0067, balance: ko.observable(0), enabled: ko.observable(true) });
    this.elementos.push({ name: "Oxígeno", symbol: "O", masaAtomica: 15.9994, balance: ko.observable(0), enabled: ko.observable(false) });

    this.origen = ko.observable();
    this.cantidad = ko.observable();
    this.destino = ko.observable();
    this.fusionar = function () {
        var origen = this.origen();
        console.log(destino);

        if (origen.balance() >= this.cantidad()) {
            origen.balance(origen.balance() - this.cantidad());
            var masaAtomica = this.cantidad() * parseInt(origen.masaAtomica);
            destino.balance(destino.balance() + parseInt(masaAtomica / parseInt(destino.masaAtomica)));
        }
    }
}

(function (ko, Web3) {
    initWeb3()
        .then(() => {
            var vm = new ViewModel();
            console.log(vm);
            ko.applyBindings(vm);
        });

})(ko, Web3);