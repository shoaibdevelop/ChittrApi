const   users = require('../controllers/user.server.controllers'),
        auth = require('../lib/middleware');

const BASE_URL = '/api/v0.0.5';

module.exports = function(app){

    app.route(BASE_URL + '/user')
        .post(users.create);

    app.route(BASE_URL + '/login')
        .post(users.login);

    app.route(BASE_URL + '/logout')
        .post(auth.isAuthenticated, users.logout);

    app.route(BASE_URL + '/user/:id')
        .get(users.get_one)
        .patch(auth.isAuthenticated, users.update);

    app.route(BASE_URL + '/user/:id/photo')
        .get(users.get_photo);

    app.route(BASE_URL + '/user/photo')
        .post(auth.isAuthenticated, users.update_photo);
};
