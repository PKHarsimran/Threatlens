/**
 * Fallback utility: createPageUrl
 * Converts a page name like "Dashboard" into "/dashboard"
 */
export function createPageUrl(name: string): string {
  return `/${name.toLowerCase()}`;
}
