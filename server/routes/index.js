var express = require('express');
var router = express.Router();
let models = require('../models');
const jwt = require('jsonwebtoken');

let config = require('../server-config');
const User = models.user;

// middleware test
const test = (req, res, next) => {
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
	const user = req.body;
	const payload = {
		id : user.id,
		name : user.name,
  };
  
	const acs_token = tokenGenerator(payload, false);
  const ref_token = tokenGenerator(payload, true);

  if(acs_token && ref_token) {
    try {
      await User.update({
          ref : ref_token.token,
          acs : acs_token.token,
        },
        {
          where : { id : user.id }
        }
      )
    } catch(err) {
      next(err);
    }
		res.send(acs_token);
	} else {
    console.log("token generator err = access token:", acs_token, ", refresh token:", ref_token);
		res.send(false);
	}
});


// access token verify
router.get('/verify/access', async(req, res, next) => {
  try {
    const token = req.headers['authorization'];
    const getToken = await verifyFunc(token, false);

    if(getToken) {
      res.send(getToken);
    } else {
      res.send("expire"); // => refresh token expire
    }
  } catch(err) {
    next(err);
  }
});

// refresh token verify
router.get('/verify/refresh', async(req, res, next) => {
  try {
    const name = req.query.name;
    const id = req.query.id || null;
    const token = req.headers['authorization'];

    let where = { acs : token, name };
    if(id) { where = { id } }

    const user = await User.findOne({
      where
    });

    if(user && user.dataValues && user.dataValues.ref) {
      const ref_token = user.dataValues.ref;
      const ref_result = await verifyFunc(ref_token, true);

      if(!ref_result) { res.send("expire"); return; }

      const acs_token = tokenGenerator(user.dataValues, false);
      await User.update(
        {
          acs : acs_token.token
        },
        {
          where : { id : user.dataValues.id }
        }
      );

      // new access token
      res.send(acs_token);
    } else {
      res.send(false);
    }
  } catch(err) {
    next(err);
  }
});

// token verify function
async function verifyFunc(token, ref) {
  try {
    const tokenKey = ref ? config.refTokenKey : config.tokenKey;
    const getToken = jwt.verify(token, tokenKey);

    return getToken;
  } catch(err) {
    console.log("verify err :", err.message); // => expire case
    return false;
  }
};

// logout - token delete all
router.get('/logout', async(req, res, next) => {
  try {
    await User.update(
      {
        ref : "",
        acs : "",
      }, {
        where : {
          id : req.query.id
        }
      }
    );
    res.send(true);
  } catch(err) {
    next(err);
  }
});

// token generator
function tokenGenerator(data, ref){
  try {
      const salt = saltGenerator(7);
      const tokenKey = ref ? config.refTokenKey : config.tokenKey;
      const expiresIn = ref ? config.refExpire : config.acsExpire;
  
      const getToken = jwt.sign({
        id : data.id,
        name : data.name,
        salt
      },
        tokenKey,
      {
        expiresIn
      });

      if(!getToken) { return false };

      return {
        token : getToken,
        name : data.name,
      };
  } catch(err) {
      console.log("token sign err : " + err);
      return false;
  }
};

// random value generator
function saltGenerator(length) {
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

module.exports = router;
