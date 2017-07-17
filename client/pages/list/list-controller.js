angular.module('App')
.controller('listController', ['$scope', 'resourcesList', '$state', function ($scope, resourcesList, $state) {

    resourcesList.fetch().then(function (list) {
        $scope.list = list;
    });

    $scope.openView = function (itemModel) {
        $state.go('main.view', { model: itemModel, id: itemModel._id });
    };

}]);
