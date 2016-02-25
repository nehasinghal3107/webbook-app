angular.module('webBookApp')
.factory('UserService', [
  '$rootScope',
  '$resource',
  '$http',
  '$state',
  '$log',
  function ($rootScope, $resource, $http, $state, $log) {
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

    session.activateaccount = function (userdata) {
      UserService.Activate_Request.sendAccountActivateRequest(userdata, function (success) {
        $log.debug(success);
        $rootScope.$broadcast('activateAccountTokenDone', success);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('activateAccountTokenNotDone', error.status);
      });
    };

    session.sendAuthorAppRequest = function (authordata) {
      UserService.Author.sendAuthorApplication(authordata, function (success) {
        $log.debug(success);
        $rootScope.$broadcast('sendAuthorRequestDone', success);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('activateAuthorRequestNotDone', error.status);
      });
    };

    session.sendAuthorUpdateCategory = function (categoryData) {
      UserService.UpdateAuthor.updateAuthorBlogCategory({authorid: $rootScope.usersession.currentUser.author.authorid}, categoryData, function (success) {
        $log.debug(success);
        $rootScope.$broadcast('updateAuthorCategoryDone', success);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('updateAuthorCategoryNotDone', error.status);
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

    session.updateEmail = function (userdata) {
      UserService.Update_Email.updateEmailSettings({ userid: session.currentUser.userid }, userdata, function (success) {
        $log.debug(success);
        $rootScope.$broadcast('updateUserEmailDone', success);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('updateUserEmailNotDone', error.status);
      });
    };

    session.updatePassword = function (userdata) {
      UserService.Change_Password.updatePasswordSettings({ userid: session.currentUser.userid }, userdata, function (success) {
        $log.debug(success);
        $rootScope.$broadcast('updateUserPasswordDone', success);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('updateUserPasswordNotDone', error.status);
      });
    };

    session.getProductFollowed = function (prodledata , userdata) {
      UserService.Product_Followed.getProduct_Followed({ data: prodledata }, function (success) {
        $log.debug(success);
        if (success.error) {
          console.log('No products followed');
        } else {
          session.productfollowlist = success.success.products;
        }
        
        $rootScope.$broadcast('getProductFollowedDone', success, userdata);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('getProductFollowedNotDone', error);
      });
    };

    session.getProductRecommend = function (prodledata) {
      UserService.Product_Recommend.getProduct_Recommend({ data: prodledata }, function (success) {
        $log.debug(success);
        $rootScope.$broadcast('getProductRecommendDone', success);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('getProductRecommendNotDone', error);
      });
    };

    session.unfollowProduct = function (pdata, product) {
      UserService.Product_Unfollow.unfollowProduct({ data: pdata }, function (success) {
        $log.debug(success);
        $rootScope.$broadcast('unfollowProductDone', success, product);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('unfollowProductNotDone', error);
      });
    };

    session.followProduct = function (pdata, product) {
      UserService.Product_Follow.followProduct({ data: pdata }, function (success) {
        $log.debug(success);
        $rootScope.$broadcast('followProductDone', success, product);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('followProductNotDone', error);
      });
    };

    session.sendInvites = function (udata) {
      UserService.User_Invites.sendUserInvites(udata, function (success) {
        $log.debug(success);
        $rootScope.$broadcast('sendUserInvitesDone', success);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('sendUserInvitesNotDone', error);
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
    session.regenerateTokenUser = function (userdata) {
      UserService.RegenerateToken.regenerateToken(userdata, function (success) {
        $log.debug(success);
        $rootScope.$broadcast('regenerateTokenDone', success);
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('regenerateTokenNotDone', error.status);
      });
    };
    session.init = function () {
      session.resetSession();
    };
    session.resetSession = function () {
      session.currentUser = null;
      session.isLoggedIn = false;
    };
    session.logoutUser = function () {
      UserService.Logout.logoutUser(function (success) {
            if(success.error !== undefined && success.error.code === 'AL001')
            {
                    session.resetSession();
                    $state.go('prodo.landing.signin');
            }
            else
            {
                    $log.debug(success.success.message); 
                    session.resetSession();
                    $rootScope.$broadcast('logoutDone', success.success.message);
            }
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('logoutNotDone', error.status);
      });
    };
    session.authSuccess = function (userData, $scope) {
      session.currentUser = userData;
      session.isLoggedIn = true;
      $rootScope.$broadcast('session', userData);
    };
    session.authfailed = function () {
      session.resetSession();
    };
    session.checkUser = function () {
      UserService.IsUserLoggedin.checkUserSession(function (result) {
        $log.debug(result);
        if (result.success) {
          session.authSuccess(result.success.user);
        } else {
          session.authfailed();
        }
      }, function (error) {
        $log.debug(error);
        $rootScope.$broadcast('session-changed-failure', error.status);
      });
    };
    return session;
  }
]);