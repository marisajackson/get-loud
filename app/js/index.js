(function(){
  'use strict';

  function getHashParams(){
    var hashParams = {},
        e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while (e = r.exec(q)){
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  var params = getHashParams(),
      access_token = params.access_token,
      error = params.error;

  if (error){
    alert('There was an error during the authentication');
  } else {
    if (access_token){
      $.ajax({
          url: 'https://api.spotify.com/v1/me',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response){
            $('#logged-in').show();
            $('#logged-out').hide();
            $('#name').text('Welcome ' + response.display_name);
          }
      });
    } else {
        // render initial screen
        $('#logged-out').show();
        $('#logged-in').hide();
    }
  }
})();
