

const fs = require("fs");
const path = require("path");
const cv = require('opencv4nodejs');

const getHistAxis = channel => ([
  {
    channel,
    bins: 256,
    ranges: [0, 256]
  }
].map(x => new cv.HistAxes(x)));

const getContour = (handMask) => {
  const mode = cv.RETR_EXTERNAL;
  const method = cv.CHAIN_APPROX_SIMPLE;
  const contours = handMask.findContours(mode, method);
  return contours.sort((c0, c1) => c1.area - c0.area)[0];
};

const getContourall = (handMask) => {
  const mode = cv.RETR_EXTERNAL;
  const method = cv.CHAIN_APPROX_SIMPLE;
  const contours = handMask.findContours(mode, method);
  return contours.sort((c0, c1) => c1.area - c0.area);
};

const ptDist = (pt1, pt2) => pt1.sub(pt2).norm();


const getCenterPt = pts => pts.reduce(
    (sum, pt) => sum.add(pt),
    new cv.Point(0, 0)
  ).div(pts.length);


// main


const blue = new cv.Vec(255, 0, 0);
const green = new cv.Vec(0, 255, 0);
const red = new cv.Vec(0, 0, 255);
const zero = new cv.Vec(0, 0, 0);
const uno = new cv.Vec(1, 1, 1);

