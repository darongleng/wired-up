function SceneNodeManipulator(shader) {
	SceneNode.call(this, shader, name);   // calling super class constructor

    this.hidden = true;
    this.container = [];
    this.color = [0/255, 109/255, 255/255,1];
    this.knobSize = 0.2;
    this.barSize = 0.03;	
    this.init(shader);


    this.moving = false;
    
}
gEngine.Core.inheritPrototype(SceneNodeManipulator, SceneNode);

SceneNodeManipulator.prototype.detectMouseOverShape = function(wcX, wcY) {
    for (var i = 0; i < this.container.length; i++) {
        var curNode = this.container[i];
        if (curNode.contains([wcX, wcY])) {
            return true;
        }
    }
    return false;
}

// RETURN: true, indicates show successfully. false otherwise.
SceneNodeManipulator.prototype.show = function () {
    if (this.container.length <= 0) {
        this.hide();
        return false;
    }
    this.hidden = false;
    this.computeNewTransform();
    return true;
}

SceneNodeManipulator.prototype.hide = function () {
    this.hidden = true;
    this.clearContainer();
    CanvasMouseSupport.CanvasMouse.toDefault();
    return true;
}

SceneNodeManipulator.prototype.toMoving = function (moving) {
    this.moving = moving;
}

SceneNodeManipulator.prototype.notMoving = function () {
    this.moving = false;
}

SceneNodeManipulator.prototype.isMoving = function () {
    return this.moving;
}

SceneNodeManipulator.prototype.isHidden = function () {
    return this.hidden;
}

SceneNodeManipulator.prototype.setContainer = function (newSceneNodes) {
    this.container = newSceneNodes;
}

SceneNodeManipulator.prototype.clearContainer = function () {
    this.container = [];
}

SceneNodeManipulator.prototype.translate = function (dx, dy) {
    for (var i = 0; i < this.container.length; i++) {
        var curNode = this.container[i];
        var xForm = curNode.getXform();
        var curPos = xForm.getPosition();
        xForm.setPosition(curPos[0]+dx, curPos[1]+dy);
    }
    this.mXform.incXPosBy(dx);
    this.mXform.incYPosBy(dy);

}

// this function detects if mouse position (in WC) touches any of the knobs
// if it does return true, otherwise false
SceneNodeManipulator.prototype.detectKnobCollision = function(wcX, wcY) {
    if (this.hidden)
        return -1;

    var mouse = CanvasMouseSupport.CanvasMouse;
    var rootXform = this.getXform(); // pivoted transform of this SceneNodes
    var wcPos = [wcX, wcY];

    // get root matrix
    var rootMatrix = rootXform.getXform();
    // calculate this matrix with repsect to its parent
    this.parentMat = this.parentMat || mat4.create();
    // coverts root matrix with respect to parent matrix in WC
    mat4.multiply(rootMatrix, this.parentMat, rootMatrix);

    for (var i = 0; i < 8; i++) {
        // checks top knob
        var childPosOC = this.getRenderableAt(i).getXform().getPosition();
        var childPosWC = this.convertPosRelativeToRoot(childPosOC, rootMatrix);
        if (this.withInBound(childPosWC, wcPos)){
            return i;
        }    
    }

    // no knob clicked
    return -1;
}

// =====> OVERRIDE FUNTIONS <=====
SceneNodeManipulator.prototype.draw = function(aCamera, parentMat) {
    var xfMat = this.mXform.getXform();
    if (parentMat !== undefined)
        mat4.multiply(xfMat, parentMat, xfMat);
    
    // Draw our own!
    if (!this.hidden && this.container !== null && this.container.length > 0) {
        for (var i = this.mSet.length-1; i >= 0 ; i--) {
            this.mSet[i].draw(aCamera, xfMat); // pass to each renderable
        }
    }
    
}

// =====> PRIVATE FUNTIONS <=====
SceneNodeManipulator.prototype.convertPosRelativeToRoot = function (childPosOC, rootMatrix) {
	var childPosWC = vec2.fromValues(0,0);
	vec2.transformMat4(childPosWC, childPosOC, rootMatrix);
	return childPosWC;
}

var kBoundTol = 0.3;
// check if (wcx, wcy) is close enough to (px, py) by kBountTol
SceneNodeManipulator.prototype.withInBound = function (p, wc) {
    return ( ((p[0] - kBoundTol) < wc[0]) &&
        ((p[0] + kBoundTol) > wc[0]) &&
        ((p[1] - kBoundTol) < wc[1]) &&
        ((p[1] + kBoundTol) > wc[1] ) );
};

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

