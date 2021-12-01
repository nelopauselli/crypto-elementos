class Fusionador {
    constructor(abi, address, accountAddress) {
        let self = this;

        this.contract = new document.web3.eth.Contract(abi, address);
        this.accountAddress = accountAddress;
        
        this.fusionar = function (origen, cantidad, destino) {
                      return self.contract.methods.fusionar(origen.address, destino.address, cantidad)
                .send({
                    from: self.accountAddress,
                    gas: 470000,
                    gasPrice: 0
                })
                .then(response => console.log(response))
                .catch(err=>console.error(err));
        };
    }
}
