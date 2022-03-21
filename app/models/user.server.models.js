const db = require('../../config/db'),
    crypto = require('crypto');

const getHash = function(password, salt){
    return crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
};

/**
 * get the user id associated with a given token, return null if not found
 */
const getIdFromToken = function(token, done){
    if (token === undefined || token === null)
        return done(true, null);
    else {
        db.get_pool().query(
            'SELECT user_id FROM chittr_user WHERE user_token=?',
            [token],
            function(err, result){
                if (result.length === 1)
                    return done(null, result[0].user_id);
                return done(err, null);
            }
        )
    }
};


/**
 * insert user
 */
const insert = function(user, done){

    const salt = crypto.randomBytes(64);
    const hash = getHash(user.password, salt);

    //console.log(salt);

    let values = [[user.given_name, user.family_name, user.email, hash, salt.toString('hex'), false]];

    db.get_pool().query(
        'INSERT INTO chittr_user (user_givenname, user_familyname, user_email, user_password, user_salt, user_account_archived) VALUES (?)',
        values,
        function(err, results){
            if (err) return done(err);

            return done(err, results.insertId)
        }
    );
};

/*
 *   authenticate user
 */
const authenticate = function(email, password, done){
    db.get_pool().query(
        'SELECT user_id, user_password, user_salt FROM chittr_user WHERE (user_email=?)',
        [email],
        function(err, results) {

            if (err || results.length !== 1){
                console.log("AUTH 1", err, results.length);
                return done(true); // return error = true (failed auth)
            }else{

                if(results[0].user_salt == null){
                    results[0].user_salt = '';
                }

                let salt = Buffer.from(results[0].user_salt, 'hex');

                if (results[0].user_password === getHash(password, salt)){
                    return done(false, results[0].user_id);
                }else{
                    console.log("failed passwd check");
                    return done(true); // failed password check
                }

            }
        }
    );
};

/**
 * get existing token
 *
 */
const getToken = function(id, done){
    db.get_pool().query(
        'SELECT user_token FROM chittr_user WHERE user_id=?',
        [id],
        function(err, results){
            if (results.length === 1 && results[0].token)
                return done(null, results[0].token);
            return done(null, null);
        }
    );
};

/**
 * create and store a new token for a user
 */
const setToken = function(id, done){
    let token = crypto.randomBytes(16).toString('hex');
    db.get_pool().query(
        'UPDATE chittr_user SET user_token=? WHERE user_id=?',
        [token, id],
        function(err){return done(err, token)}
    );
};

/**
 * remove a token for a user
 */
const removeToken = (token, done) => {
    db.get_pool().query(
        'UPDATE chittr_user SET user_token=null WHERE user_token=?',
        [token],
        function(err){return done(err)}
    )
};

/**
 * return user details, or null if user not found
 *
 * @param id
 * @param done
 */
const getOne = (id, done) => {
    // console.log("1");
    let query = 'SELECT chittr_user.user_id, chittr_user.user_givenname, chittr_user.user_familyname, chittr_user.user_email FROM chittr_user WHERE user_id=?';
    db.get_pool().query(
        query,
        [id],
        function(err, results){
            if (err){
                // console.log(err);
                return done(err, false);
            }else if(results.length == 0){
                return done(false, null);
            }else{
                // console.log("2");
                let user = results[0];

                // console.log(user);

                let chit_query = 'SELECT c.chit_id, c.chit_timestamp, c.chit_content, l.latitude, l.longitude ' +
                    'FROM chittr_chit c ' +
                    'LEFT JOIN chittr_chit_location l ON c.chit_id = l.chit_id ' +
                    'LEFT JOIN chittr_user u ON c.chit_userid = u.user_id ' +
                    'WHERE u.user_id=? ' +
                    'ORDER BY c.chit_timestamp DESC';

                db.get_pool().query(chit_query, [id], function(err, chits){
                    if(err) return done(err, false);

                    // console.log(chits);

                    let to_return = {
                        "user_id": user.user_id,
                        "given_name": user.user_givenname,
                        "family_name": user.user_familyname,
                        "email": user.user_email
                    };

                    let recent_chits = [];

                    for(let chit of chits){

                        let temp = {
                            "chit_id": chit["chit_id"],
                            "timestamp": Date.parse(chit["chit_timestamp"]),
                            "chit_content": chit["chit_content"]
                        };

                        if(chit["longitude"]){
                            temp["location"] = {
                                "longitude": chit["longitude"],
                                "latitude": chit["latitude"]
                            }
                        }

                        recent_chits.push(temp);
                    }

                    to_return["recent_chits"] = recent_chits;

                    return done(null, to_return);

                })

            }
        }
    )
};


/**
 * update user
 *
 */
const alter = function(id, user, done){

    let query_string = '';
    let values = [];

    if(user.hasOwnProperty('password')){
        const salt = crypto.randomBytes(64);
        const hash = getHash(user.password, salt);

        query_string = 'UPDATE chittr_user SET user_givenname=?, user_familyname=?, user_email=?, user_password=?, user_salt=? WHERE user_id=?';
        values = [user.given_name, user.family_name, user.email, hash, salt.toString('hex'), id];
    }else{
        query_string = 'UPDATE chittr_user SET user_givenname=?, user_familyname=?, user_email=? WHERE user_id=?';
        values = [user.given_name, user.family_name, user.email, id];
    }

    //console.log(query_string, values);


    db.get_pool().query(query_string,
        values,
        function(err, results){
            done(err);
        }
    );
};

module.exports = {
    getIdFromToken: getIdFromToken,
    insert: insert,
    authenticate: authenticate,
    getToken: getToken,
    setToken: setToken,
    removeToken: removeToken,
    getOne: getOne,
    alter: alter
};
