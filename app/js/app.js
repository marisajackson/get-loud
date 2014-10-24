(function(){
  'use strict';

  var app = angular.module('getLOUD', ['ngAudio']);

  app.controller('eventsCtrl', ['$scope', '$http', 'ngAudio', function($scope, $http, ngAudio){
    var link = 'http://www.corsproxy.com/api.bandsintown.com/events/search?per_page=100',
        appId = '&app_id=get_loud',
        artists = [];
    $scope.concerts = [];
    $scope.tracks = [];
    this.city = 'Nashville';
    this.state = 'TN';

    for (var i = 1; i < 2; i++){
      $http.get(link + '&page=' + i + '&location=' + this.city + ',' + this.state + appId).
      success(getArtists);
    }

    function getArtists(concerts){
      for (var i = 0; i < concerts.length; i++) {
        if(concerts[i].artists[0].name){
          artists.push(concerts[i].artists[0].name);
          var artist = concerts[i].artists[0].name;
          $http.get('https://api.spotify.com/v1/search?q=' + artist + '&type=track').
          success(listArtists);
        }
      }
    }

    function listArtists(data){
      if(data.tracks.items.length > 0 && $scope.tracks.indexOf(data.tracks.items[0].artists[0].name) === -1 && artists.indexOf(data.tracks.items[0].artists[0].name) > -1){
        var track = {};
        track.id = data.tracks.items[0].id;
        track.artist = data.tracks.items[0].artists[0].name;
        track.songPreview = ngAudio.load(data.tracks.items[0].preview_url);
        track.addedToPlaylist = false;
        $http.get('https://api.spotify.com/v1/search?q=' + track.artist + '&type=artist').
          success(function(data){
            track.artistImage = data.artists.items[0].images[0].url;
          });
        track.name = data.tracks.items[0].name;
        $scope.tracks.push(track);
        console.log('EVENT ARTISTS:' + artists.length);
        console.log('SCOPE ARTISTS:' + $scope.tracks.length);
      }
    }

    $scope.addToPlaylist = function(track){
      this.track.addedToPlaylist = true;
    };

  }]);

})();
