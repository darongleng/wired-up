/*
 * File: EngineCore_VertexBuffer.js
 *
 * defines the object that supports the loading and using of the buffer that
 * contains vertex positions of a square onto the gGL context
 *
 * Notice, this is a singleton object.
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Float32Array: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || { };

// The VertexBuffer object
gEngine.VertexBuffer = (function () {
    // reference to the vertex positions for the square in the gl context
    var mSquareVertexBuffer = null;

    // First: define the verticies for a circle
    var circle = {x: 0, y: 0, r: 0.5};
    var ATTRIBUTES = 3;
    var numFans = 52;
    var degreePerFan = (2 * Math.PI) / numFans;
    var vertexData = [circle.x, circle.y, 0.0];

    for(var i = 0; i <= numFans; i++) {
      var index = ATTRIBUTES * i + 3; // there are already 3 items in array
      var angle = degreePerFan * (i+1);
      vertexData[index] = circle.x + Math.cos(angle) * circle.r;
      vertexData[index + 1] = circle.y + Math.sin(angle) * circle.r;
      vertexData[index + 2] = 0.0;
    }

    // Second: define the vertices for a square
    vertexData.push(
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    );

    // Third: define the vertices of a triangle
    vertexData.push(
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.0, 0.0, 0.0
    );

    var initialize = function () {
        var gl = gEngine.Core.getGL();

        // Step A: Create a buffer on the gGL context for our vertex positions
        mSquareVertexBuffer = gl.createBuffer();

        // Step B: Activate vertexBuffer
        gl.bindBuffer(gl.ARRAY_BUFFER, mSquareVertexBuffer);

        // Step C: Loads verticesOfSquare into the vertexBuffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
    };

    var getGLVertexRef = function () { return mSquareVertexBuffer; };

    var mPublic = {
        initialize: initialize,
        getGLVertexRef: getGLVertexRef
    };

    return mPublic;
}());
