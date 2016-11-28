function ViewManipulator(myWorld) {
	this.mMyWorld = myWorld;
	this.mManipulator = myWorld.getManipulatorNode();
    // this.mManipulator.show();

    // first click
    this.firstClick = [0,0]; // point in WC
    // second click
    this.currentDragPoint = [0,0]; // point in WC
    // dragging
    this.dragging = false; // determines if ViewManipulator is in dragging mode

    this.dragger = new Dragger(myWorld.mConstColorShader);
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
    if (this.dragger.isDragging())
        this.dragger.drag(wcX, wcY);
};

ViewManipulator.prototype.detectMouseUp = function () {
    console.log("mouse up")
    this.dragger.release();
}

ViewManipulator.prototype.detectMouseLeave = function () {
    console.log("mouse leave")
}

ViewManipulator.prototype.draw = function (camera) {
    camera.switchViewport();
    this.dragger.draw(camera);
};
