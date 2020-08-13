var express = require('express');
var router = express.Router();

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

module.exports = router;
