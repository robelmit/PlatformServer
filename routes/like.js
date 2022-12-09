const express = require('express');
const router = express.Router();
const Note = require('../db/notes');
router.get('/likes', (req, res, next) => {
  Note.find().then((data) => {
    res.json(data);
    next();
  });
});
router.post('/like', (req, res, next) => {
  Note.findOneAndUpdate(
    { _id: req.body.postid },

    {
      $push: {
        likes: [{ like: req.body.userid }],
      },
    },
    { new: true }
  ).then((post) => {
    console.log('successfull');
    res.json(post);
  });
});
router.post('/dislike', (req, res, next) => {
  const rb =Number( req.body.userid)
  Note.findOneAndUpdate(
    { _id: req.body.postid },

    {
      $pop: {
        likes: [{ like: rb }],
      },
    },
    { new: true }
  ).then((post) => {
    console.log('successfull');
    res.json(post);
  });
});
router.get('/:id/likes', (req, res, next) => {
  Note.find({ userid: req.params.id })
    .then((result) => {
      res.json(result);
      next();
    })
    .catch((err) => {
      next(err);
    });
});
module.exports = router;
