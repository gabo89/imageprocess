var Jimp = require('jimp');
var robot = require('robotjs');
var cv = require('opencv4nodejs');

robot.setMouseDelay(2);

var screenCaptureToFile = function(path) {
    return new Promise(function(resolve, reject) {
        try {
            var picture =  robot.screen.capture();
			var width=picture.byteWidth/picture.bytesPerPixel
			var height=picture.height
			var image=new Jimp(width,height)
			var pos = 0;

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




var main = async () => {
var result= await screenCaptureToFile('/opt/project/imageprocess/capture.png')

//console.log("bitmap data " + result.bitmap.data)
//console.log("bitmap width " + result.bitmap.width)
//console.log("bitmap height " + result.bitmap.height)


var original = await cv.imreadAsync(`/opt/project/imageprocess/capture.png`);

//console.log(original)

var busqueda = await cv.imreadAsync(`/opt/project/imageprocess/recorte.png`);

//console.log(busqueda)


var matched = await original.matchTemplateAsync(busqueda, 5);
console.log(matched)

var minMax =  await matched.minMaxLocAsync();

console.log(minMax)


var figx= await minMax.maxLoc.x+parseInt(busqueda.cols/2)
var figy= await minMax.maxLoc.y+parseInt(busqueda.rows/2)

console.log(robot.getMousePos())
console.log(figx+" "+figy)


await robot.moveMouse(figx,figy)
await robot.mouseClick("left")


console.log(robot.getMousePos())

var result= await screenCaptureToFile('/opt/project/imageprocess/capture1.png')

var original1 = await cv.imreadAsync(`/opt/project/imageprocess/capture1.png`);



}

main()


/*




*/



