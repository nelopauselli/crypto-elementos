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