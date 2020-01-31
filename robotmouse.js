


var robot = require("robotjs");

while(1)
{
var mouse = robot.getMousePos();

var hex = robot.getPixelColor(mouse.x, mouse.y);
console.log("#" + hex + " at x:" + mouse.x + " y:" + mouse.y);
}







