var express = require('express');
var router = express.Router();
let models = require('../models');
let crypto = require('crypto');

// const tokenModules = require('../tokenModules');
// const tokenModuleFunction = new tokenModules;

const config = require('../server-config');

// db setting
const User = models.user;

// ===================== db query ===================== //

// one search
router.get('/one', async(req, res, next) => {
    let result = null;
    try {
        result = await User.findOne({
            where : {
                id : req.query.id
            }
        });

        res.send(result);
    } catch(err) {
        next(err);
    }
});

// one search - attr
router.get('/one/attr', async(req, res, next) => {
    let result = null;
    try {
        result = await User.findOne({
            where : {
                id : req.query.id
            },
            attributes: ['id', 'name', 'gender', 'address', 'open_add']
        });

        res.send(result);
    } catch(err) {
        next(err);
    }
});

// one search - name
router.get('/one/name', async(req, res, next) => {
    let result = null;
    try {
        result = await User.findOne({
            where : {
                name : req.query.name
            }
        });

        res.send(result);
    } catch(err) {
        next(err);
    }
});

// one search - name
router.put('/update', async(req, res, next) => {
    let result = null;
    try {
        result = await User.update({
            gender : req.body.gender,
            address : req.body.address,
            open_add : req.body.open_add,
        }, {
            where : {
                id : req.body.id
            }
        });

        res.send(result);
    } catch(err) {
        next(err);
    }
});

// create
router.post('/create', async(req, res, next) => {
    let pass = await hashFunc(req.body.pass);
    let result = null;
    try {
        result = await User.create({
            name : req.body.name,
            pass,
            open_add : false,
        });

        res.send(result);
    } catch(err) {
        next(err);
    }
});

// delete
router.delete('/delete', async(req, res, next) => {
    let result = null;
    try {
        result = await User.destroy({
            where : {
                id : req.query.id
            }
        });

        res.send(result);
    } catch(err) {
        next(err);
    }
});

// ====================== etc query ====================== //

// crypto modules - password hash
async function hashFunc(pass) {
    let hash = null;
    try {
        hash = await crypto.createHmac(config.sha, config.secretKey).update(pass).digest(config.base); 
    } catch(err) {
        console.log("크립토 모듈 에러 :" + err);
        return null;
    }
    return hash;
}

// login search
router.get('/one/login', async(req, res, next) => {
    let pass = await hashFunc(req.query.pass);
    let result = null;
    try {
        result = await User.findOne({
            where : {
                name : req.query.name,
                pass,
            }
        });

        res.send(result);
    } catch(err) {
        next(err);
    }
});

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

module.exports = router;