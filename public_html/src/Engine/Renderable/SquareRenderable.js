/*
 * File: SquareRenderable.js
 *
 * draws from the square vertex buffer
 */
/*jslint node: true, vars: true */
/*global gEngine, Renderable */
/* find out more about jslint: http://www.jslint.com/help.html */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function SquareRenderable(shader) {
    Renderable.call(this, shader);
        // Notice how to call the super class constructor!
        // The constructor takes on paramter, but we are calling it with two arguments!
        // First argument says, "this" is the caller of the constructor
}
gEngine.Core.inheritPrototype(SquareRenderable, Renderable);
// This line MUST be defined right after the constructor
// To get all the methods defined in the super-class.prototype

// Ovreride the super-class "draw()" method!
SquareRenderable.prototype.draw = function (camera, parentMat) {
    var gl = gEngine.Core.getGL();
    this.mShader.activateShader(
        gEngine.VertexBuffer.getGLVertexRef(),
        this.mColor,        // this is defined in the super class!
        camera.getVPMatrix());  // always activate the shader first!
    this.computeAndLoadModelXform(parentMat);
    gl.drawArrays(gl.TRIANGLE_STRIP, 54, 4);
};

// The get/set color, and getXform funcitons are inherited


// ================ OVERRDIE ================
// INPUT: parentMat must not be NULL
// returns topLeft, topRight, bottomRight, bottomLeft corner
SquareRenderable.prototype.getCornersPositions = function (parentMat) {

    // get center position
    var center = this.mXform.getPosition();
    var angle_rad = this.getXform().getRotationInRad();
    var rotationMat = mat2.create();
    mat2.rotate(rotationMat, rotationMat, angle_rad); // rotation matrix

    // get width and height
    var width = this.mXform.getWidth();
    var height = this.mXform.getHeight();


    // 1. scales the vectors
    // get top-left position in OC
    var topLeft = [-(width/2), +(height/2)];
    // get top-right position in OC
    var topRight = [(width/2), (height/2)];
    // get bottom-right position in OC
    var bottomRight = [(width/2), -(height/2)];
    // get bottom-left position in OC
    var bottomLeft = [-(width/2), -(height/2)];

    // 2. rotates the vectors
    vec2.transformMat2(topLeft, topLeft, rotationMat);
    vec2.transformMat2(topRight, topRight, rotationMat);
    vec2.transformMat2(bottomRight, bottomRight, rotationMat);
    vec2.transformMat2(bottomLeft, bottomLeft, rotationMat);

    // 3. translates the vectors
    topLeft[0] = topLeft[0]+center[0];
    topLeft[1] = topLeft[1]+center[1];
    topRight[0] = topRight[0]+center[0];
    topRight[1] = topRight[1]+center[1];
    bottomRight[0] = bottomRight[0]+center[0];
    bottomRight[1] = bottomRight[1]+center[1];
    bottomLeft[0] = bottomLeft[0]+center[0];
    bottomLeft[1] = bottomLeft[1]+center[1];


    return [ 
            vec2.transformMat4(topLeft, topLeft, parentMat),
            vec2.transformMat4(topRight, topRight, parentMat),
            vec2.transformMat4(bottomRight, bottomRight, parentMat),
            vec2.transformMat4(bottomLeft, bottomLeft, parentMat)
            ];
}
