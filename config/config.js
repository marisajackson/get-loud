'use strict';

module.exports = function(app, port){
  console.log('Listening on '+ port);
  app.listen(port);
}