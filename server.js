/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var port          = process.env.PORT || 8888;
var express       = require('express'); // Express web server framework
var app           = express();

require('./config/config')(app, port);
require('./server/routes/routes')(app, express);

module.exports = app;



