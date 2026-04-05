import { API_BASE_URL } from './apiConfig';

const originalFetch = global.fetch;

function resolveUrl(input) {
  if (typeof input === 'string') return input;
  if (input && typeof input.url === 'string') return input.url;
  return '';
}

global.fetch = async function debugFetch(input, init) {
  const url = resolveUrl(input);
  const method = (init && init.method) || 'GET';
  const isBackend = url.startsWith(API_BASE_URL);
  const start = Date.now();
  if (isBackend) {
    const bodyPreview =
      init && init.body != null
        ? typeof init.body === 'string'
          ? init.body.slice(0, 400)
          : '[non-string body]'
        : '';
    console.log('[api]', 'req', method, url, bodyPreview || undefined);
  }
  try {
    const response = await originalFetch(input, init);
    if (isBackend) {
      console.log(
        '[api]',
        'res',
        response.status,
        response.statusText,
        url,
        `${Date.now() - start}ms`
      );
      if (!response.ok) {
        response
          .clone()
          .text()
          .then((t) => console.log('[api]', 'err body', t.slice(0, 1500)))
          .catch(() => {});
      }
    }
    return response;
  } catch (err) {
    if (isBackend) {
      console.log(
        '[api]',
        'fail',
        method,
        url,
        err && err.message ? err.message : String(err),
        `${Date.now() - start}ms`
      );
    }
    throw err;
  }
};
