angular.module('App')
.controller('viewController', ['$scope', 'jsonModel', '$state', 'CanvasModel', 'user', function ($scope, jsonModel, $state, CanvasModel, user) {

    var model = new CanvasModel(jsonModel, user),
        cdr;
    $scope.linesModel = model.lines();


    $scope.edit = function () {
        $state.go('main.editor', { model: model.getJson(), id: model.getId() });
    };

    $scope.download = function ($event) {
        var link = $event.target;
        if (cdr) {
            link.href = cdr.dataUrl();
            link.download = "drawing.png";
        }
    };


    /** receive canvas drawer api from directive */
    $scope.cdrReady = function (_cdr) {
        cdr = _cdr;
    };



}]);
