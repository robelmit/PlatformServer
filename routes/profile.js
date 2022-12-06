const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../model/users');
const path = require('path');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join('D:','app', '/uploads'));
    },
    limits:{
        fileSize:2000000
    },
    filename: function(req, file, cb) {
        console.log(file.originalname)
            // cb(null, file.fieldname + '-' + Date.now());
        cb(null, file.originalname);
    },
});

var upload = multer({ storage: storage }).single('file');
router.get('/', (req, res) => {
    User.find({_id:req.user._id}).then((user)=>{
        res.json(user)
    }).catch(err=>{
        
    })
});
router.post('/profile', (req, res, next) => {
    console.log('a');
    upload(req, res, (err) => {
        if (err) next(err);
        res.status(200).json({
            message: 'image successfully uploaded',
            url: res.req.file.filename,
        });
    });
    // next();
});
router.patch('/profiles', (req, res, next) => {
    const newname = req.body.name;
    const _id = req.body.id;
    console.log(req.headers.id);
    console.log(req.headers.name);
    upload(req, res, (err) => {
        if (err) next(err);
        console.log(req.headers.id)
        var avatar = 'https://localhost:5000/' + res.req.file.filename;
        console.log(avatar)
        User.findOneAndUpdate({ _id: req.headers.id }, {
            $set: {
                useravatar: avatar,
            },
        }).then((user) => {
            User.find({ _id: user._id })
            .then(userpro=>{
                console.log(userpro)
                res.status(200).json(userpro);
            })
        });
    });
});
module.exports = router;