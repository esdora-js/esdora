export function isMpSchema(url: string): boolean {
  return /^weixin:\/\//.test(url)
}
