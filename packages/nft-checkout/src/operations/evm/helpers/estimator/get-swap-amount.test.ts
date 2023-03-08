import { Price } from '../../../../entities'
import { getSwapAmount } from './get-swap-amount'

describe('performs getSwapAmount', () => {
  test('should return correct value', () => {
    expect(getSwapAmount(Price.fromRaw('1', 18, 'BNB'))).toBe(
      '1025641025641025641',
    )
  })
})
