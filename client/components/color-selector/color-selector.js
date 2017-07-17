angular.module('App')
.directive('colorSelector', [function () {
    return {
        replace: true,
        restrict: 'E',
        templateUrl: '/client/components/color-selector/color-selector.html',
        scope: {
            onSelected: '&'
        },
        link: function (scope, elem, attrs) {

            scope.colors = [
                '#FF3F33',
                '#FFFF33',
                '#33FF55',
                '#33FFF3',
                '#334CFF',
                '#F633FF',
                '#FF3358',
                '#000000'
            ];

            scope.onClick = function (color) {
                scope.onSelected({ color: color });
            };


        }
    }
}]);