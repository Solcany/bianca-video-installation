function Controller(random_video_player) {
    this.socket;
    this.player = random_video_player

    this.control_player = function() {
        this.socket.on("message", function(message) {
            switch(message) {
                case "start":
                    console.log("controller: starting videos")
                    this.player.start_video_loop()
                    break;
                default:
                    console.log("received unknown message")
            }
        }.bind(this))
    }

    this.init = function() {
        // connect to websocket server
        this.socket = io(_SERVER_ADDRESS_);
        this.socket.on("connect", function() {
            console.log("controller: connected to websocket server")
            this.control_player()
        }.bind(this))
    }
}
