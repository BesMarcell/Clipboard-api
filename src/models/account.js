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
    validate: [
      function(password) {
        return password && password.length > 5;
      }, 'Password should be longer']
  },

  avatar: {
    type: String,
    set: function(url) {
      if (!url) {
        return url;
      } else {
        if (url.indexOf('http://') !== 0 && url.indexOf('http://') !== 0) {
          url = 'http://' + url;
        }
        return url;
      }
    }
  },

  create_at: {
    type: Date,
    default: Date.now
  },

  updated_at: {
    type: Date,
    default: Date.now
  },
});
const User = mongoose.model('User', UserSchema);
export default User;