SceneNodeManipulator.prototype.init = function (shader) {
    // now create the children shapes
    var obj = null;
    // 0: top middle knob
    obj = new SquareRenderable(shader);
    this.addToSet(obj);
    obj.setColor(this.color);
    obj.getXform().setSize(this.knobSize, this.knobSize);

    // 1: top right knob
    obj =  new SquareRenderable(shader);
    this.addToSet(obj);
    obj.setColor(this.color);
    obj.getXform().setSize(this.knobSize, this.knobSize);

    // 2: right middle knob
    obj = new SquareRenderable(shader); 
    this.addToSet(obj);
    obj.setColor(this.color);
    obj.getXform().setSize(this.knobSize, this.knobSize);

    // 3: bottom right knob
    obj = new SquareRenderable(shader);
    this.addToSet(obj);
    obj.setColor(this.color);
    obj.getXform().setSize(this.knobSize, this.knobSize);

    // 4: bottom middle knob
    obj = new SquareRenderable(shader); 
    this.addToSet(obj);
    obj.setColor(this.color);
    obj.getXform().setSize(this.knobSize, this.knobSize);

    // 5: bottom left knob
    obj = new SquareRenderable(shader);  
    this.addToSet(obj);
    obj.setColor(this.color);
    obj.getXform().setSize(this.knobSize, this.knobSize);

    // 6: left middle knob
    obj = new SquareRenderable(shader); 
    this.addToSet(obj);
    obj.setColor(this.color);
    obj.getXform().setSize(this.knobSize, this.knobSize);

    // 7: top left knob
    obj = new SquareRenderable(shader);  
    this.addToSet(obj);
    obj.setColor(this.color);
    obj.getXform().setSize(this.knobSize, this.knobSize);

    // 8: left bar
    obj = new SquareRenderable(shader);  
    this.addToSet(obj);
    obj.setColor(this.color);

    // 9: top bar
    obj = new SquareRenderable(shader); 
    this.addToSet(obj);
    obj.setColor(this.color);

    // 10: right bar
    obj = new SquareRenderable(shader); 
    this.addToSet(obj);
    obj.setColor(this.color);

    // 11: bottom bar
    obj = new SquareRenderable(shader);  
    this.addToSet(obj);
    obj.setColor(this.color);
}

SceneNodeManipulator.prototype.computeNewTransform = function () {

    var curNode = null;
    var bound = null;
    var xMin = Number.MAX_SAFE_INTEGER,
        xMax = Number.MIN_SAFE_INTEGER, 
        yMin = Number.MAX_SAFE_INTEGER, 
        yMax = Number.MIN_SAFE_INTEGER;

    for (var i = 0; i < this.container.length; i++) {
        curNode = this.container[i];
        bound = curNode.getBoundingPoints();
        xMin = Math.min(xMin, bound.xMin);
        xMax = Math.max(xMax, bound.xMax);
        yMin = Math.min(yMin, bound.yMin);
        yMax = Math.max(yMax, bound.yMax);
    }

    var width = xMax-xMin;
    var height = yMax-yMin;
    var center = [xMin+width/2, yMin+height/2];

    this.mXform.setPosition(center[0], center[1]);

    var xform = null;
    // knob 0
    xform = this.getRenderableAt(KNOBS.ZERO).getXform();
    xform.setPosition(0, height/2);
    // knob 1
    xform = this.getRenderableAt(KNOBS.FIRST).getXform();
    xform.setPosition(width/2, height/2);
    // knob 2
    xform = this.getRenderableAt(KNOBS.SECOND).getXform();
    xform.setPosition(width/2, 0);
    // knob 3
    xform = this.getRenderableAt(KNOBS.THIRD).getXform();
    xform.setPosition(width/2, -height/2);
    // knob 4
    xform = this.getRenderableAt(KNOBS.FOURTH).getXform();
    xform.setPosition(0, -height/2);
    // knob 5
    xform = this.getRenderableAt(KNOBS.FIFTH).getXform();
    xform.setPosition(-width/2, -height/2);
    // knob 6
    xform = this.getRenderableAt(KNOBS.SIXTH).getXform();
    xform.setPosition(-width/2, 0);
    // knob 7
    xform = this.getRenderableAt(KNOBS.SEVENTH).getXform();
    xform.setPosition(-width/2, height/2);

    // left bar
    xform = this.getRenderableAt(KNOBS.LEFT_BAR).getXform();
    xform.setPosition(-width/2, 0);
    xform.setSize(this.barSize, height);

    // top bar
    xform = this.getRenderableAt(KNOBS.TOP_BAR).getXform();
    xform.setPosition(0, height/2);
    xform.setSize(width, this.barSize);

    // right bar
    xform = this.getRenderableAt(KNOBS.RIGHT_BAR).getXform();
    xform.setPosition(width/2, 0);
    xform.setSize(this.barSize, height);

    // // bottom bar
    xform = this.getRenderableAt(KNOBS.BOTTOM_BAR).getXform();
    xform.setPosition(0, -height/2);
    xform.setSize(width, this.barSize);
}

var KNOBS = {
    ZERO: 0, FIRST: 1, SECOND: 2, THIRD: 3, FOURTH: 4, FIFTH: 5,
    SIXTH: 6, SEVENTH: 7, LEFT_BAR: 8, TOP_BAR: 9, RIGHT_BAR: 10,
    BOTTOM_BAR: 11, MOUSE_ON_SHAPE: 12
};
