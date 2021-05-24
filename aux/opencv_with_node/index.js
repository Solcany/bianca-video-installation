// importing OpenCv library
// const cv = require('opencv4nodejs');
// const path = require('path')
// const express = require('express');
// const app = express();
// const server = require('http').Server(app);
// const io = require('socket.io')(server);
  
// // We will now create a video capture object.
// const wCap = new cv.VideoCapture(0);
  
// //Setting the height and width of object
// wCap.set(cv.CAP_PROP_FRAME_WIDTH, 300);
// wCap.set(cv.CAP_PROP_FRAME_HEIGHT, 300);
  
// // Creating get request simple route
// app.get('/', (req, res)=> {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });
  
// // Using setInterval to read the image every one second.
// setInterval(()=>{
  
//     // Reading image from video capture device
//     const frame = wCap.read();
  
//     // Encoding the image with base64.
//     const image = cv.imencode('.jpg', frame).toString('base64');
//     io.emit('image', image);
// }, 1000)
  
// server.listen(3000); 

var cv = require('opencv');

try {
  var camera = new cv.VideoCapture(0);
  var window = new cv.NamedWindow('Video', 0)
  var first_frame = null;
  var maxArea = 5000;
  var is_occupied = false;

 //  setInterval(function() {
	//   camera.read(function(err, im){
	//     if (err) throw err;
	//     if (im.size()[0] > 0 && im.size()[1] > 0){
 //  	      	var frame = im.copy() 
 //  	    	frame.resize(640, 360)
 //      		frame.convertGrayscale()

	//       frame.detectObject("./data/haarcascade_upperbody.xml", {}, function(err, data){
	//         if (err) throw err;
	//         if (!data.length) return console.log("No data");
	//         for(i = 0; i < data.length; i++) {
	// 	        var {x, y, width, height} = data[i]
	// 	        console.log(data[i])
	// 			frame.rectangle([x, y], [x + width, y + height], [0, 0, 255], 4);

	// 	        console.log('got a body');
	//     	}
	//       })

 //        window.show(frame);

	//     } else {
	//       console.log("Camera didn't return image")
	//     }
 //       window.blockingWaitKey(0, 50);
 //  });
	// }, 100)



  setInterval(function() {
    camera.read(function(err, im) {
      if (err) throw err;
      if (im.size()[0] > 0 && im.size()[1] > 0){

      	var gray = im.copy()
      	gray.resize(512, 288)
      	gray.convertGrayscale()
      	gray.gaussianBlur([21,21],0)

      	if(first_frame == null) {
      		first_frame = gray;
      	}

      	var diff = new cv.Matrix(640, 360);
      	diff.absDiff(gray, first_frame);

		var thresh = diff.threshold(25, 255, "Binary")
	 	thresh.dilate(2)

		var contours = thresh.copy().findContours();

		for(i = 0; i < contours.size(); i++) {
			if(contours.area(i) > maxArea) {
				is_occupied = true;
				const { x, y, width, height } = contours.boundingRect(i);
				im.rectangle([x, y], [x + width, y + height], [0, 255, 0], 3);
			} else {
				is_occupied = false
			}
		}	
		if(is_occupied) { console.log("occupied") } else { console.log("not occupied") }

        window.show(im);
      }
      window.blockingWaitKey(0, 100);
    });
  }, 100);
  
} catch (e){
  console.log("Couldn't start camera:", e)
}