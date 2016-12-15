/*
 * File: MainController.js
 * Container controller for the entire world
 */

/*jslint node: true, vars: true, bitwise: true */
/*global angular, document, ClassExample, Camera, CanvasMouseSupport */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

// Creates the "backend" logical support for appMyExample
var myModule = angular.module("appMyExample",
            ["CSS450Timer", "CSS450Slider", "CSS450Xform", "colorpicker.module"]);

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

    $scope.mColor = "#0BAC8B";

    $scope.mLastWCPosX = 0;
    $scope.mLastWCPosY = 0;

    $scope.mView = new Camera(
                [0, 0],         // wc Center
                40,                // wc Wdith
                [0, 0, 800, 600]);  // viewport: left, bottom, width, height


    // Small overview camera
    $scope.mSmallCamera = new Camera(
                [0, 0],// wc Center
                80,    // wc width
                [700, 500, 100, 100]);    // viewport: left, bottom, width, height

    $scope.mSmallCamera.setBackgroundColor([0.9, 0.7, 0.7, 1]);

    $scope.mainTimerHandler = function () {
        gEngine.Core.clearCanvas([0, 0, 0, 1]);        // Clear the canvas
        // draw big camera with guide box disabled
        $scope.mMyWorld.draw($scope.mView, false); // false for disabling guidebox
        // draw small camera with guide box enabled
        // 1.set guide box size
        var guideBoxWidth = $scope.mView.getWCWidth();
        var guideBoxHeight = $scope.mView.getWCHeight();
        $scope.mMyWorld.setGuidBoxSize(guideBoxWidth, guideBoxHeight);
        // 3.set guide box position
        var guideBoxCenter = $scope.mView.getWCCenter();
        $scope.mMyWorld.setGuidBoxPosition(guideBoxCenter[0], guideBoxCenter[1]);
        // 4.draw small camera
        $scope.mMyWorld.draw($scope.mSmallCamera, true); // true for enabling guidebox
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

        if ($scope.selectedShapeIndex != -1) {
            var position = [$scope.mLastWCPosX, $scope.mLastWCPosY];
            $scope.mViewManipulator.dragShapeIntoCanvas($scope.selectedShapeIndex, 
                    $scope.mColor, $scope.mLastWCPosX, $scope.mLastWCPosY);
            $scope.selectedShapeIndex = -1; // set back to negative one so that nothing will be created again
        }

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

    $scope.selectedShapeIndex = -1;
    $scope.changeShapeState = function (shapeIndex) {
        $scope.selectedShapeIndex = parseInt(shapeIndex);
    };

    $scope.$watch("mColor", function () {
        $scope.mViewManipulator.changeColorOfSelectedNodes($scope.mColor);
    });

    $scope.combineSceneNodes = function() {
        $scope.mViewManipulator.combineSceneNodes();
    };

    $scope.deleteSceneNode = function() {
        var container = $scope.mViewManipulator.mManipulator.getContainer();
        if (container.length > 0) {
            $scope.mMyWorld.clearNodes(container);
        }
        $scope.mViewManipulator.mManipulator.hide();
    };

    var scrollModes = ["translate", "zoom"];
    var currentMode = 0;
    $scope.scrollMode = "translate";
    $scope.oppositeScrollMode = "zoom";
    $scope.changeScrollMode = function() {
        currentMode = (currentMode + 1) % scrollModes.length;
        $scope.scrollMode = scrollModes[currentMode];
        $scope.oppositeScrollMode = scrollModes[(currentMode + 1) % scrollModes.length];
    };




    // Scaling the main canvas!
    //  from: http://stackoverflow.com/questions/2916081/zoom-in-on-a-point-using-scale-and-translate
    var scale = 1;
    var oldScale = 1;
    var scaleChange = 0;
    var zoomIntensity = 0.01;

    var canvas = document.getElementById("GLCanvas");

    canvas.onmousewheel = function (event) {
        // prevent scrolling down the webpage
        event.preventDefault();

        // get mouse position in world coordinates
        var canvasX = $scope.mCanvasMouse.getPixelXPos(event);
        var canvasY = $scope.mCanvasMouse.getPixelYPos(event);
        var wcX = $scope.mView.mouseWCX(canvasX);
        var wcY = $scope.mView.mouseWCY(canvasY);

        var center = $scope.mView.getWCCenter();

        if ($scope.scrollMode === "zoom") {
            // calculate the zoom factor from scrolling
            var wheel = event.wheelDelta/120;
            var zoom = Math.exp(wheel * zoomIntensity);

            // update the scale and calculate the difference between new and old scales
            scale *= zoom;
            scaleChange = scale - oldScale;
            var width = $scope.mView.getWCWidth();
            //console.log(scale);

            // update the viewport width to the scale change + 1
            $scope.mView.setWCWidth(width / (scaleChange + 1));

            // recenter the viewport around the mouse position
            center[0] += scaleChange * wcX;
            center[1] += scaleChange * wcY;
            $scope.mView.setWCCenter(center[0], center[1]);
            // console.log("Scale Change: " + scaleChange);
            // console.log("Center: " + center);

            // update the current scale
            oldScale = scale;
        } else {
            // get horizontal and vertical scroll values
            var wheelX = event.deltaX/120;
            var wheelY = -event.deltaY/120;
            // recenter the viewport around the mouse position
            center[0] += wheelX;
            center[1] += wheelY;
            $scope.mView.setWCCenter(center[0], center[1]);
        }
    };

});
