const express = require('express');
const joi = require('joi');
const User = require('../model/users');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/me', (req, res) => {
    console.log(req.params)
    User.find().then((users) => res.json(users));
});
router.get('/users', (req, res) => {
    User.find().then((users) => res.json(users));
});
router.post('/signup', (req, res, next) => {
    const schema = joi.object().keys({
        name: joi
            .string()
            .alphanum()
            .min(5)
            .max(20)
            .required(),
        password: joi
            .string()
            .min(6)
            .required(),
        username: joi
            .string()
            .alphanum()
            .min(5)
            .max(20)
            .required(),
    });
    console.log('nice');
    User.findOne({ name: req.body.name }).then((user) => {
        if (user) {
            const err = new Error('the same user alreay exists');
            next(err);
        } else {
            const result = joi.validate(req.body, schema);
            if (result.error === null) res.json(result);
            else {
                bcryptjs
                    .hash(req.body.password, 12)
                    .then((hashed) => {
                        const user = new User({
                            name: req.body.name,
                            password: hashed,
                            useravatar:req.body.useravatar
                        });

                        user.save((err, user) => {
                            if (err) res.json('error saving to db');
                            else
                                res.json({ error: false, message: 'successfully signed up' });
                        });
                    })
                    .catch((err) => {
                        res.json(err);
                    });
            }
        }
    });
});

router.post('/login', (req, res, next) => {
    const schema = joi.object().keys({
        name: joi.string().alphanum().min(5).max(20).required(),
        password: joi.string().min(6).required(),
    });
    const result = joi.validate(req.body, schema);

    User.findOne({ name: req.body.name }).then((user) => {
        if (user) {
            bcryptjs.compare(req.body.password, user.password).then((result) => {
                if (result) {
                    const payload = {
                        name: user.name,
                        password: user.password,
                        useravatar: user.useravatar,
                        _id: user._id,
                    };
                    jwt.sign(payload, 'mysecret', { expiresIn: '1y' }, (err, token) => {
                        if (err) console.log('error');
                        else {
                            res.json({ token });
                        }
                    });
                } else {
                    const error = new Error('your crdential is incorrect');
                    next(error);
                }
            });
        } else {
            const error = new Error('your crdential is incorrect');
            next(error);
        }
    });
});

module.exports = router;