/**
*Registration Controller
**/
angular.module('webBookApp')
  .controller('userController', ['$scope', '$rootScope', '$state', '$http', '$timeout', '$sce', '$log', 'growl', 'UserService', '$modal', '$cookieStore', function($scope, $rootScope, $state, $http, $timeout, $sce, $log, growl, UserService, $modal, $cookieStore) {
    $scope.submitted = false;   
    $scope.form = {};  
    $scope.user_signup = {};
    $scope.user_signin = {};

    // function to clear form data on submit
    $scope.clearformData = function(action) {
      if (action === 'signup') {
        $scope.form.signupForm.$setPristine();
        $scope.user_signup = {};
      } else {
        $scope.form.signinForm.$setPristine();
        $scope.user_signin = {};
      }
    }

    // function to send and stringify user registration data to Rest APIs
    $scope.jsonUserData = function(action){
      if (action === 'signup') {
        var userData = 
         {
          'username' : $scope.user_signup.username,
          'email' : $scope.user_signup.email,
          'password' : $scope.user_signup.password 
        } 
      } else {
        var userData = 
        {
          'username' : $scope.user_signin.username,
          'password' : $scope.user_signin.password 
        }
      }
      return userData; 
    } 

    // function to handle server side responses
    $scope.handleSignupResponse = function(response){
      if (response && response.data) {
        $scope.clearformData('signup');
        $rootScope.userdata = angular.copy(response.data);
        $cookieStore.put('token',$rootScope.userdata.token);
        $cookieStore.put('user',$rootScope.userdata);
        $scope.hideLogin();
      }
    };
  
    $scope.signup = function(){
      if ($scope.form.signupForm.$valid) {
        $scope.form.signupForm.submitted = false;
        var jsondata=$scope.jsonUserData('signup');
        UserService.signupUser(jsondata);
      } else {
        $scope.form.signupForm.submitted = true;
      }
    }

    var cleanupEventSignupDone = $scope.$on("signupDone", function(event, response){
      $log.debug(response);
      $scope.handleSignupResponse(response);      
    });

    var cleanupEventSignupNotDone = $scope.$on("signupNotDone", function(event, response){
      $log.debug(response);
    });

    // function to handle server side responses
    $scope.handleSigninResponse = function(response){
      if (response && response.data) {
        $scope.clearformData('signin');
        $rootScope.userdata = angular.copy(response.data);
        $cookieStore.put('token',$rootScope.userdata.token);
        $cookieStore.put('user',$rootScope.userdata);
        $scope.hideLogin();
      } 
    };
  
    $scope.signin = function(){
      if ($scope.form.signinForm.$valid) {
        $scope.form.signinForm.submitted = false;
        var jsondata=$scope.jsonUserData('signin');
        UserService.signinUser(jsondata);
      } else {
        $scope.form.signinForm.submitted = true;
      }
    }

    var cleanupEventSigninDone = $scope.$on("signinDone", function(event, response){
      $log.debug(response);
      $scope.handleSigninResponse(response);      
    });

    var cleanupEventSigninNotDone = $scope.$on("signinNotDone", function(event, response){
      $log.debug(response);
    });

    $scope.$on('$destroy', function(event, message) {
      cleanupEventSignupDone();
      cleanupEventSignupNotDone();
      cleanupEventSigninDone();
      cleanupEventSigninNotDone();
    });

  }]);
 