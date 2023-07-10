import { Constants, ElemBytes } from '@iden3/js-iden3-core'

export function unmarshalBinary(data: Uint8Array): string[] {
  const requiredLength =
    2 * Constants.ELEM_BYTES_LENGTH * Constants.BYTES_LENGTH

  if (data.length !== requiredLength) {
    throw new Error()
  }

  const { BYTES_LENGTH, ELEM_BYTES_LENGTH } = Constants

  const createElemBytesArray = (data: Uint8Array, start: number, end: number) =>
    Array(end - start)
      .fill(null)
      .map(
        (_, i) =>
          new ElemBytes(
            data.slice(
              (start + i) * BYTES_LENGTH,
              (start + i + 1) * BYTES_LENGTH,
            ),
          ),
      )

  const index = createElemBytesArray(data, 0, ELEM_BYTES_LENGTH)
  const value = createElemBytesArray(
    data,
    ELEM_BYTES_LENGTH,
    2 * ELEM_BYTES_LENGTH,
  )

  return [...index, ...value].map(el => el.toBigInt().toString())
}
