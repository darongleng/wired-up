var KNOBS = {
    ZERO: 0, FIRST: 1, SECOND: 2, THIRD: 3, FOURTH: 4, FIFTH: 5,
    SIXTH: 6, SEVENTH: 7, ROTATION: 8, LEFT_BAR: 9, TOP_BAR: 10,
    RIGHT_BAR: 11, BOTTOM_BAR: 12, ROTATION_BAR: 13
};

function SceneNodeManipulator(shader) {
	SceneNode.call(this, shader, name);   // calling super class constructor

    this.hidden = true;
    this.container = [];
    this.color = [0/255, 109/255, 255/255,1];
    this.knobSize = 0.2;
    this.barSize = 0.03;
    this.rotationKnobDistance = 1;
    this.init(shader);

    this.moving = false;
    this.rotating = false;
	this.scaling = false;
	this.scaleKnob = null;

	this.minScaleThreshold = 0.5;

}
gEngine.Core.inheritPrototype(SceneNodeManipulator, SceneNode);

SceneNodeManipulator.prototype.detectMouseOverShape = function(wcX, wcY) {
    if (this.hidden)
        return false;

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
    // this.computeSelectedSceneNodePivot();
    return true;
}

SceneNodeManipulator.prototype.hide = function () {
    this.hidden = true;
    this.clearContainer();
    CanvasMouseSupport.CanvasMouse.toDefault();
    return true;
}

SceneNodeManipulator.prototype.isHidden = function () {
    return this.hidden;
}


// ============== MOVING ===================
SceneNodeManipulator.prototype.toMoving = function () {
    this.moving = true;
}

SceneNodeManipulator.prototype.notMoving = function () {
    this.moving = false;
}

SceneNodeManipulator.prototype.isMoving = function () {
    return this.moving;
}

// ============== ROTATING ===================
SceneNodeManipulator.prototype.toRotating = function () {
    this.rotating = true;
}

SceneNodeManipulator.prototype.notRotating = function () {
    this.rotating = false;
	this.scaleKnob = null;
}

SceneNodeManipulator.prototype.isRotating = function () {
    return this.rotating;
}

// ============== SCALING ===================
SceneNodeManipulator.prototype.toScaling = function () {
    this.scaling = true;
};

SceneNodeManipulator.prototype.notScaling = function () {
    this.scaling = false;
	this.scaleKnob = null;
	this.getXform().setSize(1, 1);
};

SceneNodeManipulator.prototype.isScaling = function () {
    return this.scaling;
};

SceneNodeManipulator.prototype.setScaleKnob = function(knob) {
	this.scaleKnob = knob;
};

SceneNodeManipulator.prototype.getScaleKnob = function () {
	return this.scaleKnob;
};

SceneNodeManipulator.prototype.getRotatingKnobPosition = function () {
    // this Manipulator center position
    var center = this.mXform.getPosition();
    // rotation knob position
    var real_position = this.getRenderableAt(KNOBS.ROTATION).getXform().getPosition();
    var knob_position = [real_position[0], real_position[1]];

    // first: rotate, relative to parent
    var angle_rad = this.getXform().getRotationInRad();
    var rotationMat = mat2.create();
    mat2.rotate(rotationMat, rotationMat, angle_rad); // rotation matrix
    vec2.transformMat2(knob_position, knob_position, rotationMat);

    return knob_position;
}

SceneNodeManipulator.prototype.setContainer = function (newSceneNodes) {
    this.container = newSceneNodes;

}

SceneNodeManipulator.prototype.getContainer = function() {
	return this.container;
};

// this function gets called only once through out a selected group of scene nodes
SceneNodeManipulator.prototype.computeSelectedSceneNodePivot = function () {
    var center = this.mXform.getPosition(); // reference to mXform posttion vector
    center = [center[0], center[1]];
    for (var i = 0; i < this.container.length; i++) {
        var xform = this.container[i].getXform();
        var curNodePos = xform.getPosition();
        xform.setPivot(center[0]-curNodePos[0], center[1]-curNodePos[1]);
    }
}

