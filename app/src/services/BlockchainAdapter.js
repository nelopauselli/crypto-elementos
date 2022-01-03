import { ethers, BigNumber } from 'ethers';

class BlockchainAdapter {
    constructor() {
        this.UINT_256_MAX = BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
        this.cache = {};

        const { ethereum } = window;

        let provider;

        if (ethereum) {
            provider = new ethers.providers.Web3Provider(ethereum)
            this.signerOrProvider = provider.getSigner();
        } else {
            console.error('No encontramos billetera compatible. :(');
            this.signerOrProvider = ethers.providers.JsonRpcProvider('http://vivo.local:7545');
        }
    }

    Contract(address, abi) {
        return new ethers.Contract(address, abi, this.signerOrProvider);
    }

    async ElementContract(address) {
        return await this.GetContract(address, './json/elemento.json');
    }

    async MergerContract(address) {
        return await this.GetContract(address, './json/fusionador.json');
    }

    async RewardContract(address) {
        return await this.GetContract(address, './json/hidrogeno.json');
    }

    async GetContract(address, url) {
        //FIXME: se mezclan en cache el contrato del hidrogeno como element y como reward
        //if (this.cache[address]) { return this.cache[address] };

        let response = await fetch(url);
        let abi = await response.json();
        let contract = this.Contract(address, abi);

        this.cache[address] = contract;

        return contract;
    }
}

const adapter = new BlockchainAdapter();

export default adapter;