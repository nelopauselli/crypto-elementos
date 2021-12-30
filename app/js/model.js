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
                                                for (var i = 0; i < self.elementos().length; i++) {
                                                    var from = self.elementos()[i];
                                                    from.fusions.push({
                                                        from: from,
                                                        to: element
                                                    });
                                                }
                                                self.elementos.push(element);
                                            });
                                    });
                            }
                        });

                        root.methods.contarFusionadores().call().then(value => {
                            console.log("hay " + value + " fusionadores registrados");
                            let length = parseInt(value);
                            for (let index = 0; index < length; index++) {
                                root.methods.obtenerFusionador(index).call()
                                    .then(address => {
                                        fetch('./json/fusionador.json')
                                            .then(response => response.json())
                                            .then(abi => {
                                                let fusionador = new Fusionador(abi, address, self.accountAddress);
                                                self.fusionador = fusionador;
                                            });
                                    });
                            }
                        });
                    });

                fetch('./json/hidrogeno.json')
                    .then(response => response.json())
                    .then(abi => {
                        let reward = new Reward(abi, settings.rewards, self.accountAddress);
                        self.rewards.push(reward);
                    });

            });


        this.cantidad = ko.observable();
        this.destino = ko.observable();

        this.fusionar = function (fusion) {

            var origen = fusion.from;
            var destino = fusion.to;

            var balance = parseInt(origen.balance());
            var cantidad = balance; //parseInt(this.cantidad());

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

        this.addToMetamask = async function (token) {
            const tokenAddress = token.address;
            const tokenSymbol = token.symbol();
            const tokenDecimals = 0;
            const tokenImage = 'https://cryptoelementos.web.app/img/atom.png';

            try {
                // wasAdded is a boolean. Like any RPC method, an error may be thrown.
                const wasAdded = await ethereum.request({
                    method: 'wallet_watchAsset',
                    params: {
                        type: 'ERC20', // Initially only supports ERC20, but eventually more!
                        options: {
                            address: tokenAddress, // The address that the token is at.
                            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                            decimals: tokenDecimals, // The number of decimals in the token
                            image: tokenImage, // A string url of the token logo
                        },
                    },
                });

                if (wasAdded) {
                    console.log('Thanks for your interest!');
                } else {
                    console.log('Your loss!');
                }
            } catch (error) {
                console.log(error);
            }
        };
    }
}
