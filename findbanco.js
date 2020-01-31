
var cv = require('opencv4nodejs');
var robot = require("robotjs");

robot.setMouseDelay(2);

var array1=[];
var array2=[];

const find = async () => {
// Load images
const original = await cv.imreadAsync(`/opt/project/imageprocess/capture.png`);

console.log(original)

const busqueda = await cv.imreadAsync(`/opt/project/imageprocess/recorte.png`);

console.log(busqueda)

// Match template (the brightest locations indicate the highest match)
const matched = original.matchTemplate(busqueda, 5);


console.log(matched)


const minMax = matched.minMaxLoc();

console.log(minMax)
const figx= minMax.maxLoc.x
const figy= minMax.maxLoc.y

  original.drawRectangle(
    new cv.Rect(figx, figy, busqueda.cols, busqueda.rows),
    new cv.Vec(0, 255, 0),
    2,
    cv.LINE_8
  );



  // Open result in new window
  cv.imshow('resultado', original);
  cv.waitKey();
};

find()





