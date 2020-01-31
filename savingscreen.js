



var Jimp = require('jimp');
var robot = require('robotjs');
var cv = require('opencv4nodejs');

robot.setMouseDelay(2);

var screenCaptureToFile = function(path) {
    return new Promise(function(resolve, reject) {
        try {
            var picture = robot.screen.capture();
	    const width=picture.byteWidth/picture.bytesPerPixel
	    const height=picture.height
   	    const image=new Jimp(width,height)
     	    let pos = 0;

            image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
         

	image.bitmap.data[idx + 2] = picture.image.readUInt8(pos++);
        image.bitmap.data[idx + 1] = picture.image.readUInt8(pos++);
        image.bitmap.data[idx + 0] = picture.image.readUInt8(pos++);
        image.bitmap.data[idx + 3] = 255;

	picture.image.readUInt8(pos++);

        	});

       		image.write(path,function(err,image){
		if (err){		
		reject(err)}
		else{
		resolve(image)}
		});  	   

        } catch (e) {
            console.error(e);
            reject(e);
        }
    })
}

screenCaptureToFile('/opt/project/imageprocess/capture.png').then(function(result){

console.log("termino escritura")
console.log("bitmap data " + result.bitmap.data)
console.log("bitmap width " + result.bitmap.width)
console.log("bitmap height " + result.bitmap.height)


const newimg= new cv.Mat(result.bitmap.data,result.bitmap.height,result.bitmap.width,16)

return newimg;


}).then(function(newimg){

console.log("mostrando figura")
cv.imshow('resultado', newimg);

cv.waitKey();
})

/*

const busqueda =  cv.imreadAsync(`/opt/project/imageprocess/recorte.png`)

console.log(busqueda)

const matched = newimg.matchTemplate(busqueda, 5);
console.log(matched)

const minMax = matched.minMaxLoc();

console.log(minMax)
const figx= minMax.maxLoc.x
const figy= minMax.maxLoc.y

robot.moveMouse(figx,figy);
*/



