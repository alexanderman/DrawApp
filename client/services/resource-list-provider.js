/**
 * responsible for fetching resources list
 * paging
 */


angular.module('App')
.provider('resourcesList', ['config', function (config) {

    var baseUrl = config.resourceListBaseUrl || '/api/list/';

    this.setBaseUrl = function (url) {
        if (!url) {
            return baseUrl;
        }

        baseUrl = url;
        return this;
    };


    this.$get = ['$http', '$q', function ($http, $q) {

        function request(path, method, body, params) {
            params = params || {};

            return $http({
                url: baseUrl + path,
                method: method || 'GET',
                data: body || undefined,
                params: params || undefined,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

        return {
            /** return a promise that will be resolved with resources list */
            fetch: function () {
                return request('', 'GET');
            }
        };
    }]


}]);