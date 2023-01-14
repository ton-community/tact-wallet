import { beginCell, contractAddress, toNano } from "ton";
import { testAddress } from "ton-emulator";
import { Wallet } from "./output/wallet_Wallet";
import { deploy } from "./utils/deploy";
import { printAddress, printDeploy, printHeader } from "./utils/print";
import { mnemonicNew, mnemonicToPrivateKey } from "ton-crypto";
import {BN} from "bn.js";

(async () => {

    // Generate new key
    let mnemonics = await mnemonicNew();
    console.log(mnemonics);
    let keyPair = await mnemonicToPrivateKey(mnemonics);
    let walletId = new BN(1);

    console.log(keyPair);

    console.log(keyPair.secretKey.readBigInt64BE());

    // Parameters
    let owner = testAddress('some-owner'); // Replace owner with your address
    //let packed = beginCell().store(storeAdd({ $$type: 'Add', amount: 10n })).endCell(); // Replace if you want another message used
    let pk = new BN(key.publicKey.toString('hex'), 'hex');
    let init = await Wallet_init(pk, new BN(0));
    let init = await Wallet.init(keyPair.secretKey.readBigInt64BE(), walletId);


    //use ton-core method to calculate new contract address with:
    //contractAddress(workchain: number, init: StateInit)

    //workchain = 1 - masterchain (expensive operation cost, validator's election contract works here)
    //workchain = 0 - basechain (normal operation cost, user's contracts placed here)



    let workchain = 0;
    let address = contractAddress(workchain, init);
    let deployAmount = toNano(1);
    let testnet = true;

    //command
    let command = "Deploy";

    // Print basics
    printHeader('Wallet Contract');
    printAddress(address);
    // printDeploy(init, deployAmount, packed, testnet);



    // Do deploy
    await deploy(init, deployAmount, command, testnet)
})();




// // Create Client
// const client = new TonClient({
//   endpoint: 'https://toncenter.com/api/v2/jsonRPC',
// });
//
// // Generate new key
// let mnemonics = await mnemonicNew();
// let keyPair = await mnemonicToPrivateKey(mnemonics);
//
// // Create wallet contract
// let workchain = 0; // Usually you need a workchain 0
// let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
// let contract = client.open(wallet);
//
// // Get balance
// let balance: bigint = await contract.getBalance();
//
// // Create a transfer
// let seqno: number = await contract.getSeqno();
// let transfer = await contract.createTransfer({
//   seqno,
//   messages: [internal({
//     value: '1.5',
//     dest: 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N',
//     body: 'Hello world'
//   })]
// });