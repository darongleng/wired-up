/*
 * File: 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global ClassExample, matrix  */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

// asking ClassExample if it has any scene nodes whose center is at
// the given wcX, wcY
ClassExample.prototype.hasSceneNodeCenterAt = function(wcX, wcY) {
    return this.mParent.touchCenter(wcX, wcY);
}

ClassExample.prototype.defineLastNode = function(wcX, wcY) {
    // set lastNode property to a new SceneNode object
    this.lastNode = new SceneNode(this.mConstColorShader);
}

ClassExample.prototype.releaseLastNode = function(wcX, wcY) {
    this.lastNode = null;
}

// a helper function
function printMatrix(array, row, col) {
    for (var i = 0; i < row; i++) {
        var rowStr = "";
        for (var j = 0; j < col; j++) {
            rowStr += array[(i*col)+j] + ", "
        }
        console.log(rowStr);
    }
}