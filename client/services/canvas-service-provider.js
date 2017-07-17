angular.module('App')
.provider('canvasService', ['config', function (config) {

    var baseUrl = config.canvasServiceBaseUrl || '/api/drawing/';

    this.setBaseUrl = function (url) {
        if (!url) {
            return baseUrl;
        }

        baseUrl = url;
        return this;
    };


    this.$get = ['$http', function ($http) {

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
            /**
             * fetches drawing by id
             * @param drawingId
             */
            fetch: function(drawingId) {
                return request(drawingId, 'GET');
            },

            /**
             * saves/updates the model to server
             * and returns the updated model
             * @param model
             */
            save: function (model) {
                if (model._id) {
                    return request(model._id, 'PUT', model);
                }
                else {
                    return request('', 'POST', model);
                }
            }

        };

    }]

}]);