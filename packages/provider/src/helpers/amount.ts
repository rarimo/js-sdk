export function hexToDecimal(chainHexOrId: string | number): number {
  return window.Web3.utils.isHexStrict(chainHexOrId)
    ? window.Web3.utils.hexToNumber(chainHexOrId)
    : (chainHexOrId as number)
}
