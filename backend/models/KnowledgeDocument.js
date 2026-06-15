const mongoose = require('mongoose');

const KnowledgeDocumentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, maxlength: 3000 },
    category: {
      type: String,
      enum: ['pregnancy', 'toddler', 'nutrition', 'myths', 'postpartum', 'first_aid', 'general'],
      required: true,
    },
    tags: [{ type: String }],
    source: { type: String },
    embedding: { type: [Number], select: false }, // large field excluded from default queries
  },
  { timestamps: true }
);

// Text index for optional keyword fallback search
KnowledgeDocumentSchema.index({ content: 'text', tags: 'text' });

module.exports = mongoose.model('KnowledgeDocument', KnowledgeDocumentSchema);
