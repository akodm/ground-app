var express = require('express');
var router = express.Router();
let models = require('../models');

// const tokenModules = require('../tokenModules');
// const tokenModuleFunction = new tokenModules;

// db setting
const Space = models.space;

// ===================== db query ===================== //
// all search
router.get('/all', async(req, res, next) => {
    let result = null;
    try {
        result = await Space.findAll();
        res.send(result);
    } catch(err) {
        next(err);
    }
});

// all search - name
router.get('/one/title', async(req, res) => {
    let result = null;
    try {
        result = await Space.findAll({
            where : {
                title : req.query.title
            }
        });
        res.send(result);
    } catch(err) {
        next(err);
    }
});

// one search
router.get('/one', async(req, res) => {
    let result = null;
    try {
        result = await Space.findOne({
            where : {
                id : req.query.id
            }
        });
        res.send(result);
    } catch(err) {
        next(err);
    }
});

// one search - position
router.get('/one/position', async(req, res) => {
    let result = null;
    try {
        result = await Space.findOne({
            where : {
                lat : req.query.lat,
                lng : req.query.lng
            }
        });
        res.send(result);
    } catch(err) {
        next(err);
    }
});

// create
router.post('/create', async(req, res) => {
    let result = null;
    try {
        result = await Space.create({
            title : req.body.title,
            content : req.body.content,
            lat : req.body.lat,
            lng : req.body.lng,
        });
        res.send(result);
    } catch(err) {
        next(err);
    }
});

// update
router.put('/update', async(req, res) => {
    let result = null;
    try {
        result = await Space.update({
                title : req.body.title,
                content : req.body.content,
            }, {
                where : {
                    id : req.body.id
                }
            }
        );
        res.send(result);
    } catch(err) {
        next(err);
    }
});

// delete
router.delete('/delete', async(req, res) => {
    let result = null;
    try {
        result = await Space.destroy({
            where : {
                id : req.query.id
            }
        });
        res.send(result);
    } catch(err) {
        next(err);
    }
});

module.exports = router;