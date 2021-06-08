const cv = require('opencv');
const _SERVER_ADDRESS_ = 'http://localhost:4000';
var fs = require('fs');


function Motion_detector(MIN_AREA=3000, 
						 RESOLUTION=[512, 288],
						 DELAY=100,
						 SAMPLES_AMT=20,
						 OCCUPATION_THRESH=0.8) {
	this.camera;
	this.window;
	this.occupation = [];

	this.init = function() {
		try {
			this.camera = new cv.VideoCapture(0);
			this.window = new cv.NamedWindow('Video', 0)			
			this.detect_motion();
		} catch (e){
  			console.log("Couldn't start camera:", e)
		}
	}

	this.collect_samples = function(v) {
		if(this.occupation.length > SAMPLES_AMT) {
			let sample = this.occupation.slice(Math.max(this.occupation.length - SAMPLES_AMT, 0))
			this.occupation = sample;
		}
		this.occupation.push(v)
	}

	this.is_space_occupied = function() {
		var get_rolling_avg = function() {
			if (this.occupation.length >= SAMPLES_AMT) {
				let sample = this.occupation;
				let avg = sample.reduce(function(acc, v) { 
								return acc + v})
					avg = avg  / SAMPLES_AMT;
				return avg;
			} else {
				return 0
			}			
		}.bind(this)

		var avg = get_rolling_avg();

		if(avg > OCCUPATION_THRESH) {
			return true
		} else {
			return false
		}
	}

	// this.store_camera_frame = function(image) {
	// 	var buff = new Buffer(image.toString('base64'));
	// 	this.frame = buff;

		// function to encode file data to base64 encoded string
		// function base64_encode(image) {
		//     // read binary data
		//     var bitmap = fs.readFileSync(image);
		//     // convert binary data to base64 encoded string
		//     return new Buffer(bitmap).toString('base64');
		// }

		//this.frame = base64_encode(image);
//	}


	this.detect_motion = function() {
		const [w, h] = RESOLUTION
		var first_frame = null
		var is_occupied = false

		setInterval(function() {
		    this.camera.read(function(err, im) {
		      if (err) throw err;
		      if (im.size()[0] > 0 && im.size()[1] > 0){
		      	var gray = im.copy()
		      	gray.resize(w, h)
		      	gray.convertGrayscale()
		      	gray.gaussianBlur([27,27],0)

		      	if(first_frame == null) {
		      		first_frame = gray;
		      	}

		      	var diff = new cv.Matrix(w, h);
		      	diff.absDiff(gray, first_frame);

				var thresh = diff.threshold(30, 255, "Binary")
			 	thresh.dilate(2)

				const contours = thresh.copy().findContours();
				var has_motion = 0;


				for(i = 0; i < contours.size(); i++) {
					if(contours.area(i) > MIN_AREA) {
						has_motion = 1
						const { x, y, width, height } = contours.boundingRect(i);
						thresh.rectangle([x, y], [x + width, y + height], [255, 255, 255], 1);
						break;
					} else {
						has_motion = 0
					}
				}
				this.collect_samples(has_motion)
		        //this.window.show(thresh)
		      }
		      this.window.blockingWaitKey(0, 100);
		    }.bind(this));
		  }.bind(this), DELAY);
	}
}	

module.exports = Motion_detector;