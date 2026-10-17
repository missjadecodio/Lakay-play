/**
 * Get the public URL for sharing with other players and friends.
 * Automatically transforms private AI Studio dev URL (ais-dev-...)
 * into the public shared URL (ais-pre-...) which anyone can open without login!
 */
export function getPublicAppUrl(): string {
  if (typeof window === 'undefined') {
    return 'https://ais-pre-u557p4thpltevwoqin6m2s-392973694454.us-west2.run.app';
  }

  const currentOrigin = window.location.origin;
  if (currentOrigin.includes('ais-dev-')) {
    return currentOrigin.replace('ais-dev-', 'ais-pre-');
  }

  return currentOrigin;
}
