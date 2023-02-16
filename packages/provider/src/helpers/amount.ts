export function hexToDecimal(chainHexOrId: string | number): number {
  if (Number.isInteger(chainHexOrId)) return Number(chainHexOrId)
  return window.Web3.utils.hexToNumber(chainHexOrId)
}
