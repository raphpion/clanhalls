export enum CredentialScopes {
  CLAN_REPORTING = 'clan:reporting',
}

export type Scopes = Record<CredentialScopes, boolean>;

/** Converts a Scopes object to a comma-separated string of scopes. */
export function scopesToString(scopes: Scopes) {
  return Object.entries(scopes)
    .filter(([, value]) => value)
    .map(([key]) => key)
    .join(',');
}

/** Converts a comma-separated string of scopes to a Scopes object. */
export function scopesFromString(scopes: string): Scopes {
  const scopesArray = scopes
    .split(',')
    .filter((scope) => scope in CredentialScopes);

  const result = {} as Scopes;
  for (const scope of scopesArray) {
    result[scope as CredentialScopes] = true;
  }

  return result;
}
