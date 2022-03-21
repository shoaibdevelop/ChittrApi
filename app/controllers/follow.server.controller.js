const
    follows = require('../models/follow.server.models'),
    users = require('../models/user.server.models'),
    log = require('../lib/logger')(),
    validator = require('../lib/validator'),
    config = require('../../config/config.js'),
    schema = require('../../config/zedrem-Chittr-0.0.5-swagger.json');


exports.search_users = function(req, res){
    // console.log("searching users...");
    let query = req.query.q;

    if(!query) return res.sendStatus(400);

    follows.user_search(query, function(err, results){
        if(err){
            log.warn(`follow.controller.user_search: ${JSON.stringify(err)}`);
            res.sendStatus(400);
        }else{
            if (!validator.isValidSchema(results, 'components.schemas.ListUsers')) {
                log.warn(`follows.controller.user_search: bad list ${JSON.stringify(results)}`);
                return res.sendStatus(400);
            }else{
                // console.log("Success:", results);
                res.status(200).json(results);
            }
        }
    });
};

exports.follow_user = function(req, res){
    let follow_id = parseInt(req.params.id);
    if (!validator.isValidId(follow_id)) return res.sendStatus(404);

    let token = req.get(config.get('authToken'));
    users.getIdFromToken(token, function(err, _id){

        if(err) res.sendStatus(401);

        follows.follow_user(
            {
                "user_id": _id,
                "follow_id": follow_id
            }, function(err, results){
                if(err){
                    log.warn(`follow.controller.follow_user: ${JSON.stringify(err)}`);
                    res.sendStatus(400);
                }else{
                    console.log("Success:", results);
                    res.sendStatus(200);
                }
            }
        );
    });
};

exports.unfollow_user = function(req, res){
    let follow_id = parseInt(req.params.id);
    if (!validator.isValidId(follow_id)) return res.sendStatus(404);

    let token = req.get(config.get('authToken'));
    users.getIdFromToken(token, function(err, _id){

        if(err) res.sendStatus(401);

        follows.unfollow_user(
            {
                "user_id": _id,
                "follow_id": follow_id
            }, function(err, results){
                if(err){
                    log.warn(`follow.controller.unfollow_user: ${JSON.stringify(err)}`);
                    res.sendStatus(400);
                }else{
                    console.log("Success:", results);
                    res.sendStatus(200);
                }
            }
        );
    });
};

exports.see_followers = function(req, res){
    let id = parseInt(req.params.id);
    if (!validator.isValidId(id)) return res.sendStatus(404);

    follows.get_followers(id, function(err, results){
        if(err){
            log.warn(`follow.controller.see_followers: ${JSON.stringify(err)}`);
            res.sendStatus(400);
        }else{
            if (!validator.isValidSchema(results, 'components.schemas.ListUsers')) {
                log.warn(`follows.controller.see_followers: bad list ${JSON.stringify(results)}`);
                return res.sendStatus(400);
            }else{
                console.log("Success:", results);
                res.status(200).json(results);
            }
        }
    });
};

exports.see_following = function(req, res){
    let id = parseInt(req.params.id);
    if (!validator.isValidId(id)) return res.sendStatus(404);

    follows.get_following(id, function(err, results){
        if(err){
            log.warn(`follow.controller.see_following: ${JSON.stringify(err)}`);
            res.sendStatus(400);
        }else{
            if (!validator.isValidSchema(results, 'components.schemas.ListUsers')) {
                log.warn(`follows.controller.see_following: bad list ${JSON.stringify(results)}`);
                return res.sendStatus(400);
            }else{
                // console.log("Success:", results);
                res.status(200).json(results);
            }
        }
    });
};
