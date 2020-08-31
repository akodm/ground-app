var express = require('express');
var router = express.Router();

const tokenModules = require('../tokenModules');
const tokenModuleFunction = new tokenModules;

// middleware test
const test = async(req, res, next) => {
  console.log("first function");
  next();
}

// first server page
router.get('/',test, function(req, res, next) {
  console.log("scond function");

  const test = false;
  if(test) {
    next();
  } else {
    res.send("test is false");
  }
}, function(req, res, next) {
  console.log("third function");
  res.json({
    message : "Hello Server",
    status : 200
  });
});

// login = first access / refresh token sign
router.post("/sign" , async(req,res, next) => {
  const result = await tokenModuleFunction.sign(req);
  
  if(result.data === "err") { next(result.err); return; }
  if(!result.data) { res.send(result.data); return; }

  res.send(result.data);
});

// access token verify
router.get('/verify/access', async(req, res, next) => {
  const result = await tokenModuleFunction.verifyAccess(req);

  if(result.data === "expire") { res.send(result.data); return; }
  if(result.data === "err") { next(result.err); return; } 

  res.send(result.data);
});

// refresh token verify
router.get('/verify/refresh', async(req, res, next) => {
  const result = await tokenModuleFunction.verifyRefresh(req);

  if(result.data === "expire") { res.send(result.data); return; }
  if(result.data === "err") { next(result.err); return; }
  if(!result.data) { res.send(false); return; }

  res.send(result.data);
});

module.exports = router;