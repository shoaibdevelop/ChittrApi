const db = require('../../config/db');

/**
 * Search for a user
 * @param q
 * @param done
 */
const user_search = function(q, done){
    db.get_pool().query(
        "SELECT u.user_id, u.user_givenname AS given_name, u.user_familyname AS family_name, u.user_email AS email FROM chittr_user u WHERE u.user_givenname LIKE '%" + q + "%' OR u.user_familyname LIKE '%" + q + "%' OR u.user_email LIKE '%" + q + "%'",
        function(err, results){
            if(err){
                return done(err, false);
            }else{
                return done(false, results);
            }
        }
    );
};


/**
 * follow_user
 */
const follow_user = function(params, done){

    let values = [[params.user_id, params.follow_id]];

    db.get_pool().query(
        'INSERT INTO chittr_user_following (user_id, following_id) VALUES (?)',
        values,
        function(err, results){
            if (err) return done(err, false);

            return done(err, results)
        }
    );
};


/**
 * unfollow_user
 */
const unfollow_user = function(params, done){

    db.get_pool().query(
        'DELETE FROM chittr_user_following WHERE user_id=' + params.user_id + ' AND following_id=' + params.follow_id,
        function(err, results){
            if (err) return done(err, false);

            return done(err, results)
        }
    );
};

const get_followers = function(id, done){
    db.get_pool().query(
        'SELECT u.user_id, u.user_givenname AS given_name, u.user_familyname AS family_name, u.user_email AS email FROM chittr_user u, chittr_user_following f WHERE u.user_id = f.user_id AND f.following_id = ?',
        [id],
        function(err, results){
            if(err){
                return done(err, false);
            }else{
                return done(false, results);
            }
        }
    );
};

const get_following = function(id, done){
    db.get_pool().query(
        'SELECT u.user_id, u.user_givenname AS given_name, u.user_familyname AS family_name, u.user_email AS email FROM chittr_user u, chittr_user_following f WHERE u.user_id = f.following_id AND f.user_id = ?',
        [id],
        function(err, results){
            if(err){
                return done(err, false);
            }else{
                return done(false, results);
            }
        }
    );
};

module.exports = {
    user_search: user_search,
    follow_user: follow_user,
    unfollow_user: unfollow_user,
    get_followers: get_followers,
    get_following: get_following
};
