// Values must be lowercase because we lowercase them in Web3.init
export enum Providers {
  Fallback = 'fallback',
  Metamask = 'metamask',

  // Not implemented yet
  Coinbase = 'coinbase',
  WalletConnect = 'wallet-connect',
  Phantom = 'phantom',
  Solflare = 'solflare',
  Near = 'near',
}

export enum ProviderChecks {
  Fallback = 'isWeb3',
  Metamask = 'isMetaMask',

  // Not implemented yet
  Coinbase = 'isCoinbaseWallet',
  WalletConnect = 'isWalletConnect',
  Phantom = 'isPhantom',
  Solflare = 'isSolflare',
  Near = 'isNear',
}

export enum ProviderEvents {
  Connect = 'connect',
  Disconnect = 'disconnect',
  ChainChanged = 'chainChanged',
  AccountsChanged = 'accountsChanged',
  AccountChanged = 'accountChanged',
}
