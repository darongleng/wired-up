"use strict";  // Operate in Strict mode such that variables must be declared before used!

function SquareBorder(shader) {
    Renderable.call(this, shader);

    this.leftRect = new SquareRenderable(this.mShader);
    this.topRect = new SquareRenderable(this.mShader);
    this.rightRect = new SquareRenderable(this.mShader);
    this.bottomRect = new SquareRenderable(this.mShader);

    this.borderSize = 1; // size of each rect
}

gEngine.Core.inheritPrototype(SquareBorder, Renderable);

// Ovreride the super-class "draw()" method!
SquareBorder.prototype.draw = function (camera) {
    camera.switchViewport();
    var parentTransform = this.getXform();
    var parentPosition = this.getXform().getPosition();
    var parentSize = this.getXform().getSize();
    var parentColor = this.getColor();

    // setup left rect
    this.leftRect.getXform().setPosition(parentPosition[0]-parentSize[0]/2, parentPosition[1]);
    this.leftRect.getXform().setSize(this.borderSize, parentSize[1]);
    this.leftRect.setColor(parentColor);
    // setup top rect
    this.topRect.getXform().setPosition(parentPosition[0], parentPosition[1]-parentSize[1]/2);
    this.topRect.getXform().setSize(parentSize[0], this.borderSize);
    this.topRect.setColor(parentColor);
    // setup right rect
    this.rightRect.getXform().setPosition(parentPosition[0]+parentSize[0]/2, parentPosition[1]);
    this.rightRect.getXform().setSize(this.borderSize, parentSize[1]);
    this.rightRect.setColor(parentColor);
    // setup bottom rect
    this.bottomRect.getXform().setPosition(parentPosition[0], parentPosition[1]+parentSize[1]/2);
    this.bottomRect.getXform().setSize(parentSize[0], this.borderSize);
    this.bottomRect.setColor(parentColor);

    this.leftRect.draw(camera);
    this.topRect.draw(camera);
    this.rightRect.draw(camera);
    this.bottomRect.draw(camera);
};

SquareBorder.prototype.setBorderSize = function(size) {
    this.borderSize = size;
}