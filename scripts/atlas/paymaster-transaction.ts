import { AtlasEnvironment } from "atlas-ide";
import TokenArtifact from "../artifacts/TestToken";
import ZeekMessagesArtifact from "../artifacts/TestToken";

import * as ethers from "ethers";
import {utils} from 'zksync-web3'

// Address of the ZeekMessages contract
const ZEEK_MESSAGES_CONTRACT_ADDRESS = "";
// Address of the ERC20 token contract
const TOKEN_CONTRACT_ADDRESS = ""

const NEW_MESSAGE = "This tx cost me no ETH!";

export async function main (atlas: AtlasEnvironment) {
  const provider = new ethers.providers.Web3Provider(atlas.provider);
  //uses the connected wallet
  const wallet = provider.getSigner();

  // initialise messages and token contracts with address, abi and signer
  const messagesContract= new ethers.Contract(ZEEK_MESSAGES_CONTRACT_ADDRESS, ZeekMessagesArtifact.ZeekSecretMessages.abi, wallet);
  const tokenContract= new ethers.Contract(TOKEN_CONTRACT_ADDRESS, TokenArtifact.TestToken.abi, wallet);

  console.log(`Account ${wallet.address} has ${await tokenContract.balanceOf(wallet.address)} tokens`);
  const testnetPaymasterAddress = provider.getTestnetPaymasterAddress();

  const gasPrice = await provider.getGasPrice();

  // define paymaster parameters for gas estimation
  const paramsForFeeEstimation = utils.getPaymasterParams(testnetPaymasterAddress, {
    type: "ApprovalBased",
    token: TOKEN_CONTRACT_ADDRESS,
    minimalAllowance: BigInt("1")
  });

  // estimate gasLimit via paymaster
  const gasLimit = await messagesContract.sendMessage.estimateGas(NEW_MESSAGE, {
    customData: {
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
      paymasterParams: paramsForFeeEstimation,
    },
  });

  // fee calculated in ETH will be the same in
  // ERC20 token using the testnet paymaster
  const fee = gasPrice * gasLimit;

  const paymasterParams = utils.getPaymasterParams(testnetPaymasterAddress, {
    type: "ApprovalBased",
    token: TOKEN_CONTRACT_ADDRESS,
    // provide estimated fee as allowance
    minimalAllowance: fee,
    // empty bytes as testnet paymaster does not use innerInput
    // innerInput: new Uint8Array(),
  });

  const txOverrides = {
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: BigInt(1),
    gasLimit,
    customData: {
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
      paymasterParams,
    }
  }
  const txHandle = await messagesContract.sendMessage(NEW_MESSAGE, txOverrides);
  console.log(`Transaction ${txHandle.hash} sent via paymaster ${testnetPaymasterAddress} with fee ${fee} ERC20 tokens`);
  await txHandle.wait();
  console.log(`Account ${wallet.address} now has ${await tokenContract.balanceOf(wallet.address)} tokens`);

  console.log(`Done!`);

}
