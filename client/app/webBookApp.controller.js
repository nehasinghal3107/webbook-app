'use strict';

angular.module('webBookApp', ['ui.router', 'mgcrea.ngStrap', 'ngResource', 'ngCookies', 'ngSanitize', 'angular-growl', 'blockUI', 'ngAnimate'])

.config(['$logProvider', 'growlProvider', '$httpProvider', 'blockUIConfig', '$locationProvider', function($logProvider, growlProvider, $httpProvider, blockUIConfig, $locationProvider) {
  $logProvider.debugEnabled(true);
  growlProvider.globalTimeToLive(5000);
  growlProvider.onlyUniqueMessages(true);
  growlProvider.messagesKey("errors");
  growlProvider.messageTextKey("message");
  growlProvider.messageSeverityKey("field");
  blockUIConfig.message = 'loading...';
  blockUIConfig.delay = 100;
  // $httpProvider.defaults.headers.common.xsrfCookieName = 'csrftoken'; 
  // $httpProvider.defaults.headers.common.xsrfHeaderName = 'X-CSRFToken'; 
  // $httpProvider.defaults.headers.common.withCredentials = true;
}])

.run(['$rootScope', '$state', '$location', '$log', '$http', function($rootScope, $state, $location, $log, $http) {
  $rootScope.$log = $log;
}])

.controller('webBookAppCtrl', ['$scope', '$rootScope', '$state', '$log', '$http', '$cookieStore', 'blockUI', 'growl', function($scope, $rootScope, $state, $log, $http, $cookieStore, blockUI, growl) {
 
  console.log('initializing........')
//   $scope.modal = {
//   "title": "Title",
//   "content": "Hello Modal<br />This is a multiline message!"
// };
  $state.transitionTo('home.landing.view');

}]);