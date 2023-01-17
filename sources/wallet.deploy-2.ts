import { beginCell, contractAddress, toNano, TonClient, TonClient4,  WalletContractV4} from "ton";
import { testAddress } from "ton-emulator";
import { Wallet } from "./output/wallet_Wallet";
import { deploy } from "./utils/deploy";
import { printAddress, printDeploy, printHeader } from "./utils/print";
import { mnemonicNew, mnemonicToPrivateKey } from "ton-crypto";

(async () => {

    //create client for Ton center API
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: 'bb38df0c2756c66e2ab49f064e2484ec444b01244d2bd49793bd5b58f61ae3d2'
    })

    //create client for v4api
    const client4 = new TonClient4({
        endpoint: "https://sandbox-v4.tonhubapi.com"
    })

    // Generate insert your test wallet seed
    let mnemonics = "your test seed";
    let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));
    let pk = beginCell().storeBuffer(keyPair.publicKey).endCell().beginParse().loadUintBig(256);
    //let pk = BigInt(`0x${keyPair.publicKey.toString('hex')}`); alternative
    //EQDND6yHEzKB82ZGRn58aY9Tt_69Ie_uz73e2VuuJ3fVVXfV

    //Create wallet contract
    let workchain = 0;
    //workchain = 1 - masterchain (expensive operation cost, validator's election contract works here)
    //workchain = 0 - base-chain (normal operation cost, user's contracts works here)

    let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey});
    let contract = client.open(wallet);

    // Get balance
    let balance: bigint = await contract.getBalance();
    console.log(balance);



   // await deploy(init, deployAmount, command, testnet)
})();
