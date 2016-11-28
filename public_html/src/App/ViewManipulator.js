function ViewManipulator(myWorld) {
	this.mMyWorld = myWorld;
	this.mManipulator = myWorld.getManipulatorNode();

    this.dragger = new Dragger(myWorld.mConstColorShader, myWorld);

    this.selectedSceneNodes = null;

}

ViewManipulator.prototype.detectMouseDown = function (wcX, wcY) {
    console.log("mouse down");
    this.dragger.start(wcX, wcY);
};

ViewManipulator.prototype.detectMouseMove = function (wcX, wcY, eventWhich) {
    var mouse = CanvasMouseSupport.CanvasMouse;

    if (eventWhich != 1) {
        this.dragger.release();
        return;
    }

    if (this.dragger.isDragging()){
        this.dragger.drag(wcX, wcY);
        var sceneNodes = this.mMyWorld.getSceneNodesInArea(this.dragger.getTransformObject());
        this.selectedSceneNodes = sceneNodes;
        console.log(sceneNodes);
    }
};

ViewManipulator.prototype.detectMouseUp = function () {
    console.log("mouse up")
    this.dragger.release();
    this.selectedSceneNodes = null;
}

ViewManipulator.prototype.detectMouseLeave = function () {
    console.log("mouse leave")
}

ViewManipulator.prototype.draw = function (camera) {
    camera.switchViewport();
    this.dragger.draw(camera);
};
