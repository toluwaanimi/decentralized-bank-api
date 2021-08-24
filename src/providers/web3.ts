// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3');
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const ethers = require('ethers');
import * as ethers from 'ethers';
// eslint-disable-next-line @typescript-eslint/no-var-requires
//const { Tx } = require('ethereumjs-tx');

import { Transaction as Tx } from 'ethereumjs-tx';
import { abi } from './abi.web3';

const provider = new ethers.providers.InfuraProvider();
const sign = ethers.Signer;
const Wallet = ethers.Wallet;
const mnemonic =
  'symptom select kangaroo gain stove zoo knife clip useless plug hundred narrow';

const web3 = new Web3('ws://localhost:7545' || 'http://127.0.0.1:7545');
const nairaContract = new web3.eth.Contract(
  abi,
  '0xb7027dcC363865e55661Af53CbaE4eE871Ce553a',
  // { from: '0x3bAD3F4cAB657095cb478d2feBE6AA4Bbd6129f6' },
);
const contractAddress = '0xb7027dcC363865e55661Af53CbaE4eE871Ce553a';

export class Ethereum {
  static async generateWallet(index: number) {
    const path = "m/44'/60'/0'/0/" + index;
    const wallet = Wallet.fromMnemonic(mnemonic, path);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
    };
  }

  static async getBalance(address: string) {
    const balance =
      Number(await nairaContract.methods.balanceOf(address).call()) /
      Math.pow(10, await nairaContract.methods.decimals().call());
    return {
      balance,
      symbol: await nairaContract.methods.symbol().call(),
    };
  }

  static async sendTransaction(
    to: string,
    from: string,
    amount: string | number,
  ) {
    //  const send = await nairaContract.methods.transfer.sendTransaction(to, );
    const transaction = await nairaContract.methods
      .transfer(to, amount)
      .send({ from: from, gas: 1000000 });
    console.log(transaction);
    return transaction;
  }

  static async transfer(
    to: string,
    fromKey: string,
    amount: string | number | any,
    senderAddress: string,
  ) {
    fromKey = fromKey.substr(2, fromKey.length);
    const nonce = await web3.eth.getTransactionCount(senderAddress);
    //const amount = web3.utils.toHex(2e16);
    const privateKey = new Buffer(fromKey, 'hex');
    const rawTransaction = {
      from: senderAddress,
      gasPrice: web3.utils.toHex(2 * 1e9),
      gasLimit: web3.utils.toHex(210000),
      to: contractAddress,
      value: '0x0',
      data: nairaContract.methods
        .transfer(to, amount * Math.pow(10, 2))
        .encodeABI(),
      nonce: web3.utils.toHex(nonce),
    };
    const transaction = new Tx(rawTransaction);
    transaction.sign(privateKey);
    return web3.eth.sendSignedTransaction(
      '0x' + transaction.serialize().toString('hex'),
    );
  }
}
