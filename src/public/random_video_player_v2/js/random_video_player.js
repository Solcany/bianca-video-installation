function Random_video_player(PATH, VIDEOS_NAMES, VIDEOS_SCHEDULE, SCHEDULE_DUE_TIME, CAM_STREAM_DURATION, DEBUG, NUM) {
    this.player_name = "random_video_player_" + NUM    
    this.video_els = []
    this.active_video_el = null;
    this.prev_video_el = null;
    this.dispatcher = new EventTarget();
    this.state = "inactive";

    this.set_page_title = function() {
        document.title = this.player_name
    }

    this.create_video_player = function() {
        // create video container
        var container = document.createElement('div')
            container.classList.add("video_player_container")
            container.id = this.player_name

        // create an invisible video element for each video
        for(i = 0; i < VIDEOS_NAMES.length; i++) {
            var video_name = VIDEOS_NAMES[i]
            var src = PATH + video_name
            var video_el = document.createElement('video')
                video_el.id = "video_" + i
                video_el.setAttribute("data-is-active", "false")
                video_el.src = src
                video_el.preload = "auto"
                video_el.muted = true
            container.appendChild(video_el)
            video_el.load()

            // store reference to the videos
            this.video_els.push(video_el)
        }

        // create an invisible video element for the camera feed
        var camera_video_el = document.createElement('video')
            // camera feed video element will be the last in the container
            camera_video_el.id = "video_camera_stream"
            camera_video_el.setAttribute("data-is-active", "false")
            camera_video_el.muted = true
            //camera_video_el.autoplay = true
            container.appendChild(camera_video_el) 

        // store reference to the camera video el
        this.video_els.push(camera_video_el)        

        document.body.appendChild(container)
    }

    this.init_camera_stream = function() {
        // find camera video el in videos array
        const video_camera_stream_el = this.video_els.find(v => v.id == "video_camera_stream")
        if(video_camera_stream_el) {
            if (navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: true })
                .then(function (stream) {
                    video_camera_stream_el.srcObject = stream;
           }.bind(this))
            .catch(function (error) {
                throw(error)
            });
            }
        } else { throw new Error("camera video DOM element doesn't exist")}
    }

    this.set_next_video = function(next_video_index) {
        this.prev_video_el = this.active_video_el
        this.active_video_el = this.video_els[next_video_index]
    }

    this.play_next_video = function() {
        // hide the previous video
        if(this.prev_video_el) {
            this.prev_video_el.setAttribute("data-is-active", false)
        }
        // show the next one
        this.active_video_el.setAttribute("data-is-active", true)
        try {
            this.active_video_el.play();
        } catch (err) {
            throw(err)
        }
    }

    this.stop_active_video = function() {
        this.active_video_el.setAttribute("data-is-active", false)
        try {
            this.active_video_el.pause();
        } catch (err) {
            throw(err);
        }
    }
    this.stop_video_loop = function() {
        this.state ="inactive";
    }

    // randomly select a video from the VIDEOS_NAMES array of filenames
    // or show camera stream.
    // every n milliseconds select a video from VIDEOS_SCHEDULE array,
    // and play it instead of a random video.
    // after the scheduled video is played return to random selection.
    this.init_video_loop = function() {
        this.state = "active";

        const video_schedule_indices = VIDEOS_SCHEDULE.map(function(s) { return VIDEOS_NAMES.indexOf(s) })        
        var loop_start_time = new Date();
        var schedule_counter = 0;

        const loop = function() {
            if(this.state == "active") {
                var current_time = new Date();
                var time_diff = current_time - loop_start_time;
                // select a random video most of the time
                if(time_diff < SCHEDULE_DUE_TIME) {
                    const next_video_index = Math.floor(Math.random() * this.video_els.length)
                    this.set_next_video(next_video_index);
                    if(DEBUG) dispatch_video_event("random", next_video_index)
                // if time is due select a scheduled video
                } else {
                    // reset start time
                    loop_start_time = new Date();
                    var next_video_index = schedule_counter % video_schedule_indices.length
                    this.set_next_video(next_video_index);
                    schedule_counter++;
                    if(DEBUG) dispatch_video_event("scheduled", next_video_index)
                }
                // play it
                this.play_next_video();
                // call the loop after a video or camera stream ends
                if(this.active_video_el.id == "video_camera_stream") {
                    setTimeout(function() {
                        loop();
                    }, CAM_STREAM_DURATION)
                } else {
                    this.active_video_el.onended = function() {
                        loop();
                    }
                }
            }            
        }.bind(this)

        const dispatch_video_event = function(event_name, video_index) {
            var video_name

            if(video_index == VIDEOS_NAMES.length) {
                video_name = "camera_stream"
            } else {
                video_name = VIDEOS_NAMES[video_index]                
            }
            const event = new CustomEvent("player_next_video", {
              detail: {
                player_name: this.player_name,
                video_name: video_name,
                event_name: event_name
              }
            });
            this.dispatcher.dispatchEvent(event);        
        }.bind(this) 

        loop();
    }

    this.connect_to_controller = function() {
        var vid_els = this.video_els;

            var ready = 0
            for(i = 0; i < vid_els.length; i++) {
                var vid = vid_els[i]
                vid.addEventListener('canplay', function() {
                    ready++
                }.bind(this), { once: true })
            }
            var check_status = function() {
                if(ready == vid_els.length) {
                    dispatch_ready_event();
                } else {
                    setTimeout(check_status, 200)
                }
            }.bind(this)
            check_status()

        const dispatch_ready_event = function() {
            var event = new CustomEvent("player_is_ready", {
              detail: {
                player_name: this.player_name,
              }
            });
            this.dispatcher.dispatchEvent(event);
        }.bind(this) 
    }       



    this.init = function() {
        this.set_page_title();
        this.create_video_player();
        this.init_camera_stream();
        //this.connect_to_controller();
        //this.init_video_loop();
    }

    // the player is controlled through Controller object
    // in controller.js
}
