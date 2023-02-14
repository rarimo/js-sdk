export enum Providers {
  Fallback = 'fallback',
  Metamask = 'metamask',
  // Coinbase = 'coinbase',
  // WalletConnect = 'wallet-connect',
  // Phantom = 'phantom',
  // Solflare = 'solflare',
  // Near = 'near',
}

export enum ProviderChecks {
  Fallback = 'isWeb3',
  Metamask = 'isMetaMask',
  // Coinbase = 'isCoinbaseWallet',
  // WalletConnect = 'isWalletConnect',
  // Phantom = 'isPhantom',
  // Solflare = 'isSolflare',
  // Near = 'isNear',
}

export enum ProviderEvents {
  Connect = 'connect',
  Disconnect = 'disconnect',
  ChainChanged = 'chainChanged',
  AccountsChanged = 'accountsChanged',
}
