  var app = angular.module('twitchApp', []);
  app.controller('MainController', ['$scope', '$http', function($scope, $http) {
    var coders = ["freecodecamp", "storbeck", "terakilobyte", "habathcx", "RobotCaleb", "comster404", "noobs2ninjas", "medrybw"];
    var allStreamers = [];
    var onlineStreamers = [];
    var offlineStreamers = [];
    var count = 0;

    function twitchApi(user, api, idx) {
      var url = 'https://api.twitch.tv/kraken/' + api + '/' + user + '?callback=JSON_CALLBACK';
      $http.jsonp(url).success(function(data) {
          if (api === 'users') {
            allStreamers[idx]['display_name'] = data['display_name'];
            allStreamers[idx]['logo'] = data['logo'] || 'http://placekitten.com/g/50/50';
          } else if (api === 'streams') {
            allStreamers[idx]['stream'] = data['stream'];
            if (data['stream']) {
              onlineStreamers.push(allStreamers[idx]);
            } else {
              offlineStreamers.push(allStreamers[idx]);
            }
          }
        })
        .error(console.error);
    }

    coders.forEach(function(coder, i) {
      obj = {
        name: coder,
        url: 'http://twitch.tv/' + coder
      };
      allStreamers[i] = obj;
      twitchApi(coder, 'users', i);
      twitchApi(coder, 'streams', i);
      count++;
      if (count === coders.length) {
        $scope.streamers = allStreamers;
        count = 0;
      }
    });
    $scope.tab = 'all';

    $scope.setTab = function(tab) {
      $scope.tab = tab;
      switch (tab) {
        case 'online':
          $scope.streamers = onlineStreamers;
          break;
        case 'offline':
          $scope.streamers = offlineStreamers;
          break;
        default:
          $scope.streamers = allStreamers;
          break;
      }
    }
  }]);