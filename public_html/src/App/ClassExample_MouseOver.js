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

ClassExample.prototype.getSceneNodesInArea = function (pTransform) {
    var center = pTransform.getPosition(); //[x, y]
    var width = pTransform.getWidth();
    var height = pTransform.getHeight();
    var drag_xMin = center[0]-width/2,
        drag_xMax = center[0]+width/2,
        drag_yMin = center[1]-height/2,
        drag_yMax = center[1]+height/2;

    var children = this.getAllSceneNodes();

    var containedChildren = [];

    for (var i = 0; i < children.length; i++) {
        var curChild = children[i];
        var  bound = curChild.getBoundingPoints(); // x and y min, max

        var zero = drag_xMin >= bound.xMin && drag_xMax <= bound.xMax, // zero quandrant
            first = drag_xMax >= bound.xMax && drag_yMax >= bound.yMax,
            second = drag_yMin >= bound.yMin && drag_yMax <= bound.yMax,
            third = drag_xMax >= bound.xMax && drag_yMin <= bound.yMin,
            fourth = zero,
            fifth = drag_xMin <= bound.xMin && drag_yMin <= bound.yMin,
            sixth = second,
            seventh = drag_xMin <= bound.xMin && drag_yMax >= bound.yMax;

        if (zero) { // can also be fourth
            if (drag_yMin <= bound.yMin && drag_yMax >= bound.yMin || // fourth
                drag_yMin <= bound.yMax && drag_yMax >= bound.yMax || second ) // zero || second
                    containedChildren.push(curChild);

        } else if (first) {
            if (drag_xMin <= bound.xMax && drag_yMin <= bound.yMax)
                containedChildren.push(curChild);

        }else if (second) { // can also be sixth
          
            if (drag_xMin <= bound.xMin && drag_xMax >= bound.xMin || // sixth
                drag_xMin <= bound.xMax && drag_xMax >= bound.xMax ) // second
                    containedChildren.push(curChild)

        } else if (third) {
    
            if (drag_xMin <= bound.xMax && drag_yMax >= bound.yMin)
                containedChildren.push(curChild);

        } else if (fifth) {

            if (drag_xMax >= bound.xMin && drag_yMax >= bound.yMin)
                containedChildren.push(curChild);

        } else if (seventh) {

            if (drag_xMax >= bound.xMin && drag_yMin <= bound.yMax)
                containedChildren.push(curChild);

        } 
    }

    return containedChildren;
}

ClassExample.prototype.detectMouseOverShape = function(wcX, wcY) {
    for (var i = 0; i < this.nodes.length; i++) {
        var curNode = this.nodes[i];
        if (curNode.contains([wcX, wcY])) {
            return this.nodes[i];
        }
    }
    return null;
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