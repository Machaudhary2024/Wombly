// utils/youtube.js
// Tiny helpers for turning any YouTube URL into the 11-char video id that
// react-native-youtube-iframe (and the web <iframe>) needs.

/**
 * Extract the 11-char YouTube video id from any common URL form:
 *   - https://youtu.be/ID
 *   - https://www.youtube.com/watch?v=ID
 *   - https://www.youtube.com/embed/ID
 *   - https://www.youtube.com/shorts/ID
 * Tracking suffixes like ?si=... or &t=90s are ignored.
 * If the input is already a bare 11-char id, it is returned as-is.
 * Returns null when nothing usable is found.
 *
 * @param {string} url
 * @returns {string|null}
 */
export function getYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  // Already a bare id (exactly 11 valid chars, no slashes/dots)
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;

  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /[?&]v=([A-Za-z0-9_-]{11})/,
    /\/embed\/([A-Za-z0-9_-]{11})/,
    /\/shorts\/([A-Za-z0-9_-]{11})/,
  ];

  for (const re of patterns) {
    const match = trimmed.match(re);
    if (match && match[1]) return match[1];
  }

  return null;
}

/**
 * Thumbnail image url for a given video id (no API key required).
 * @param {string} videoId
 */
export function getYouTubeThumbnail(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
