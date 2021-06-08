const express = require('express')
const socket = require('socket.io')
const Motion_detector = require('./motion_detector.js')

const PORT = 4000
const DELAY = 2000

const OCCUPANCE_SAMPLE_TIME = 100;
const OCCUPANCE_ACTIVATION_PERIOD = 3000;
const OCCUPANCE_DEACTIVATION_PERIOD = 5000;
const OCCUPANCE_ACTIVATION_THRESHOLD = 0.85;
const OCCUPANCE_DEACTIVATION_THRESHOLD = 0.1;
const PLAYERS = ['public/random_video_player_v2/']

const app = express();
const server = app.listen(4000)
var io;
const motion_detector = new Motion_detector()
var state = "inactive";

function express_serve_video_player_websites() {
    for(i = 0; i < PLAYERS.length; i++) {
        const mirror = "random_player_" + i
        const player = PLAYERS[i]
        app.use("/" + mirror, express.static(player))
        console.log("serving " + mirror + " at: ")
        console.log("http://localhost:" + PORT + "/" + mirror)
        console.log(" ")
    }
}
function express_serve_video_asssets() {
    const mirror = "videos"
    app.use("/" + mirror, express.static('public/videos'))
}

function express_serve_frontend_settings() {
    const mirror = "settings.js"
    app.use("/" + mirror, express.static('public/settings.js'))
}




function broadcast_start_video_loops() {
    io.sockets.emit("broadcast", "players_start_video_loops")
}

function broadcast_pause_video_loops() {
    io.sockets.emit("broadcast", "players_pause_video_loops")
}

//

// connect to socket server


// function can_all_players_play(socket) {
//     var players_ready = 0;

//     socket.on("player_is_ready", function(player_detail) {
//         console.log(player_detail.player_name + " can play!")
//         ready_players++;

//         if(players_ready == PLAYERS.length) {
//             console.log("all players are ready");
//             return true;
//         } else {
//             console.log("players not ready!");            
//             return false;
//         }
//     }
// }


function handle_motion_detector() {
    console.log("…detecting room occupance");

    var occupance = 0;
    
    function measure_occupance(period) {
            var sample = 0;
            var samples_count = 0;

            var interval = setInterval(function() {
                if(samples_count < period / OCCUPANCE_SAMPLE_TIME) {
                    if(motion_detector.is_space_occupied()) {
                        sample++;
                    }
                    samples_count++;
                } else {
                    occupance = sample / samples_count;                  
                    clearInterval(interval);
                }
            }, OCCUPANCE_SAMPLE_TIME);
    }

    function loop() {

        if(state === "inactive") {
            measure_occupance(OCCUPANCE_ACTIVATION_PERIOD);
            console.log("occupance " + occuapnce);
            if(occupance > OCCUPANCE_ACTIVATION_THRESHOLD) {
                let seconds = (OCCUPANCE_ACTIVATION_PERIOD / 1000) * occupance;                
                console.log("…the space has been occupied for " + seconds + " seconds…" + " (occupance: " + occupance + ")");
                console.log("…starting video loops.")
                broadcast_start_video_loops();
                state = "active";
            }
            setTimeout(loop, OCCUPANCE_ACTIVATION_PERIOD);
        } else {
            measure_occupance(OCCUPANCE_DEACTIVATION_PERIOD);            
            if(occupance < OCCUPANCE_DEACTIVATION_THRESHOLD) {
                let seconds = OCCUPANCE_DEACTIVATION_PERIOD / 1000 * (1.0 - occupance);
                console.log("…the space has been unoccupied for " + seconds + " seconds…" + " (occupance: " + occupance + ")");
                console.log("…pausing video loops.")
                broadcast_pause_video_loops();
                state = "inactive";
            }
            setTimeout(loop, OCCUPANCE_DEACTIVATION_PERIOD);                
        }
    }

    loop();
}


function handle_client_events(socket) {
    socket.on("start_performance", function(player_detail) {
            console.log("Player: " + player_detail + " started the performance…")
            console.log("…starting motion detector in 5 seconds…");
            console.log("…clear the area in front of the camera.");
            setTimeout(() => { 
                motion_detector.init(); 
                console.log("✓ Motion detector started");
                handle_motion_detector(io);

            }, 1000);        
        });

    socket.on("player_next_video", function(player_detail) {
        let event_name;
        if (player_detail.event_name == "random") {
            event_name = "random video"
        } else if (player_detail.event_name == "scheduled") {
            event_name = "scheduled video"
        } else {
            event_name = "! unknown video event !"
        }
        console.log(player_detail.player_name + " is playing " +  event_name + ": " + player_detail.video_name)
    });    
}

 function are_all_players_connected() {
    return io.allSockets().then((sockets)=> {
        if(sockets.size == PLAYERS.length) {
            console.log("✓ " + sockets.size + " / " + PLAYERS.length + " players are connected");
            return true;
        } else {
            console.log("… " + sockets.size + " / " + PLAYERS.length + " players are connected");
            return false;
        }        
    })
}

// function can_player_play(so cket) {
//     socket.on("player_is_ready", function(player_detail) {
//         console.log(player_detail.player_name + " can play!")

//         if(players_ready == PLAYERS.length) {
//             console.log("all players are ready");
//             return true;
//         } else {
//             console.log("players not ready!");            
//             return false;
//         }
//     })
// }

function init() {
    io = socket(server);

    express_serve_frontend_settings();
    express_serve_video_asssets();
    // 1. serve video players locally
    express_serve_video_player_websites();

    io.on('connection', function(socket) {

        are_all_players_connected().then(ready => {
            if(ready) {
                console.log("➔ open a video player browser tab and press 'u' key to start the performance");
                handle_client_events(socket);                  
            }
        })
        // if(are_all_players_connected(io)) {
        //     console.log("➔ open a video player window and press 'u' key to start the performance");
        //     handle_client(socket);    
        // };



        // if(are_players_connected) {
        //     console.log("ready!");
        //     handle_client(socket);
        // }
        // can_players_play = can_player_play(socket);

        // check if the player can play their videos
        // socket.on("player_is_ready", function(player_detail) {
        //     can_players_play++;
        //     console.log(player_detail.player_name + " is ready")
        // });
    });




    // io.on('connection', function(socket) {
    //     console.log(io);
    //     are_all_players_connected(io, function() { return 0})

    // })

    // 2. check if all players are connected to ws server
}

init();


// check if all windows have connected
// io.on('connection', function(socket) {
//     console.log(io.sockets.adapter.rooms);
//     console.log("ws client connected")

// })

    // socket.on("player_is_ready", function(player_detail) {
    //     are_players_ready = true
    //     console.log(player_detail.player_name + " is ready")
    // });

    // socket.on("player_next_video", function(player_detail) {
    //     let event_name;
    //     if (player_detail.event_name == "random") {
    //         event_name = "random video"
    //     } else if (player_detail.event_name == "scheduled") {
    //         event_name = "scheduled video"
    //     } else {
    //         event_name = " !unknown event! "
    //     }
    //     console.log(player_detail.player_name + " is playing " +  event_name + ": " + player_detail.video_name)
    // });

    // socket.on("server_start_video_loops", function(detail) {
    //     if(are_players_ready) {
    //         //console.log("player: " + player_detail.player_name + " started video loops")
    //         // setInterval(function() {
    //         //     if(motion_detector.is_space_occupied()) {
    //         //         io.sockets.emit("broadcast", "players_start")
    //         //     }
    //         // }, 500)             
    //     }
    // })