function Dragger(shader, myWorld) {
	
	this.squareDragger = new SquareBorder(shader);
    this.squareDragger.setColor([0,0,0,1])
    this.squareDragger.setBorderSize(0.05);
    this.squareDragger.getXform().setSize(0,0);

	// startPoint 
    this.startPoint = [0,0]; // point in WC
    // current dragging position
    this.currentDragPoint = [0,0]; // point in WC
    // dragging
    this.dragging = false; // determines if ViewManipulator is in dragging mode
}

Dragger.prototype.start = function (wcX, wcY) {
	this.startPoint = [wcX, wcY];
	this.dragging = true;
}

Dragger.prototype.drag = function (wcX, wcY) {
	this.currentDragPoint = [wcX, wcY];
	// resetting new position and new size
	var x1 = this.startPoint[0],
    y1 = this.startPoint[1],
    x2 = this.currentDragPoint[0],
    y2 = this.currentDragPoint[1];

	var newCenter = [(x2-x1)/2, (y2-y1)/2];
	var xform = this.squareDragger.getXform();
	xform.setPosition(x1+newCenter[0], y1+newCenter[1]);
	xform.setSize(Math.abs(newCenter[0])*2, Math.abs(newCenter[1])*2);
}

Dragger.prototype.release = function (wcX, wcY) {
	this.dragging = false;
    this.squareDragger.getXform().setSize(0,0);
}

Dragger.prototype.isDragging = function (wcX, wcY) {
	return this.dragging;
}

Dragger.prototype.getTransformObject = function() {
	return this.squareDragger.getXform();
}

Dragger.prototype.draw = function(camera) {
	camera.switchViewport();
	this.squareDragger.draw(camera)
}

Dragger.prototype.getXform = function () {
    return this.squareDragger.getXform();
}