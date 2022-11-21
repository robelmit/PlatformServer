const jwt = require('jsonwebtoken');
function authorization(req, res, next) {
  const header = req.get('authorization');
  if (header) {
    const token = header.split(' ')[1];
    jwt.verify(token, 'mysecret', (err, user) => {
      if (err) {
        console.log(err);
        next(err);
      }

      req.user = user;
      next();
    });
  } else {
    next();
  }
}
function isLoggedin(req, res, next) {
  if (req.user) {
    next();
  } else {
    const error = new Error('unauthorized');
    next(error);
  }
}

module.exports = {
  authorization,
  isLoggedin,
};
