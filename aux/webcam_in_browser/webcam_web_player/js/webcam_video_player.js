function Webcam_video_player() {
    this.player_name = "webcam_video_player_"
    this.video_el

    this.create_video_player = function() {
        // create video container
        var container = document.createElement('div')
        container.id = this.player_name
        container.classList.add("video_player_container")
        var video_el = document.createElement('video')
        video_el.setAttribute("data-is-active", "true")
        video_el.muted = true
        video_el.autoplay = true
        video_el.load()
        this.video_el = video_el
        container.appendChild(video_el)
        document.body.appendChild(container)
    }

    this.start_webcam_stream = function() {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                this.video_el.srcObject = stream;
       }.bind(this))
        .catch(function (error) {
            throw(error)
        });
}


    }

    // this.start_video_loop = function() {
    //     this.video_el.play();

    //     this.video_el.onended = function() {
    //         this.video_el.setAttribute("data-is-active", false)
    //         this.clock_container_el.setAttribute("data-is-active", true)
    //         this.countdown_clock(new Date(), _DELAYED_PLAYER_DELAY_)

    //         setTimeout(function() {
    //             this.video_el.setAttribute("data-is-active", true)
    //             this.clock_container_el.setAttribute("data-is-active", false)
    //             this.video_el.play();
    //         }.bind(this), _DELAYED_PLAYER_DELAY_)
    //     }.bind(this)
    // }

    this.init = function() {
        this.create_video_player();
        this.start_webcam_stream();
        // this.create_countdown_el();
        //this.start_playback();
        // this.video_el.play();

        //this.set_next_video()
    }

    // the player is controlled through Controller object
    // in controller.js
}
