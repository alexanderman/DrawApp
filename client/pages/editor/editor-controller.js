angular.module('App')
.controller('editorController', ['$scope', 'CanvasModel', 'canvasService', 'user', 'jsonModel', '$state', function
($scope, CanvasModel, canvasService, user, jsonModel, $state) {

    var model = new CanvasModel(jsonModel, user),
        cdr = null;
    $scope.linesModel = model.lines();

    $scope.save = function () {
        canvasService.save(model.getJson())
        .then(function (doc) {

            $state.go('main.editor', { model: doc, id: doc._id });

        }, function (err) {
            /** handle error */
            console.log(err);
        })
    };



    $scope.colorSelected = function (color) {
        if (cdr) {
            cdr.setTool({ type:'pen', radius:4, color:color });
        }
    };


    /** receive canvas drawer api from directive */
    $scope.cdrReady = function (_cdr) {

        cdr = _cdr;
        var lines = model.lines();
        cdr.allowEdit(true);
        cdr.onChanged(function (line) {
            lines.push(line);
            model.updateLines(lines);
        });

        $scope.redraw = function () {
            cdr.clear();
            cdr.drawModel(lines, 1);
        };


    };


}]);
