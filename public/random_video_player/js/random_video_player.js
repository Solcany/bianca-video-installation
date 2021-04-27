function Random_video_player(path, videos) {
    this.path = path;
    this.video_names = videos;
    this.video_frames = []
    this.active_video_el = null;
    this.prev_video_el = null;

    this.create_video_player = function() {
        // create video container
        var container = document.createElement('div')
            container.id = "random_video_player"

        // create an invisible video element for each video
        for(i = 0; i < this.video_names.length; i++) {
            var video_name = this.video_names[i]
            var src = this.path + video_name
            var video_frame = document.createElement('video')
                video_frame.id = "video_" + i
                video_frame.setAttribute("data-is-playing", "false")
                video_frame.src = src
                video_frame.muted = true
            container.appendChild(video_frame)

            // store reference to the videos
            this.video_frames.push(video_frame)
        }
        document.body.appendChild(container)
    }

    // this.preload_video = function(video_name) {
    //     var req = new XMLHttpRequest();
    //     var video_url = this.path + video_name

    //     req.onload = function() {
    //         src = URL.createObjectURL(req.response);
    //         this.video_player.src = src
    //     }.bind(this);
    //     //
    //     //if (video.canPlayType('video/mp4;codecs="avc1.42E01E, mp4a.40.2"')) {
    //     req.open("GET", video_url); // false makes the request synchronous
    //    // }
    //    // else {
    //    //     req.open("GET", "slide.webm");
    //    // }
    //     req.responseType = "blob";
    //     req.send();
    // }

    this.set_next_video = function() {
        this.prev_video_el = this.active_video_el
        var next_video_index = Math.floor(Math.random() * this.video_frames.length)
        this.active_video_el = this.video_frames[next_video_index]
        this.active_video_el.setAttribute("data-is-playing", true)
    }

    this.play_next_video = function() {
        // hide the previous video
        if(this.prev_video_el) {
            this.prev_video_el.setAttribute("data-is-playing", false)
        }
        this.active_video_el.setAttribute("data-is-playing", true)
        this.active_video_el.play();
    }

    this.start_video_loop = function() {
        // play the first video
        this.play_next_video()

        // the loop will play all the video
        var loop = function() {
            this.set_next_video();
            this.play_next_video();
            this.active_video_el.onended = function() {
               loop()
            }
        }.bind(this)

        // once the very first video is over start the video loop
         this.active_video_el.onended = function() {
            loop();
        }
    }

    this.init = function() {
        this.create_video_player();
        this.set_next_video()
    }

    // the player is controlled through Controller object
    // in controller.js
}
