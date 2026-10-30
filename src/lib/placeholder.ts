/** True for empty values and unfinished "[TODO: ...]" text, so the site can hide them until they are filled in. */
export function isPlaceholder(value: string | undefined | null): boolean {
  const text = value?.trim() ?? '';
  return text === '' || text.startsWith('[TODO');
}
