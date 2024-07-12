const absoluteUrlRegex = new RegExp('^(?:[a-z+]+:)?//', 'i');

export function isAbsoluteURL(url: string) {
  return absoluteUrlRegex.test(url);
}
