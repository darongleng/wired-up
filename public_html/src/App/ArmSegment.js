/*
 * File: MyGame.js
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ArmSegment(shader, name, xPivot, yPivot) {
    SceneNode.call(this, shader, name, true);   // calling super class constructor

    var xf = this.getXform();
    xf.setPosition(xPivot, yPivot);

    // now create the children shapes
    var obj = new CircleRenderable(shader);  // The purple circle base
    this.addToSet(obj);
    obj.setColor([0.75, 0.5, 1, 1]);
    xf = obj.getXform();
    xf.setSize(1, 2);
    // xf.setPosition(xPivot, 1 + yPivot);
    xf.setPosition(0, 0);

    obj = new SquareRenderable(shader);  // The right green
    this.addToSet(obj);
    obj.setColor([0, 1, 0, 1]);
    xf = obj.getXform();
    xf.setSize(0.25, 0.25); // so that we can see the connecting point
    // xf.setPosition(xPivot, 1.75 + yPivot);
    xf.setPosition(0.375, 0);

    obj = new SquareRenderable(shader);  // The left green
    this.addToSet(obj);
    obj.setColor([0, 1, 0, 1]);
    xf = obj.getXform();
    xf.setSize(0.25, 0.25); // so that we can see the connecting point
    // xf.setPosition(xPivot, 1.75 + yPivot);
    xf.setPosition(-0.375, 0);

    obj = new SquareRenderable(shader); // The top green
    this.addToSet(obj);
    obj.setColor([0, 0.85, 0.15, 1]);
    xf = obj.getXform();
    xf.setSize(0.25, 0.25); // so that we can see the connecting point
    // xf.setPosition(xPivot+0.5-0.125, yPivot+0.125);
    xf.setPosition(0, 0.375);

    obj = new SquareRenderable(shader); // The bottom green
    this.addToSet(obj);
    obj.setColor([0, 0.85, 0.15, 1]);
    xf = obj.getXform();
    xf.setSize(0.25, 0.25); // so that we can see the connecting point
    // xf.setPosition(xPivot-0.5+0.125, yPivot+0.125);
    xf.setPosition(0, -0.375);

    obj = new CircleRenderable(shader); // The middle red circle
    this.addToSet(obj);
    obj.setColor([1, 0.75, 1, 1]);
    xf = obj.getXform();
    xf.setSize(0.5, 0.5); // so that we can see the connecting point
    xf.setPosition(0, 0);

    this.mPulseRate = 0.005;
    this.mRotateRate = -2;
}
gEngine.Core.inheritPrototype(ArmSegment, SceneNode);

ArmSegment.prototype.update = function () {
    // index-1 is the red-top
    var xf = this.getRenderableAt(1).getXform();
    xf.incRotationByDegree(this.mRotateRate);

    // index-4 is the blue circle
    xf = this.getRenderableAt(4).getXform();
    xf.incSizeBy(this.mPulseRate);
    if (xf.getWidth() > 0.7 || xf.getWidth() < 0.4)
        this.mPulseRate = -this.mPulseRate;
};
