(function(){
  'use strict';
  /**
   * Obtains parameters from the hash of the URL (access token and refresh token)
   * @return Object
   */
  function getHashParams(){
    var hashParams = {},
        e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while (e = r.exec(q)){
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  // // handlebars templating variables
  // var userProfileSource = document.getElementById('user-profile-template').innerHTML,
  //     userProfileTemplate = Handlebars.compile(userProfileSource),
  //     userProfilePlaceholder = document.getElementById('user-profile');

  //     oauthSource = document.getElementById('oauth-template').innerHTML,
  //     oauthTemplate = Handlebars.compile(oauthSource),
  //     oauthPlaceholder = document.getElementById('oauth');

  var params = getHashParams(),
      access_token = params.access_token,
      // refresh_token = params.refresh_token,
      error = params.error;

  if (error){
    alert('There was an error during the authentication');
  } else {
    if (access_token){
      // // render oauth info and pass it to the handlebars template
      // oauthPlaceholder.innerHTML = oauthTemplate({
      //   access_token: access_token,
      //   refresh_token: refresh_token
      // });

      $.ajax({
          url: 'https://api.spotify.com/v1/me',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response){
            // userProfilePlaceholder.innerHTML = userProfileTemplate(response);

            console.log('THE RESPONSE IS----------------------');
            console.log(response);

            $('#logged-in').show();
            $('#logged-out').hide();
            $('#name').text('Welcome ' + response.display_name);
          }
      });
    } else {
        // render initial screen
        $('#login').show();
        $('#loggedin').hide();
    }

    // document.getElementById('obtain-new-token').addEventListener('click', function() {
    //   $.ajax({
    //     url: '/refresh_token',
    //     data: {
    //       'refresh_token': refresh_token
    //     }
    //   }).done(function(data) {
    //     access_token = data.access_token;
    //     oauthPlaceholder.innerHTML = oauthTemplate({
    //       access_token: access_token,
    //       refresh_token: refresh_token
    //     });
    //   });
    // }, false);
  }
})();