var main = async () => {

var imagen = await cv.imreadAsync(`/opt/project/imageprocess/upch/24h/10min/7A_1.jpg`);
var imagen1 = await cv.imreadAsync(`/opt/project/imageprocess/upch/pre_inc/10min/7A_1.jpg`);


const resizedImg = imagen.resizeToMax(640);
const resizedImg1 = imagen1.resizeToMax(640);

const { rows, cols } = resizedImg;

const sideBySide = new cv.Mat(rows, cols * 2, cv.CV_8UC3);
resizedImg.copyTo(sideBySide.getRegion(new cv.Rect(0, 0, cols, rows)));
resizedImg1.copyTo(sideBySide.getRegion(new cv.Rect(cols, 0, cols, rows)));

cv.imshow('primera imagen', sideBySide);

const matGray = resizedImg.bgrToGray();
const matHSV = resizedImg.cvtColor(cv.COLOR_BGR2HSV);
const matLab = resizedImg.cvtColor(cv.COLOR_BGR2Lab);
const matGray1 = resizedImg1.bgrToGray();
const matHSV1 = resizedImg1.cvtColor(cv.COLOR_BGR2HSV);
const matLab1 = resizedImg1.cvtColor(cv.COLOR_BGR2Lab);

const [matB, matG, matR] = resizedImg.splitChannels();
const [matH, matS, matV] = matHSV.splitChannels();
const [matl, mata, matb] = matLab.splitChannels();
const [matB1, matG1, matR1] = resizedImg1.splitChannels();
const [matH1, matS1, matV1] = matHSV1.splitChannels();
const [matl1, mata1, matb1] = matLab1.splitChannels();


value1=matV
value2=matV1


const grayHist = cv.calcHist(value1, getHistAxis(0));
const grayHist1 = cv.calcHist(value2, getHistAxis(0));

const grayHistPlot = new cv.Mat(300, 600, cv.CV_8UC3, [255, 255, 255]);
cv.plot1DHist(grayHist, grayHistPlot, new cv.Vec(0, 0, 0));

const grayHist1Plot = new cv.Mat(300, 600, cv.CV_8UC3, [255, 255, 255]);
cv.plot1DHist(grayHist1, grayHist1Plot, new cv.Vec(0, 0, 0));

const media=grayHist.mean()
const media1=grayHist1.mean()

sigma=0.3

const lower = parseInt(Math.max(0, (1.0 - sigma) * media.w))
const upper = parseInt(Math.min(255, (1.0 + sigma) * media.w))

const lower1 = parseInt(Math.max(0, (1.0 - sigma) * media1.w))
const upper1 = parseInt(Math.min(255, (1.0 + sigma) * media1.w))


console.log("imagen 1 ="+lower+" "+upper)
console.log("media 1= ")
console.log(media)
console.log(grayHist)


console.log("imagen 2 ="+lower1+" "+upper1)
console.log("media 2= ")
console.log(media1)
console.log(grayHist1)


const sideBySidegray = new cv.Mat(rows, cols * 2, cv.CV_8UC1);
//const sideBySidegray = new cv.Mat(rows, cols * 2, cv.CV_8UC3);
value1.copyTo(sideBySidegray.getRegion(new cv.Rect(0, 0, cols, rows)));
value2.copyTo(sideBySidegray.getRegion(new cv.Rect(cols, 0, cols, rows)));

cv.imshow('matGray', sideBySidegray);


matcanny = value1.canny(lower, upper,3, false);
matcanny1 = value2.canny(lower1, upper1,3, false);

const sideBySidecanny = new cv.Mat(rows, cols * 2, cv.CV_8UC1);
matcanny.copyTo(sideBySidecanny.getRegion(new cv.Rect(0, 0, cols, rows)));
matcanny1.copyTo(sideBySidecanny.getRegion(new cv.Rect(cols, 0, cols, rows)));

cv.imshow('matlcanny', sideBySidecanny);

const offset=5
const contour= getContour(matcanny)
const Points=contour.getPoints();
const result = resizedImg.copy();
const center = getCenterPt(Points);

const centerx=(center.x)
const centery=(center.y)

let radius= (ptDist(center,Points[0])+offset)

Points.forEach(element => { 
let newradius= (ptDist(center,element)+offset)
if (newradius>radius)
radius=newradius
}); 


console.log("center 1=" +centerx+" , "+centery)
console.log("radius 1=" +radius)


  result.drawContours(
    [Points],
    0,
    red,
    { thickness: 2 } );

  result.drawRectangle(
        new cv.Point(Math.abs(centerx-radius), Math.abs(centery-radius)),
        new cv.Point(Math.abs(centerx+radius), Math.abs(centery+radius)),
        { color: blue, thickness: 2 }
      );

const contour1= getContour(matcanny1)
const Points1=contour1.getPoints();
const result1 = resizedImg1.copy();
const center1 = getCenterPt(Points1);

const center1x=(center1.x)
const center1y=(center1.y)

let radius1= (ptDist(center1,Points1[0])+offset)

Points1.forEach(element => { 
let newradius1= (ptDist(center1,element)+offset)
if (newradius1>radius1)
radius1=newradius1
}); 

console.log("center 2=" +center1x+" , "+center1y)
console.log("radius 2=" +radius1)

  result1.drawContours(
    [Points1],
    0,
    red,
    { thickness: 2 } );

   result1.drawRectangle(
        new cv.Point(Math.abs(center1x-radius1), Math.abs(center1y-radius1)),
        new cv.Point(Math.abs(center1x+radius1), Math.abs(center1y+radius1)),
        { color: blue, thickness: 2 }
      );
 

const sideBySidecircle= new cv.Mat(rows, cols * 2, cv.CV_8UC3);
result.copyTo(sideBySidecircle.getRegion(new cv.Rect(0, 0, cols, rows)));
result1.copyTo(sideBySidecircle.getRegion(new cv.Rect(cols, 0, cols, rows)));

cv.imshow('circle detection', sideBySidecircle);


const plantilla = new cv.Mat(rows, cols, cv.CV_8UC3);
const plantilla1 = new cv.Mat(rows, cols, cv.CV_8UC3);

plantilla.drawFillPoly(
    [Points],
    uno,
   0);

 plantilla1.drawFillPoly(
    [Points1],
    uno,
   0);

const matMul = resizedImg.hMul(plantilla);          
const matMul1 = resizedImg1.hMul(plantilla1);   


const transform = new cv.Mat([[1,0,-(Math.abs(centerx-radius))],[0,1,-(Math.abs(centery-radius))]],cv.CV_32F)
const matMul_trans = matMul.warpAffine(transform)

const transform1 = new cv.Mat([[1,0,-(Math.abs(center1x-radius1))],[0,1,-(Math.abs(center1y-radius1))]],cv.CV_32F)
const matMul_trans1 = matMul1.warpAffine(transform1)


const regionrect = new cv.Rect(0,0,2*radius,2*radius)
const matMul_trans_region=matMul_trans.getRegion(regionrect)

const regionrect1 = new cv.Rect(0,0,2*radius1,2*radius1)
const matMul_trans1_region=matMul_trans1.getRegion(regionrect1)

const rows_trans= matMul_trans_region.rows
const cols_trans = matMul_trans_region.cols

const rows_trans1= matMul_trans1_region.rows
const cols_trans1 = matMul_trans1_region.cols

    
larger_row=rows_trans
if (larger_row<rows_trans1)
larger_row=rows_trans1

const sideBySidetrans= new cv.Mat(larger_row, cols_trans+cols_trans1, cv.CV_8UC3);
matMul_trans_region.copyTo(sideBySidetrans.getRegion(new cv.Rect(0, 0, cols_trans, rows_trans)));
matMul_trans1_region.copyTo(sideBySidetrans.getRegion(new cv.Rect(cols_trans, 0, cols_trans1, rows_trans1)));
cv.imshow('real images', sideBySidetrans);


const matGray_real = matMul_trans_region.bgrToGray();
const matHSV_real = matMul_trans_region.cvtColor(cv.COLOR_BGR2HSV);
const matLab_real = matMul_trans_region.cvtColor(cv.COLOR_BGR2Lab);
const matGray1_real = matMul_trans1_region.bgrToGray();
const matHSV1_real = matMul_trans1_region.cvtColor(cv.COLOR_BGR2HSV);
const matLab1_real = matMul_trans1_region.cvtColor(cv.COLOR_BGR2Lab);


const [matB_real, matG_real, matR_real] = matMul_trans_region.splitChannels();
const [matH_real, matS_real, matV_real] = matHSV_real.splitChannels();
const [matl_real, mata_real, matb_real] = matLab_real.splitChannels();
const [matB1_real, matG1_real, matR1_real] = matMul_trans1_region.splitChannels();
const [matH1_real, matS1_real, matV1_real] = matHSV1_real.splitChannels();
const [matl1_real, mata1_real, matb1_real] = matLab1_real.splitChannels();

value=matV_real
value1=matV1_real


const sideBySidetransgray= new cv.Mat(larger_row, cols_trans+cols_trans1, cv.CV_8UC1);
value.copyTo(sideBySidetransgray.getRegion(new cv.Rect(0, 0, cols_trans, rows_trans)));
value1.copyTo(sideBySidetransgray.getRegion(new cv.Rect(cols_trans, 0, cols_trans1, rows_trans1)));
cv.imshow('real images gray', sideBySidetransgray);

const lower_real = parseInt(Math.max(0, (1.0 - sigma) * media.w))
const upper_real = parseInt(Math.min(255, (1.0 + sigma) * media.w))

const lower1_real = parseInt(Math.max(0, (1.0 - sigma) * media1.w))
const upper1_real = parseInt(Math.min(255, (1.0 + sigma) * media1.w))

const matcanny_real = value.canny(lower_real, upper_real,3, false);
const matcanny1_real = value1.canny(lower1_real, upper1_real,3, false);


  const blurred1 = matcanny_real.blur(new cv.Size(2, 2));
  const blurred2 = matcanny1_real.blur(new cv.Size(2, 2));

  const thresholded1 = blurred1.threshold(80, 200, cv.THRESH_BINARY);
  const thresholded2 = blurred2.threshold(80, 200, cv.THRESH_BINARY);

const sideBySidetransgray_canny= new cv.Mat(larger_row, cols_trans+cols_trans1, cv.CV_8UC1);
thresholded1.copyTo(sideBySidetransgray_canny.getRegion(new cv.Rect(0, 0, cols_trans, rows_trans)));
thresholded2.copyTo(sideBySidetransgray_canny.getRegion(new cv.Rect(cols_trans, 0, cols_trans1, rows_trans1)));

cv.imshow('images canny real', sideBySidetransgray_canny);





cv.waitKey();

}

main()



