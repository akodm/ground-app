var express = require('express');
var router = express.Router();
const models = require('../models');

const Follow = models.follow;

// const tokenModules = require('../tokenModules');
// const tokenModuleFunction = new tokenModules;

// ========================== DB Query ======================== //

// one user -> user all search
router.get('/all/user', async(req, res, next) => {
    try {
        const result = await Follow.findAll({
            where : {
                user_id : req.query.user_id
            }
        });

        res.send(result);
    } catch(err) {
        next(err);
    }
});

// one user -> target all search
router.get('/all/target', async(req, res, next) => {
    try {
        const result = await Follow.findAll({
            where : {
                target_id : req.query.target_id
            }
        });

        res.send(result);
    } catch(err) {
        next(err);
    }
});

// one search
router.get('/one', async(req, res, next) => {
    try {
        const result = await Follow.findOne({
            where : {
                user_id : req.query.user_id,
                target_id : req.query.target_id
            }
        });

        res.send(result);
    } catch(err) {
        next(err);
    }
});

// create
router.post('/create', async(req, res, next) => {
    try {
        const result = await Follow.create({
            user_info : req.body.user_info,
            target_info : req.body.target_info,
            user_id : req.body.user_id,
            target_id : req.body.target_id,
        });

        res.send(result);
    } catch(err) {
        next(err);
    }
});

// delete
router.delete('/delete', async(req, res, next) => {
    try {
        await Follow.destroy({
            where : {
                id : req.query.id
            }
        });

        res.send(true);
    } catch(err) {
        next(err);
    }
});

module.exports = router;