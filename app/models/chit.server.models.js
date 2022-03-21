const db = require('../../config/db');


/**
 * insert chit
 */
const insert = function(chit, done){

    //let timestamp = new Date(parseInt(chit.timestamp));
    let timestamp = new Date();

    let values = [[timestamp, chit.chit_content, chit.user_id]];

    db.get_pool().query(
        'INSERT INTO chittr_chit (chit_timestamp, chit_content, chit_userid) VALUES (?)',
        values,
        function(err, results){
            if (err) return done(err);

            if(chit.hasOwnProperty('location')){
                let location = chit.location;

                if(location.hasOwnProperty('longitude') && location.hasOwnProperty('latitude')){

                    let chit_id = results.insertId;
                    let values = [[chit_id, chit.location.latitude, chit.location.longitude]];

                    db.get_pool().query(
                        'INSERT INTO chittr_chit_location (chit_id, latitude, longitude) VALUES (?)',
                        values,
                        function(err, location_results){
                            if (err) return done(err);

                            return done(err, results.insertId);

                        }
                    )
                }
            }else{
                return done(err, results.insertId);
            }
        }
    );
};

const getUserID = function(chit_id, done){
    //done format = function(err, user_id)

    db.get_pool().query(
        'SELECT chit_userid FROM chittr_chit WHERE chit_id = ' + chit_id,
        function(err, results){
            if (err){
                return done(err, false);
            }else{
                return done(err, results[0]['chit_userid']);
            }
        }
    );
};

const list = function(params, done){
    //done format = function(err, chits)

    // SELECT *
    // FROM chittr.chit
    // WHERE chit.chit_userid = 1
    // OR chit.chit_userid IN
    // (SELECT user_following.following_id FROM chittr.user_following WHERE user_following.user_id = 1)
    // ORDER BY chit.chit_timestamp DESC
    // LIMIT 50
    // OFFSET 0;

    let query = 'SELECT chittr_chit.chit_id AS chit_id, chittr_chit.chit_timestamp AS timestamp, chittr_chit.chit_content AS chit_content, chittr_chit.chit_userid AS user_id, chittr_chit_location.chit_id AS location_chitid, chittr_chit_location.longitude AS longitude, chittr_chit_location.latitude AS latitude, chittr_user.user_familyname AS family_name, chittr_user.user_givenname AS given_name, chittr_user.user_email AS email FROM chittr_chit LEFT JOIN chittr_chit_location ON chittr_chit.chit_id = chittr_chit_location.chit_id LEFT JOIN chittr_user ON chittr_chit.chit_userid = chittr_user.user_id';

    if(params["logged_in"]){
        query += ' WHERE chittr_chit.chit_userid = ' + params["user_id"] + ' OR chittr_chit.chit_userid IN (SELECT chittr_user_following.following_id FROM chittr_user_following WHERE chittr_user_following.user_id = ' + params['user_id'] + ')';
    }

    query += ' ORDER BY chittr_chit.chit_timestamp DESC';

    if(params["count"]){
        query += ' LIMIT ' + params["count"];
    }

    if(params["start"]){
        query += ' OFFSET ' + params["start"];
    }

    db.get_pool().query(
        query,
        function(err, chits){
            if (err){
                return done(err, false);
            }else{
                return done(err, chits);
            }
        }
    );
};


module.exports = {
    insert: insert,
    getUserID: getUserID,
    list: list
};
