var express = require('express');
var router = express.Router();
let models = require('../models');
let crypto = require('crypto');

const config = require('../server-config');

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

// 한명 조회
router.get('/one/name', async(req, res) => {
    let result = null;
    try {
        result = await User.findOne({
            where : {
                name : req.query.name
            }
        });
    } catch(err) {
        next(err);
    }
    res.send(result);
});

// 생성
router.post('/create', async(req, res) => {
    let pass = await hashFunc(req.body.pass);
    let result = null;
    try {
        result = await User.create({
            name : req.body.name,
            pass,
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

// 크립토 모듈을 이용한 해싱 암호화 함수
async function hashFunc(pass) {
    let hash = null;
    try {
        hash = await crypto.createHmac(config.sha, config.secretKey).update(pass).digest(config.base); 
    } catch(err) {
        console.log(__filename + " 에서 크립토 모듈 에러 : " + err);
    }
    return hash;
}

// 로그인 조회
router.get('/one/login', async(req, res) => {
    let pass = await hashFunc(req.query.pass);
    let result = null;
    try {
        result = await User.findOne({
            where : {
                name : req.query.name,
                pass,
            }
        });
    } catch(err) {
        next(err);
    }
    res.send(result);
});

module.exports = router;