class Fusionador {
    constructor(abi, address, accountAddress) {
        let self = this;

        this.contract = new document.web3.eth.Contract(abi, address);
        this.accountAddress = accountAddress;
        
        this.fusionar = function (origen, cantidad, destino) {
            console.log(origen.address);
            console.log(cantidad);
            console.log(destino.address);

            return self.contract.methods.fusionar(origen.address, destino.address, cantidad)
                .send({
                    from: self.accountAddress,
                    gas: 470000,
                    gasPrice: 0
                })
                .then(response => console.log(response));
        };
    }
}
