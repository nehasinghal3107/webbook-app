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
}])

.run(['$rootScope', '$state', '$location', '$log', '$http', 'UserService', function($rootScope, $state, $location, $log, $http, UserService) {
  $rootScope.$log = $log;
  $rootScope.userdata = {};
  var user_data = UserService.checkIfUserSessionExist(); 
  console.log(user_data);
  if (user_data) {
    $rootScope.userdata = user_data;
  };
}])

.controller('webBookAppCtrl', ['$scope', '$rootScope', '$state', '$log', '$http', '$cookieStore', 'blockUI', 'growl', '$modal', function($scope, $rootScope, $state, $log, $http, $cookieStore, blockUI, growl, $modal) {
 
  console.log('initializing........');

  $state.transitionTo('home.landing.view');

  var loginModal;

  $scope.showLogin = function (){
    loginModal = $modal({
      scope: $scope,
      show: true,
      animation: 'am-fade-and-scale',
      placement: 'center',
      backdrop: 'static',
      templateUrl:'app/account/user/signin.tpl.html'
    });
  };

  $scope.hideLogin = function (){
    loginModal.$promise.then(loginModal.hide);
  };

  $scope.logout = function(){
    $cookieStore.remove('token');
    $cookieStore.remove('user');
    delete $rootScope.userdata;
    $state.transitionTo('home.landing.view');
  }

  $scope.ask_a_question = function(){
    if ($rootScope.userdata && $rootScope.userdata.token) {
      $state.transitionTo('home.landing.view.askquestion');
    } else {
      $scope.showLogin();
    }
  }

}]);