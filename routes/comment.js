const express = require('express');
const router = express.Router();
const Post = require('../model/post');
router.get('/comments', (req, res, next) => {
  Post.find().then((comment) => {
    res.json(comment);
  });
});
router.post('/comment', (req, res, next) => {
  Post.findOneAndUpdate(
    { _id: req.body.postid },

    {
      $push: {
        comments: [{ username: req.body.name, comment: req.body.comment }],
      },
    },
    { new: true }
  ).then((post) => {
    console.log('this is  a post');
    res.json(post);
  });

  //  const note = new Note({

  //  });

  // comment
  //   .save()
  //   .then((response) => {
  //     res.json({ message: 'successfully saved to db' });
  //     next();
  //   })
  //   .catch((err) => {
  //     next(err);
  //   });
});
router.get('/:id/comment', (req, res, next) => {
  Post.find({ userid: req.params.id })
    .then((result) => {
      res.json(result);
      next();
    })
    .catch((err) => {
      next(err);
    });
});
module.exports = router;
