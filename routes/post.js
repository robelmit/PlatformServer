const express = require('express');
const router = express.Router();
const Post =  require('../model/post');

router.get('/posts', (req, res) => {
  Post.find()
  .populate('userid')
  .then(data =>{
      res.json(data)
  })
});
router.post('/chat', (req, res) => {
  const post = new Post({
    userid: req.body.userid,
    post: req.body.post,
    date: req.body.date,
    type: req.body.type,
  });
  chat
    .save()
    .then(res.json({ message: 'post sent successfully' }))
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
