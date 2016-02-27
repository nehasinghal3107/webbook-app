angular.module('webBookApp')
.factory('UserService', [
  '$rootScope',
  '$resource',
  '$http',
  '$state',
  '$log',
  '$cookieStore',
  function ($rootScope, $resource, $http, $state, $log, $cookieStore) {
    var UserService = {
        Signup: $resource('http://mashbook.swamisamaj.com/user-registration/', {}, { saveUser: { method: 'POST' } }),
        Signin: $resource('/api/user/signin', {}, { signinUser: { method: 'POST' } })
      };
    var session = {};
    session.isLoggedIn = false;
    session.currentUser = null;
    session.productfollowlist = [];

    session.signupUser = function (userdata) {
      $http({
        method: 'POST',
        url: 'http://mashbook.swamisamaj.com/user-registration/',
        data: userdata
      }).then(function successCallback(response) {
        $log.debug(response);
        $rootScope.$broadcast('signupDone', response);
      }, function errorCallback(response) {
        $log.debug(response);
        $rootScope.$broadcast('signupNotDone', response);
      });
    };

    session.signinUser = function (userdata) {
      $http({
        method: 'POST',
        url: 'http://mashbook.swamisamaj.com/get-user-token/',
        data: userdata
      }).then(function successCallback(response) {
        $log.debug(response);
        $rootScope.$broadcast('signinDone', response);
      }, function errorCallback(response) {
        $log.debug(response);
        $rootScope.$broadcast('signinNotDone', response);
      });
    };

    session.getUserProfileData = function (userData,profileUserName) {
      UserService.User_Profile.getUserProfile({ userid: userData }, function (success) {
        $log.debug(success);
        $rootScope.$broadcast('getUserDataDone', success,profileUserName);
      }), function (error) {
        $log.debug(error);
        $rootScope.$broadcast('getUserDataNotDone', error);
      };
    };

    session.saveUserSettings = function (userdata) {
      UserService.ManageUser.updateUserSettings({ userid: session.currentUser.userid }, userdata, function (success) {
        $log.debug(success);
        $rootScope.$broadcast('updateUserDone', success);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('updateUserNotDone', error.status);
      });
    };

    session.removeUserSettings = function () {
      UserService.ManageUser.deleteUserSettings({ userid: session.currentUser.userid }, function (success) {
        $log.debug(success);
        $rootScope.$broadcast('deleteUserDone', success);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('daleteUserNotDone', error.status);
      });
    };

    session.getUserDetailSettings = function () {
      UserService.ManageUser.getUserSettings({ userid: session.currentUser.userid }, function (success) {
        $log.debug(success);
        $rootScope.$broadcast('getUserDone', success);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('getUserNotDone', error.status);
      });
    };

    session.updateUserData = function (userData, $scope) {
      session.currentUserData = userData;
    };

    session.forgotPasswordUser = function (userdata) {
      UserService.ForgotPassword.forgotPassword(userdata, function (success) {
        $log.debug(success);
        $rootScope.$broadcast('forgotPasswordDone', success);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('forgotPasswordNotDone', error.status);
      });
    };

    session.resetPasswordUser = function (userdata) {
      UserService.ResetPassword.resetPassword({ userid: session.currentUser.userid }, userdata, function (success) {
        $log.debug(success);
        $rootScope.$broadcast('resetPasswordDone', success);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('resetPasswordNotDone', error.status);
      });
    };

    session.checkIfUserSessionExist = function () {
      var data = $cookieStore.get('user');
      return data;
    }

    return session;

}]);