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

    this.square = new SquareRenderable(this.mConstColorShader);
    this.square.setColor([0,0,1,1]);
    this.square.getXform().setSize(4, 2);
    this.square.getXform().setPosition(-5, 0);
    this.square.getXform().setRotationInRad(Math.PI/4);

    this.square1 = new SquareRenderable(this.mConstColorShader);
    this.square1.setColor([0,1,0,1]);
    this.square1.getXform().setSize(7, 1);
    this.square1.getXform().setPosition(2, 3);
    this.square1.getXform().setRotationInRad(-Math.PI/4);

    this.parentNode = new SceneNode(this.mConstColorShader, "Root");
    this.parentNode.addToSet(this.square);
    this.parentNode.addToSet(this.square1);
    this.parentNode.getXform().setPosition(-4, 0);

    this.square2 = new SquareRenderable(this.mConstColorShader);
    this.square2.setColor([1,0,0,1]);
    this.square2.getXform().setSize(4, 4);
    this.square2.getXform().setPosition(0, 0);

    this.node2 = new SceneNode(this.mConstColorShader, "Child1");
    this.node2.getXform().setPosition(8, 4);
    this.node2.addToSet(this.square2);

    this.nodes.push(this.parentNode);
    this.nodes.push(this.node2);

    // console.log(this.parentNode.getBoundingPoints());
    console.log(this.node2.getBoundingPoints());
}

ClassExample.prototype.getManipulatorNode = function() {
    return this.snManipualtor;
}

ClassExample.prototype.getAllSceneNodes = function() {
    return this.nodes;
}

ClassExample.prototype.draw = function (camera) {
    // Step F: Starts the drawing by activating the camera
    camera.setupViewProjection();

    for (var i = 0; i < this.nodes.length; i++) {
        this.nodes[i].draw(camera);
    }

    if (!this.snManipualtor.isHidden())
        this.snManipualtor.draw(camera);
};

