import type { TokenInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { TokenType } from '@safe-global/safe-gateway-typescript-sdk'

export type BlastYieldResponse = {
  items: Array<{
    tokenInfo: TokenInfo
    claimableYield: string
    mode: YieldMode
  }>
}

enum YieldTokens {
  BLAST_ETH,
  WETH,
  USDB,
}

const YieldTokenConfig = {
  [YieldTokens.BLAST_ETH]: {
    type: TokenType.NATIVE_TOKEN,
    decimals: 18,
    symbol: 'ETH',
    name: 'Ether',
    logoUri: '/0x4300000000000000000000000000000000000002.png',
  },
  [YieldTokens.WETH]: {
    type: TokenType.ERC20,
    decimals: 18,
    symbol: 'WETH',
    name: 'WETH',
    logoUri: '/0x4200000000000000000000000000000000000023.png',
  },
  [YieldTokens.USDB]: {
    type: TokenType.ERC20,
    decimals: 18,
    symbol: 'USDB',
    name: 'USDB',
    logoUri: '/0x4200000000000000000000000000000000000022.png',
  },
}

export function getBlastYieldTokens(chainId: number): TokenInfo[] {
  switch (chainId) {
    case 81457:
      return [
        {
          ...YieldTokenConfig[YieldTokens.BLAST_ETH],
          address: '0x4300000000000000000000000000000000000002',
        },
        {
          ...YieldTokenConfig[YieldTokens.USDB],
          address: '0x4300000000000000000000000000000000000003',
        },
        {
          ...YieldTokenConfig[YieldTokens.WETH],
          address: '0x4300000000000000000000000000000000000004',
        },
      ]
    default:
      return [
        {
          ...YieldTokenConfig[YieldTokens.BLAST_ETH],
          address: '0x4300000000000000000000000000000000000002',
        },
        {
          ...YieldTokenConfig[YieldTokens.WETH],
          address: '0x4200000000000000000000000000000000000023',
        },
        {
          ...YieldTokenConfig[YieldTokens.USDB],
          address: '0x4200000000000000000000000000000000000022',
        },
      ]
  }
}

export enum YieldMode {
  AUTOMATIC,
  VOID,
  CLAIMABLE,
}

export const YieldModeSelectorValues = [
  YieldMode.AUTOMATIC,
  YieldMode.VOID,
  YieldMode.CLAIMABLE,
]

export const YIELD_LABELS = {
  [YieldMode.VOID]: 'Void',
  [YieldMode.AUTOMATIC]: 'Automatic',
  [YieldMode.CLAIMABLE]: 'Claimable',
}

export const YIELD_DESCRIPTION = {
  [YieldMode.VOID]: 'Balance never changes. No yield is earned.',
  [YieldMode.AUTOMATIC]: 'Balance rebases (increasing only).',
  [YieldMode.CLAIMABLE]: 'Balance never changes. Yield accumulates separately.',
}
