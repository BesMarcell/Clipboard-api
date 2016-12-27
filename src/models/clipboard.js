import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ClipboardSchema = new Schema({
  value: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ['text'],
    required: true
  },

  account: {
    type: Schema.ObjectId,
    ref: 'Account'
  }
});

const Clipboard = mongoose.model('Clipboard', ClipboardSchema);
export default Clipboard;
