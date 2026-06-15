// Lazy-loads @xenova/transformers on first use.
// The model (~80MB) downloads once to disk and is cached by the library.
// Uses all-MiniLM-L6-v2: fast, 384-dim embeddings, good semantic accuracy.

let _embedder = null;
let _loadPromise = null;

async function getEmbedder() {
  if (_embedder) return _embedder;
  if (_loadPromise) return _loadPromise;

  _loadPromise = (async () => {
    try {
      // Dynamic import works in CommonJS via import()
      const { pipeline, env } = await import('@xenova/transformers');
      // Silence verbose download logs after first run
      env.allowLocalModels = true;
      const model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      _embedder = model;
      console.log('[EmbeddingService] Model ready');
      return model;
    } catch (err) {
      _loadPromise = null; // allow retry on next call
      throw err;
    }
  })();

  return _loadPromise;
}

/**
 * Convert a text string into a 384-dimensional embedding vector.
 * @param {string} text
 * @returns {Promise<number[]>}
 */
async function embedText(text) {
  const pipe = await getEmbedder();
  const output = await pipe(text.slice(0, 512), { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

/**
 * Warm up the model at server start (avoids cold-start on first user message).
 * Call fire-and-forget from server.js.
 */
async function warmUp() {
  try {
    await embedText('warmup');
  } catch (err) {
    console.warn('[EmbeddingService] Warm-up failed (will retry on first use):', err.message);
  }
}

module.exports = { embedText, warmUp };
