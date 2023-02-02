import { ethers } from 'ethers'

import { connectEthAccounts, getEthTokenBalances } from '@/helpers'
import { Provider, WalletInfo } from '@/types'

export class useEthereum {
  walletInfo: WalletInfo = {
    currentAddress: '',
    currentNetwork: { chainId: 0 },
  }

  currentProvider: ethers.providers.Web3Provider

  constructor(provider: Provider) {
    this.currentProvider = new ethers.providers.Web3Provider(
      provider as ethers.providers.ExternalProvider,
    )
  }

  #setWalletInfo(info: WalletInfo) {
    this.walletInfo = info
  }

  #updateWalletInfo = async () => {
    try {
      const network = await this.currentProvider.detectNetwork()

      if (
        this.walletInfo.currentNetwork.chainId !== 5 ||
        network.chainId !== 5
      ) {
        if (!window.ethereum) return
        // await currentProvider.send("wallet_switchEthereumChain", [
        //   {
        //     chainId: `0x${Number(5).toString(16)}`,
        //   },
        // ]);
      }

      const userAccounts = await this.currentProvider.listAccounts()

      this.#setWalletInfo({
        ...this.walletInfo,
        currentAddress: userAccounts[0],
        currentNetwork: network,
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log({ error })
    }
  }

  #addWalletListeners = () => {
    const tempProvider = this.currentProvider.provider as {
      on: (eventName: string, cb: () => void) => void
    }

    tempProvider.on('accountsChanged', () => {
      this.#updateWalletInfo()
    })
    tempProvider.on('chainChanged', () => {
      this.#updateWalletInfo()
    })

    tempProvider.on('disconnect', () => {
      this.#setWalletInfo({
        currentAddress: '',
        currentNetwork: { chainId: 1 },
      })
    })
  }

  connectEthAccounts = connectEthAccounts

  init = async () => {
    this.#addWalletListeners()
    await this.#updateWalletInfo()
  }

  getTokenBalances = () =>
    getEthTokenBalances(
      this.currentProvider,
      this.walletInfo.currentAddress,
      this.walletInfo.currentNetwork.chainId,
    )
}
