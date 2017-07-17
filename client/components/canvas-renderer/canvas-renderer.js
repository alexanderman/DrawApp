/**
 * the directive is responsible for rendering canvas image by model
 * and allowes editing
 */

angular.module('App')
.directive('canvasRenderer', ['CanvasDrawer', function (CanvasDrawer) {
    return {
        replace: true,
        templateUrl: '/client/components/canvas-renderer/canvas-renderer.html',
        restrict: 'E',
        scope: {
            linesModel: '=',
            //isEditable: '=',
            //onModelChanged: '&',
            onReady: '&'
        },
        link: function (scope, elem, attrs) {

            var canvas = angular.element(elem).find('canvas')[0];
            /** setting canvas size according to css properties */
            canvas.width = canvas.scrollWidth;
            canvas.height = canvas.scrollHeight;


            var model = scope.linesModel || [];
            var cdr = new CanvasDrawer(canvas);
            cdr.drawModel(model);

            scope.onReady({ cdr: cdr });

        }
    }
}]);