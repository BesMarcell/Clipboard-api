import mongoose from 'mongoose';

const enumObj = {
  values: ['text'],
  message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
};

const Schema = mongoose.Schema;

const ClipboardSchema = new Schema({
  value: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: enumObj,
    required: true
  },

  account: {
    type: Schema.ObjectId,
    ref: 'Account'
  }
});

const Clipboard = mongoose.model('Clipboard', ClipboardSchema);
export default Clipboard;
