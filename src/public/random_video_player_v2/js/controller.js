function Controller(video_player) {
    this.socket;
    this.player = video_player
    this.is_player_ready = false

    /*

        websockets utils

    */

    this.connect_to_ws_server = function() {
        this.socket = io(_SERVER_ADDRESS_);
    }

    this.ws_start_performance = function(player) {
        this.socket.emit("start_performance", player.player_name);
    }

    /*

        event handling

    */

    this.handle_video_player_events = function() {
        // forwards events from the player to the server
        // mostly for debug purposes

        // this.player.dispatcher.addEventListener("player_is_ready", function(ev) {            
        //     this.socket.emit("player_is_ready", ev.detail)
        // }.bind(this))
        this.player.dispatcher.addEventListener("player_next_video", function(ev) {            
            this.socket.emit("player_next_video", ev.detail)
        }.bind(this))        
    }

    this.handle_server_events = function() {
        // control the video player
        // on events from the server

        this.socket.on("broadcast", function(command) {
            switch(command) {
                case "players_start_video_loops":
                    this.player.init_video_loop();
                    break;
                case "players_pause_video_loops":
                    this.player.stop_active_video();
                    this.player.stop_video_loop();
                    break;
                default:
                    console.log("received unknown message")
            }
        }.bind(this))
    }

    /*

        input handling

    */

    this.handle_user_input = function() {
        // handle keyboard input
        // control the server from video player browser tab
        window.addEventListener('keyup', function(event) {
            switch(event.key) {
                case "a":
                    console.log("a");
                    break;
                case "u":
                    console.log("u");
                    this.ws_start_performance(this.player);
                    break;
                default:
                    break;
            }
        }.bind(this))
    }    

    /*

        entry

    */


    this.init = function() {
        this.connect_to_ws_server()
        this.socket.on("connect", function() {
            this.handle_video_player_events()
            this.handle_server_events();            
            this.handle_user_input();            
        }.bind(this))
    }
}
