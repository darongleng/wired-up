function setColorByHex (hex, c) {
	var inInt = parseInt(hex.substring(1), 16);  // to get rid of "#"
    var r = (inInt >> 16) & 255;
    var g = (inInt >> 8) & 255;
    var b = inInt & 255;
    c[0] = r / 255.0;
    c[1] = g / 255.0;
    c[2] = b / 255.0;
};

function hexToRGBA (hex) {
	var inInt = parseInt(hex.substring(1), 16);  // to get rid of "#"
    var r = (inInt >> 16) & 255;
    var g = (inInt >> 8) & 255;
    var b = inInt & 255;
    var rgba = [0,0,0,1] 
    rgba[0] = r / 255.0;
    rgba[1] = g / 255.0;
    rgba[2] = b / 255.0;
    return rgba;
};