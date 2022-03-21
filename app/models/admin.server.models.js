const db = require('../../config/db');
const fs = require('fs');

exports.database_reset = function(done){
    let script = fs.readFileSync('./app/scripts/tables.sql', 'utf8');

    db.get_pool().query(script, function (err, rows){
        //console.log(err, rows);
        if (err){
            return done(err);
        }else{
            done(false);
        }
    });
}
