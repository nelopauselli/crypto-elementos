import { ethers } from 'ethers';

class BlockchainAdapter {
    constructor() {
        const { ethereum } = window;

        if (!ethereum) {
            console.error('No encontramos billetera compatible. :(');
            return;
        }

        const provider = new ethers.providers.Web3Provider(ethereum);
        this.signer = provider.getSigner();
    }

    Contract(address, abi){
        return new ethers.Contract(address, abi, this.signer)
    }
}

const adapter = new BlockchainAdapter();

export default adapter;