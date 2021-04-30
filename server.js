const express = require('express')
const socket = require('socket.io')

const app = express();
const server = app.listen(4000)

const random_player_mirror = '/random_player'
const delayed_player0_mirror = '/delayed_player0'

app.use(random_player_mirror, express.static('public/random_video_player/'))
app.use(delayed_player0_mirror , express.static('public/delayed_video_player/'))

var are_players_ready = false

var io = socket(server)
io.on('connect', function(socket) {

    socket.on("player_is_ready", function(player_name) {
        are_players_ready = true
        console.log("player: " + player_name + " is ready")
    });

    socket.on("server_start_video_loops", function(player_name) {
        if(are_players_ready) {
            console.log("player: " + player_name + " started video loops")
            io.sockets.emit("broadcast", "players_start")
        }
    })
})
