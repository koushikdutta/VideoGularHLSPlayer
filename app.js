'use strict';
var myApp = angular.module('myApp',
        [
            "ngSanitize",
            "com.2fdevs.videogular",
            "com.2fdevs.videogular.plugins.controls",
            "com.2fdevs.videogular.plugins.overlayplay",
            "com.2fdevs.videogular.plugins.poster",
            "com.2fdevs.videogular.plugins.buffering",
            "com.2fdevs.videogular.plugins.hls"
        ]
        );
myApp.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);

myApp.controller('HomeCtrl',
        ["$scope", "$sce", "$timeout", function ($scope, $sce, $timeout) {
                var controller = this;
                controller.state = null;
                controller.API = null;
                controller.currentVideo = 0;
                //OnPlayerReady
                controller.onPlayerReady = function (API) {
                    controller.API = API;
                    console.log("OnPlayerReady Called");
                };
                //OnCompleteVideo
                controller.onCompleteVideo = function () {
                    controller.isCompleted = true;
                    console.log("OnCompleteVideo Called");
                };
                //OnError
                controller.onError = function (event) {
                    console.log("VIDEOGULAR ERROR EVENT", event);
                };
                //OnUpdateState
                controller.onUpdateState = function (state) {
                    controller.state = state;
                    console.log("OnUpdateState Called");
                };
                //OnUpdateTime
                controller.onUpdateTime = function (currentTime, totalTime) {
                    controller.currentTime = currentTime;
                    controller.totalTime = totalTime;
                    console.log("[OnUpdateTime] CurrentTime:" + currentTime + ", Duration:" + totalTime);
                };
                //OnSeeking
                controller.onSeeking = function (currentTime, duration) {
                    controller.seeking.currentTime = currentTime;
                    controller.seeking.duration = duration;
                    console.log("[OnSeeking] CurrentTime:" + currentTime + ", Duration:" + duration);
                };
                //OnSeeked
                controller.onSeeked = function (currentTime, duration) {
                    controller.seeked.currentTime = currentTime;
                    controller.seeked.duration = duration;
                    console.log("[OnSeeked] CurrentTime:" + currentTime + ", Duration:" + duration);
                };
                //OnUpdateVolume
                controller.onUpdateVolume = function (newVol) {
                    controller.volume = newVol;
                    console.log("OnUpdateVolume Called. New Volumn:", newVol);
                };
                //OnUpdatePlayback
                controller.onUpdatePlayback = function (newSpeed) {
                    controller.API.playback = newSpeed;
                    console.log("OnUpdatePlayback Called. New Speed:", newSpeed);
                };

                controller.medias = [
                    {
                        sources: [
                            {src: $sce.trustAsResourceUrl("http://content.jwplatform.com/manifests/vM7nH0Kl.m3u8"), type: "application/x-mpegurl"}
                        ]
                    }
                ];

                controller.config = {
                    playsInline: false,
                    nativeFullscreen: true,
                    autoHide: false,
                    autoHideTime: 3000,
                    autoPlay: false,
                    sources: controller.medias[0].sources,
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
                        analytics: {}
                    }
                };

                controller.PlayVideo = function () {
                    controller.API.stop();
                    console.log("Video Url: ", $scope.StreamUrl);
                    controller.medias = [
                        {
                            sources: [
                                {src: $scope.StreamUrl, type: "application/x-mpegurl"}
                            ]
                        }
                    ];
                    controller.config.sources = controller.medias[0].sources;
                    $timeout(controller.API.play.bind(controller.API), 100);
                };
            }]
        );