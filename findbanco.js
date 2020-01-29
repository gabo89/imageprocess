


var cv = require('opencv4nodejs');


function find() {
  // Load images
  let original =  cv.imread(`/opt/project/imageprocess/capture.png`);
  let busqueda =  cv.imread(`/opt/project/imageprocess/recorte.png`);

  // Match template (the brightest locations indicate the highest match)
  const matched = original.matchTemplate(busqueda, 5);

  // Use minMaxLoc to locate the highest value (or lower, depending of the type of matching method)
  const minMax = matched.minMaxLoc();
  const { maxLoc: { x, y } } = minMax;

  // Draw bounding rectangle
  original.drawRectangle(
    new cv.Rect(x, y, busqueda.cols, busqueda.rows),
    new cv.Vec(0, 255, 0),
    2,
    cv.LINE_8
  );

  // Open result in new window
  cv.imshow('resultado', original);
  cv.imshow('buscando a ', busqueda);
  cv.waitKey();
};

find()




