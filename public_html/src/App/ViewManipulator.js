
var Shape = {
    SQUARE: 0,
    CIRCLE: 1
}

function ViewManipulator(myWorld) {
	this.mMyWorld = myWorld;
    this.dragger = new Dragger(myWorld.mConstColorShader);
    this.mManipulator = new SceneNodeManipulator(myWorld.mConstColorShader);
    this.lastClick = null; // first click, dummy value
    this.currentMouseMove = [0,0]; // current mouse move, dummy value
	this.currentTheta = 0; // current angle of rotation
    this.clickedSceneNode = null; // holds a clicked-on scene node--not selected

    this.sceneNodeShape = 0; 
}

ViewManipulator.prototype.dragShapeIntoCanvas = function (shapeIndex, hexColor, wcX, wcY) {
    this.sceneNodeShape = shapeIndex; 
    var newNode = this.mMyWorld.addNewSceneNode(shapeIndex, hexColor, wcX, wcY);
    this.clickedSceneNode = newNode;
}

ViewManipulator.prototype.changeColorOfSelectedNodes = function(hexColor) {
    var container = this.mManipulator.getContainer();
    var rgba = hexToRGBA(hexColor);

    for (var i = 0; i < container.length; i++) {
        var children = container[i].mSet;
        for (var j = 0; j < children.length; j++) {
            children[j].setColor(rgba);
        }
    }
}

ViewManipulator.prototype.detectMouseDown = function (wcX, wcY) {
    console.log("mouse down");
    this.lastClick = [wcX, wcY];

    var mouseOverSelectedShape = this.mManipulator.detectMouseOverShape(wcX, wcY);
    this.clickedSceneNode = this.mMyWorld.detectMouseOverShape(wcX, wcY); // detect if mouse click
                                                                    // was on unselected scene node
    if (!mouseOverSelectedShape && this.clickedSceneNode != null) {
        this.mManipulator.hide();
        return;                                                                
    } else { // if there's some selected shape
        this.clickedSceneNode = null; // ensure clickdSceneNode is null
    }

    var knob = this.mManipulator.detectKnobCollision(wcX, wcY);

    // check if mouse is click on manipulator's container's scene nodes
    if (mouseOverSelectedShape) {
        this.mManipulator.toMoving();
    } else {
        switch (knob) { // check if mouse is clicked on any known knob
            case KNOBS.ROTATION:
                this.mManipulator.toRotating();
                break;
			case KNOBS.ZERO:
				this.mManipulator.toScaling();
				this.mManipulator.setScaleKnob(knob);
				break;
			case KNOBS.FIRST:
				this.mManipulator.toScaling();
				this.mManipulator.setScaleKnob(knob);
				break;
			case KNOBS.SECOND:
				this.mManipulator.toScaling();
				this.mManipulator.setScaleKnob(knob);
				break;
			case KNOBS.THIRD:
				this.mManipulator.toScaling();
				this.mManipulator.setScaleKnob(knob);
				break;
			case KNOBS.FOURTH:
				this.mManipulator.toScaling();
				this.mManipulator.setScaleKnob(knob);
				break;
			case KNOBS.FIFTH:
				this.mManipulator.toScaling();
				this.mManipulator.setScaleKnob(knob);
				break;
			case KNOBS.SIXTH:
				this.mManipulator.toScaling();
				this.mManipulator.setScaleKnob(knob);
				break;
			case KNOBS.SEVENTH:
				this.mManipulator.toScaling();
				this.mManipulator.setScaleKnob(knob);
				break;
			case KNOBS.LEFT_BAR:
				this.mManipulator.toScaling();
				this.mManipulator.setScaleKnob(knob);
				break;
			case KNOBS.TOP_BAR:
				this.mManipulator.toScaling();
				this.mManipulator.setScaleKnob(knob);
				break;
			case KNOBS.RIGHT_BAR:
				this.mManipulator.toScaling();
				this.mManipulator.setScaleKnob(knob);
				break;
			case KNOBS.BOTTOM_BAR:
				this.mManipulator.toScaling();
				this.mManipulator.setScaleKnob(knob);
				break;
        }
    }

    if (knob == -1 && !mouseOverSelectedShape) {
        this.dragger.start(wcX, wcY);
        this.mManipulator.hide();

        var transform = new Transform();
        transform.setPosition(wcX, wcY);
        var selectedSceneNodes = this.mMyWorld.getSceneNodesInArea( transform );
        this.mManipulator.setContainer(selectedSceneNodes);
    }

};

