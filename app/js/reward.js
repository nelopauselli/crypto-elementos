class Reward {
    constructor(abi, address, accountAddress) {
        let self = this;

        this.contract = new document.web3.eth.Contract(abi, address);
        this.address = address;
        this.accountAddress = accountAddress;

        this.name = ko.observable("...");
        this.symbol = ko.observable("...");
        this.subscribed = ko.observable(undefined);
        this.pending = ko.observable("");
        this.description = ko.computed(function () {
            if (this.subscribed())
                return `Usted tiene ${this.pending()} ${this.symbol()} pendientes de reclamar`;
            return `Usted no está subscripto a este generador de ${this.symbol()}`;
        }, this);

        this.contract.methods.name().call().then(value => self.name(`Generador de ${value}`));
        this.contract.methods.symbol().call().then(value => self.symbol(value));
        this.contract.methods.subscribed().call({
            from: this.accountAddress
        }).then(value => {
            self.subscribed(value);

            if (value) {
                setInterval(() => {
                    this.getPendingReward();
                }, 1000);
            }
        });
    }

    subscribe() {
        this.contract.methods.subscribe()
            .send({
                from: this.accountAddress,
                gas: 470000,
                //value: 1000000000000000000, // in WEI, which is equivalent to 1 ether
                gasPrice: 0
            });
    }

    getPendingReward() {
        this.contract.methods.pendingReward().call({
            from: this.accountAddress
        }).then(value => this.pending(value));
    }

    claim() {
        this.contract.methods.claim()
            .send({
                from: this.accountAddress,
                gas: 470000,
                //value: 1000000000000000000, // in WEI, which is equivalent to 1 ether
                gasPrice: 0
            });
    }


}
