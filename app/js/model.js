class ViewModel {
    constructor(accountAddress) {
        var self = this;
        this.elementos = ko.observableArray();
        this.rewards = ko.observableArray();
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
                                root.methods.obtenerElemento(index).call()
                                    .then(address => {
                                        fetch('./json/elemento.json')
                                            .then(response => response.json())
                                            .then(abi => {
                                                let element = new Element(abi, address, self.accountAddress);
                                                self.elementos.push(element);
                                            });
                                    });
                            }
                        });

                        root.methods.contarFusionadores().call().then(value => {
                            console.log("hay " + value + " fusionadores registrados");
                        });
                    });

                fetch('./json/hidrogeno.json')
                    .then(response => response.json())
                    .then(abi => {
                        let reward = new Reward(abi, settings.rewards, self.accountAddress);
                        self.rewards.push(reward);
                    });

            });

        fetch('./json/fusionador.json')
            .then(response => response.json())
            .then(abi => {
                let fusionador = new Fusionador(abi, '0xaae9095bE1BF40989948a461f2C760B98F9c4e66', self.accountAddress);
                self.fusionador = fusionador;
            });

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
        };
    }
}
