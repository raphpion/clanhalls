/**
 * For some reason, RuneLite may send player names with or without a non-breaking space character, which can
 * cause issues when trying to match these names with the ones stored in the database. This function normalizes
 * the player name by replacing any non-breaking space characters with regular space characters.
 *
 * @param name The player name to normalize.
 * @returns The normalized player name.
 */
export function normalizePlayerName(name: string) {
  return name.replace(/\u00A0/g, ' ');
}
