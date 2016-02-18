/**
*Registration Controller
**/
angular.module('webBookApp')
  .controller('userProfileController', ['$scope', '$rootScope', '$state', '$http', '$timeout', '$sce', '$log', 'growl', 'UserService', function($scope, $rootScope, $state, $http, $timeout, $sce, $log, growl, UserService) {
    $scope.submitted = false;     

    $scope.user = 
      {
        'username' : '',
        'email' :  '',
        'password' :  ''
      };

    $scope.activateaccount = { 'email': ''};

    // function to clear form data on submit
    $scope.clearformData = function() {
      $scope.signupForm.$setPristine();
      $scope.user.username = '';
      $scope.user.email = '';
      $scope.user.password = '';
    }


     // function to send and stringify user registration data to Rest APIs
    $scope.jsonUserData = function(){
      var userData = 
       {
            'username' : $scope.user.username,
            'email' : $scope.user.email,
            'password' : $scope.user.password 
      };
      return userData; 
    } 

    // function to handle server side responses
    $scope.handleSignupResponse = function(data){
      if (data.success) {
        $state.transitionTo('prodo.user-content.emailverification');
        $scope.clearformData();
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
  
    $scope.signup = function(){
      if ($scope.signupForm.$valid) {
        // $scope.showSpinner();
        $scope.signupForm.submitted = false;
        var jsondata=$scope.jsonUserData();
        console.log(jsondata)
        $log.debug('User Data entered successfully');
        UserService.signupUser(jsondata);
      } else {
        $scope.signupForm.submitted = true;
      }
    }

    var cleanupEventSignupDone = $scope.$on("signupDone", function(event, message){
      $log.debug(message);
      $scope.handleSignupResponse(message);      
    });

    var cleanupEventSignupNotDone = $scope.$on("signupNotDone", function(event, message){
      // $scope.hideSpinner();
      $log.debug(message);
      // $rootScope.ProdoAppMessage("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
    });

    $scope.$on('$destroy', function(event, message) {
      cleanupEventSignupDone();
      cleanupEventSignupNotDone();
    });

  }]);
 