// this function gets called only once through out a selected group of scene nodes
SceneNodeManipulator.prototype.reverseSelectedSceneNodePivot = function () {
    for (var i = 0; i < this.container.length; i++) {
        var xform = this.container[i].getXform();
        var curNodePos = xform.getPosition(); // reference to mXform posttion vector
        // xform.setPosition(0, 0);
        xform.setPivot(0, 0);
    }
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

SceneNodeManipulator.prototype.rotate = function (dTheta) {
    if (this.container.length > 1) // shouldn't be rotating multiple scene nodes
        return;

    var center = this.mXform.getPosition(); // reference to mXform posttion vector
    center = [center[0], center[1]];

    var xform = this.container[0].getXform();
    var curNodePos = xform.getPosition();
    xform.setPivot(0, 0);
    xform.incRotationByRad(dTheta);
    this.mXform.incRotationByRad(dTheta);
}

SceneNodeManipulator.prototype.scale = function(dx, dy) {
    if (this.container.length > 1) // shouldn't be scaling multiple scene nodes
        return;

	var width = dx;
    var height = dy;
    var xform = this.container[0].getXform();
    // scale the child
    scaleNode(width, height, xform, this.getScaleKnob());
	// scale SceneNodeManipulator
    this.computeNewTransform();
};

// helper function for scaling
function scaleNode(width, height, xform, scaleKnob) {
	//console.log(width);
	//console.log(height);

	//spare code
	// xform.setWidth(width);
	// xform.setHeight(height);
	// xform.incWidthBy(width);
	// xform.incHeightBy(height);

	switch (scaleKnob) {
		case KNOBS.ZERO:
			xform.incHeightBy(height);
			break;
		case KNOBS.FIRST:
			/*
			if (manipulator) {
				xform.setWidth(width);
				xform.setHeight(height);
			} else {
				xform.incWidthBy(width);
				xform.incHeightBy(height);
			}
			*/
			xform.incWidthBy(width);
			xform.incHeightBy(height);
			break;
		case KNOBS.SECOND:
			/*
			if (manipulator) {
				xform.setWidth(width);
			} else {
				xform.incWidthBy(width);
			}
			*/
			xform.incWidthBy(width);
			break;
		case KNOBS.THIRD:
			// set correct direction for height
			height = -height;
			xform.incWidthBy(width);
			xform.incHeightBy(height);
			break;
		case KNOBS.FOURTH:
			// set correction direction for height
			height = -height;
			xform.incHeightBy(height);
			break;
		case KNOBS.FIFTH:
			// set correct direction for width & height
			width = -width;
			height = - height;
			xform.incWidthBy(width);
			xform.incHeightBy(height);
			break;
		case KNOBS.SIXTH:
			// set correction direction for width
			width = -width;
			xform.incWidthBy(width);
			break;
		case KNOBS.SEVENTH:
			// set correct direction for width
			width = -width;
			xform.incWidthBy(width);
			xform.incHeightBy(height);
			break;
		// case KNOBS.LEFT_BAR:
		// 	// set correct direction for width
		// 	width = -width;
		// 	xform.incWidthBy(width);
		// 	break;
		// case KNOBS.TOP_BAR:
		// 	xform.incHeightBy(height);
		// 	break;
		// case KNOBS.RIGHT_BAR:
		// 	xform.incWidthBy(width);
		// 	break;
		// case KNOBS.BOTTOM_BAR:
		// 	// set correct direction for height
		// 	height = -height;
		// 	xform.incHeightBy(height);
		// 	break;
		default:
			break;
	}
}

// this function detects if mouse position (in WC) touches any of the knobs
// if it does return true, otherwise false
SceneNodeManipulator.prototype.detectKnobCollision = function(wcX, wcY) {
    if (this.hidden || this.container.length > 1)
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

    for (var i = 0; i < KNOBS.ROTATION+1; i++) {
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
    // if (parentMat !== undefined)
    //     mat4.multiply(xfMat, parentMat, xfMat);

    // Draw our own!
    if (!this.hidden && this.container !== null && this.container.length > 0) {
        // if multiple scene nodes are selected, disable scaling and rotation knobs
        if (this.container.length > 1)
            for (var i = KNOBS.LEFT_BAR; i <= KNOBS.BOTTOM_BAR ; i++) 
                this.mSet[i].draw(aCamera, xfMat); // pass to each renderable

        // if only one scene node is selected, enable scaling and rotation knobs
        else 
            for (var i = this.mSet.length-1; i >= 0 ; i--) 
                this.mSet[i].draw(aCamera, xfMat); // pass to each renderable   
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

    // 8: rotation knob
    obj = new SquareRenderable(shader);
    this.addToSet(obj);
    obj.setColor(this.color);
    obj.getXform().setSize(this.knobSize, this.knobSize);

    // 9: left bar
    obj = new SquareRenderable(shader);
    this.addToSet(obj);
    obj.setColor(this.color);

    // 10: top bar
    obj = new SquareRenderable(shader);
    this.addToSet(obj);
    obj.setColor(this.color);

    // 11: right bar
    obj = new SquareRenderable(shader);
    this.addToSet(obj);
    obj.setColor(this.color);

    // 12: bottom bar
    obj = new SquareRenderable(shader);
    this.addToSet(obj);
    obj.setColor(this.color);

    // 13: rotation bar
    obj = new SquareRenderable(shader);
    this.addToSet(obj);
    obj.setColor(this.color);
}

SceneNodeManipulator.prototype.adaptChildScale = function () {
    if (this.container != null && this.container.length == 1) {
        var child = this.container[0];
        this.mXform.mScale[0] = child.mXform.mScale[0];
        this.mXform.mScale[1] = child.mXform.mScale[1];
    }
}

SceneNodeManipulator.prototype.computeNewTransform = function () {

    this.mXform = new PivotedTransform();

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

    // rotation knob
    xform = this.getRenderableAt(KNOBS.ROTATION).getXform();
    xform.setPosition(0, height/2+this.rotationKnobDistance);

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

    // bottom bar
    xform = this.getRenderableAt(KNOBS.BOTTOM_BAR).getXform();
    xform.setPosition(0, -height/2);
    xform.setSize(width, this.barSize);

    // rotation bar
    xform = this.getRenderableAt(KNOBS.ROTATION_BAR).getXform();
    xform.setPosition(0, height/2+(this.rotationKnobDistance/2));
    xform.setSize(this.barSize, 1);
    
}
