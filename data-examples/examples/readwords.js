const cv = require('opencv4nodejs');
const path = require('path');

if (!cv.modules.text) {
  throw new Error('exiting: opencv4nodejs compiled without text module');
}

const dataPath = path.resolve('../data/text-data/');
const modelsPath = path.resolve('../data/text-models');
const beamSearchModel = path.resolve(modelsPath, 'OCRBeamSearch_CNN_model_data.xml.gz');

const vocabulary = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const lexicon = [
  'Abre', 'tu', 'cuenta','Cuenta','Banca','por' ,'Internet','Inversiones','Soluciones','de','Pago'
];

const transitionP = cv.createOCRHMMTransitionsTable(vocabulary, lexicon);
const emissionP = cv.Mat.eye(62, 62, cv.CV_64FC1);

const hmmClassifier = cv.loadOCRHMMClassifierCNN(beamSearchModel);
const hmmDecoder = new cv.OCRHMMDecoder(hmmClassifier, vocabulary, transitionP, emissionP);




const wordImages = ['parte1.jpg', 'parte2.jpg', 'parte3.jpg', 'parte4.jpg', 'parte5.jpg']
  .map(file => path.resolve(dataPath, file))
  .map(cv.imread);

wordImages.forEach((img) => {
  console.log(img.type);
  console.log(cv.CV_8U);
  //checkif is already gray scale
  const grayImg = img.type === cv.CV_8U ? img : img.bgrToGray();
  const mask = grayImg.threshold(255, 100, cv.THRESH_BINARY_INV);

  const ret = hmmDecoder.runWithInfo(grayImg, mask);

  console.log('outputText:', ret.outputText);
  cv.imshow('grayImg', grayImg);
  cv.imshow('mask', mask);
  cv.imshowWait('img', img);
});
