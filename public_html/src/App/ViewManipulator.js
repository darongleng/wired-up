function ViewManipulator(myWorld) {
	this.mMyWorld = myWorld;
    this.dragger = new Dragger(myWorld.mConstColorShader);
    this.mManipulator = new SceneNodeManipulator(myWorld.mConstColorShader);

    this.selectedSceneNodes = null;

    // first click
    this.lastClick = null;
    // current mouse move
    this.currentMouseMove = null;
	// current angle of rotation
	this.currentTheta = 0;
}

ViewManipulator.prototype.detectMouseDown = function (wcX, wcY) {
    console.log("mouse down");
    this.lastClick = [wcX, wcY];

    var mouseOverSelectedShape = this.mManipulator.detectMouseOverShape(wcX, wcY);
    var knob = this.mManipulator.detectKnobCollision(wcX, wcY);

    // check if mouse is click on manipulator's container's scene nodes
    if (mouseOverSelectedShape) {
        this.mManipulator.toMoving();
    } else {
		console.log("Knob: " + knob);
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
        this.selectedSceneNodes = this.mMyWorld.getSceneNodesInArea( transform );
        this.mManipulator.setContainer(this.selectedSceneNodes);
    }

};

ViewManipulator.prototype.detectMouseMove = function (wcX, wcY, eventWhich) {

    this.currentMouseMove = [wcX, wcY];

    var mouseOverShape = this.mMyWorld.detectMouseOverShape(wcX, wcY);
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
		var dx, dy;
        if (this.mManipulator.isMoving())  {
			// translate
            dx = this.currentMouseMove[0] - this.lastClick[0];
            dy = this.currentMouseMove[1] - this.lastClick[1];

            this.lastClick[0] += dx;
            this.lastClick[1] += dy;
            this.mManipulator.translate(dx, dy);
        } else if (this.mManipulator.isRotating()) {
			// rotate
            console.log("rotating");

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
        } else if (this.mManipulator.isScaling()) {
			// scale
			console.log("scaling");

			dx = this.currentMouseMove[0] - this.lastClick[0];
			dy = this.currentMouseMove[1] - this.lastClick[1];

			this.lastClick[0] += dx;
			this.lastClick[1] += dy;

			this.mManipulator.scale(dx, dy, wcX, wcY);
        }
    } else { // if dragger object has started
        this.dragger.drag(wcX, wcY);
        this.selectedSceneNodes = this.mMyWorld.getSceneNodesInArea( this.dragger.getTransformObject() );
        this.mManipulator.setContainer(this.selectedSceneNodes);
    }

};

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
    this.mManipulator.show();
}

ViewManipulator.prototype.detectMouseLeave = function () {
    console.log("mouse leave");
}

ViewManipulator.prototype.draw = function (camera) {
    camera.switchViewport();
    this.dragger.draw(camera);
    this.mManipulator.draw(camera);
};
