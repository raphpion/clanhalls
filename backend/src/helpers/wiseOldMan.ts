export async function withSafeWiseOldMan<T>(
  callback: () => Promise<T>,
): Promise<T | undefined> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await callback();
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return undefined;
      }

      if (error.name === 'RateLimitError') {
        // Retry in 60 seconds if the request fails because of rate limiting
        // See https://docs.wiseoldman.net/#rate-limits--api-keys
        await new Promise((r) => setTimeout(r, 60000));
        continue;
      }

      throw error;
    }
  }
}
