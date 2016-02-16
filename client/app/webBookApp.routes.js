/**
 * Main routing configuration
 **/

angular.module('webBookApp')
  .config(['$stateProvider', '$urlRouterProvider', '$uiViewScrollProvider', function($stateProvider, $urlRouterProvider, $uiViewScrollProvider) {
    $uiViewScrollProvider.useAnchorScroll();

    $stateProvider
      .state('home', {
        abstract: true,
        templateUrl: 'components/partials/views/home.tpl.html'
      })
      .state('home.landing', {
        views: {
          'navbar': {
            templateUrl: 'components/partials/views/navbar.tpl.html'
          },
          'content': {
            templateUrl: 'components/partials/views/home.landing.tpl.html'
          }
        }
      })
      .state('home.landing.view', {
        views: {
          'landing-view': {
            templateUrl: 'components/partials/views/home.landing.content.tpl.html'
          }
        }
      })
      .state('home.landing.login', {
        views: {
          'landing-view': {
            templateUrl: 'app/account/user/signin.tpl.html'
          }
        }
      })
      .state('home.landing.signup', {
        views: {
          'landing-view': {
            templateUrl: 'app/account/user/signup.tpl.html',
            controller: 'userController'
          }
        }
      })
  }]);
