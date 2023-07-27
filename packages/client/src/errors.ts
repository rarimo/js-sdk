import type { BroadcastTxFailure } from '@cosmjs/launchpad'

export class WalletNotInitializedError extends ReferenceError {
  constructor() {
    super('Wallet not initialized!')
    this.name = 'WalletNotInitializedError'
  }
}

export class WalletIsEmptyError extends ReferenceError {
  name = 'WalletIsEmptyError'
  constructor() {
    super('Wallet is empty!')
  }
}

export class WalletExtensionNotInstalledError extends ReferenceError {
  name = 'WalletExtensionNotInstalledError'
  constructor() {
    super('Wallet extension is not installed')
  }
}

export class WalletBroadcastError extends Error {
  name = 'WalletBroadcastError'
  txCode: number
  txHash: string
  txRawLog?: string

  constructor(txFailure: BroadcastTxFailure) {
    super(txFailure.rawLog || 'unknown error')
    this.name = 'Broadcast Tx Error'
    this.txCode = txFailure.code
    this.txRawLog = txFailure.rawLog
    this.txHash = txFailure.transactionHash
  }
}
