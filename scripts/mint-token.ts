import { ethers } from "hardhat";

// Address of the ERC20 token contract
const TOKEN_CONTRACT_ADDRESS = "";
// Wallet that will receive tokens
const RECEIVER_WALLET = "";
// Amount of tokens to mint in ETH format, e.g. 1.23
const TOKEN_AMOUNT = "";

async function main() {
  const Token = await ethers.getContractFactory("TestToken");
  const tokenContract = Token.attach(TOKEN_CONTRACT_ADDRESS);

  console.log("Minting tokens...");

  const tx = await tokenContract.mint(
    RECEIVER_WALLET,
    ethers.parseEther(TOKEN_AMOUNT),
  );
  await tx.wait();

  console.log("Success!");
  console.log(
    `The account ${RECEIVER_WALLET} now has ${await tokenContract.balanceOf(
      RECEIVER_WALLET,
    )} tokens`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
