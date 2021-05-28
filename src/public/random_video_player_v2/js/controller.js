function Controller(video_player) {
    this.socket;
    this.player = video_player
    this.is_player_ready = false


    this.connect_to_ws_server = function() {
        this.socket = io(_SERVER_ADDRESS_);
    }

    // this.ws_send_server_start_video_loops = function() {
    //     this.socket.emit("server_start_video_loops", this.player.player_name)
    // }


    this.keyboard_controller = function() {
        window.addEventListener('keyup', function(event) {
            switch(event.key) {
                case " ": // spacebar
                    this.socket.emit("server_start_video_loops", this.player.player_name)
                    break;
                default:
                    break;
            }
        }.bind(this))
    }

    this.handle_player_events = function() {
        this.player.dispatcher.addEventListener("player_is_ready", function(ev) {            
            this.socket.emit("player_is_ready", ev.detail)
        }.bind(this))

        this.player.dispatcher.addEventListener("player_next_video", function(ev) {            
            this.socket.emit("player_next_video", ev.detail)
        }.bind(this))        
    }

    this.control_player = function() {
        this.socket.on("broadcast", function(command) {
            console.log(command)

            switch(command) {
                case "players_start":
                    console.log(this.player.player_name + ": starting video loop")
                    this.player.start_video_loop()
                    break;
                default:
                    console.log("received unknown message")
            }
        }.bind(this))
    }



    this.init = function() {
        this.connect_to_ws_server()
        
        this.socket.on("connect", function() {
            this.handle_player_events()
            this.control_player();
            this.keyboard_controller();
        }.bind(this))
    }
}
