export async function readBytesFile(path: string) {
  const res = await fetch(path)
  const buff = await res.arrayBuffer()
  return new Uint8Array(buff)
}
