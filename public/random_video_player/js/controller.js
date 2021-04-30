function Controller(video_player) {
    this.socket;
    this.player = video_player
    this.is_player_ready = false

    this.ws_send_player_ready = function() {
        this.socket.emit("player_is_ready", this.player.player_name)
    }

    this.ws_connect_to_server = function() {
        this.socket = io(_SERVER_ADDRESS_);
    }

    this.ws_send_server_start_video_loops = function() {
        this.socket.emit("server_start_video_loops", this.player.player_name)
    }

    this.is_player_ready = function() {
        var video = this.player.video_el || this.player.video_els

        if(Array.isArray(video)) {
            var ready = 0
            for(i = 0; i < video.length; i++) {
                var vid = video[i]
                vid.addEventListener('canplay', function() {
                    ready++
                }.bind(this), { once: true })
            }
            var check_status = function() {
                if(ready == video.length) {
                    this.ws_send_player_ready()
                } else {
                    setTimeout(check_status, 200)
                }
            }.bind(this)
            check_status()

        } else {
            var vid = video
            vid.addEventListener('canplay', function() {
                 this.ws_send_player_ready()
            }.bind(this), { once: true })
        }
    }

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
        this.ws_connect_to_server()
        this.is_player_ready()

        this.socket.on("connect", function() {
            this.control_player();
            this.keyboard_controller();
        }.bind(this))
    }
}
