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

const {
    ExpressPeerServer
} = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true,
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


app.use(notFound);
app.use(Errorhandler);
mongoose
    .connect('mongodb://localhost:27017/tyes', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(console.log(`database successfully connected`));
server.listen(port, () => {
    console.log(` app started on a port ${port}`);
});

