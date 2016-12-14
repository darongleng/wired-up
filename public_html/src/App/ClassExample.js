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

    // snManipualtor, sceneNodeManipulator
    this.snManipualtor = new SceneNodeManipulator(this.mConstColorShader);
    this.snManipualtor.getXform().setPosition(0, 2);


    /*
    // adding this.parentNode
    this.square = new SquareRenderable(this.mConstColorShader);
    this.square.setColor([0,0,1,1]);
    //this.square.getXform().setSize(4, 2);
    this.square.getXform().setSize(2, 2);
    this.square.getXform().setPosition(0, 0);
    this.square.getXform().setRotationInRad(Math.PI/2);

    this.parentNode = new SceneNode(this.mConstColorShader, "Root", true);
    this.parentNode.addToSet(this.square);
    this.parentNode.getXform().setPosition(-4, 2);

    this.nodes.push(this.parentNode);


    // adding this.node2
    this.square2 = new SquareRenderable(this.mConstColorShader);
    this.square2.setColor([1,0,0,1]);
    //this.square2.getXform().setSize(6, 2);
    this.square2.getXform().setSize(2, 2);
    this.square2.getXform().setPosition(0, 0);

    this.node2 = new SceneNode(this.mConstColorShader, "Child1", true);
    this.node2.getXform().setPosition(4, 2);
    this.node2.addToSet(this.square2);

    this.nodes.push(this.node2);
    */
}

ClassExample.prototype.getAllSceneNodes = function() {
    return this.nodes;
};

ClassExample.prototype.addNewSceneNode = function(shape) {
    var newShape, newNode;
    switch (shape) {
        case 'circle':
            newShape = new CircleRenderable(this.mConstColorShader);
            newShape.setColor([0,1,0,1]);
            newShape.getXform().setSize(2, 2);
            newShape.getXform().setPosition(0, 0);
            break;

        case 'square':
            newShape = new SquareRenderable(this.mConstColorShader);
            newShape.setColor([0,1,0,1]);
            newShape.getXform().setSize(2, 2);
            newShape.getXform().setPosition(0, 0);
            break;

        case 'triangle':
            return;
            break;

        default:
            return;
            break;
    }

    newNode = new SceneNode(this.mConstColorShader, "New Node", true);
    newNode.getXform().setPosition(0, 0);
    newNode.addToSet(newShape);

    this.nodes.push(newNode);
    this.lastNode = newNode;
};

ClassExample.prototype.combineSceneNodes = function (container, center) {
    var newNode = new SceneNode(this.mConstColorShader, "New Node", true);
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

ClassExample.prototype.draw = function (camera) {
    // Step F: Starts the drawing by activating the camera
    camera.setupViewProjection();

    for (var i = 0; i < this.nodes.length; i++) {
        this.nodes[i].draw(camera);
    }

};
