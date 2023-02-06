import { CHAIN_IDS_TO_NAMES, CHAIN_NAME } from '@/const'
import { nftCheckoutContext } from '@/context/NftCheckoutContext'
import { handleError } from '@/helpers'
import { useSwapPrice } from '@/hooks'
import {
  EstimatedPrice,
  EthereumTokenBalance,
  PriceImpact,
  TokenInfoWithBalance,
  WalletInfo,
} from '@/types'
import { onCheckoutHandler } from '@/utils'
import { getWrappedToken } from '@/utils/get-wrapped-token'
import { TokenInfo } from '@uniswap/token-lists'

const { jsonRPCUrlMap, nftDetails } = nftCheckoutContext

export class UserWalletTokenBalances {
  #tokenBalancesPromise
  #tokens
  #walletInfo

  #tokenBalances = {
    balances: [] as EthereumTokenBalance[],
    noTokensWithBalances: false,
  }
  #selectedToken: TokenInfoWithBalance
  #outputToken: TokenInfo
  #estimatedPrice: EstimatedPrice

  constructor({
    tokenBalancesPromise,
    walletInfo,
    tokens,
  }: {
    tokenBalancesPromise: Promise<Array<EthereumTokenBalance>>
    tokens: Array<TokenInfo>
    walletInfo: WalletInfo
  }) {
    this.#tokenBalancesPromise = tokenBalancesPromise
    this.#walletInfo = walletInfo
    this.#tokens = tokens
    this.fetchTokenBalances()
  }

  async setTokenBalancesPromise(promise: Promise<Array<EthereumTokenBalance>>) {
    this.#tokenBalancesPromise = promise
    await this.fetchTokenBalances()
  }

  get tokenBalances() {
    return this.#tokenBalances
  }

  get tokensWithBalances() {
    if (this.#tokenBalances.noTokensWithBalances)
      return 'No supported token found in user wallet. Please add supported tokens.'

    return this.#tokenBalances.balances.map(token => {
      let tokenLogoUri = this.#tokens
        ?.find(t => t.symbol === token.symbol)
        ?.logoURI?.replace('ipfs://', 'https://ipfs.io/ipfs/')

      if (token.symbol === 'WETH')
        tokenLogoUri =
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
      return { ...token, tokenLogoUri }
    })
  }

  async fetchTokenBalances() {
    const balances = await this.#tokenBalancesPromise

    this.#tokenBalances = {
      balances,
      noTokensWithBalances: Boolean(!balances.length),
    }
  }

  // resetStateOnTokenSelection() {
  //   setIsPriceLoading(true)
  //   setEstimatedPrices(InitEstimatedPriceState)
  //   setErrorText('')
  //   setTransactionId('')
  // }

  async getEstimatedPrice(token: TokenInfoWithBalance) {
    // call uniswap
    this.#selectedToken = token
    // resetStateOnTokenSelection()
    try {
      const wrappedToken = getWrappedToken({
        nftChainName: nftDetails.chainName,
        selectedChainName:
          CHAIN_IDS_TO_NAMES[this.#walletInfo?.currentNetwork?.chainId] ||
          CHAIN_NAME.goerli,
        tokens: this.#tokens,
      })

      this.#outputToken = wrappedToken

      if (
        token?.address.toLowerCase() === wrappedToken?.address.toLowerCase()
      ) {
        throw new Error('No need for swap to trigger a transaction')

        // setIsPriceLoading(false)
      }

      const data = await useSwapPrice({
        chainId: this.#walletInfo?.currentNetwork?.chainId || 0,
        jsonRPCUrlMap,
        inputAmount: nftDetails.price.toString(),
        inputToken: token,
        outputToken: wrappedToken,
        paymentChainName:
          CHAIN_IDS_TO_NAMES[this.#walletInfo?.currentNetwork?.chainId] ||
          CHAIN_NAME.goerli,
        userWalletAddress: this.#walletInfo.currentAddress,
      })

      if (data?.selectedTokenSymbol && data?.estimatedPriceInToken) {
        const selectedTokenWithBalance = this.#tokenBalances.balances.find(
          tokenWithBalance => tokenWithBalance.address === token?.address,
        )

        this.#estimatedPrice = {
          gasPriceInUsd: data?.gasCostInUsd,
          selectedTokenSymbol: data?.selectedTokenSymbol,
          estimatedPriceInToken: data?.estimatedPriceInToken,
          impact: data?.impact as PriceImpact,
          // gasLimit: data?.gasLimit,
          // notEnoughTokens:
          //   parseFloat(data.estimatedPriceInToken) >
          //   parseFloat(selectedTokenWithBalance?.balance || '0'),
        }

        if (
          parseFloat(data.estimatedPriceInToken) >
          parseFloat(selectedTokenWithBalance?.balance || '0')
        ) {
          throw new Error(
            `Not enough ${
              this.#selectedToken?.symbol
            } token in wallet. Please select other token.`,
          )
        }
      }

      return this.#estimatedPrice

      // setIsPriceLoading(false)
    } catch (error) {
      const errorText = handleError(error, token)
      throw errorText ? new Error(errorText) : error
      // setIsPriceLoading(false)
    }
  }

  async checkout() {
    if (this.#selectedToken && this.#outputToken) {
      // setTransactionStarted(true)
      const transaction = await onCheckoutHandler({
        chainId: this.#walletInfo?.currentNetwork?.chainId || 0,
        jsonRPCUrlMap,
        inputAmount: nftDetails.price.toString(),
        inputToken: this.#selectedToken,
        outputToken: this.#outputToken,
        paymentChainName:
          CHAIN_IDS_TO_NAMES[this.#walletInfo?.currentNetwork?.chainId] ||
          CHAIN_NAME.goerli,
        userWalletAddress: this.#walletInfo.currentAddress,
        estimatedPriceInToken: this.#estimatedPrice.estimatedPriceInToken,
        // setTransactionStep,
      })
      return transaction
      // setTransactionStarted(false)
      // setTransactionId(transaction.transactionHash)
    }
    throw new Error('Input and output tokens not provided yet')
  }
}
