/*global window, $:false */

/***
 * App.js
 * Defines the behaviour of the EngAGe visual editor.
 */
(function (angular) {
    "use strict";

    // This create a new Angular modu)le called EnGAge
    var engage = angular.module('EnGAge', ['ngResource', 'ui.bootstrap', 'xeditable']);

    // xeditable options
    engage.run(function (editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    });

    // This creates a angular resources to handle the communication with EnGAge backend.
    engage.factory('Config', function ($resource) {
        return $resource('http://146.191.107.189:8080/seriousgame/89/version/0', {}, {
            get: {method: 'GET'}
        });
    });

    // This defines the main controller
    engage.controller('GameCtrl', function ($scope, Config) {
        var feedbackByType, learningOutcomesByFeedback;
        // Initialization
        // 
        $scope.config = Config.get();

        /**
         * Returns the list of learning outcome matching a given feedback
         * @param  {Object} config configuration file
         * @param  {String} name   feedback name
         * @return {Array}         list of learning outcomes
         */
        learningOutcomesByFeedback = function (config, name) {
            var result = [];
            angular.forEach(config.learningOutcomes, function (learningOutcome, loname) {
                angular.forEach(learningOutcome.feedbackTriggered, function (fbt, feedbackTriggeredIdx) {
                    angular.forEach(fbt.feedback, function (fb, feedbackIdx) {
                        if (fb.name === name) {
                            result.push({
                                "learningOutcome": loname,
                                "feedbackTriggeredIdx": feedbackTriggeredIdx,
                                "feedbackIdx": feedbackIdx
                            });
                        }
                    });
                });

            });
            return result;
        };

        /**
         * Returns the feedback of a given type
         * @param  {Object} config configuration file
         * @param  {String} type   filtering type 
         * @return {Array}         List of feedbacks  
         */
        feedbackByType = function (config, type) {
            var result = [];
            angular.forEach(config.feedback, function (fb, fbname) {
                if (fb.type === type) {
                    result.push(fbname);
                }
            });
            return result;
        };

        /**
         * remove a given learning outcome 
         * @param  String lo name of the learning outcome
         */
        $scope.deleteLearningOutcome = function (lo) {

            delete $scope.config.learningOutcomes[lo];
        };

        /**
         * add a new learning outcome 
         */
        $scope.addLearningOutcome = function () {
            // Initialize the data
            $scope.config.learningOutcomes[$scope.newLoName] = {
                desc: "",
                feedbackTriggered: [],
                value: 0
            };

            // Make it editable
            $scope.loInserted = $scope.newLoName;

            // Should reset new name field
            $scope.newLoName = "";
        };

        $scope.$watch('config', function () {
            // Get the list of learning outcome having end_win fb
            $scope.endWins = learningOutcomesByFeedback($scope.config, 'end_win');
            $scope.endLoses = learningOutcomesByFeedback($scope.config, 'end_lose');
            $scope.badges = feedbackByType($scope.config, 'badge');

        }, true);
    });
}(window.angular));