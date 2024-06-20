import * as zk from "zksync-ethers";
import { default as hre, ethers } from "hardhat";
import { getDeployer } from "@atlas-labs-inc/hardhat-atlas-zksync-deploy";

// Address of the ZeekMessages contract
const ZEEK_MESSAGES_CONTRACT_ADDRESS = "";
// Address of the ERC20 token contract
const TOKEN_CONTRACT_ADDRESS = "";
// Message to be sent to the contract
const NEW_MESSAGE = "This tx cost me no ETH!";

async function main() {
  // connects to the wallet connected in the network tab -->
  const { provider, signer } = await getDeployer(hre);

  const zkProvider = new zk.Provider("https://sepolia.era.zksync.dev");
  const signerAddress = await signer.getAddress();

  console.log("Sending a transaction via the testnet paymaster");

  // initialise messages and token contracts with address, abi and signer
  const messagesContract = new zk.Contract(
    ZEEK_MESSAGES_CONTRACT_ADDRESS,
    (await ethers.getContractFactory("ZeekSecretMessages")).interface,
    signer
  );

  const tokenContract = new zk.Contract(
    TOKEN_CONTRACT_ADDRESS,
    (await ethers.getContractFactory("TestToken")).interface,
    signer
  );

  // retrieve and print the current balance of the wallet
  let ethBalance = await provider.getBalance(signerAddress);
  let tokenBalance = await tokenContract.balanceOf(signerAddress);
  console.log(
    `Account ${signerAddress} has ${ethers.formatEther(ethBalance)} ETH`,
  );
  console.log(
    `Account ${signerAddress} has ${ethers.formatUnits(
      tokenBalance,
      18,
    )} tokens`,
  );

  // retrieve the testnet paymaster address
  const testnetPaymasterAddress = await zkProvider.getTestnetPaymasterAddress();

  console.log(`Testnet paymaster address is ${testnetPaymasterAddress}`);

  const gasPrice = await zkProvider.getGasPrice();

  // define paymaster parameters for gas estimation
  const paramsForFeeEstimation = zk.utils.getPaymasterParams(
    testnetPaymasterAddress,
    {
      type: "ApprovalBased",
      token: TOKEN_CONTRACT_ADDRESS,
      // set minimalAllowance to 1 for estimation
      minimalAllowance: ethers.toBigInt(1),
      // empty bytes as testnet paymaster does not use innerInput
      innerInput: new Uint8Array(0),
    },
  );

  // estimate gasLimit via paymaster
  const gasLimit = await messagesContract.sendMessage.estimateGas(NEW_MESSAGE, {
    customData: {
      gasPerPubdata: zk.utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
      paymasterParams: paramsForFeeEstimation,
    },
  });

  // fee calculated in ETH will be the same in
  // ERC20 token using the testnet paymaster
  const fee = gasPrice * gasLimit;

  // new paymaster params with fee as minimalAllowance
  const paymasterParams = zk.utils.getPaymasterParams(testnetPaymasterAddress, {
    type: "ApprovalBased",
    token: TOKEN_CONTRACT_ADDRESS,
    // provide estimated fee as allowance
    minimalAllowance: fee,
    // empty bytes as testnet paymaster does not use innerInput
    innerInput: new Uint8Array(0),
  });

  // full overrides object including maxFeePerGas and maxPriorityFeePerGas
  const txOverrides = {
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: "1",
    gasLimit,
    customData: {
      gasPerPubdata: zk.utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
      paymasterParams,
    },
  };

  console.log(`Sign the transaction in your wallet`);

  // send transaction with additional paymaster params as overrides
  const txHandle = await messagesContract.sendMessage(NEW_MESSAGE, txOverrides);
  console.log(
    `Transaction ${txHandle.hash} with fee ${ethers.formatUnits(
      fee,
      18,
    )} ERC20 tokens, sent via paymaster ${testnetPaymasterAddress}`,
  );
  await txHandle.wait();
  console.log(`Transaction processed`);

  ethBalance = await provider.getBalance(signerAddress);
  tokenBalance = await tokenContract.balanceOf(signerAddress);
  console.log(
    `Account ${signerAddress} now has ${ethers.formatEther(ethBalance)} ETH`,
  );
  console.log(
    `Account ${signerAddress} now has ${ethers.formatUnits(
      tokenBalance,
      18,
    )} tokens`,
  );

  console.log(`Done!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
