const chits = require('../models/chit.server.models'),
    users = require('../models/user.server.models'),
    log = require('../lib/logger')(),
    validator = require('../lib/validator'),
    config = require('../../config/config.js'),
    schema = require('../../config/zedrem-Chittr-0.0.5-swagger.json'),
    fs = require('fs'),
    path = require('path'),
    app_dir = path.dirname(require.main.filename);;


exports.create = function(req, res){

    let token = req.get(config.get('authToken'));

    users.getIdFromToken(token, function(err, _id){

        if(err) return res.sendStatus(400);

        //if (!validator.isValidSchema(req.body, 'components.schemas.SingleChit')) {
          //  log.warn(`chits.controller.create: bad chit ${JSON.stringify(req.body)}`);
            //log.warn(validator.getLastErrors());
            //return res.sendStatus(400);
        //} else {
            let chit = Object.assign({}, req.body);

            chit["user_id"] = _id;

            chits.insert(chit, function (err, chit_id) {
                if (err) {
                    log.warn(`chits.controller.create: couldn't create ${JSON.stringify(chit)}: ${err}`);
                    return res.sendStatus(400); // duplicate record
                }
                res.status(201).send({chit_id: chit_id});
            });
        //}
    });

};

exports.get_all = function(req, res){
    console.log("Get all chits...");
    // get all tweets where ID is me or ID is a follower limit to 'count' offset by 'start' order by timestamp descending

    let count = 10; //default to 10
    let start = 0; //default to 0

    if(req.query.count){
        count = parseInt(req.query.count);
    }

    if(req.query.start){
        start = parseInt(req.query.start);
    }

    let params = {
        "count": count,
        "start": start
    };

    let token = req.get(config.get('authToken'));

    users.getIdFromToken(token, function(err, _id){
        if(err == true && _id == null){
            //no user logged in
            params["logged_in"] = false;
        }else{
            //user logged in
            params["logged_in"] = true;
            params["user_id"] = _id;
        }

        chits.list(params, function(err, rows){
            if(err){
                return res.sendStatus(400);
            }else {

                let chits = [];

                for(let row of rows){
                    let chit = {
                        "chit_id": row["chit_id"],
                        "timestamp": Date.parse(row["timestamp"]),
                        "chit_content": row["chit_content"],
                        "user": {
                          "user_id": row["user_id"],
                          "given_name": row["given_name"],
                          "family_name": row["family_name"],
                          "email": row["email"]
                        }
                    };

                    if(row["longitude"]){
                        chit["location"] = {
                            "longitude": row["longitude"],
                            "latitude": row["latitude"]
                        }
                    }

                    chits.push(chit);
                }


                if (!validator.isValidSchema(chits, 'components.schemas.ListChits')) {
                    log.warn(JSON.stringify(chits, null,));
                    log.warn(validator.getLastErrors());
                    return res.sendStatus(500);
                } else {
                    return res.status(200).json(chits);
                }
            }
        });
    });

};

exports.get_photo = function(req, res){
    let chit_id = parseInt(req.params.id);
    if (!validator.isValidId(chit_id)) return res.sendStatus(404);

    // Check file exists
    let check_path_jpeg = app_dir + "/photo_repo/chit" + chit_id + ".jpeg";
    let check_path_png = app_dir + "/photo_repo/chit" + chit_id + ".png";


    fs.stat(check_path_jpeg, function(err, stat){
        if(err){
            fs.stat(check_path_png, function(err, stat){
                if(err){
                    // Not found JPEG or PNG
                    // Photo doesn't exist, send an empty 404
                    res.sendStatus(404)
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

exports.attach_photo = function(req, res){
    console.log("attach photo...");

    let token = req.get(config.get('authToken'));
    let chit_id = parseInt(req.params.id);

    if(!token) return res.sendStatus(401);
    if (!validator.isValidId(chit_id)) return res.sendStatus(404);

    users.getIdFromToken(token, function(err, _id){

        if(err) return res.sendStatus(400);

        chits.getUserID(chit_id, function(err, user_id){

            if(err) return res.sendStatus(400);

            console.log("Executed getUserID function, returned value", user_id);

            if(_id == user_id){
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
                req.pipe(fs.createWriteStream('./photo_repo/chit' + chit_id + '.' + file_ext));

                res.sendStatus(201);

            }else{
                res.sendStatus(401);
            }

        });
    });




};
