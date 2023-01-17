# TACT wallet demo project

This project of tact wallet demo. It has ready to use TACT compiler, typescript + jest with [ton-emulator](https://github.com/ton-community/ton-emulator), example how to do tests.

## Installation

```bash
git clone https://github.com/Reveloper/tact-wallet.git
cd tact-wallet
yarn add ton-tact
```

## Using

```bash
yarn test # To test contract
yarn build # To build contract
yarn deploy # To deploy contract via deployment link
yarn deploy-api # To deploy through API(need to input deployment wallet in wallet.deploy-api.ts)
```

## Overview
This project contents demo of Tact wallet contract and deployment demo scripts.
Note, that this project not intended for using in production environment just for learning of how tact compiler and ton library works.

1) Specify `wallet.tact` that will be used in `yarn build`
2) Specify `wallet.spec.ts` tests for using `yarn tests` for launching local tests on your local IDE. Not necessary for deployment.
3) Specify `wallet.deploy.ts` according to your `wallet.tact` for `yarn deploy` to generate a deployment link. In particular, it is necessary to correctly call the Init() function from the contract. From the beginning in the template project using Tonhub endpoint in the deeplink, that means you can deploy your smart contract via [Tonhub/Sandbox](https://ton.org/docs/participate/wallets/apps#tonhub) application.
4) Specify alternative deployment script `wallet.deploy-api.ts` for `yarn deploy-api` according to your `contract.tact` to send deployment message from deployment wallet. You need to input your deployment wallet 24 words [here](sources/wallet.deploy-api.ts#L19).

## Licence

MIT
