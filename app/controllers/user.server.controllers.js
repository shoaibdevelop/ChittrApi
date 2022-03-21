const users = require('../models/user.server.models'),
    log = require('../lib/logger')(),
    validator = require('../lib/validator'),
    config = require('../../config/config.js'),
    schema = require('../../config/zedrem-Chittr-0.0.5-swagger.json'),
    emailvalidator = require("email-validator"),
    fs = require('fs'),
    path = require('path'),
    app_dir = path.dirname(require.main.filename);

exports.create = function(req, res){
    if (!validator.isValidSchema(req.body, 'components.schemas.PostUser')) {
        log.warn(`users.controller.create: bad user ${JSON.stringify(req.body)}`);
        //log.warn(validator.getLastErrors());
        return res.sendStatus(400);
    } else {
        let user = Object.assign({}, req.body);

        if(!emailvalidator.validate(user['email']) || user['password'].length == 0){
            log.warn(`user.controller.create: failed validation ${JSON.stringify(user)}`);
            res.status(400).send('Malformed request');
        }else{
            users.insert(user, function(err, id){
                if (err)
                {
                    log.warn(`user.controller.create: couldn't create ${JSON.stringify(user)}: ${err}`);
                    return res.sendStatus(400); // duplicate record
                }
                res.status(201).send({id:id});
            });
        }
    }
};

exports.login = function(req, res){
    if(!validator.isValidSchema(req.body, 'components.schemas.LoginUser')){
        console.log(err);
        console.log(req.body);
        log.warn(`users.controller.login: bad request ${JSON.stringify(req.body)}`);
        res.sendStatus(400);
    } else{
        let email = req.body.email;
        let password = req.body.password;

        users.authenticate(email, password, function(err, id){
            //console.log(err, id);
            if(err){
                log.warn("Here: " + err);
                res.status(400).send('Invalid email/password supplied');
            } else {
                users.getToken(id, function(err, token){
                    /// return existing token if already set (don't modify tokens)
                    if (token){
                        return res.send({id: id, token: token});
                    } else {
                        // but if not, complete login by creating a token for the user
                        users.setToken(id, function(err, token){
                            res.send({id: id, token: token});
                        });
                    }
                });
            }
        });
    }
};

exports.logout = function(req, res){
    let token = req.get(config.get('authToken'));
    users.removeToken(token, function(err){
        if (err){
            return res.sendStatus(401);
        }else{
            return res.sendStatus(200);
        }
    });
    return null;
};

exports.get_one = function(req, res){
    let id = parseInt(req.params.id);
    if (!validator.isValidId(id)) return res.sendStatus(404);

    users.getOne(id, function(err, results){
        if (err) {
            log.warn(`users.controller.get_one: ${JSON.stringify(err)}`);
            return res.sendStatus(500);
        } else if (!results) {  // no user found
            console.log("Returned no results");
            return res.sendStatus(404);
        }else{
            res.status(200).json(results);
        }
    })
};


exports.update = function(req, res){
    let id = parseInt(req.params.id);
    if (!validator.isValidId(id)) return res.sendStatus(404);

    let token = req.get(config.get('authToken'));
    users.getIdFromToken(token, function(err, _id){
        if (_id !== id)
            return res.sendStatus(403);
        if (!validator.isValidSchema(req.body, 'components.schemas.User')) {
            log.warn(`users.controller.update: bad user ${JSON.stringify(req.body)}`);
            return res.sendStatus(400);
        }

        users.getOne(id, function(err, results){
            if(err) return res.sendStatus(500);
            if (!results) return res.sendStatus(404);  // no user found

            // console.log(results);
            // console.log(req.body);

            let givenname = '';
            let familyname = '';
            let email = '';
            let password = '';

            if(req.body.hasOwnProperty('given_name')){
                givenname = req.body.given_name;
            }else{
                givenname = results.given_name;
            }

            if(req.body.hasOwnProperty('family_name')){
                familyname = req.body.family_name;
            }else{
                familyname = results.family_name;
            }

            if(req.body.hasOwnProperty('email')){
                email = req.body.email;
            }else{
                email = results.email;
            }

            if(req.body.hasOwnProperty('password')) {
                password = req.body.password;
            }

            if(!emailvalidator.validate(email)){
                res.status(400).send('Invalid email supplied');
            }else{

                let user = {};

                if(password != ''){
                    user = {
                        "given_name": givenname,
                        "family_name": familyname,
                        "email": email,
                        "password": password
                    }
                }else{
                    user = {
                        "given_name": givenname,
                        "family_name": familyname,
                        "email": email
                    }
                }
                console.log(user);
                users.alter(id, user, function(err){
                    if (err)
                        return res.sendStatus(500);
                    return res.sendStatus(201);
                });
            }
        });
    })

};

exports.get_photo = function(req, res){
    let user_id = parseInt(req.params.id);
    if (!validator.isValidId(user_id)) return res.sendStatus(404);

    // Check file exists
    let check_path_jpeg = app_dir + "/photo_repo/user" + user_id + ".jpeg"
    let check_path_png = app_dir + "/photo_repo/user" + user_id + ".png"

    let default_path = app_dir + "/photo_repo/default.png"

    fs.stat(check_path_jpeg, function(err, stat){
        if(err){
            fs.stat(check_path_png, function(err, stat){
                if(err){
                    // Not found JPEG or PNG
                    fs.stat(default_path, function(err, stat){
                        if (err){
                            // There is a problem
                            res.sendStatus(500);
                        }else{
                            // Send the default
                            res.set("Content-Type", 'image/png');
                            res.status(200);
                            res.sendFile(default_path);
                        }
                    });
                }else{
                    // Its found a png
                    res.set("Content-Type", 'image/png');
                    res.status(200);
                    res.sendFile(check_path_png);
                }
            });
        }else{
            // Its found a JPEG
            res.set("Content-Type", 'image/jpeg');

            res.sendFile(check_path_jpeg);
        }
    });
};

exports.update_photo = function(req, res){
    console.log("update photo...");
    let token = req.get(config.get('authToken'));

    if(!token) return res.sendStatus(401);

    users.getIdFromToken(token, function(err, _id){

        if(err) return res.sendStatus(400);

        let content_type = req.get('Content-Type');

        console.log('Content-Type=', content_type);
        if (!content_type){console.log(req)};

        console.log("HERE", content_type);

        let file_ext = "jpeg";
        // if(content_type === 'image/png'){
        //     file_ext = "png";
        // }else if(content_type === 'image/jpeg' || content_type === 'image/jpg'){
        //     file_ext = "jpeg";
        // }
        // if (file_ext === '') {
        //     console.log('file_ext is empty')
        //     file_ext = "jpeg";
        // };
        console.log('add_photo:', _id, file_ext,);
        req.pipe(fs.createWriteStream('./photo_repo/user' + _id + '.' + file_ext));

        res.sendStatus(201);

    });
};
