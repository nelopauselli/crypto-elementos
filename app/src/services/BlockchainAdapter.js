import { ethers, BigNumber } from 'ethers';

import settings from './../abis/settings.json';
import cosmosAbi from './../abis/cosmos.json';
import elementoAbi from './../abis/elemento.json';
import fusionadorAbi from './../abis/fusionador.json';

class BlockchainAdapter {
    constructor() {
        this.UINT_256_MAX = BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
        this.UINT_256_AVG = BigNumber.from("0x00000000000000000000000000000000ffffffffffffffffffffffffffffffff");
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

    async CosmosContract(){
        return await this.GetContract(settings.root, cosmosAbi);
    }

    async ElementContract(address) {
        return await this.GetContract(address, elementoAbi);
    }

    async MergerContract(address) {
        return await this.GetContract(address, fusionadorAbi);
    }

    async GetContract(address, abi) {
        if (this.cache[address]) { return this.cache[address] };

        let contract = new ethers.Contract(address, abi, this.signerOrProvider);
        this.cache[address] = contract;

        return contract;
    }
}

const adapter = new BlockchainAdapter();

export default adapter;