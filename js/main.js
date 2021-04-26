// function setup() {
//   createCanvas(400, 400);
//   vid = createVideo("../assets/video/video.mp4");
//   vid.loop()
//   vid.speed(3);
// }

const PATH = '../assets/video/'
const VIDEOS = ['video0.mp4',
                'video1.mp4',
                'video2.mp4',
               ]

function random_video_player(path, videos) {
    this.path = path;
    this.videos_unplayed = videos
    this.last_played_index;

    this.create_video_el = function() {
        var video = document.createElement('video');
        video.src = this.src;
        video.autoplay = true;
        video.loop = true;
        document.body.appendChild(video);
    }

    this.select_random_video = function() {
        var get_random_index = function() {
            var index = Math.floor(Math.random() * this.videos_unplayed.length)
            if(index == this.last_played_index) {
                get_random_index()
            } else {
                return index
            }
        }

        var index = Math.floor(Math.random() * this.videos_unplayed.length)



        var video = this.videos_unplayed[index]

        // remove the chosen video from unplayed videos
        this.videos_unplayed.splice(index, 1)
        return video
    }

    this.load_video = function(video_index) {
        var req = new XMLHttpRequest();
        var video;
        req.onload = function() {
            video.src = URL.createObjectURL(req.response);
            video.play();
        };
        //if (video.canPlayType('video/mp4;codecs="avc1.42E01E, mp4a.40.2"')) {
            req.open("GET", "video" + video_index + ".mp4");
       // }
       // else {
       //     req.open("GET", "slide.webm");
       // }

        req.responseType = "blob";
        req.send();
    }

    this.init = function() {
        this.create_video_el();

        document.addEventListener("click", function() {
            var v = this.select_random_video()
            console.log(v)
        }.bind(this));
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    const player = new random_video_player(PATH, VIDEOS)
    player.init()
});

console.log("ff")




// function draw() {
//   background(220);
// }
