(function(){
  'use strict';

  var app = angular.module('getLOUD', ['ngAudio', 'simplePagination']);

  app.controller('dataCtrl', ['$http', 'ngAudio', '$scope', function($http, ngAudio, $scope){
    var link = 'http://www.corsproxy.com/api.bandsintown.com/events/search?per_page=100',
        appId = '&app_id=get_loud',
        events = [],
        artists = [];

    $scope.city = 'Nashville';
    $scope.state = 'TN';
    // $scope.page = '1';
    $scope.tracks = [];
    $scope.playlist = [];

    // Uses bandsintown API to get list of upcoming concerts:
    $scope.getConcerts = function(){
      $scope.tracks = [];                                       // empties the current list
      for (var i = 1; i < 10; i++){                              // gathers info from the first 20 pages of the API
        $http.get(link + '&page=' + i + '&location=' + $scope.city + ',' + $scope.state + appId).
        success(sanitizeConcertData);
      }
    };

    function sanitizeConcertData(concerts){
      for (var i = 0; i < concerts.length; i++) {               // loops throught concerts
        if(concerts[i].artists[0].name){                        // checks that artist name is listed on concert
          artists.push(concerts[i].artists[0].name);
          var concert = {};                                     // creates custom concert object
          concert.artist = concerts[i].artists[0].name;
          concert.date = concerts[i].datetime;
          concert.venue = concerts[i].venue.name;
          concert.ticket = concerts[i].ticket_url;
          events.push(concert);                                 // adds concert to event array
          $http.get('https://api.spotify.com/v1/search?q=' + concert.artist + '&type=track').   // searches for tracks that match artist
          success(sanitizeSongData);
        }
      }
    }

    function sanitizeSongData(data){
      if(data.tracks.items.length > 0 &&                                        // checks that a song track was returned
        _.where($scope.tracks, {artist: data.tracks.items[0].artists[0].name}).length < 1 &&   // checks that song hasn't already been added to the array of tracks
        artists.indexOf(data.tracks.items[0].artists[0].name) > -1){            // checks that song is actually by an artist who has an upcoming concert
        var track = {};                                                         // creates new track object
        track.spotifyId = data.tracks.items[0].id;                              // saves spotify track id
        track.artist = data.tracks.items[0].artists[0].name;                    // saves artist name
        track.songPreview = ngAudio.load(data.tracks.items[0].preview_url);     // saves track preview url
        track.name = data.tracks.items[0].name;                                 // save track title
        track.addedToPlaylist = false;
        $http.get('https://api.spotify.com/v1/search?q=' + track.artist + '&type=artist'). // searches spotify for artist object to obtain an image
          success(function(data){
            track.artistImage = data.artists.items[0].images[0].url;            // saves artist image to track
          });
        var theEvent = _.where(events, {artist: track.artist})[0];
        track.event = theEvent;
        $scope.tracks.push(track);                                              // adds track to array of tracks
        // $scope.list = $scope.tracks;
        // $scope.pagination.numPages = Math.ceil(($scope.tracks.length-$scope.tracks.filter(addedToPlaylist).length)/$scope.pagination.perPage);
      }
    }

    $scope.addToPlaylist = function(track){
      this.track.addedToPlaylist = true;
      $scope.playlist.push(track);
    };

  }]);

})();
