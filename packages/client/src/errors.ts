import type { BroadcastTxFailure } from '@cosmjs/launchpad'
import { RuntimeError } from '@rarimo/shared'

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

export class WalletBroadcastError extends RuntimeError {
  name = 'WalletBroadcastError'

  constructor(txFailure: BroadcastTxFailure) {
    super(
      txFailure.rawLog || 'Transaction broadcast failed',
      txFailure as unknown as Error,
    )
  }
}
