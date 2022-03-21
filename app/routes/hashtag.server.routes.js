const   hashtags = require('../controllers/hashtag.server.controller'),
    auth = require('../lib/middleware');

const BASE_URL = '/api/v0.0.5';

module.exports = function(app){

    app.route(BASE_URL + '/chits/hashtagsearch')
        .post(hashtags.search_hashtags);

    app.route(BASE_URL + '/chits/:hashtag')
        .get(hashtags.view_hashtag);

    app.route(BASE_URL + '/chits/:hashtag/follow')
        .post(auth.isAuthenticated, hashtags.follow_hashtag);

    app.route(BASE_URL + '/chits/:hashtag/unfollow')
        .post(auth.isAuthenticated, hashtags.unfollow_hashtag);
};
