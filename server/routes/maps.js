var express = require('express');
var router = express.Router();
const axios = require('axios');
const models = require('../models');

const Map = models.map;
const User = models.user;

// const tokenModules = require('../tokenModules');
// const tokenModuleFunction = new tokenModules;

const config = require('../server-config');

// ========================== DB Query ======================== //

// all search
router.get('/all', async(req, res, next) => {
    let result = null;
    try {
        result = await Map.findAll();

        res.send(result);
    } catch(err) {
        next(err);
    }
});

// one user -> all search
router.get('/all/user', async(req, res, next) => {
    let result = null;
    try {
        result = await Map.findAll({
            where : {
                user_id : req.query.user_id
            }
        });

        res.send(result);
    } catch(err) {
        next(err);
    }
});

router.get('/all/category', async(req, res, next) => {
    try {
        const result = await Map.findAll({
            where : {
                cate : req.query.cate
            }
        });

        res.send(result);
    } catch(err) {
        next(err);
    }
});

router.get('/all/category/init', async(req, res, next) => {
    try {
        const result = await Map.count({
            group: ["cate"],
        });

        res.send(result);
    } catch(err) {
        next(err);
    }
});

// create
router.post('/create', async(req, res, next) => {
    let result = null;
    try {
        result = await Map.findOrCreate({
            where : {
                title : req.body.title,
                content : req.body.content,
                lat : req.body.lat,
                lng : req.body.lng,
            },
            defaults : {
                title : req.body.title,
                content : req.body.content,
                cate : req.body.cate,
                lat : req.body.lat,
                lng : req.body.lng,
                user_id : req.body.user_id,
                star_num : 0
            }
        });

        res.send({
            data : result[0],
            result : result[1]
        });
    } catch(err) {
        next(err);
    }
});

// delete place
router.delete('/delete', async(req, res, next) => {
    try {
        await Map.destroy({
            where : {
                id : req.query.id
            }
        });

        res.send(true);
    } catch(err) {
        next(err);
    }
});

// star 1 plus
router.get("/decrement", async(req, res, next) => {
    try {
		await Map.decrement('star_num', { where : {
			id : req.query.id
        }});
        
        res.send(true);
    } catch(err) {
        next(err);
    }
});

// star 1 minus
router.get("/increment", async(req, res, next) => {
    try {
		await Map.increment('star_num', { where : {
			id : req.query.id
        }});
        
        res.send(true);
    } catch(err) {
        next(err);
    }
});

// ========================== DB Query ======================== //
/**
 *  place api => place_id search
 *  url exist => url send
 *  url not exist => detail api axios
 */
router.get('/place', async(req, res, next) => {
    const textQuery = req.query;

    try {
        const mapResult = await Map.findOne({
            where : {
                title : textQuery.title,
                cate : textQuery.cate,
                lat : textQuery.lat,
                lng : textQuery.lng
            }
        });

        if(mapResult && mapResult.dataValues && mapResult.dataValues.url) {
            if(/https/.test(mapResult.dataValues.url)) {
                res.send({
                    url : mapResult.dataValues.url
                });
                return;
            }
        }
    } catch(err) {
        next(err);
        return;
    }

    const space = encodeURIComponent(textQuery.title);
    let result = null;
    try {
        result = await axios.get(`
            https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${space}&inputtype=textquery&field=null&locationbias=circle:50@${textQuery.lat},${textQuery.lng}&key=${config.googleKey}
        `);

        res.send(result.data);
    } catch(err) {
        next(err);
    }
});

/**
 *  place detail api => place url search
 *  map db update url & place_id
 *  send url
 */
router.get('/place/detail', async(req, res, next) => {
    const place_id = req.query.place_id;
    let result = null;
    try {
        result = await axios.get(`
            https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=url&key=${config.googleKey}
        `);

        if(result.data && result.data.result.url) {
            Map.update(
                {
                    place_id,
                    url : result.data.result.url,
                },
                {
                    where : {
                        title : req.query.title,
                        cate : req.query.cate,
                        lat : req.query.lat,
                        lng : req.query.lng,
                    }
                }
            );

            res.send(result.data);
            return;
        } else {
            res.send(false);
            return;
        }
    } catch(err) {
        next(err);
    }
});

/**
 *  place find api
 *  input query -> search
 *  send lat, lng with place name
 */
router.get('/place/find', async(req, res, next) => {
    const textQuery = req.query;

    const space = encodeURIComponent(textQuery.title);
    let result = null;
    try {
        result = await axios.get(`
            https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${textQuery.lat},${textQuery.lng}&radius=1000&keyword=${space}&language=ko&key=${config.googleKey}
        `);

        res.send(result.data);
    } catch(err) {
        next(err);
    }
});

module.exports = router;