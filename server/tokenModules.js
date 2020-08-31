let models = require('./models');
const jwt = require('jsonwebtoken');

const config = require('./server-config');
const User = models.user;

function tokenModules() {
    // login = first access / refresh token sign
    this.sign = async function(req) {
        const user = req.body;
        const payload = {
            id : user.id,
            name : user.name,
        };
    
        const acs_token = this.tokenGenerator(payload, false);
        const ref_token = this.tokenGenerator(payload, true);

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
                return { 
                    data : "err",
                    err
                };
            }
            return { data : acs_token };
        } else {
            console.log("token generator err = access token:", acs_token, ", refresh token:", ref_token);
            return { data : false }
        }
    };

    // access token verify
    this.verifyAccess = async function(req) {
        try {
            const token = req.headers['authorization'];
            const getToken = await this.verifyFunc(token, false);
        
            if(getToken) {
                return { data : getToken };
            } else {
                return { data : "expire" }; // => refresh token expire
            }
        } catch(err) {
            return {
                data : "err",
                err
            };
        }
    };

    // refresh token verify
    this.verifyRefresh = async function(req) {
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
                const ref_result = await this.verifyFunc(ref_token, true);
        
                if(!ref_result) { return { data : "expire" }; }
            
                const acs_token = this.tokenGenerator(user.dataValues, false);
                await User.update(
                    {
                        acs : acs_token.token
                    },
                    {
                        where : { id : user.dataValues.id }
                    }
                );
                // new access token
                return { data : acs_token };
            } else {
                return { data : false }
            }
        } catch(err) {
            return { 
                data : "err",
                err
            }
        }
    };

    // token verify function
    this.verifyFunc = async function(token, ref) {
        try {
            const tokenKey = ref ? config.refTokenKey : config.tokenKey;
            const getToken = jwt.verify(token, tokenKey);
        
            return getToken;
        } catch(err) {
            console.log("verify err :", err.message); // => expire case
            return false;
        }
    };

    // token generator
    this.tokenGenerator = function(data, ref){
        try {
            const salt = this.saltGenerator(7);
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
    this.saltGenerator = function(length) {
        let result           = '';
        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };
};

module.exports = tokenModules;