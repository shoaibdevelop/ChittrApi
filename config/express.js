const
    express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan');

const
    admin = require('../app/models/admin.server.models'),
    fs = require('fs'),
    path = require('path'),
    app_dir = path.dirname(require.main.filename);

module.exports = function(){
    const app = express();

    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser());

    app.use(morgan('tiny'));

    app.get('/api/v0.0.5/', function(req, res){
        res.status(200).json({"msg": "Server up"});
    });

    app.post('/api/v0.0.5/reset', function(req, res){
        console.log("h1");
        admin.database_reset(function(err){
            console.log("h2");
            if(err){
              console.log(1, err);
              res.sendStatus(500);
            }else{
              fs.readdir(app_dir + "/photo_repo", function(err, files){
                  console.log("h3");
                  if(err){
                      console.log(2, err);
                      res.sendStatus(500);
                  }else{

                      let i = 0;
                      let flag = false;

                      files.forEach(function(file, index){
                          if(file != "default.png"){
                              file_path = app_dir + "/photo_repo/" + file;
                              fs.unlink(file_path, function(err){
                                  if(err){
                                      flag = true;
                                  }
                              });
                          }

                          i++;
                          if(i == files.length){
                              if(flag){
                                  console.log(3, err);
                                  res.sendStatus(500);
                              }else{
                                  res.sendStatus(200);
                              }
                          }
                      })
                  }
              });
            }
        });
    });

    require('../app/routes/user.server.routes')(app);
    require('../app/routes/chit.server.routes')(app);
    require('../app/routes/follow.server.routes')(app);
    require('../app/routes/hashtag.server.routes')(app);

    return app;
};
