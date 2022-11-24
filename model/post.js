const mongoose = require('mongoose');
const schema = mongoose.Schema({
  userid: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Users',
    required: true,
  },
 
  post: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  type: {
    type: String,
  },
  comments: [
    {
      username: {
        type: String,
      },
      comment: {
        type: String,
      },
      useravatar: {
        type: String,
      },
    },
  ],
  likes: [
    {
      like: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model('Post', schema);
