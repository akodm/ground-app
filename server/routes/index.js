var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

let config = require('../server-config');

// first server page
router.get('/', function(req, res, next) {
  res.json({
    message : "Hello Server",
    status : 200
  });
});

// ping test
router.get('/ping', function(req, res, next) {
  res.send("pong");
});

router.get('/verify', (req, res, next)=>{
  try {
      const token = req.headers['Authorization'] || req.query.token;
      const getToken = jwt.verify(token, config.tokenKey);
      res.send(getToken);
  } catch(err) {
    next(err);
  }
});

function getToken(data){
  try {
      const getToken = jwt.sign({
        id : data.id
      },
        config.tokenKey,
      {
        expiresIn : '2400m'
      });
      return getToken;
  } catch(err) {
      console.log("token sign err : " + err);
  }
}

module.exports = router;
