function Delayed_video_player(path, video_name, player_num) {
    this.path = path;
    this.video_name = video_name;
    this.num = player_num
    this.video_el

    this.create_video_player = function() {
        // create video container
        var container = document.createElement('div')
        container.id = "delayed_video_player_" + this.num
        container.classList.add("video_player_container")
        var src = this.path + this.video_name
        var video_el = document.createElement('video')
        video_el.setAttribute("data-is-active", "true")
        video_el.src = src
        video_el.muted = true
        this.video_el = video_el
        container.appendChild(video_el)
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

    // this.set_next_video = function() {
    //     this.prev_video_el = this.active_video_el
    //     var next_video_index = Math.floor(Math.random() * this.video_frames.length)
    //     this.active_video_el = this.video_frames[next_video_index]
    //     this.active_video_el.setAttribute("data-is-playing", true)
    // }

    this.play_next_video = function() {
        // hide the previous video
        this.video_el.play();
    }

    this.measure_time = function() {
        var startTime;
        startTime = new Date();

        function end() {
            var endTime = new Date();
            var timeDiff = endTime - startTime; //in ms
            // strip the ms
            timeDiff /= 1000;

            // get seconds
            var seconds = Math.round(timeDiff);
            console.log(seconds + " seconds");

            setTimeout(function() {
                end()
            }, 1000)
        }

        end();

    }

    this.init = function() {
        this.create_video_player();
        this.video_el.play();
        this.measure_time();

        //this.set_next_video()
    }

    // the player is controlled through Controller object
    // in controller.js
}
