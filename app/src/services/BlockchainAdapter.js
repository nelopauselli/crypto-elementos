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
        this.events = {
            onBlock: []
        };

        const { ethereum } = window;

        if (ethereum) {
            let provider = new ethers.providers.Web3Provider(ethereum);
            provider.on("block", (blockNumber) => {
                this.events.onBlock.forEach(e=>e.apply(blockNumber));
            });
            this.signerOrProvider = provider.getSigner();
        } else {
            console.error('No encontramos billetera compatible. :(');
            this.signerOrProvider = ethers.providers.JsonRpcProvider('http://vivo.local:7545');
        }
    }

    async CosmosContract() {
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

    onBlock(callback) {
        this.events.onBlock.push(callback);
    }
}

const adapter = new BlockchainAdapter();

export default adapter;