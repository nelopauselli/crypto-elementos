class Element {
    constructor(abi, address, accountAddress, masaAtomica) {
        let self = this;

        this.contract = new document.web3.eth.Contract(abi, address);
        this.address = address;
        this.name = ko.observable("...");
        this.symbol = ko.observable("...");
        this.masaAtomica = masaAtomica;
        this.balance = ko.observable("...");
        this.enabled = ko.observable(true);
        this.description = "Este elemento es usado para...";
        this.fusions = ko.observableArray();

        this.contract.methods.name().call().then(value => self.name(value));
        this.contract.methods.symbol().call().then(value => self.symbol(value));
        //this.contract.methods._masaAtomica().call().then(value => self.masaAtomica(value));
        this.contract.methods.balanceOf(accountAddress).call().then(value => self.balance(value));
        this.accountAddress = accountAddress;

        this.refreshBalance = function () {
            return self.contract.methods.balanceOf(self.accountAddress)
                .call()
                .then(value => self.balance(value));
        };
    }
}
