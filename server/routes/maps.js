var express = require('express');
var router = express.Router();
const axios = require('axios');
const models = require('../models');

const Map = models.map;

// const tokenModules = require('../tokenModules');
// const tokenModuleFunction = new tokenModules;

const config = require('../server-config');

// all search - name
router.get('/place', async(req, res, next) => {
    const textQuery = req.query;

    try {
        const mapResult = await Map.findOne({
            where : {
                title : textQuery.title,
                lat : textQuery.lat,
                lng : textQuery.lng
            }
        });
        console.log(mapResult)
        if(mapResult && mapResult.dataValues && mapResult.dataValues.url) {
            res.send({
                url : mapResult.dataValues.url
            });
            return;
        }
    } catch(err) {
        next(err);
        return;
    }

    const space = encodeURIComponent(textQuery.title);
    let result = null;
    try {
        result = await axios.get(`
            https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${space}&inputtype=textquery&field=null&locationbias=circle:100@${textQuery.lat},${textQuery.lng}&key=${config.googleKey}
        `);

        res.send(result.data);
    } catch(err) {
        next(err);
    }
});

router.get('/place/detail', async(req, res, next) => {
    const place_id = req.query.place_id;
    let result = null;
    try {
        result = await axios.get(`
            https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=url&key=${config.googleKey}
        `);

        // 여기에 url 을 찾았을 경우 디비에 추가시키도록 코딩함
        res.send(result.data);
    } catch(err) {
        next(err);
    }
});
module.exports = router;