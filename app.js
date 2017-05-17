'use strict';
var myApp = angular.module('myApp',
        [
            "ngSanitize",
            "com.2fdevs.videogular",
            "com.2fdevs.videogular.plugins.controls",
            "com.2fdevs.videogular.plugins.overlayplay",
            "com.2fdevs.videogular.plugins.poster",
            "com.2fdevs.videogular.plugins.buffering",
            "uk.ac.soton.ecs.videogular.plugins.cuepoints",
            "com.2fdevs.videogular.plugins.hls"
        ]
        );
myApp.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);

myApp.directive('setHeight', ['$window', function ($window) {
        return {
            link: link,
            restrict: 'A'
        };
        function link(scope, element, attrs) {
            scope.setWindowAreas = function (element) {
                var deltaHeight = 150;
                var elementHeight = $window.innerHeight;
                var heightUnit = (elementHeight === $window.innerHeight) ? "px" : "%";
                var elementArea = {'Height': (elementHeight - deltaHeight) + heightUnit};
                if (elementHeight !== 0)
                    element.css('height', elementArea.Height);
                //angular.element(element).animate({scrollTop: element.offset().top}, "slow");
            };

            function onResize() {
                scope.setWindowAreas(element);
                scope.$digest();
            }
            function cleanUp() {
                angular.element($window).off('resize', onResize);
                angular.element($window).off('load', onResize);
            }
            angular.element($window).on('resize', onResize);
            angular.element($window).on('load', onResize);
            scope.$on('$destroy', cleanUp);
        }
    }]);

myApp.controller('HomeCtrl',
        ["$scope", "$sce", "$timeout", function ($scope, $sce, $timeout) {

                // <editor-fold defaultstate="collapsed" desc=" -- Player Init Variable -- ">
                var controller = this;
                controller.state = null;
                controller.API = null;
                var _printLog = [];
                controller.currentVideo = 0;
                // </editor-fold>

                // <editor-fold defaultstate="collapsed" desc=" -- Player API's -- ">
                //OnPlayerReady
                controller.onPlayerReady = function (API) {
                    controller.API = API;
                    PlayerLog("OnPlayerReady Called");
                    PlayerLog("[onPlayerReady] Playing Url: " + $sce.valueOf(controller.config.sources[0].src));
                    PlayerButtonState();
                };
                //OnStartPlaying
                controller.onStartPlaying = function () {
                    PlayerLog("onStartPlaying Called");
                };
                //OnCompleteVideo
                controller.onCompleteVideo = function () {
                    controller.isCompleted = true;
                    PlayerLog("OnCompleteVideo Called");
                };
                //OnError
                controller.onError = function (event) {
                    PlayerLog("VIDEOGULAR ERROR EVENT" + event);
                };
                //OnUpdateState
                controller.onUpdateState = function (state) {
                    controller.state = state;
                    PlayerLog("OnUpdateState Called" + state);
                };
                //OnUpdateTime
                controller.onUpdateTime = function (currentTime, totalTime) {
                    controller.currentTime = currentTime;
                    controller.totalTime = totalTime;
                    PlayerLog("[OnUpdateTime] CurrentTime:" + currentTime + ", Duration:" + totalTime);
                };
                //OnSeeking
                controller.onSeeking = function (currentTime, duration) {
                    controller.seeking.currentTime = currentTime;
                    controller.seeking.duration = duration;
                    PlayerLog("[OnSeeking] CurrentTime:" + currentTime + ", Duration:" + duration);
                };
                //OnSeeked
                controller.onSeeked = function (currentTime, duration) {
                    controller.seeked.currentTime = currentTime;
                    controller.seeked.duration = duration;
                    PlayerLog("[OnSeeked] CurrentTime:" + currentTime + ", Duration:" + duration);
                };
                //OnUpdateVolume
                controller.onUpdateVolume = function (newVol) {
                    controller.volume = newVol;
                    PlayerLog("OnUpdateVolume Called. New Volumn:", newVol);
                };
                //OnUpdatePlayback
                controller.onUpdatePlayback = function (newSpeed) {
                    controller.API.playback = newSpeed;
                    PlayerLog("OnUpdatePlayback Called. New Speed:", newSpeed);
                };
                // </editor-fold>

                // <editor-fold defaultstate="collapsed" desc=" -- Player Config Variable -- ">
                var GetVideoUrl = function () {
                    if (typeof $scope.StreamUrl === 'undefined' || $scope.StreamUrl === "")
                    {
                        $scope.StreamUrl = "http://content.jwplatform.com/manifests/vM7nH0Kl.m3u8";
                    }
                    return  [{src: $sce.trustAsResourceUrl($scope.StreamUrl), type: "application/x-mpegurl"}];
                };
                controller.config = {
                    playsInline: false,
                    nativeFullscreen: true,
                    autoHide: true,
                    autoHideTime: 5000,
                    autoPlay: false,
                    sources: GetVideoUrl(),
                    loop: false,
                    preload: "auto",
                    controls: false,
                    theme: {
                        url: "videogular.min.css"
                    }
                    ,
                    plugins: {
                        poster: "videogular.png",
                        ads: {},
                        analytics: {},
                        cuepoints: {
                            theme: {
                                url: "bower_components/videogular-cuepoints/cuepoints.css",
                            },
                            points: [
                                {time: 100},
                                {time: 450}
                            ],
                        }
                    }
                };
                // </editor-fold>

                // <editor-fold defaultstate="collapsed" desc=" -- App Events -- ">
                controller.PlayVideo = function () {
                    if ($scope.StreamState == "Play") {
                        controller.API.stop();
                        PlayerLog("[PlayVideo] Playing Video Url: " + $scope.StreamUrl);
                        controller.config.sources = GetVideoUrl();
                        $timeout(controller.API.play.bind(controller.API), 100);
                        PlayerButtonState("stop");
                    } else {
                        controller.API.stop();
                        PlayerLog("Stop current Video.");
                        PlayerButtonState("play");
                    }
                };

                var PlayerLog = function (data) {
                    var _temp = {currentDate: new Date().getTime(), data: data}
                    _printLog.push(_temp);
                    $scope.player_logs = _printLog.reverse();
                };

                var PlayerButtonState = function (state) {
                    if (typeof state == 'undefined') {
                        $scope.StreamState = "Play";
                        $scope.StreamIcon = "play";
                    } else if (state == "stop") {
                        $scope.StreamState = "Stop";
                        $scope.StreamIcon = "stop";
                    } else if (state == "play") {
                        $scope.StreamState = "Play";
                        $scope.StreamIcon = "play";
                    }
                };
                // </editor-fold>
            }]
        );