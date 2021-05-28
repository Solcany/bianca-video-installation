const express = require('express')
const socket = require('socket.io')
const Motion_detector = require('./motion_detector.js')

const app = express();
const server = app.listen(4000)
const motion_detector = new Motion_detector()

const random_player_mirror = '/random_player'
//const delayed_player0_mirror = '/delayed_player0'
//const delayed_player1_mirror = '/delayed_player1'

app.use(random_player_mirror, express.static('public/random_video_player_v2/'))
// app.use(delayed_player0_mirror , express.static('public/delayed_video_player/'))
// app.use(delayed_player1_mirror , express.static('public/delayed_video_player1/'))

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
        console.log(player_detail.player_name + " is playing: " + player_detail.video_name)
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
