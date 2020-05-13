const {cv,drawRect} = require('./utils');
const fs = require('fs');
const path = require('path');
const classNames = require('./tipos_mascara');
const { extractResults } = require('./ssdUtils');

if (!cv.modules.dnn) {
  throw new Error('exiting: opencv4nodejs compiled without dnn module');
}

// replace with path where you unzipped inception model
const pathfile = '/opt/project/imageprocess/face_detector';

const prototxt = path.resolve(pathfile, 'deploy.prototxt');
const modelFile = path.resolve(pathfile, 'res10_300x300_ssd_iter_140000.caffemodel');

if (!fs.existsSync(prototxt) || !fs.existsSync(modelFile)) {
  console.log('could not find  model');
  throw new Error('exiting: could not find  model');
}

const modelFile1 = path.resolve(pathfile, "mask_detector.model");

if (!fs.existsSync(modelFile)) {
  console.log("could not find  model");
  throw new Error("exiting: could not find model");
}





// initialize  model from prototxt and modelFile
const net = cv.readNetFromCaffe(prototxt, modelFile);

function classifyImg(img) {
  //model works with 300 x 300 images
  const imgResized = img.resize(300, 300);

  // network accepts blobs as input
  const inputBlob = cv.blobFromImage(imgResized);
  net.setInput(inputBlob);

  // forward pass input through entire network, will return
  // classification result as 1x1xNxM Mat
  let outputBlob = net.forward();

 console.log(outputBlob);
  // extract NxM Mat
  outputBlob = outputBlob.flattenFloat(outputBlob.sizes[2], outputBlob.sizes[3]);

 console.log(outputBlob);

  return extractResults(outputBlob, img)
    .map(r => Object.assign({}, r, { className: classNames[r.classLabel] }));
}

const makeDrawClassDetections = predictions => (drawImg, className, getColor, thickness = 2) => {
  predictions
    .filter(p => classNames[p.classLabel] === className)
    .forEach(p => drawRect(drawImg, p.rect, getColor(), { thickness }));
  return drawImg;
};

const run_sample = () => {
  const img = cv.imread('/opt/project/imageprocess/face_detector/0-with-mask.jpg');
  const minConfidence = 0.2;

  const predictions = classifyImg(img).filter(res => res.confidence > minConfidence);
  const drawClassDetections = makeDrawClassDetections(predictions);

   console.log(predictions);
   const redcolor = () => new cv.Vec( 255, 0, 0);

   //get all images that are related to 'tipo 2' type
   drawClassDetections(img, 'tipo 2', redcolor);
   cv.imshowWait('img', img);
   cv.waitKey();
};

run_sample();

