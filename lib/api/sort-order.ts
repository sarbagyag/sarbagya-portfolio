// New entries are appended after the current highest sortOrder rather than
// defaulting to 0, so they land at the end of the admin list instead of
// jumping to the front.
export function nextSortOrder(entries: { sortOrder: number }[]): number {
  return entries.reduce((max, entry) => Math.max(max, entry.sortOrder), -1) + 1;
}
