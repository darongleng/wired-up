function ViewManipulator(myWorld) {
	this.mMyWorld = myWorld;
    this.dragger = new Dragger(myWorld.mConstColorShader);
    this.mManipulator = new SceneNodeManipulator(myWorld.mConstColorShader);

    this.selectedSceneNodes = null;

    // first click
    this.lastClick = null; 
    // current mouse move
    this.currentMouseMove = null;
}

ViewManipulator.prototype.detectMouseDown = function (wcX, wcY) {
    console.log("mouse down");

    this.lastClick = [wcX, wcY];

    var mouseOverSelectedShape = this.mManipulator.detectMouseOverShape(wcX, wcY);
    
    if (!mouseOverSelectedShape) {
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

    if (eventWhich != 1) { // not left mouse drag
        return;
    }

    if (!this.mManipulator.isMoving()) {
        var mouseOverShape = this.mManipulator.detectMouseOverShape(wcX, wcY);
        this.mManipulator.toMoving(mouseOverShape);
    }
    
    if (this.mManipulator.isMoving() && !this.dragger.isDragging())  {
        var dx = this.currentMouseMove[0] - this.lastClick[0],
            dy = this.currentMouseMove[1] - this.lastClick[1];

        this.lastClick[0] += dx;
        this.lastClick[1] += dy;
        this.mManipulator.translate(dx, dy);

    } else { // if left mouse drag
        if (this.dragger.isDragging()){
            this.dragger.drag(wcX, wcY);
            this.selectedSceneNodes = this.mMyWorld.getSceneNodesInArea( this.dragger.getTransformObject() );
            this.mManipulator.setContainer(this.selectedSceneNodes);
            console.log(this.selectedSceneNodes);
        }    
    }
};

ViewManipulator.prototype.detectMouseUp = function () {
    console.log("mouse up");
    this.mManipulator.notMoving();
    this.dragger.release();
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
