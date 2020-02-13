


var robot = require("robotjs");

while(1)
{
var mouse = robot.getMousePos();

var hex = robot.getPixelColor(mouse.x, mouse.y);
var decimal = parseInt(hex.substring(0,2), 16);

console.log("#" + hex +" , "+ decimal +" , "+ hex.substring(0,2) +" at x:" + mouse.x + " y:" + mouse.y);
}







