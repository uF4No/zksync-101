# ZKsync 101

This project contains the following smart contracts:

- `ZeekSecretMessages.sol`: stores secret messages
- `TestToken.sol`: a mintable ERC20 token

And the following scripts:

- `mint-token.ts`: mints a given amount of the ERC20 token to an address.
- `paymaster-transaction.ts`: sends a message to the `ZeekSecreMessages.sol` contract paying the transaction fees with the `TestToken.sol` ERC20 token.
  

You can deploy these contracts and run the provided scripts using Atlas or Remix:

[Open this project in Atlas](https://app.atlaszk.com/projects?template=https://github.com/uF4No/zksync-101-quickstart&open=/contracts/ZeekSecretMessages.sol&chainId=300)

[Open this project in Remix](https://remix.ethereum.org/#url=https://github.com/uF4No/zksync-101-quickstart/blob/master/contracts/ZeekSecretMessages.sol)
