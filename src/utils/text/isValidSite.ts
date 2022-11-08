export function isValidSite(site: string) {
  let url
  site = site.trim()
  try {
    url = new URL(site)
  } catch (_) {
    return false
  }
  return url.protocol === "http:" || url.protocol === "https:"
}
