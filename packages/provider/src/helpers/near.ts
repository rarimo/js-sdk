import {
  setupWalletSelector,
  Wallet,
  WalletSelector,
} from '@near-wallet-selector/core'
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet'
import { providers, utils } from 'near-api-js'

import {
  EIP1193,
  EIP1474,
  NEAR_CHAINS,
  NEAR_WALLET_ACTION_TYPE,
} from '../enums'
import { errors } from '../errors'
import {
  Chain,
  ENearWalletId,
  NearProviderRpcError,
  NearTxRequestBody,
} from '../types'

const THIRTY_TGAS = '300000000000000'
const NO_DEPOSIT = '0'

export class NearProvider {
  selector: WalletSelector | null = null
  wallet: Wallet | null = null
  createAccessKeyFor: string
  accountId = ''
  isNear = true

  constructor({ createAccessKeyFor = '' }: { createAccessKeyFor?: string }) {
    this.createAccessKeyFor = createAccessKeyFor
  }

  async init() {
    this.selector = await setupWalletSelector({
      network: NEAR_CHAINS.mainnet,
      modules: [setupMyNearWallet()],
    })

    const isSignedIn = this.selector.isSignedIn()

    if (isSignedIn) {
      this.wallet = await this.selector.wallet()
      this.accountId =
        this.selector.store.getState().accounts[0].accountId ?? ''
    }

    return isSignedIn
  }

  async signIn() {
    if (!this.selector || Boolean(this.accountId)) return

    this.wallet = await this.selector.wallet(ENearWalletId.MyNearWallet)
    await this.wallet.signIn({
      contractId: this.createAccessKeyFor,
      methodNames: [],
      accounts: [],
    })
  }

  async signOut() {
    if (!this.wallet) return

    await this.wallet.signOut()
    this.wallet = null
    this.accountId = ''
  }

  // Call a method that changes the contract's state
  async signAndSendTx({
    contractId,
    method,
    args = {},
    gas = THIRTY_TGAS,
    deposit = NO_DEPOSIT,
  }: NearTxRequestBody) {
    if (!this.wallet) return

    // Sign a transaction with the "FunctionCall" action
    const outcome = await this.wallet.signAndSendTransaction({
      signerId: this.accountId,
      receiverId: contractId,
      actions: [
        {
          type: NEAR_WALLET_ACTION_TYPE.functionCall,
          params: {
            methodName: method,
            args,
            gas,
            deposit,
          },
        },
      ],
    })

    return outcome ? providers.getTransactionLastResult(outcome) : null
  }

  // Get transaction result from the network
  async getTransactionResult(txhash: string) {
    if (!this.selector) return

    const { network } = this.selector.options
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl })

    // Retrieve transaction result from the network
    const transaction = await provider.txStatus(txhash, 'unnused')
    return providers.getTransactionLastResult(transaction)
  }
}

export const nearProvider = new NearProvider({
  // createAccessKeyFor: 'example-account.testnet',
})

export const convertNearAmountToYocto = (amount: string) => {
  // converts NEAR amount into yoctoNEAR (10^-24)

  return utils.format.parseNearAmount(amount)
}

export const convertYoctoToNearAmount = (amount: string) => {
  // converts yoctoNEAR (10^-24) amount into NEAR

  return utils.format.formatNearAmount(amount)
}

export function getNearExplorerTxUrl(
  explorerUrl: string | Chain,
  txHash: string,
) {
  return `${explorerUrl}/transactions/${txHash}`
}

export function getNearExplorerAddressUrl(
  explorerUrl: string | Chain,
  address: string,
) {
  return `${explorerUrl}/accounts/${address}`
}

export function handleNearError(error: NearProviderRpcError): never {
  switch (error.code) {
    case EIP1193.userRejectedRequest:
      throw new errors.ProviderUserRejectedRequest()
    case EIP1193.unauthorized:
      throw new errors.ProviderUnauthorized()
    case EIP1193.unsupportedMethod:
      throw new errors.ProviderUnsupportedMethod()
    case EIP1193.disconnected:
      throw new errors.ProviderDisconnected()
    case EIP1193.chainDisconnected:
      throw new errors.ProviderChainDisconnected()
    case EIP1474.parseError:
      throw new errors.ProviderParseError()
    case EIP1474.invalidRequest:
      throw new errors.ProviderInvalidRequest()
    case EIP1474.methodNotFound:
      throw new errors.ProviderMethodNotFound()
    case EIP1474.invalidParams:
      throw new errors.ProviderInvalidParams()
    case EIP1474.internalError:
      throw new errors.ProviderInternalError()
    case EIP1474.invalidInput:
      throw new errors.ProviderInvalidInput()
    case EIP1474.resourceNotFound:
      throw new errors.ProviderResourceNotFound()
    case EIP1474.resourceUnavailable:
      throw new errors.ProviderResourceUnavailable()
    case EIP1474.transactionRejected:
      throw new errors.ProviderTransactionRejected()
    case EIP1474.methodNotSupported:
      throw new errors.ProviderMethodNotSupported()
    case EIP1474.limitExceeded:
      throw new errors.ProviderLimitExceeded()
    case EIP1474.jsonRpcVersionNotSupported:
      throw new errors.ProviderJsonRpcVersionNotSupported()
    default:
      throw error
  }
}
