/*
 * File: MyGame.js
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode, ArmSegment */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ClassExample() {

    this.mConstColorShader = new SimpleShader(
        "src/GLSLShaders/SimpleVS.glsl",      // Path to the VertexShader
        "src/GLSLShaders/SimpleFS.glsl");    // Path to the simple FragmentShader

    this.nodes = []; // this is list is used to stored Scene Nodes
    this.lastNode = null; // this indicates the last create scene node

    this.guideBox = new SquareBorder(this.mConstColorShader);
    this.guideBox.setColor([66/255, 244/255, 179/255, 0.3]); //rgb(66, 244, 179)
}

ClassExample.prototype.getAllSceneNodes = function() {
    return this.nodes;
};

ClassExample.prototype.setGuidBoxSize = function (width, height) {
    this.guideBox.getXform().setSize(width, height);
}

ClassExample.prototype.setGuidBoxPosition = function (wcX, wcY) {
    this.guideBox.getXform().setPosition(wcX, wcY);
}

ClassExample.prototype.addNewSceneNode = function(shape, hexColor, wcX, wcY) {
    var newShape, newNode;
    var rgbColor = hexToRGBA(hexColor);
    
    switch (shape) {
        case 0:
            newShape = new SquareRenderable(this.mConstColorShader);
            newShape.setColor(rgbColor);
            newShape.getXform().setSize(2, 2);
            newShape.getXform().setPosition(0, 0);
            break;

        case 1:
            newShape = new CircleRenderable(this.mConstColorShader);
            newShape.setColor(rgbColor);
            newShape.getXform().setSize(2, 2);
            newShape.getXform().setPosition(0, 0);
            break;

        default:
            return;
    }

    newNode = new SceneNode(this.mConstColorShader, "New Node", false);
    newNode.getXform().setPosition(wcX, wcY);
    newNode.addToSet(newShape);
    this.nodes.push(newNode);
    this.lastNode = newNode;
    return newNode;
};

ClassExample.prototype.combineSceneNodes = function (container, center) {
    var newNode = new SceneNode(this.mConstColorShader, "New Node", false);
    newNode.getXform().setPosition(center[0], center[1]);

    for (var i = 0; i < container.length; i++) {
        var childPos = container[i].getXform().getPosition();
        container[i].getXform().setPosition(center[0]-childPos[0], center[1]-childPos[1]);
        newNode.addAsChild(container[i]);
        // find this node in this.nodes and remove it
        var index = this.nodes.indexOf(container[i]);
        console.log(index);
        if (index > -1) {
            this.nodes.splice(index, 1);
        }
    }

    this.nodes.push(newNode);
    this.lastNode = newNode;
};

ClassExample.prototype.clearNodes = function (container) {
    for (var i = 0; i < container.length; i++) {
        var index = this.nodes.indexOf(container[i]);
        if (index > -1) {
            this.nodes.splice(index, 1);
        }
    }
};

ClassExample.prototype.draw = function (camera, enableGuideBox) {
    // Step F: Starts the drawing by activating the camera
    camera.setupViewProjection();

    for (var i = 0; i < this.nodes.length; i++) {
        this.nodes[i].draw(camera);
    }

    enableGuideBox = enableGuideBox == null ? false : enableGuideBox;
    if (enableGuideBox)
        this.guideBox.draw(camera);
};
