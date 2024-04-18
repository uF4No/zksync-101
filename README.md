# ZKsync 101

This project contains the following smart contracts:

- `ZeekSecretMessages.sol`: stores secret messages
- `TestToken.sol`: a mintable ERC20 token

And the following scripts:

- `mint-token.ts`: mints a given amount of the ERC20 token to an address.
- `paymaster-transaction.ts`: sends a message to the `ZeekSecreMessages.sol` contract paying the transaction fees with the `TestToken.sol` ERC20 token.
  

You can deploy these contracts and run the provided scripts using Atlas or Remix:

### Atlas

- [Open `ZeekSecretMessages.sol` in Atlas](https://app.atlaszk.com/projects?template=https://github.com/uF4No/zksync-101&open=/atlas/contracts/ZeekSecretMessages.sol&chainId=300)
- [Open `TestToken.sol` in Atlas](https://app.atlaszk.com/projects?template=https://github.com/uF4No/zksync-101&open=/atlas/contracts/TestToken.sol&chainId=300)
- [Open `mint-token.ts` in Atlas](https://app.atlaszk.com/projects?template=https://github.com/uF4No/zksync-101&open=/atlas/scripts/mint-token.ts&chainId=300)
- [Open `paymaster-transaction.ts` in Atlas](https://app.atlaszk.com/projects?template=https://github.com/uF4No/zksync-101&open=/atlas/scripts/paymaster-transaction.ts&chainId=300)

### Remix IDE

- [Open `ZeekSecretMessages.sol` in Remix](https://remix.ethereum.org/#url=https://github.com/uF4No/zksync-101/blob/master/remix/contracts/ZeekSecretMessages.sol)
- [Open `TestToken.sol` in Remix](https://remix.ethereum.org/#url=https://github.com/uF4No/zksync-101/blob/master/remix/contracts/TestToken.sol)
- [Open `mint-token.ts` in Remix](https://remix.ethereum.org/#url=https://github.com/uF4No/zksync-101/blob/master/remix/scripts/mint-token.ts)
- [Open `paymaster-transaction.ts` in Remix](https://remix.ethereum.org/#url=https://github.com/uF4No/zksync-101/blob/master/remix/scripts/paymaster-transaction.ts)
