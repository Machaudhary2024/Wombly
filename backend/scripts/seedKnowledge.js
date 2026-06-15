/**
 * Seeds the knowledge base into MongoDB.
 *
 * Run once (or whenever knowledge content changes):
 *   cd backend && node scripts/seedKnowledge.js
 *
 * What it does:
 *  1. Connects to MongoDB
 *  2. Loads all JSON knowledge files
 *  3. Generates an embedding (vector) for each chunk using the local AI model
 *  4. Saves every chunk to the KnowledgeDocument collection
 *
 * First run downloads the embedding model (~80MB from HuggingFace) — needs internet.
 * Subsequent runs use the cached model and are fast.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const KnowledgeDocument = require('../models/KnowledgeDocument');

const KNOWLEDGE_DIR = path.join(__dirname, '../knowledge');
const KNOWLEDGE_FILES = [
  'pregnancy_guide.json',
  'nutrition.json',
  'toddler_care.json',
  'myths_facts.json',
  'postpartum.json',
  'first_aid.json',
];

async function loadAllChunks() {
  const chunks = [];
  for (const file of KNOWLEDGE_FILES) {
    const filePath = path.join(KNOWLEDGE_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`[Seed] File not found, skipping: ${file}`);
      continue;
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    chunks.push(...data);
    console.log(`[Seed] Loaded ${data.length} chunks from ${file}`);
  }
  return chunks;
}

async function seed() {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wombly');
  console.log('[Seed] Connected to MongoDB');

  // Load the embedding service (downloads model on first run)
  console.log('[Seed] Loading embedding model (may download ~80MB on first run)...');
  const { embedText } = require('../services/embeddingService');

  // Load all knowledge chunks from JSON files
  const chunks = await loadAllChunks();
  console.log(`[Seed] Total chunks to process: ${chunks.length}`);

  // Clear existing knowledge documents
  await KnowledgeDocument.deleteMany({});
  console.log('[Seed] Cleared existing knowledge documents');

  let saved = 0;
  let failed = 0;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    process.stdout.write(`\r[Seed] Processing ${i + 1}/${chunks.length} — "${chunk.content.slice(0, 60)}..."`);

    try {
      const embedding = await embedText(chunk.content);
      await KnowledgeDocument.create({
        content: chunk.content,
        category: chunk.category,
        tags: chunk.tags || [],
        source: chunk.source || 'unknown',
        embedding,
      });
      saved++;
    } catch (err) {
      console.error(`\n[Seed] Failed chunk ${i + 1}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n[Seed] Done. Saved: ${saved} | Failed: ${failed}`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[Seed] Fatal error:', err);
  process.exit(1);
});
