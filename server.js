const db = require('./config/db'),
    express = require('./config/express');

const app = express();

db.connect(function(err){
    if(err){
        console.log('Unable to connect to MySQL');
        process.exit(1);
    }else{
        app.listen(3333, function() {
            console.log('Listening on port: 3333');
        })
    }
});