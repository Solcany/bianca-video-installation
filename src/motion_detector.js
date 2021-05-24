const cv = require('opencv');

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
			console.log("camera ready")
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
				let sample = this.occupation.slice(Math.max(this.occupation.length - SAMPLES_AMT, 0))
				let avg = sample.reduce(function(acc, v) { 
								return acc + v})
					avg = avg  / SAMPLES_AMT;
				return avg;
			} else {
				console.log("not enough samples, returning false")
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

				const out_im = im.copy()
				out_im.resize(w,h)

				for(i = 0; i < contours.size(); i++) {
					if(contours.area(i) > MIN_AREA) {
						has_motion = 1
						const { x, y, width, height } = contours.boundingRect(i);
						out_im.rectangle([x, y], [x + width, y + height], [255, 255, 255], 1);
						break;
					} else {
						has_motion = 0
					}
				}
				this.collect_samples(has_motion)
		        this.window.show(out_im)
		      }
		      this.window.blockingWaitKey(0, 100);
		    }.bind(this));
		  }.bind(this), DELAY);
	}
}	

module.exports = Motion_detector;