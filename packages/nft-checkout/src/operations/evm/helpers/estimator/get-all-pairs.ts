import { createProvider } from '@rarimo/provider'
import { MetamaskProvider } from '@rarimo/providers-evm'
import { Pair as PairQS, Token as QSToken } from '@rarimo/quickswap-sdk'
import type { ChainId } from '@rarimo/shared'
import {
  BASE_AVALANCHE_TOKENS,
  ChainNames,
  EVM_CHAIN_IDS,
  multicallContractAbi,
  pairContractAbi,
} from '@rarimo/shared'
import { BASE_POLYGON_TOKENS } from '@rarimo/shared'
import { Pair as PairTJ, Token as TJToken } from '@traderjoe-xyz/sdk'
import { ethers } from 'ethers'

type Token = TJToken | QSToken

const multicallAddress = '0xcA11bde05977b3631167028862bE2a173976CA11'

const isAvalanche = (chain: ChainId) =>
  Boolean(chain === EVM_CHAIN_IDS[ChainNames.Avalanche])

const isPolygon = (chain: ChainId) =>
  Boolean(chain === EVM_CHAIN_IDS[ChainNames.Polygon])

const getAllPairCombinations = (
  tokenA: Token | undefined,
  tokenB: Token | undefined,
  bases: Token[],
  basePairs: [Token, Token][],
): [Token, Token][] => {
  return tokenA && tokenB
    ? [
        [tokenA, tokenB],
        ...bases.map((base): [Token, Token] => [tokenA, base]),
        ...bases.map((base): [Token, Token] => [tokenB, base]),
        ...basePairs,
      ]
        .filter((tokens): tokens is [Token, Token] =>
          Boolean(tokens[0] && tokens[1]),
        )
        .filter(([t0, t1]) => t0.address !== t1.address)
    : []
}

export const getAllPairs = async (tokenA: Token, tokenB: Token) => {
  if (tokenA.chainId !== tokenB.chainId)
    throw new Error('tokens must have the same chain')
  let bases: Token[]
  let tokenOne: Token
  let tokenTwo: Token
  if (isPolygon(tokenA.chainId)) {
    tokenOne = new QSToken(
      Number(tokenA.chainId),
      tokenA.address,
      tokenA.decimals,
      tokenA.symbol,
      tokenA.name,
    )

    tokenTwo = new QSToken(
      Number(tokenB.chainId),
      tokenB.address,
      tokenB.decimals,
      tokenB.symbol,
      tokenB.name,
    )
    bases = BASE_POLYGON_TOKENS
  } else if (isAvalanche(tokenA.chainId)) {
    tokenOne = new TJToken(
      Number(tokenA.chainId),
      tokenA.address,
      tokenA.decimals,
      tokenA.symbol,
      tokenA.name,
    )

    tokenTwo = new TJToken(
      Number(tokenB.chainId),
      tokenB.address,
      tokenB.decimals,
      tokenB.symbol,
      tokenB.name,
    )
    bases = BASE_AVALANCHE_TOKENS
  } else throw new Error('unknown tokens chain')
  const basePairs: [Token, Token][] = bases.flatMap((base): [Token, Token][] =>
    bases.map(otherBase => [base, otherBase]),
  )
  const allPairCombinations = getAllPairCombinations(
    tokenOne,
    tokenTwo,
    bases,
    basePairs,
  )
  const pairAddresses = allPairCombinations.map(pair => {
    const chainId = (pair[0] as TJToken).chainId
    return isAvalanche(chainId)
      ? PairTJ.getAddress(pair[0] as TJToken, pair[1] as TJToken, chainId)
      : PairQS.getAddress(pair[0] as QSToken, pair[1] as QSToken)
  })
  const provider = await createProvider(MetamaskProvider)
  await provider.connect()
  const multicallContract = new ethers.Contract(
    multicallAddress,
    multicallContractAbi,
    provider.getWeb3Provider(),
  )

  const pair = new ethers.utils.Interface(pairContractAbi)
  const callData = pair.encodeFunctionData('getReserves', [])

  const results = await multicallContract.callStatic.aggregate(
    pairAddresses.map(i => ({ target: i, callData })),
  )

  const pairs = []
  for (let i = 0; i < pairAddresses.length; i++) {
    const reservesData = results.returnData[i]
    if (reservesData !== '0x') {
      const reserves = await pair.decodeFunctionResult(
        'getReserves',
        reservesData,
      )

      const resultPair = {
        address: pairAddresses[i],
        reserves: reserves,
      }
      pairs.push(resultPair)
    }
  }

  return pairs
}
