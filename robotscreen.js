

var Jimp = require('jimp');
var robot = require("robotjs");

function captureimage({x,y,w,h})
{
	const pic=robot.screen.capture(x,y,w,h)
	const width=pic.byteWidth/pic.bytesPerPixel
	const height=pic.height
	const image=new Jimp(width,height)
	pic.image.forEach((byte ,i)=>
	{
	switch(i%4){
	case 0: return blue = byte
	case 1: return green = byte
	case 2: return red = byte
	case 3: 
		image.bitmap.data[i-3]=red
		image.bitmap.data[i-2]=green
		image.bitmap.data[i-1]=blue
		image.bitmap.data[i]=255	
	}
	})

	return image
}

let x=0
let y=0
let w= robot.getScreenSize().width
let h= robot.getScreenSize().height

const result=captureimage(x,y,w,h).write('/opt/project/imageprocess/capture.png')
console.log(result); 








