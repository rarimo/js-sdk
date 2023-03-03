import { ProviderChecks, Providers } from '@/enums'
import { sleep } from '@/helpers'
import { EthereumProvider, ProviderInstance, RawProvider } from '@/types'

declare global {
  interface Window {
    ethereum?: EthereumProvider
    solflare?: {
      isSolflare: boolean
    }
    solana?: unknown
  }
}

type ProvidersReturnType = Record<Providers, ProviderInstance>

export class Web3 {
  #providers: ProviderInstance[]
  #rawProviders: RawProvider[]
  #initiated = false

  constructor() {
    this.#providers = []
    this.#rawProviders = []
  }

  public async init(): Promise<Web3> {
    await sleep(500)
    this.#detectRawProviders()
    await this.#defineProviders()
    this.#initiated = true
    return this
  }

  get initiated(): boolean {
    return this.#initiated
  }

  public get providers(): ProvidersReturnType {
    return this.#providers.reduce((acc, el) => {
      const name = el.name.toLowerCase() as Providers

      acc[name] = {
        ...el,
        name,
      }
      return acc
    }, {} as Record<Providers, ProviderInstance>)
  }

  public getProvider(provider: Providers): ProviderInstance | undefined {
    return this.providers[provider]
  }

  public get isEnabled(): boolean {
    return Boolean(this.#providers.length)
  }

  #detectRawProviders(): void {
    const ethProviders = window?.ethereum
      ? window?.ethereum?.providers || [window?.ethereum]
      : undefined
    const phantomProvider = window?.solana
    const solflareProvider = window?.solflare

    this.#rawProviders = [
      ...(ethProviders ? ethProviders : []),
      ...(phantomProvider ? [phantomProvider] : []),
      ...(solflareProvider ? [solflareProvider] : []),
    ] as RawProvider[]
  }

  async #defineProviders(): Promise<void> {
    if (this.#rawProviders.length) {
      await this.#handleProviders()
    } else {
      await sleep(3000)
      await this.#handleProviders()
    }
  }

  async #handleProviders(): Promise<void> {
    if (!this.#rawProviders.length) return
    this.#providers = this.#wrapProviders()
  }

  #wrapProviders(): ProviderInstance[] {
    if (!this.#rawProviders.length) return []

    const browserProviders = this.#rawProviders.map(el => {
      const appropriatedProviderName: Providers =
        this.#getAppropriateProviderName(el)

      return {
        name: appropriatedProviderName,
        instance: el,
      } as ProviderInstance
    })

    return browserProviders.filter(
      (el, idx, arr) => arr.findIndex(sec => sec.name === el.name) === idx,
    )
  }

  #getAppropriateProviderName(provider: RawProvider): Providers {
    const providerName = Object.entries(ProviderChecks).find(el => {
      const [, value] = el

      return ((<unknown>provider) as { [key in ProviderChecks]: boolean })[
        value
      ]
    })

    return (
      ((providerName && providerName[0]) as Providers) || Providers.Fallback
    )
  }
}
