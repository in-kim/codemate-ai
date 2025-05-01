import mongoose from 'mongoose';

const CodeDocumentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  fileName: { type: String, required: true },
  content: { type: String, default: '' },
  isSaved: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
});

export const CodeDocument = mongoose.model('CodeDocument', CodeDocumentSchema);