ViewManipulator.prototype.detectMouseMove = function (wcX, wcY, eventWhich) {
    this.currentMouseMove = [wcX, wcY];
    var mouseOverShape = this.mMyWorld.detectMouseOverShape(wcX, wcY) == null ? false : true;
    var knob = this.mManipulator.detectKnobCollision(wcX, wcY);

    if (knob != -1) {
        CanvasMouseSupport.CanvasMouse.toPointer();
    } else if (mouseOverShape) {
        CanvasMouseSupport.CanvasMouse.toPointer();
    } else {
        CanvasMouseSupport.CanvasMouse.toDefault();
    }

    if (eventWhich != 1)  // not left mouse drag
        return;


    if (!this.dragger.isDragging()) {
        if (this.lastClick == null)  // so that when dragging into canvas properly
            this.lastClick = [wcX, wcY];
        
		var dx = this.currentMouseMove[0] - this.lastClick[0],
            dy = this.currentMouseMove[1] - this.lastClick[1];
        this.lastClick[0] += dx;
        this.lastClick[1] += dy;

        if (this.mManipulator.isMoving())  {
            // translate
            this.mManipulator.translate(dx, dy);
        } else if (this.clickedSceneNode != null) {
            var xform = this.clickedSceneNode.getXform();
            xform.incXPosBy(dx);
            xform.incYPosBy(dy);
        } else if (this.mManipulator.isRotating()) { // rotate
            var xform = this.mManipulator.getXform();
            // manipulator position
            var manipulator_position = xform.getPosition();
            // calculate mouse move position vector
            var mouseMove_vector = [wcX-manipulator_position[0] , wcY-manipulator_position[1]];
            // get rotating knob's position vector
            var rotating_knob_vector = this.mManipulator.getRotatingKnobPosition();

            //compute angle between two vectors
            var dTheta = calculateAnchor(mouseMove_vector, rotating_knob_vector);
            // update the angle of manipulator and its container's scene nodes
            this.mManipulator.rotate(dTheta);
			this.currentTheta += dTheta;
            this.lastClick[0] = wcX;
            this.lastClick[1] = wcY;
        } else if (this.mManipulator.isScaling()) { // scale
            this.mManipulator.scale(dx, dy);
        }
    } else { // if dragger object has started
        this.dragger.drag(wcX, wcY);
        var selectedSceneNodes = this.mMyWorld.getSceneNodesInArea( this.dragger.getTransformObject() );
        this.mManipulator.setContainer(selectedSceneNodes);
    }

};

ViewManipulator.prototype.combineSceneNodes = function () {
    var container = this.mManipulator.container;

    if (container.length <= 0 || container.length == 1)
        return;

    var xMin = Number.MAX_SAFE_INTEGER,
        xMax = Number.MIN_SAFE_INTEGER,
        yMin = Number.MAX_SAFE_INTEGER,
        yMax = Number.MIN_SAFE_INTEGER;

    for (var i = 0; i < container.length; i++) {
        curNode = container[i];
        bound = curNode.getBoundingPoints();
        xMin = Math.min(xMin, bound.xMin);
        xMax = Math.max(xMax, bound.xMax);
        yMin = Math.min(yMin, bound.yMin);
        yMax = Math.max(yMax, bound.yMax);
    }

    var width = xMax-xMin;
    var height = yMax-yMin;
    var center = [xMin+width/2, yMin+height/2];

    this.mMyWorld.combineSceneNodes(container, center);
}

function calculateAnchor(vector1, vector2) {

    // calculate vector1_theta
    var vector1_dist = vec2.distance([0,0], vector1);
    var vector1_theta = Math.acos(vector1[0] / vector1_dist);
    // because the acos allows only from 0 - 180;
    // so more computation is neded to get from 0-360
    if (vector1[1] < 0) vector1_theta = 2*Math.PI-vector1_theta;

    // calculate vector2_theta
    var vector2_dist = vec2.distance([0,0], vector2);
    var vector2_theta = Math.acos(vector2[0] / vector2_dist);
    // because the acos allows only from 0 - 180;
    // so more computation is neded to get from 0-360
    if (vector2[1] < 0) vector2_theta = 2*Math.PI-vector2_theta;

    // find difference in angle
    var theta = vector1_theta-vector2_theta;

    return theta;
}

ViewManipulator.prototype.detectMouseUp = function () {
    console.log("mouse up");
    this.dragger.release();
    this.mManipulator.notMoving();
    this.mManipulator.notRotating();
	this.mManipulator.notScaling();
    if (this.clickedSceneNode != null) 
        this.mManipulator.setContainer([this.clickedSceneNode]);
    this.mManipulator.show();
    this.clickedSceneNode = null;
}

ViewManipulator.prototype.detectMouseLeave = function () {
    console.log("mouse leave");
    this.lastClick = null;
}

ViewManipulator.prototype.draw = function (camera) {
    camera.switchViewport();
    this.dragger.draw(camera);
    this.mManipulator.draw(camera);
};
