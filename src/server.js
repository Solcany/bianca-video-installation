const PORT = 4000
const PLAYERS = ['public/random_video_player_v2/']

const express = require('express')
const socket = require('socket.io')
const Motion_detector = require('./motion_detector.js')

const app = express();
const server = app.listen(4000)
const motion_detector = new Motion_detector()


for(i = 0; i < PLAYERS.length; i++) {
    const mirror = "random_player_" + i
    const player = PLAYERS[i]
    app.use("/" + mirror, express.static(player))
    console.log("serving " + mirror + " at: ")
    console.log("localhost:" + PORT + "/" + mirror)
    console.log(" ")

}

var are_players_ready = false

//motion_detector.init();

// connect to socket server
var io = socket(server)

io.on('connection', function(socket) {
    console.log("ws client connected")

    socket.on("player_is_ready", function(player_detail) {
        are_players_ready = true
        console.log(player_detail.player_name + " is ready")
    });

    socket.on("player_next_video", function(player_detail) {
        let event_name;
        if (player_detail.event_name == "random") {
            event_name = "random video"
        } else if (player_detail.event_name == "scheduled") {
            event_name = "scheduled video"
        } else {
            event_name = " !unknown event! "
        }
        console.log(player_detail.player_name + " is playing " +  event_name + ": " + player_detail.video_name)
    });

    socket.on("server_start_video_loops", function(detail) {
        if(are_players_ready) {
            //console.log("player: " + player_detail.player_name + " started video loops")
            // setInterval(function() {
            //     if(motion_detector.is_space_occupied()) {
            //         io.sockets.emit("broadcast", "players_start")
            //     }
            // }, 500)             
        }
    })
})
