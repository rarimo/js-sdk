// Values must be lowercase because we lowercase them in Web3.init
export enum Providers {
  Fallback = 'fallback',
  Metamask = 'metamask',
  Phantom = 'phantom',
  Coinbase = 'coinbase',
  Solflare = 'solflare',
  Near = 'near',
}

export enum ProviderChecks {
  Fallback = 'isWeb3',
  Metamask = 'isMetaMask',
  Coinbase = 'isCoinbaseWallet',
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

export enum ProviderEventBusEvents {
  Connect = 'connect',
  Disconnect = 'disconnect',
  ChainChanged = 'chain-changed',
  AccountChanged = 'account-changed',
  Initiated = 'initiated',
}
