/**
*Registration Controller
**/
angular.module('webBookApp')
  .controller('userController', ['$scope', '$rootScope', '$state', '$http', '$timeout', '$sce', '$log', 'growl', 'UserService', '$modal', function($scope, $rootScope, $state, $http, $timeout, $sce, $log, growl, UserService, $modal) {
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

    var loginModal = $modal({show:false});

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
        loginModal.$promise.then(loginModal.hide);
      } else {
        if (data.error.code== 'AU001') {     // user already exist
            $log.debug(data.error.code + " " + data.error.message);
            $rootScope.ProdoAppMessage(data.error.message, 'error');
        } else if (data.error.code=='ACT001') {  // user data invalid
            $log.debug(data.error.code + " " + data.error.message);
            $state.transitionTo('prodo.user-content.reactivate');
        } else if (data.error.code=='AV001') {  // user data invalid
            $log.debug(data.error.code + " " + data.error.message);
            $rootScope.ProdoAppMessage(data.error.message, 'error');
        } else if (data.error.code=='AT001') {   // user has not verified
            $log.debug(data.error.code + " " + data.error.message);
            $state.transitionTo('user-content.resetGenerateToken');
        } else {
            $log.debug(data.error.message);
            $rootScope.ProdoAppMessage('Prodonus Database Server error. Please wait for some time.', 'error');
        }
      }
    };
  
    $scope.signup = function(){
      if ($scope.form.signupForm.$valid) {
        $scope.form.signupForm.submitted = false;
        var jsondata=$scope.jsonUserData('signup');
        console.log(jsondata)
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
      // $scope.hideSpinner();
      $log.debug(response);
      // $rootScope.ProdoAppMessage("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
    });

    // function to handle server side responses
    $scope.handleSigninResponse = function(data){
      if (data) {
        console.log(data)
        $scope.clearformData('signin');
      } else {
        if (data.error.code== 'AU001') {     // user already exist
            $log.debug(data.error.code + " " + data.error.message);
            $rootScope.ProdoAppMessage(data.error.message, 'error');
        } else if (data.error.code=='ACT001') {  // user data invalid
            $log.debug(data.error.code + " " + data.error.message);
            $state.transitionTo('prodo.user-content.reactivate');
        } else if (data.error.code=='AV001') {  // user data invalid
            $log.debug(data.error.code + " " + data.error.message);
            $rootScope.ProdoAppMessage(data.error.message, 'error');
        } else if (data.error.code=='AT001') {   // user has not verified
            $log.debug(data.error.code + " " + data.error.message);
            $state.transitionTo('user-content.resetGenerateToken');
        } else {
            $log.debug(data.error.message);
            $rootScope.ProdoAppMessage('Prodonus Database Server error. Please wait for some time.', 'error');
        }
      }
      $scope.hideSpinner();
    };
  
    $scope.signin = function(){
      if ($scope.form.signinForm.$valid) {
        $scope.form.signinForm.submitted = false;
        var jsondata=$scope.jsonUserData('signin');
        console.log(jsondata)
        UserService.signinUser(jsondata);
      } else {
        $scope.form.signinForm.submitted = true;
      }
    }

    var cleanupEventSigninDone = $scope.$on("signinDone", function(event, message){
      $log.debug(message);
      $scope.handleSigninResponse(message);      
    });

    var cleanupEventSigninNotDone = $scope.$on("signinNotDone", function(event, message){
      $log.debug(message);
    });

    $scope.$on('$destroy', function(event, message) {
      cleanupEventSignupDone();
      cleanupEventSignupNotDone();
      cleanupEventSigninDone();
      cleanupEventSigninNotDone();
    });

  }]);
 