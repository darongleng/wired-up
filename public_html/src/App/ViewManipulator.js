function ViewManipulator(myWorld) {
	this.mMyWorld = myWorld;
    this.dragger = new Dragger(myWorld.mConstColorShader);
    this.mManipulator = new SceneNodeManipulator(myWorld.mConstColorShader);

    this.selectedSceneNodes = null;
}

ViewManipulator.prototype.detectMouseDown = function (wcX, wcY) {
    console.log("mouse down");
    this.dragger.start(wcX, wcY);
    this.mManipulator.hide();
};

ViewManipulator.prototype.detectMouseMove = function (wcX, wcY, eventWhich) {

    var mouseOverShape = this.mMyWorld.detectMouseOverShape(wcX, wcY);
    var knob = this.mManipulator.detectKnobCollision(wcX, wcY);

    if (knob != -1 || mouseOverShape) {
        CanvasMouseSupport.CanvasMouse.toPointer();
    } else {
        CanvasMouseSupport.CanvasMouse.toDefault();
    }

    if (eventWhich != 1) { // not left mouse drag
        return;
    }

    else { // if left mouse drag
        if (this.dragger.isDragging()){
            this.dragger.drag(wcX, wcY);
            this.selectedSceneNodes = this.mMyWorld.getSceneNodesInArea(this.dragger.getTransformObject());
            this.mManipulator.setContainer(this.selectedSceneNodes);
            console.log(this.selectedSceneNodes);
        }    
    }
};

ViewManipulator.prototype.detectMouseUp = function () {
    console.log("mouse up");
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
