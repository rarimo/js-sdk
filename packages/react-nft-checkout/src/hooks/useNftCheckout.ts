import { EVMOperation, NFTCheckoutFactory } from '@rarimo/nft-checkout'
import { ChainTypes, Provider } from '@rarimo/provider'

export const useNftCheckout = () => {
  const factory = new NFTCheckoutFactory({
    [ChainTypes.EVM]: EVMOperation,
  })
  //   const web3 = new Web3()
  const provider = new Provider()

  const NFTCheckoutOperator = factory.create(ChainTypes.EVM, provider)

  return NFTCheckoutOperator
}
