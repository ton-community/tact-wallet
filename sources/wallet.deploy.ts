import { beginCell, contractAddress, toNano } from "ton";
import { testAddress } from "ton-emulator";
import { Wallet } from "./output/wallet_Wallet";
import { deploy } from "./utils/deploy";
import { printAddress, printDeploy, printHeader } from "./utils/print";
import { mnemonicNew, mnemonicToPrivateKey } from "ton-crypto";

(async () => {

    // Generate new key
    let mnemonics = await mnemonicNew(24);
    console.log(mnemonics);
    let keyPair = await mnemonicToPrivateKey(mnemonics);
    let pk = BigInt(`0x${keyPair.publicKey.toString('hex')}`);
    //let pk = beginCell().storeBuffer(keyPair.publicKey).endCell().beginParse().loadUintBig(256); - also could be used to get pk from keypair

    let walletId = BigInt(0);

    // Parameters
    let init = await Wallet.init(pk, walletId);

    //use ton-core method to calculate new contract address with:
    //contractAddress(workchain: number, init: StateInit)

    //workchain = 1 - masterchain (expensive operation cost, validator's election contract works here)
    //workchain = 0 - basechain (normal operation cost, user's contracts works here)

    let workchain = 0;
    let address = contractAddress(workchain, init);
    let deployAmount = toNano(1);
    let testnet = true;

    //command
    let command = "Deploy";

    // Print basics
    printHeader('Wallet Contract');
    printAddress(address);

    // Do deploy
   await deploy(init, deployAmount, command, testnet)
})();
