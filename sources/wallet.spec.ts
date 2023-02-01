import { storeTransfer, Transfer, Wallet } from "./output/wallet_Wallet";
import { ContractSystem, testKey } from "ton-emulator";
import { beginCell, toNano } from "ton-core";
import { sign } from "ton-crypto";

describe('wallet', () => {
    it('should deploy', async () => {

        // Create wallet
        let key = testKey('wallet-key');
        let publicKey = beginCell().storeBuffer(key.publicKey).endCell().beginParse().loadUintBig(256);
        let system = await ContractSystem.create();
        let treasure = system.treasure('treasure');
        let contract = system.open(await Wallet.fromInit(publicKey, BigInt(0)));
        let tracker = system.track(contract.address);
        await contract.send(treasure, { value: toNano('10') }, 'Deploy');
        await system.run();

        // Create executor
        expect(await contract.getPublicKey()).toBe(publicKey);
        expect(await contract.getWalletId()).toBe(BigInt(0));
        expect(await contract.getSeqno()).toBe(BigInt(0));

        // Send transfer and check seqno
        let transfer: Transfer = {
            $$type: 'Transfer',
            seqno: BigInt(0),
            mode: BigInt(1),
            amount: toNano(10),
            to: treasure.address,
            body: null
        };
        let signature = sign(beginCell().store(storeTransfer(transfer)).endCell().hash(), key.secretKey);
        await contract.send(treasure, { value: toNano(1) }, {
            $$type: 'TransferMessage',
            transfer,
            signature: beginCell().storeBuffer(signature).endCell()
        });
        await system.run();
        expect(tracker.events()).toMatchSnapshot();
        expect(await contract.getSeqno()).toBe(BigInt(1));

        // Send comment message
        await contract.send(treasure, { value: toNano(1) }, 'notify');
        await system.run();
        expect(tracker.events()).toMatchSnapshot();
        expect(await contract.getSeqno()).toBe(BigInt(2));

        // // Send null message
        // await contract.send(treasure, { value: toNano(1) }, null);
        // await system.run();
        // expect(tracker.events()).toMatchSnapshot();
        // expect(await contract.getSeqno()).toBe(BigInt(3));
    });
});