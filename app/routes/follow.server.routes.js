const   follows = require('../controllers/follow.server.controller'),
        auth = require('../lib/middleware');

const BASE_URL = '/api/v0.0.5';

module.exports = function(app){

    app.route(BASE_URL + '/search_user')
        .get(follows.search_users);

    app.route(BASE_URL + '/user/:id/follow')
        .post(auth.isAuthenticated, follows.follow_user)
        .delete(auth.isAuthenticated, follows.unfollow_user);

    app.route(BASE_URL + '/user/:id/followers')
        .get(follows.see_followers);

    app.route(BASE_URL + '/user/:id/following')
        .get(follows.see_following);

};
