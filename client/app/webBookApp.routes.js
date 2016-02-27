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
          },
          'footer': {
            templateUrl: 'components/partials/views/footer.tpl.html'
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
      .state('home.landing.view.questions', {
        views: {
          'content': {
            templateUrl: 'app/q&a/questions_list.tpl.html'
          }
        }
      })
      .state('home.landing.view.askquestion', {
        views: {
          'content': {
            templateUrl: 'app/q&a/askquestion.tpl.html'
          }
        }
      })
      .state('home.user', {
        views: {
          'navbar': {
            templateUrl: 'components/partials/views/navbar.tpl.html'
          },
          'content': {
            templateUrl: 'app/account/user/user.profile.tpl.html',
            controller: 'userProfileController'
          }
        }
      })
      .state('home.user.about', {
        views: {
          'content-view': {
            templateUrl: 'app/account/user/user.profile.about.tpl.html'
          }
        }
      })
      .state('home.user.answers', {
        views: {
          'content-view': {
            templateUrl: 'app/account/user/user.profile.answers.tpl.html'
          }
        }
      })
      .state('home.user.questions', {
        views: {
          'content-view': {
            templateUrl: 'app/account/user/user.profile.questions.tpl.html'
          }
        }
      })
      .state('home.user.activities', {
        views: {
          'content-view': {
            templateUrl: 'app/account/user/user.profile.activities.tpl.html'
          }
        }
      })
      .state('home.user.following', {
        views: {
          'content-view': {
            templateUrl: 'app/account/user/user.profile.following.tpl.html'
          }
        }
      })
      .state('home.user.followers', {
        views: {
          'content-view': {
            templateUrl: 'app/account/user/user.profile.followers.tpl.html'
          }
        }
      })
      .state('home.user.blogs', {
        views: {
          'content-view': {
            templateUrl: 'app/account/user/user.profile.blogs.tpl.html'
          }
        }
      })
      .state('home.user.posts', {
        views: {
          'content-view': {
            templateUrl: 'app/account/user/user.profile.posts.tpl.html'
          }
        }
      })
  }]);
