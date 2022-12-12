const express = require('express');
const router = express.Router();
const Chat = require('../model/chats');

router.get('/:id/:to', (req, res) => {
  Chat.find({ userfrom: req.params.id, userto: req.params.to })
    .populate('userfrom')
    .then((msg) => {
      Chat.find({ userto: req.params.id, userfrom: req.params.to })
        .populate('userfrom')
        .then((msg1) => {
          var tobesent = msg.concat(msg1);
          console.log(tobesent);
          tobesent.sort(function(a, b) {
            return b.date - a.date;
          });
          tobesent.reverse()

          res.json(tobesent);
          // { message1: msg, message2: msg1 }
        });
    });
});
router.post('/chat', (req, res) => {
  const chat = new Chat({
    userfrom: req.body.userfrom,
    userto: req.body.userto,
    message: req.body.message,
    type: req.body.type,
  });
  chat
    .save()
    .then(res.json({ message: 'message sent successfully' }))
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
