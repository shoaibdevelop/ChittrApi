const   chits = require('../controllers/chit.server.controller'),
    auth = require('../lib/middleware');

const BASE_URL = '/api/v0.0.5';

module.exports = function(app){

    app.route(BASE_URL + '/chits')
        .get(chits.get_all)
        .post(auth.isAuthenticated, chits.create);

    app.route(BASE_URL + '/chits/:id/photo')
        .get(chits.get_photo)
        .post(auth.isAuthenticated, chits.attach_photo);
};
