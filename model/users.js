const mongoose = require('mongoose');
const schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    useravatar: {
        type: String,
    },
});

module.exports = mongoose.model('Users', schema);