// Standalone paid-traffic landing pages that opt out of the shared Navbar/Footer
// chrome, so ad visitors aren't pulled away from the conversion form.
export const STANDALONE_PAGE_PATHS = ['/es/bienes-raices-republica-dominicana']

export function isStandalonePage(pathname: string | null): boolean {
  if (!pathname) return false
  return STANDALONE_PAGE_PATHS.some(path => pathname === path || pathname === `${path}/`)
}
