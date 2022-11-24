const mongoose = require('mongoose');
const schema = mongoose.Schema({
  userfrom: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Users',
    required: true,
  },
  userto: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Users',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: String,
  },
  type: {
    type: String,
  },
});

module.exports = mongoose.model('Chat', schema);
