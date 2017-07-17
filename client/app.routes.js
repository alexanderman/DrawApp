angular.module('App')
.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function ($stateProvider, $locationProvider, $urlRouterProvider) {

    function resolveJsonModel() {
        return ['$stateParams', 'canvasService', '$q', function($stateParams, canvasService, $q) {
            var jsonModel = $stateParams.model;
            if (jsonModel) {
                return $q.when(jsonModel);
            }

            if ($stateParams.id) {
                return canvasService.fetch($stateParams.id)
                .then(function (doc) {
                    return doc;
                });
            }
        }];
    }

    $locationProvider.html5Mode(true);

    $stateProvider.state('main', {
        abstract: true,
        controller: 'mainController',
        templateUrl: 'client/pages/base/base-controller.html',
        resolve: {
            user: ['userService', function (userService) {
                return userService.fetchCurrentUser()
                .then(function (user) {
                    return user;
                })
                .catch(function (err) {
                    /** handle not logged in users */
                })
            }]
        }
    });

    $stateProvider.state('main.list', {
        url: '/list',
        controller: 'listController',
        templateUrl: 'client/pages/list/list-controller.html'
    });

    $stateProvider.state('main.editor', {
        url: '/editor/:id',
        controller: 'editorController',
        templateUrl: 'client/pages/editor/editor-controller.html',
        params: { model: null },
        resolve: {
            jsonModel: resolveJsonModel()
        }
    });

    $stateProvider.state('main.view', {
        url: '/view/:id',
        controller: 'viewController',
        templateUrl: 'client/pages/view/view-controller.html',
        params: { model: null },
        resolve: {
            jsonModel: resolveJsonModel()
        }
    });

    $urlRouterProvider.otherwise('/list');
    $urlRouterProvider.when('/', '/list');

}]);
