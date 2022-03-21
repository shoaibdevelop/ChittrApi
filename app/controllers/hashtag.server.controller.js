const hashtags = require('../models/hashtag.server.models'),
    log = require('../lib/logger')(),
    validator = require('../lib/validator'),
    config = require('../../config/config.js'),
    schema = require('../../config/zedrem-Chittr-0.0.5-swagger.json');


exports.search_hashtags = function(req, res){
    res.status(200).send('Awaiting functionality');
};

exports.view_hashtag = function(req, res){
    res.status(200).send('Awaiting functionality');
};

exports.follow_hashtag = function(req, res){
    res.status(200).send('Awaiting functionality');
};

exports.unfollow_hashtag = function(req, res){
    res.status(200).send('Awaiting functionality');
};
