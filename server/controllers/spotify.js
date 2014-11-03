'use strict';
var querystring   = require('querystring'),
    request       = require('request'), // "Request" library
    client_id     = process.env.CLIENT_ID, // Your client id
    client_secret = process.env.CLIENT_SECRET, // Your client secret
    redirect_uri  = process.env.REDIRECT_URI || 'http://localhost:8888/callback', // Your redirect uri
    stateKey = 'spotify_auth_state',

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */

generateRandomString = function(length){
  var text = '',
      possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

exports.login = function(req, res){
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
};

exports.callback = function(req, res){
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null,
      state = req.query.state || null,
      storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState){
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code',
        client_id: client_id,
        client_secret: client_secret
      },
      json: true
    };

    request.post(authOptions, function(error, response, body){
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token,
            options = {
          url: 'https://api.spotify.com/v1/me',
          headers: {'Authorization': 'Bearer ' + access_token},
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body){
          console.log(body);
        });

        // res.redirect('/#');

        //we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
};

exports.playlist = function(req, res){
  var token = req.params.token,
      id = req.params.userId,
      tracks = req.body.tracks,
      options = {
          url: 'https://api.spotify.com/v1/users/' + id + '/playlists',
          headers: {'Authorization': 'Bearer ' + token},
          body: JSON.stringify({'name' : 'Upcoming Concerts'}),
          json: true
        };

  request.post(options, function(error, response){
    var playlistId = response.body.id,
        playlist = response.body,
        newOptions = {
      url: 'https://api.spotify.com/v1/users/'+ id +'/playlists/'+ playlistId +'/tracks',
      headers: {'Authorization': 'Bearer ' + token , 'Content-Type': 'application/json'},
      body: tracks,
      json: true
    };
    request.post(newOptions, function(err, response){
      res.send({playlist: playlist});
    });

  });
};
