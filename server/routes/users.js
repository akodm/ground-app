var express = require('express');
var router = express.Router();
let models = require('../models');

const User = models.user;

// ===================== 데이터 베이스 쿼리 ===================== //
// 전체 조회
router.get('/all', async(req, res, next) => {
    let result = null;
    try {
        result = await User.findAll();
    } catch(err) {
        next(err);
    }
    res.send(result);
});

// 한명 조회
router.get('/one', async(req, res) => {
    let result = null;
    try {
        result = await User.findOne({
            where : {
                id : req.query.id
            }
        });
    } catch(err) {
        next(err);
    }
    res.send(result);
});

// 생성
router.post('/create', async(req, res) => {
    let result = null;
    try {
        result = await User.create({
            email : req.body.email,
        });
    } catch(err) {
        next(err);
    }
    res.send(result);
});

// 삭제
router.delete('/delete', async(req, res) => {
    let result = null;
    try {
        result = await User.destroy({
            where : {
                id : req.query.id
            }
        });
    } catch(err) {
        next(err);
    }
    res.send(result);
});

// ====================== 기본 외 추가 쿼리 ====================== //
module.exports = router;