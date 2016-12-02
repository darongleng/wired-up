/* File: SceneNode.js 
 *
 * Support for grouping of Renderables with custom pivot ability
 */

/*jslint node: true, vars: true */
/*global PivotedTransform, SquareRenderable  */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


function SceneNode(shader, name, drawPivot) {
    this.mName = name;
    this.mSet = [];
    this.mChildren = [];
    this.mXform = new PivotedTransform();

    // this is for debugging only: for drawing the pivot position
    this.mPivotPos = null;
    if ((drawPivot !== undefined) && (drawPivot === true)) {
        this.mPivotPos = new SquareRenderable(shader);
        this.mPivotPos.setColor([255/255, 61/255, 245/255, 1]); // default color
        var xf = this.mPivotPos.getXform();
        xf.setSize(0.2, 0.2); // always this size
    }
}

// ======> functions this SceneNode class <======
SceneNode.prototype.setName = function (n) { this.mName = n; };
SceneNode.prototype.getName = function () { return this.mName; };
SceneNode.prototype.getXform = function () { return this.mXform; };
SceneNode.prototype.setXform = function (newXform) { return this.mXform = newXform; };


// returns xMin, xMax, yMin, yMax
// example of xMin, xMax, yMin, yMax
// imagine there's a bunch of square rendables, give xMin, xMax, yMin, yMax
// so that i can create a sqaure renderable that wraps around all of them
SceneNode.prototype.getBoundingPoints = function(parentMat) {

    parentMat = parentMat || mat4.create();
    var matXform = this.getXform().getXform();
    mat4.multiply(matXform, parentMat, matXform); // concat parent and matXofrm

    var xMin = Number.MAX_SAFE_INTEGER,
        xMax = Number.MIN_SAFE_INTEGER, 
        yMin = Number.MAX_SAFE_INTEGER, 
        yMax = Number.MIN_SAFE_INTEGER;

    var allCorners = this.getAllCornersPositions();
    var corner = null;
    for (var i = 0; i < allCorners.length; i++) {
        // each corner is a point
        corner = allCorners[i];
        xMin = Math.min(xMin, corner[0]);
        xMax = Math.max(xMax, corner[0]);
        yMin = Math.min(yMin, corner[1]);
        yMax = Math.max(yMax, corner[1]);
    }

    return {
        xMin: xMin,
        xMax: xMax,
        yMin: yMin,
        yMax: yMax
    }
}

// this function returns the corners positions of all children scene nodes and renderables
SceneNode.prototype.getAllCornersPositions = function(parentMat, allCorners) {
    parentMat = parentMat || mat4.create();
    var matXform = this.getXform().getXform();
    mat4.multiply(matXform, parentMat, matXform); // concat parent and matXofrm

    allCorners = allCorners || [];

    // iterate through set
    for (var i = 0; i < this.mSet.length; i++) {
        var curShape = this.mSet[i];
        var corners = curShape.getCornersPositions(matXform); // each corner is a point of x and y
                                                              
        if (corners != null) { // ensures shape returns corners
            allCorners.push(corners[0]);
            allCorners.push(corners[1]);
            allCorners.push(corners[2]);
            allCorners.push(corners[3]);
        }                                                              
    }

    // iterate through child
    for (var i = 0; i < this.mChildren.length; i++) {
        var curChild = this.mChildren[i];
        curChild.getAllCornersPositions(matXform, allCorners);
    }

    return allCorners;
}

SceneNode.prototype.contains = function (point, parentMat) {
    parentMat = parentMat || mat4.create();

    var matXform = this.getXform().getXform();
    mat4.multiply(matXform, parentMat, matXform);
    // pass point and concat matrix to children nodes
    var contained = false;
    for (var i = this.mChildren.length-1; i >= 0; i--) {
        var curChild = this.mChildren[i];
        contained =  curChild.contains(point, matXform);
        if (contained)
            return true;
    }

    // pass point and concat matrix to renderables
    for (var i = this.mSet.length-1; i >= 0; i--) {
        var curRenderable = this.mSet[i];
        contained = curRenderable.contains(point, matXform);
        if (contained)
            return true;
    }

    return false;
}


