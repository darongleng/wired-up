/*
 * File: MainController.js
 * Container controller for the entire world
 */

/*jslint node: true, vars: true, bitwise: true */
/*global angular, document, ClassExample, Camera, CanvasMouseSupport */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

// Creates the "backend" logical support for appMyExample
var myModule = angular.module("appMyExample", ["CSS450Timer", "CSS450Slider", "CSS450Xform"]);

// registers the constructor for the controller
// NOTE: the constructor is only called _AFTER_ the </body> tag is encountered
//       this code does NOT run until the end of loading the HTML page

myModule.controller("MainCtrl", function ($scope) {
    // Initialize the graphics system
    gEngine.Core.initializeWebGL('GLCanvas');
    var CanvasMouse = new CanvasMouseSupport('GLCanvas');
    $scope.mCanvasMouse = new CanvasMouseSupport('GLCanvas');
    CanvasMouseSupport.CanvasMouse = $scope.mCanvasMouse;

    // this is the model
    $scope.mMyWorld = new ClassExample();
    $scope.mViewManipulator = new ViewManipulator($scope.mMyWorld);

    $scope.mLastWCPosX = 0;
    $scope.mLastWCPosY = 0;
    $scope.mSelectedShape = 'square';

    $scope.mView = new Camera(
                [0, 0],         // wc Center
                32,                // wc Wdith
                [0, 0, 800, 600]);  // viewport: left, bottom, width, height


    // Small overview camera
    $scope.mSmallView = new Camera(
                [0, 0],// wc Center
                32, // wc width
                [700, 500, 100, 100]);    // viewport: left, bottom, width, height
    $scope.mSmallView.setBackgroundColor([0.9, 0.7, 0.7, 1]);

    $scope.mainTimerHandler = function () {
        // Step E: Clear the canvas
        gEngine.Core.clearCanvas([0, 0, 0, 1]);        // Clear the canvas

        $scope.mMyWorld.draw($scope.mView);
        $scope.mMyWorld.draw($scope.mSmallView);
        $scope.mViewManipulator.draw($scope.mView);
    };


    $scope.serviceDown = function (event) {
        var canvasX = $scope.mCanvasMouse.getPixelXPos(event);
        var canvasY = $scope.mCanvasMouse.getPixelYPos(event);
        $scope.mLastWCPosX = this.mView.mouseWCX(canvasX);
        $scope.mLastWCPosY = this.mView.mouseWCY(canvasY);
        $scope.mViewManipulator.detectMouseDown($scope.mLastWCPosX, $scope.mLastWCPosY);
    };

    $scope.serviceMove = function (event) {
        var canvasX = $scope.mCanvasMouse.getPixelXPos(event);
        var canvasY = $scope.mCanvasMouse.getPixelYPos(event);
        $scope.mLastWCPosX = this.mView.mouseWCX(canvasX);
        $scope.mLastWCPosY = this.mView.mouseWCY(canvasY);

        $scope.mViewManipulator.detectMouseMove($scope.mLastWCPosX, $scope.mLastWCPosY, event.which);

        $scope.mMouseOver = $scope.mLastWCPosX.toFixed(2).toString() + " " + $scope.mLastWCPosY.toFixed(2).toString();
        event.preventDefault();
    };

    $scope.serviceUp = function (event) {
        $scope.mViewManipulator.detectMouseUp();
    };

    $scope.serviceLeave = function (event) {
        $scope.mViewManipulator.detectMouseLeave();
    };

    $scope.addSelectedShape = function (shape) {
        $scope.mMyWorld.addNewSceneNode(shape);
        $scope.mSelectedShape = shape;
    };

    $scope.combineSceneNodes = function() {
        var container = $scope.mViewManipulator.mManipulator.getContainer();
        if (container.length > 1) {
            $scope.mMyWorld.combineSceneNodes(container);
        }
    };

    $scope.deleteSceneNode = function() {
        var container = $scope.mViewManipulator.mManipulator.getContainer();
        if (container.length > 0) {
            $scope.mMyWorld.clearNodes(container);
        }
        $scope.mViewManipulator.mManipulator.hide();
    };

});
