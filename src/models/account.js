import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  provider: {
    type: String,
    required: true,
    enum: ['local', 'facebook', 'twitter']
  },

  email: {
    type: String,
    match: [/.+@.+\..+/, 'Please fill a valid e-mail address']},

  authToken: String,

  password: {
    type: String,
    min: 6
  },

  avatar: {
    type: String
  }

}, {
  timestamps: true
});

AccountSchema.options.toJSON = {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
};

const Account = mongoose.model('Account', AccountSchema);
export default Account;
