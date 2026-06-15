// RAG (Retrieval-Augmented Generation) service.
// Finds the most relevant knowledge chunks for a user query
// via cosine similarity over stored embeddings, then formats
// them as context to inject into the AI system prompt.

const KnowledgeDocument = require('../models/KnowledgeDocument');
const { embedText } = require('./embeddingService');

const TOP_K = 4;
const MIN_SIMILARITY = 0.30; // ignore chunks that are too unrelated
const CACHE_TTL_MS = 5 * 60 * 1000; // 5-minute in-memory cache

// Simple query → results cache so repeated or near-identical questions
// don't re-embed and re-scan MongoDB every time.
const _cache = new Map();

function _cacheKey(query, mode) {
  return `${mode || 'any'}::${query.toLowerCase().trim().slice(0, 120)}`;
}

function _isExpired(entry) {
  return Date.now() - entry.ts > CACHE_TTL_MS;
}

/**
 * Dot product of two equal-length float arrays.
 * Because embeddings are L2-normalised, dot product == cosine similarity.
 */
function _dot(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

/**
 * Category filter by conversation mode.
 * Pregnancy conversations get pregnancy/nutrition/myths/postpartum content.
 * Toddler conversations get toddler/nutrition/first_aid content.
 * "both" mode gets everything.
 */
function _buildFilter(mode) {
  if (mode === 'pregnancy') {
    return { category: { $in: ['pregnancy', 'nutrition', 'myths', 'postpartum', 'general'] } };
  }
  if (mode === 'toddler') {
    return { category: { $in: ['toddler', 'nutrition', 'first_aid', 'general'] } };
  }
  return {}; // "both" or unknown — no filter
}

/**
 * Search the knowledge base for chunks relevant to `query`.
 *
 * @param {string} query - The user's message text
 * @param {Object} opts
 * @param {string} [opts.mode] - "pregnancy" | "toddler" | "both"
 * @param {number} [opts.topK] - Number of results to return
 * @returns {Promise<Array<{content:string, category:string, score:number}>>}
 */
async function searchKnowledgeBase(query, { mode = null, topK = TOP_K } = {}) {
  const key = _cacheKey(query, mode);
  const cached = _cache.get(key);
  if (cached && !_isExpired(cached)) return cached.results;

  let results = [];
  try {
    const queryVec = await embedText(query);
    const filter = _buildFilter(mode);

    // Fetch documents WITH their embedding field (excluded by default in schema)
    const docs = await KnowledgeDocument.find(filter)
      .select('content category tags embedding')
      .lean();

    if (!docs.length) return [];

    results = docs
      .filter((d) => Array.isArray(d.embedding) && d.embedding.length > 0)
      .map((d) => ({
        content: d.content,
        category: d.category,
        score: _dot(queryVec, d.embedding),
      }))
      .filter((d) => d.score >= MIN_SIMILARITY)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    _cache.set(key, { results, ts: Date.now() });
  } catch (err) {
    // RAG must never break the chat — swallow errors and return empty
    console.error('[RAGService] search failed:', err.message);
  }

  return results;
}

/**
 * Format retrieved chunks as a block to inject into the system prompt.
 * Keeps it concise so we don't eat the token budget.
 *
 * @param {Array<{content:string}>} results
 * @returns {string} ready-to-insert context block, or "" if nothing found
 */
function formatContext(results) {
  if (!results || !results.length) return '';
  const body = results.map((r, i) => `[${i + 1}] ${r.content}`).join('\n\n');
  return `WOMBLY KNOWLEDGE BASE — use the following verified information to guide your answer:\n\n${body}\n\nIf the above context is relevant, prefer it over general knowledge. If it is not relevant to the question, rely on your training as usual.`;
}

module.exports = { searchKnowledgeBase, formatContext };
