import {beginCell, contractAddress, toNano, TonClient, TonClient4, WalletContractV4, internal, fromNano} from "ton";
import { Wallet } from "./output/wallet_Wallet";
import { mnemonicNew, mnemonicToPrivateKey } from "ton-crypto";

(async () => {

    //create client for testnet Toncenter API
    const client = new TonClient({
        endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
        apiKey: 'bb38df0c2756c66e2ab49f064e2484ec444b01244d2bd49793bd5b58f61ae3d2'
    })

    //create client for testnet sandboxv4 API - alternative endpoint
    const client4 = new TonClient4({
        endpoint: "https://sandbox-v4.tonhubapi.com"
    })

    // Insert your test wallet's 24 words, make sure you have some test Toncoins on its balance. Every deployment spent 0.5 test toncoin.
    let mnemonics = "multiply voice predict admit hockey fringe flat bike napkin child quote piano year cloud bundle lunch....";
    // read more about wallet apps https://ton.org/docs/participate/wallets/apps#tonhub-test-environment

    let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));
    let secretKey = keyPair.secretKey;
    //workchain = 1 - masterchain (expensive operation cost, validator's election contract works here)
    //workchain = 0 - basechain (normal operation cost, user's contracts works here)
    let workchain = 0; //we are working in basechain.

    //Create deploy wallet contract
    let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey});
    let contract = client.open(wallet);

    // Get deploy wallet balance
    let balance: bigint = await contract.getBalance();


    // Generate new key for new Tact wallet
    let mnemonic = await mnemonicNew(24);
    console.log('new tact wallet mnemo: ', mnemonic);
    let initkeyPair = await mnemonicToPrivateKey(mnemonic);
    let publicKey = beginCell().storeBuffer(initkeyPair.publicKey).endCell().beginParse().loadUintBig(256);

    let walletId = BigInt(0);

    // Parameters
    let init = await Wallet.init(publicKey, walletId);

    //use ton-core method to calculate new contract address with:
    //contractAddress(workchain: number, init: StateInit)
    //read more about TON addresses https://ton.org/docs/learn/overviews/addresses

    let destination_address = contractAddress(workchain, init);
    let deployAmount = toNano('0.5');

    // send a message on new address contract to deploy it
    let seqno: number = await contract.getSeqno();
    console.log('🛠️Preparing new outgoing massage from deployment wallet. Seqno = ', seqno);
    console.log('Current deployment wallet balance = ', fromNano(balance).toString(), '💎TON');
    await contract.sendTransfer({
        seqno,
        secretKey,
        messages: [internal({
            value: deployAmount,
            to: destination_address,
            init: {
                code : init.code,
                data : init.data
            },
            body: 'Deploy'
        })]
    });
    console.log('======deployment message sent to ', destination_address, ' ======');

})();
