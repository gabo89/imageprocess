


var robot = require("robotjs");

while(1)
{
var mouse = robot.getMousePos();

var hex = robot.getPixelColor(mouse.x, mouse.y);
var decimalr = parseInt(hex.substring(0,2), 16);
var decimalg = parseInt(hex.substring(2,4), 16);
var decimalb = parseInt(hex.substring(4,6), 16);

console.log("#" + hex +" , "+ decimalr +" , "+decimalg+" , "+decimalb +" at x:" + mouse.x + " y:" + mouse.y);
}







