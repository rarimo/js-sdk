import { UserWalletTokenBalances, UserMetamaskWallet } from '@/entities'
import { CONFIG } from '@/config'
import { CHAIN_IDS_TO_NAMES, CHAIN_NAME } from '@/const'
import { useTokenList } from '@/hooks'
import { EthereumTokenBalance, TChainName, WalletInfo } from '@/types'
import { TokenInfo } from '@uniswap/token-lists'

enum NETWORK_TYPE {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
}

const CHAIN_LIST = {
  [NETWORK_TYPE.MAINNET]: [
    {
      contractAddress: '0x7ce68BDE528A2623198aF3756B073FAb376b9fe2',
      chainId: 1,
      symbol: 'ETH',
      chainType: 'evm',
      icon: 'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_ethereum.jpg&w=32&q=75',
      name: 'ethereum',
      displayName: 'Ethereum Mainnet',
    },
    {
      contractAddress: '0x7ce68BDE528A2623198aF3756B073FAb376b9fe21',
      chainId: 137,
      symbol: 'MATIC',
      chainType: 'evm',
      icon: 'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_polygon.jpg&w=32&q=75',
      name: 'polygon',
      displayName: 'Polygon Mainnet',
    },
    {
      contractAddress: '0x7ce68BDE528A2623198aF3756B073FAb376b9fe21',
      chainId: 43114,
      symbol: 'AVAX',
      chainType: 'evm',
      icon: 'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_avalanche.jpg&w=64&q=75',
      name: 'avalanche',
      displayName: 'Avalanche C-Chain',
    },
  ],
  [NETWORK_TYPE.TESTNET]: [
    {
      contractAddress: '0x7ce68BDE528A2623198aF3756B073FAb376b9fe21s',
      chainId: 5,
      symbol: 'ETH',
      chainType: 'evm',
      icon: 'https://chainlist.org/_next/image?url=%2Funknown-logo.png&w=64&q=75',
      name: 'goerli',
      displayName: 'Görli',
    },

    {
      contractAddress: '0x7ce68BDE528A2623198aF3756B073FAb376b9fe21',
      chainId: 43113,
      symbol: 'AVAX',
      chainType: 'evm',
      icon: 'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_avalanche.jpg&w=64&q=75',
      name: 'fuji',
      displayName: 'Avalanche Fuji-Chain',
    },
    {
      contractAddress: '0x7ce68BDE528A2623198aF3756B073FAb376b9fe21',
      chainId: 80001,
      symbol: 'MATIC',
      chainType: 'evm',
      icon: 'https://chainlist.org/_next/image?url=%2Funknown-logo.png&w=64&q=75',
      name: 'Polygon Mumbai',
      displayName: 'mumbai',
    },
  ],
}

const JSON_RPC_URL_MAP = {
  [NETWORK_TYPE.MAINNET]: {
    [CHAIN_NAME.ethereum]: `https://mainnet.infura.io/v3/${CONFIG.INFURA_KEY}`,
    [CHAIN_NAME.polygon]: `https://polygon-mainnet.infura.io/v3/${CONFIG.INFURA_KEY}`,
    [CHAIN_NAME.avalanche]: `https://avalanche-mainnet.infura.io/v3/${CONFIG.INFURA_KEY}`,
  },
  [NETWORK_TYPE.TESTNET]: {
    [CHAIN_NAME.goerli]: `https://goerli.infura.io/v3/${CONFIG.INFURA_KEY}`,
    [CHAIN_NAME.fuji]: `https://avalanche-fuji.infura.io/v3/${CONFIG.INFURA_KEY}`,
    [CHAIN_NAME.mumbai]: `https://polygon-mumbai.infura.io/v3/${CONFIG.INFURA_KEY}`,
  },
}

class NftCheckoutContext {
  nftDetails = {
    nativeToken: 'ETH',
    chainName: CHAIN_NAME.ethereum,
    symbol: 'ETH',
    price: 0.001,
  }
  #selectedNetwork: NETWORK_TYPE
  chainList: Array<{
    contractAddress: string
    chainId: number
    symbol: string
    chainType: string
    icon: string
    name: string
    displayName: string
  }>
  jsonRPCUrlMap: Partial<Record<TChainName, string>>

  #userWalletTokenBalances: UserWalletTokenBalances | null = null
  #userWallet: UserMetamaskWallet

  constructor(network = NETWORK_TYPE.TESTNET) {
    this.#selectedNetwork = network
    this.chainList = CHAIN_LIST[this.selectedNetwork]
    this.jsonRPCUrlMap = JSON_RPC_URL_MAP[this.selectedNetwork]
  }

  get selectedNetwork() {
    return this.#selectedNetwork
  }

  setSelectedNetwork(network = NETWORK_TYPE.TESTNET) {
    this.#selectedNetwork = network
    this.#onNetworkChanged()
  }

  #onNetworkChanged() {
    this.chainList = CHAIN_LIST[this.selectedNetwork]
    this.jsonRPCUrlMap = JSON_RPC_URL_MAP[this.selectedNetwork]
  }

  async purchaseWithAnyToken() {
    this.#userWallet = new UserMetamaskWallet(window.ethereum)
    try {
      await this.#userWallet.connect()

      const { walletInfo } = this.#userWallet

      const { tokens, tokenBalancesPromise } = await useTokenList({
        chainId: walletInfo.currentNetwork.chainId || 0,
        chainName:
          CHAIN_IDS_TO_NAMES[walletInfo.currentNetwork.chainId] ||
          CHAIN_NAME.goerli,
        userWalletAddress: walletInfo.currentAddress || '',
      })

      await this.fetchTokenBalances({
        tokens,
        tokenBalancesPromise,
        walletInfo,
      })

      return this.#userWalletTokenBalances?.tokensWithBalances
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
      // TODO: Handle not installed Metamask

      throw error
    }
  }

  async fetchTokenBalances(props: {
    tokenBalancesPromise: Promise<Array<EthereumTokenBalance>>
    tokens: Array<TokenInfo>
    walletInfo: WalletInfo
  }) {
    this.#userWalletTokenBalances = new UserWalletTokenBalances(props)
  }

  get userWalletTokenBalances() {
    return this.#userWalletTokenBalances
  }

  //   const { nftInfo, isLoading, isError } = useNFT();
}

export const nftCheckoutContext = new NftCheckoutContext(NETWORK_TYPE.TESTNET)
