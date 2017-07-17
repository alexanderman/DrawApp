/**
 * stub for user service
 */

angular.module('App')
.provider('userService', ['config', function (config) {

    var baseUrl = config.userBaseUrl || '/api/user/';

    this.setBaseUrl = function (url) {
        if (!url) {
            return baseUrl;
        }

        baseUrl = url;
        return this;
    };


    this.$get = ['$q', function ($q) {

        var _user = {
            _id: 'b1c9be50-e7d6-4eab-a74b-92a5772626fb',
            username: 'Alexander'
            // more details here
        };


        return {
            /**
             * fetches (from server) currently logged in user by cookie
             * @returns {Promise} that is resolved with current user
             */
            fetchCurrentUser: function () {
                return $q.when(_user);
            },

            /** returns previously fetched current user */
            getCurrentUser: function () {
                return _user;
            },


            register: function (email, name, lastName, password) {
            },


            /**
             * fetches user by id
             * @param userId
             * @returns {Promise} that resolves with users public details
             */
            getUser: function (userId) {
                return $q.when({});
            }
        };

    }]

}]);