const mysql = require('mysql');
// const sqlite3 = requrie('sqlite3').verbose();

const config = require('./config.js');

let state = {
    pool: null
};

exports.connect = function(done){
    state.pool = mysql.createPool(config.get('db'));
    done();
};

exports.get_pool = function(){
    return state.pool;
};
