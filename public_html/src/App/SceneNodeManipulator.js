var KNOBS = {
	TOP: 0,
	MIDDLE: 1,
	RIGHT: 2
};

function SceneNodeManipulator(shader) {
	SceneNode.call(this, shader, name);   // calling super class constructor

	var knobSize = 0.4;
    var xf = this.getXform();
    xf.setPivot(0, 0);

    // now create the children shapes
    // 0: vertical line
    var obj = new SquareRenderable(shader);
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(0.1, 3);
    xf.setPosition(0, 1.5);

    // 1: horizontal line
    obj = new SquareRenderable(shader);
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(3, 0.1);
    xf.setPosition(1.5, 0);

    // 2: top knob
    obj = new SquareRenderable(shader);  // The red top
    this.addToSet(obj);
    obj.setColor([1, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(knobSize, knobSize);
    xf.setPosition(0, 3);

    // 3: middle knob
    obj = new SquareRenderable(shader);
    this.addToSet(obj);
    obj.setColor([1, 1, 1, 1]);
    xf = obj.getXform();
    xf.setSize(knobSize, knobSize);
    xf.setPosition(0, 0);

    // 4: right knob
    obj = new SquareRenderable(shader);  // The red top
    this.addToSet(obj);
    obj.setColor([97/255, 232/255, 249/255, 1]);
    xf = obj.getXform();
    xf.setSize(knobSize, knobSize);
    xf.setPosition(3, 0);

    this.parentMat = null;
    this.hidden = true;
    this.mouseOnTopKnob = false;
    this.mouseOnMiddleKnob = false;
    this.mouseOnRightKnob = false;

}
gEngine.Core.inheritPrototype(SceneNodeManipulator, SceneNode);

// this function detects if mouse position (in WC) touches any of the knobs
// if it does return true, otherwise false
SceneNodeManipulator.prototype.detectKnobCollision = function(wcX, wcY) {
	var rootXform = this.getXform(); // pivoted transform of this SceneNodes
	var wcPos = [wcX, wcY];

	// get root matrix
	var rootMatrix = rootXform.getXform();
    // calculate this matrix with repsect to its parent
    this.parentMat = this.parentMat || mat4.create();
    // coverts root matrix with respect to parent matrix in WC
    mat4.multiply(rootMatrix, this.parentMat, rootMatrix);

	// checks top knob
	var childPosOC = this.getRenderableAt(2).getXform().getPosition();
	var childPosWC = this.convertPosRelativeToRoot(childPosOC, rootMatrix);
	if (this.withInBound(childPosWC, wcPos)){
		// console.log("touches top knob " );
		return KNOBS.TOP;
	}
	// checks middle knob
	var childPosOC = this.getRenderableAt(3).getXform().getPosition();
	var childPosWC = this.convertPosRelativeToRoot(childPosOC, rootMatrix);
	if (this.withInBound(childPosWC, wcPos)){
		// console.log("touches middle knob " );
		return KNOBS.MIDDLE;
	}

	// checks right knob
	var childPosOC = this.getRenderableAt(4).getXform().getPosition();
	var childPosWC = this.convertPosRelativeToRoot(childPosOC, rootMatrix);
	if (this.withInBound(childPosWC, wcPos)){
		// console.log("touches right knob " );
		return KNOBS.RIGHT;
	}

	// no knob clicked
	return null;
}

SceneNodeManipulator.prototype.getTopKnobPosition = function() {
    return this.getRenderableAt(2).getXform().getPosition();
}

SceneNodeManipulator.prototype.show = function (parentMat) {
    this.hidden = false;
}

SceneNodeManipulator.prototype.hide = function (parentMat) {
    this.hidden = true;
}

SceneNodeManipulator.prototype.isHidden = function (parentMat) {
    return this.hidden;
}

SceneNodeManipulator.prototype.setParentMatrix = function (parentMat) {
    this.parentMat = parentMat;
}

SceneNodeManipulator.prototype.getParentMatrix = function (parentMat) {
    return this.parentMat || mat4.create();
}

SceneNodeManipulator.prototype.activateTopKnob = function() {
    this.mouseOnTopKnob = true;
    this.mouseOnMiddleKnob = false;
    this.mouseOnRightKnob = false;
}

SceneNodeManipulator.prototype.isTopKnobActivated = function() {
    return this.mouseOnTopKnob;
}

SceneNodeManipulator.prototype.activateMiddleKnob = function() {
    this.mouseOnTopKnob = false;
    this.mouseOnMiddleKnob = true;
    this.mouseOnRightKnob = false;
}

SceneNodeManipulator.prototype.isMiddleKnobActivated = function() {
    return this.mouseOnMiddleKnob;
}

SceneNodeManipulator.prototype.activateRightKnob = function() {
    this.mouseOnTopKnob = false;
    this.mouseOnMiddleKnob = false;
    this.mouseOnRightKnob = true;
}

SceneNodeManipulator.prototype.isRightKnobActivated = function() {
    return this.mouseOnRightKnob;
}

SceneNodeManipulator.prototype.deactivateAllKnobs = function() {
    this.mouseOnTopKnob = false;
    this.mouseOnMiddleKnob = false;
    this.mouseOnRightKnob = false;
}

// =====> OVERRIDE FUNTIONS <=====
SceneNodeManipulator.prototype.draw = function(aCamera) {
    SceneNode.prototype.draw.call(this, aCamera, this.parentMat || mat4.create());
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
