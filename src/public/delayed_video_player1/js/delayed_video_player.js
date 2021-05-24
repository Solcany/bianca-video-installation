function Delayed_video_player(path, video_name, num) {
    this.path = path;
    this.video_name = video_name;
    this.player_name = "delayed_video_player_" + num
    this.video_el
    this.clock_el
    this.clock_container_el

    this.create_video_player = function() {
        // create video container
        var container = document.createElement('div')
        container.id = this.player_name
        container.classList.add("video_player_container")
        var src = this.path + this.video_name
        var video_el = document.createElement('video')
        video_el.setAttribute("data-is-active", "true")
        video_el.src = src
        video_el.preload = "auto"
        video_el.muted = true
        video_el.load()
        this.video_el = video_el
        container.appendChild(video_el)
        document.body.appendChild(container)
    }

    this.create_countdown_el = function() {
        var container_el = document.getElementById(this.player_name)
        var clock_container_el = document.createElement('div')
        clock_container_el.id = "clock_container"
        clock_container_el.setAttribute("data-is-active", false);

        var clock_el = document.createElement('span')
        clock_el.id = "clock"
        clock_el.innerHTML = _DELAYED_PLAYER_DELAY_ / 1000

        this.clock_el = clock_el;
        this.clock_container_el = clock_container_el;

        clock_container_el.appendChild(clock_el)
        container_el.appendChild(clock_container_el)
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


    this.start_video_loop = function() {
        this.video_el.play();

        this.video_el.onended = function() {
            this.video_el.setAttribute("data-is-active", false)
            this.clock_container_el.setAttribute("data-is-active", true)
            this.countdown_clock(new Date(), _DELAYED_PLAYER_DELAY_)

            setTimeout(function() {
                this.video_el.setAttribute("data-is-active", true)
                this.clock_container_el.setAttribute("data-is-active", false)
                this.video_el.play();
            }.bind(this), _DELAYED_PLAYER_DELAY_)
        }.bind(this)
    }

    // this.measure_time_ = function(start_time, delay, callback) {

    //     var loop = function() {
    //         var end_time = new Date();
    //         var time_diff = end_time - start_time;

    //         if(timeDiff < delay) {
    //             setTimeout(function() {
    //                 console.log(timeDiff)
    //                 this.measure_time_(start_time)
    //             }.bind(this), 1000)
    //         } else {
    //             callback();
    //         }
    //     }
    //     loop()
    // }

    this.countdown_clock = function(start_time, delay) {
        var end_time = new Date();
        var time_diff = end_time - start_time;

        if(time_diff < delay) {
            setTimeout(function() {
                var countdown = (delay - time_diff) / 1000
                var seconds = Math.round(countdown);
                this.clock_el.innerHTML = seconds
                this.countdown_clock(start_time, delay)
            }.bind(this), _DELAYED_PLAYER_TIME_CHECK_)
        } else {
            this.clock_el.innerHTML = 0
        }
    }

    this.init = function() {
        this.create_video_player();
        this.create_countdown_el();
        //this.start_playback();
        // this.video_el.play();

        //this.set_next_video()
    }

    // the player is controlled through Controller object
    // in controller.js
}
