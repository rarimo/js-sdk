// import {
//   Chain,
//   ChainId,
//   EthereumProvider,
//   ProviderProxy,
//   TransactionResponse,
//   TxRequestBody,
// } from '@/types'
// import { ethers } from 'ethers'
// import Web3 from 'web3/types'
//
// declare global {
//   interface Window {
//     Web3: typeof Web3
//   }
// }
//
// export class MetamaskProvider implements ProviderProxy {
//   readonly #provider?: ethers.providers.Web3Provider
//   readonly #isConnected = false
//   #web3: Web3
//   #address?: string = ''
//   #chainId?: ChainId
//
//   constructor(provider: ethers.providers.Web3Provider) {
//     this.#web3 = new window.Web3(Web3.givenProvider)
//     this.#provider = provider
//     this.#isConnected = false
//   }
//
//   get provider(): ethers.providers.Web3Provider | undefined {
//     return this.#provider
//   }
//
//   get signer(): ethers.providers.JsonRpcSigner | undefined {
//     return this.#provider?.getSigner()
//   }
//
//   get isConnected(): boolean {
//     return this.#isConnected
//   }
//
//   get chainId(): ChainId | undefined {
//     return this.#chainId
//   }
//
//   get address(): string | undefined {
//     return this.#address
//   }
//
//   init(): Promise<void> {
//     return Promise.resolve(undefined)
//   }
//
//   addChain(chain: Chain): Promise<void> {
//     return Promise.resolve(undefined)
//   }
//
//   connect(): Promise<void> {
//     return Promise.resolve(undefined)
//   }
//
//   disconnect(): Promise<void> {
//     return Promise.resolve(undefined)
//   }
//
//   getAddressUrl(explorerUrl: string, address: string): string {
//     return ''
//   }
//
//   getHashFromTx(txResponse: TransactionResponse): string {
//     return ''
//   }
//
//   getTxUrl(explorerUrl: string, txHash: string): string {
//     return ''
//   }
//
//   signAndSendTx(txRequestBody: TxRequestBody): Promise<TransactionResponse> {
//     return Promise.resolve(undefined)
//   }
//
//   signMessage(message: string): Promise<string | undefined> {
//     return Promise.resolve(undefined)
//   }
//
//   switchChain(chainId: ChainId): Promise<void> {
//     return Promise.resolve(undefined)
//   }
// }
