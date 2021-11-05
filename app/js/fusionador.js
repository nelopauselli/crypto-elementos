class Fusionador {
    constructor(abi, address, accountAddress) {
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
        };
    }
}