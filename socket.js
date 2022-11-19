const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const Chat = require('./model/chats');

function socket() {
  io.on(
    'connection',
    (socket) => socket.emit('message', 'welcome to our app')
    // socket.on('inputmsg', (msg) => {
    // console.log(msg);
    // })
  );
}

//     //   const chat = new Chat({
//     //     userfrom: req.body.userfrom,
//     //     userto: req.body.userto,
//     //     message: req.body.message,
//     //     type: req.body.type,
//     //   });
//     //   chat
//     //     .save()
//     //     .then(Chat.find({ id: req.body.id }).then((response) => res.json()))
//     //     .catch();
//  }

// )
// }

module.exports = socket;
