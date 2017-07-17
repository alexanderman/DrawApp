/**
 * the service is responsible for creating, manipulating and validating canvas model
 */

angular.module('App')
.factory('CanvasModel', [function () {

    function defaultModel(modelJson, user) {
        user = user || {};
        modelJson = modelJson || {};
        var now = new Date();

        /**
         * what happens with created date when user edits
         * someone else's drawings???
         */
        return {
            _id: modelJson._id || undefined,
            userId: modelJson.userId || user._id,
            username: modelJson.username || user.username,
            createdAt: new Date(modelJson.createdAt || now),
            endedAt: new Date(modelJson.endedAt || now),
            timeConsumed: modelJson.timeConsumed || 0,
            data: modelJson.data || {
                type: 'canvas',
                lines: []
            }
        };
    }


    function CanvasModel(modelJson, user) {

        var model = defaultModel(modelJson, user);

        this.updateLines = function (lines) {
            model.data.lines = lines;
            model.timeConsumed = (new Date()).getTime() - model.createdAt.getTime();
            //console.log(model);
        };

        this.updateBase64 = function (data) {
            model.data.base64 = data;
        };

        this.getId = function () {
            return model._id;
        };

        this.lines = function () {
            return model.data.lines;
        };

        /**
         * @returns copy of underlying canvas model
         * to be persisted
         */
        this.getJson = function () {
            var json = angular.copy(model);

            json.createdAt = json.createdAt.toISOString();
            json.endedAt = json.endedAt.toISOString();

            return json;
        }
    }


    return CanvasModel;
}]);