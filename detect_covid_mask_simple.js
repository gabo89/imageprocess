const {cv,drawRect} = require('./utils');
const fs = require('fs');
const path = require('path');
const { extractResults } = require('./ssdUtils');

if (!cv.modules.dnn) {
  throw new Error('exiting: opencv compiled without dnn module');
}


const pathfile = '/opt/project/imageprocess/face_detector/face-detection-from-body';
const pathfile1 = '/opt/project/imageprocess/face_detector/mask-detection-from-face';

const prototxt = path.resolve(pathfile, 'deploy.prototxt');
const modelFile = path.resolve(pathfile, 'res10_300x300_ssd_iter_140000.caffemodel');

const prototxt1 = path.resolve(pathfile1, 'deploy.prototxt');
const modelFile1 = path.resolve(pathfile1, 'res10_224x224_ssd_iter_15000.caffemodel');

if (!fs.existsSync(prototxt) || !fs.existsSync(modelFile)) {
  console.log('could not find  model for face');
  throw new Error('exiting: could not find face model');
}

if (!fs.existsSync(prototxt1) || !fs.existsSync(modelFile1)) {
  console.log('could not find  model formask');
  throw new Error('exiting: could not find mask model');
}



const netface_from_body = cv.readNetFromCaffe(prototxt, modelFile);
const netmask_from_face = cv.readNetFromCaffe(prototxt1, modelFile1);

function classifyImg(img) {
  const imgResized = img.resize(300, 300);


  const inputBlob = cv.blobFromImage(imgResized);
  netface_from_body.setInput(inputBlob);

  let outputBlob = netface_from_body.forward();
  console.log("face detection")
  console.log(outputBlob);
  // extract NxM Mat
  outputBlob = outputBlob.flattenFloat(outputBlob.sizes[2], outputBlob.sizes[3]);

  const outputsalida1 = outputBlob.getDataAsArray();
   console.log(outputsalida1);

  return extractResults(outputBlob, img)
    .map(r => Object.assign({}, r));
}

const makeDrawClassDetections = predictions => (drawImg, className, getColor, thickness = 2) => {
  predictions
    .filter(p => classNames[p.classLabel] === className)
    .forEach(p => drawRect(drawImg, p.rect, getColor(), { thickness }));
  return drawImg;
};

const run_sample = () => {
  const img = cv.imread('/opt/project/imageprocess/image-for-test/1.jpg');
  //const img = cv.imread('/opt/project/imageprocess/image-for-test/0-with-mask.jpg');
  const imgResized_formask = img.resize(224, 224);
  const inputBlob_formask = cv.blobFromImage(imgResized_formask);
 
   console.log(inputBlob_formask);


   //https://github.com/justadudewhohacks/opencv4nodejs/blob/master/cc/core/Mat.cc

   netmask_from_face.setInput(inputBlob_formask);

   var outputBlob1 = netmask_from_face.forward();
   console.log("mask detection");
   console.log(outputBlob1);
   const outputsalida = outputBlob1.at(0,0);
   console.log("with mask:"+outputsalida);
   const outputsalida1 = outputBlob1.at(0,1);
   console.log("no mask:"+outputsalida1);

   
   cv.imshowWait('img original', img);
   cv.imshowWait('img resize', imgResized_formask);
   cv.waitKey();
};

run_sample();

