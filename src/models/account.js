import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  provider:{
    type: String,
    required: true,
    enum: ['local', 'facebook', 'twitter']
  },

  email: {
    type: String,
    match: [/.+\@.+\..+/, "Please fill a valid e-mail address"]},

  auth_token: String,

  password: {
    type: String,
    min: 6
  },

  avatar: {
    type: String,
  },

}, {timestamps: true});
const User = mongoose.model('User', UserSchema);
export default User;