// ======> functions related to this.mSet <======
SceneNode.prototype.size = function () { return this.mSet.length; };
SceneNode.prototype.getRenderableAt = function (index) {
    return this.mSet[index];
};

SceneNode.prototype.addToSet = function (obj) {
    this.mSet.push(obj);
};
SceneNode.prototype.removeFromSet = function (obj) {
    var index = this.mSet.indexOf(obj);
    if (index > -1)
        this.mSet.splice(index, 1);
};
SceneNode.prototype.moveToLast = function (obj) {
    this.removeFromSet(obj);
    this.addToSet(obj);
};

// ======> functions related to this.mChildren, child scene nodes <======
SceneNode.prototype.addAsChild = function (node) {
    this.mChildren.push(node);
};
SceneNode.prototype.removeChild= function (node) {
    var index = this.mChildren.indexOf(node);
    if (index > -1)
        this.mChildren.splice(index, 1);
};

SceneNode.prototype.getChildAt = function (index) {
    return this.mChildren[index];
};
SceneNode.prototype.getChildren = function () {
    return this.mChildren;
};
SceneNode.prototype.hasChild = function () {
    return this.mChildren.length != 0;
};

// checks if the coordinate, wcX and wcY, touches this 
// SceneNodes's center or any of its children's centers
SceneNode.prototype.touchCenter = function (wcX, wcY, parentMat) {
    parentMat = parentMat || mat4.create();

    // get matrix of this object
    var pForm = this.mXform; // pivoted transform
    var matXform = pForm.getXform(); // a matrix for this SceneNode's transform

    var concat = mat4.create();
    mat4.multiply(concat, parentMat, matXform);

    // check if the point touches any child--
    // by iterating from the last child because it appear-- 
    // at the top of view stack.

    for (var i = this.mChildren.length-1; i >= 0; i--) {
        var childMatrix = this.mChildren[i].touchCenter(wcX, wcY, concat);
        if (childMatrix != null) {
            return childMatrix;
        }
    }

    // center of this scene node class relative to its parent in WC
    var center = vec2.fromValues(0, 0);
    vec2.transformMat4(center, center, concat);
    // finally, check if point is within this SceneNode's bound
    if ( this.containsPoint(center, [wcX,wcY]) ) {
        return {parentMatrix: parentMat, transform: this.getXform()};
    }

    // this scene node doesn't contain the point, so
    // return NULL
    return null;
}


// checks if this SceneNode object contains the given point
SceneNode.prototype.containsPoint = function (center, wc) {
    // these are developer-defined width and height
    var width = 1;
    var height = 1;
    return wc[0] <= center[0] + width/2 &&
            wc[0] >= center[0] - width/2 &&
            wc[1] <= center[1] + height/2 &&
            wc[1] >= center[1] - height/2;
}

// ======> draw function <======
SceneNode.prototype.draw = function (aCamera, parentMat) {
    var i;
    var xfMat = this.mXform.getXform();
    if (parentMat !== undefined)
        mat4.multiply(xfMat, parentMat, xfMat);
    
    // Draw our own!
    for (i = 0; i < this.mSet.length; i++) {
        this.mSet[i].draw(aCamera, xfMat); // pass to each renderable
    }
    
    // now draw the children
    for (i = 0; i < this.mChildren.length; i++) {
        this.mChildren[i].draw(aCamera, xfMat); // pass to each renderable
    }
    
    // for debugging, let's draw the pivot position
    if (this.mPivotPos !== null) {
        var pxf = this.getXform();
        var t = pxf.getPosition();
        var p = pxf.getPivot();
        var xf = this.mPivotPos.getXform();
        xf.setPosition(p[0] + t[0], p[1] + t[1]);
        this.mPivotPos.draw(aCamera, parentMat);
    }
};