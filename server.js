var express = require('express')
var socket = require('socket.io')

var app = express();
var server = app.listen(4000)

app.use(express.static('./public/random_video_player'))

var io = socket(server)
io.on('connect', function(socket) {
    socket.send("start")
})
