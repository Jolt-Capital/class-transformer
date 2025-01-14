/**
 * This function returns the global object across Node and browsers.
 *
 * Note: `globalThis` is the standardized approach however it has been added to
 * Node.js in version 12. We need to include this snippet until Node 12 EOL.
 */
export function getGlobal() {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }

  if (typeof global !== 'undefined') {
    return global;
  }

  // @ts-ignore: Cannot find name 'window'.
  if (typeof window !== 'undefined') {
    // @ts-ignore: Cannot find name 'window'.
    return window;
  }

  // @ts-ignore: Cannot find name 'self'.
  if (typeof self !== 'undefined') {
    // @ts-ignore: Cannot find name 'self'.
    return self;
  }
}
