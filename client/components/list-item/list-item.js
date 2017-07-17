/**
 * directive is responsible for placing and sizing item
 * in the list, can possibly render different finds of items inside of it
 */

angular.module('App')
.directive('listItem', [function () {
    return {
        restrict: 'E',
        templateUrl: '/client/components/list-item/list-item.html',
        replace: true,
        scope: {
            itemModel: '='
        },
        link: function(scope, elem, attrs) {

        }
    }
}]);