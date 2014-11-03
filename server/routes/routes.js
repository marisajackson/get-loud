'use strict';

var cookieParser  = require('cookie-parser'),
    bodyParser    = require('body-parser'),
    spotify       = require('../controllers/spotify');

module.exports = function(app, express){
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../public'));
  app.use(cookieParser());

  app.get('/login', spotify.login);
  app.get('/callback', spotify.callback);
  app.post('/createPlaylist/:token/:userId', spotify.playlist);

  console.log('Routes Loaded');
};
