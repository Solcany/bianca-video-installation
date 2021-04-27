// function setup() {
//   createCanvas(400, 400);
//   vid = createVideo("../assets/video/video.mp4");
//   vid.loop()
//   vid.speed(3);
// }

const PATH = '../assets/video/'
const VIDEOS = ['video-0.mp4',
                'video-1.mp4',
                'video-2.mp4',
               ]

function random_video_player(path, videos) {
    this.path = path;
    this.video_names = videos;
    this.video_frames = []
    this.prev_video_index = null;

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

    this.preload_video = function(video_name) {
        var req = new XMLHttpRequest();
        var video_url = this.path + video_name

        req.onload = function() {
            src = URL.createObjectURL(req.response);
            this.video_player.src = src
        }.bind(this);
        //
        //if (video.canPlayType('video/mp4;codecs="avc1.42E01E, mp4a.40.2"')) {
        req.open("GET", video_url); // false makes the request synchronous
       // }
       // else {
       //     req.open("GET", "slide.webm");
       // }
        req.responseType = "blob";
        req.send();
    }

    this.play_random_videos = function() {
        // choose random video index
        var next_video_index = Math.floor(Math.random() * this.video_frames.length)
        var video = this.video_frames[next_video_index]
        var previous_video = this.video_frames[this.prev_video_index];

        // deactivate the previous video
        if(previous_video) {
            previous_video.setAttribute("data-is-playing", false)
        }

        video.setAttribute("data-is-playing", true)
        video.play();

        this.prev_video_index = next_video_index

        video.onended = function() {
            this.play_random_videos()
        }.bind(this)
    }

    this.init = function() {
        //this.create_video_player();
        this.create_video_player();
        this.play_random_videos();

        // document.addEventListener("click", function() {
        //     var v = this.select_random_video()
        //     console.log(v)
        // }.bind(this));
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    const player = new random_video_player(PATH, VIDEOS)
    player.init()
});




// function draw() {
//   background(220);
// }
