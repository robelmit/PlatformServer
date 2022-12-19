const express = require('express');
const morgan = require('morgan');
const app = express();

const mongoose = require('mongoose');
const joi = require('joi');
const auth = require('./routes/user');
const cors = require('cors');
app.use(cors());
const {
    authorization,
    isLoggedin
} = require('./middleware/auth');
const profile = require('./routes/profile');
const port = process.env.PORT || 5000;
const path = require('path');
const fs = require('fs');
// const options = { 
//     key:fs.readFileSync(path.join(__dirname,'key.pem')),
//      cert:fs.readFileSync(path.join(__dirname,'cert.pem')) 
//     }
const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert'),
};


const server = require('https').createServer(options,app);
const server1 = require('http').createServer(app);
const io = require('socket.io')(server);
const chat = require('./routes/chat');
const post = require('./routes/post');
const notification = require('./routes/notification');
// const socket = require('./socket');

const Chat = require('./model/chats');
const User = require('./model/users');
const Post = require('./model/post');
const Notification = require('./model/notification');
const {
    ExpressPeerServer
} = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true,
});


io.on('connection', (socket) => {
    socket.emit('msg', 'welcome to our app'),
        socket.on('join-room', (roomId, userId) => {
            socket.join(roomId); // Join the room
            socket.broadcast.emit('user-connected', userId); // Tell everyone else in the room that we joine
            console.log('a user connected');
            socket.on('disconnect',()=>{
                socket.to(roomId).broadcast.emit('user-disconnected',userId)
            })
        });
        socket.on('videocalling', (msg) => {
            io.emit('video',msg)
        }
        )
        socket.on('audiocalling', (msg) => {
            io.emit('audio',msg)
        }
        )

    // });
    socket.on('inputmsg', (msg) => {
        var d = new Date();
        var n = d.getTime();  
        const mamsg = {
            userfrom:msg.userfrom,
            userto:msg.userto,
            message:msg.message,
            type:msg.type,
            date:n
        }
         console.log(mamsg)

        const chat = new Chat(mamsg);

        chat
            .save()
            .then(() => {
                User.find({
                    _id: msg.userfrom
                }).then((user) => {
                    msg.userfrom = user[0];
                    console.log('are u there');
                    return io.emit('outputmsg', msg);
                });
            })
            .catch(() => {});
    });
    socket.on('post', (userpost) => {
        User.find({
            _id: userpost.userid
        }).then((data) => {
            userpost.userid = data[0];

            const post = new Post(userpost);

            post
                .save()
                .then((doc) => {
                    console.log('are u there');
                    return io.emit('changepost', doc);
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    });
    socket.on('comment', (comm) => {
        Post.findOneAndUpdate({
                _id: comm.postid
            },

            {
                $push: {
                    comments: [{
                        username: comm.name,
                        comment: comm.comment,
                        useravatar: comm.avatar,
                    }, ],
                },
            }, {
                new: true
            }
        ).then(() => {
            console.log('this is  a comment');
            // res.json(post);
        });
    });
    socket.on('like', (like) => {
        Post.findOneAndUpdate({
                _id: like.postid
            },

            {
                $push: {
                    likes: [{
                        like: like.userid
                    }],
                },
            }, {
                new: true
            }
        ).then(() => {
            console.log('this is  a like');
        });
    });
    socket.on('dislike', (like) => {
        Post.findOneAndUpdate({
                    _id: like.postid
                },

                {
                    $pop: {
                        likes: [{
                            like: like.userid
                        }],
                    },
                }, {
                    new: true
                }
            )
            .then(() => {
                console.log('this is  dislike');
            })
            .catch((err) => {
                console.log('error dislike ' + err);
            });
    });
    socket.on('notificaton', (not) => {
        const no = new Notification(not);
        no.save()
            .then(console.log('success'))
            .catch((err) => {
                console.log(err);
            });
    });
});

app.use(morgan('dev'));
app.use(express.json());
app.use('/auth', auth);
app.use(authorization);
app.use('/api', profile);
app.use('/chat', chat);
app.use('/post', post);
app.use('/notification', notification);

app.use(express.static(path.join('D:','app', 'uploads')));
app.use('/peerjs', peerServer);

app.get('/',auth, (req, res) => {
     if(req.user){
     User.find({_id:req.user._id}).then(user=>{
         res.json(user[0]);
     }).catch(err=>{
         res.json(err)
     })
    }
    else res.json({message:'welcome to our communication app'})
 //   res.json(req.user)
});
app.get('/me', (req, res) => {
    res.json({
        message: "welcome to our app"
    });
});

function notFound(req, res, next) {
    const error = new Error(`there is an error +${req.OrginalUrl}`);
    next(error);
}

function Errorhandler(error, req, res, next) {
    res.status(400);
    res.json({
        error: error.message,
        stack: error.stack,
    });
    console.log(error.message, ' and ', error.stack);
}


//app.use(notFound);
//app.use(Errorhandler);
mongoose
    .connect('mongodb://localhost:27017/tyes', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(console.log(`database successfully connected`));
server.listen(port, () => {
    console.log(` app started on a port ${port}`);
});

// TODO: Creating user name update
// FIXME: profile pic upload and make it there