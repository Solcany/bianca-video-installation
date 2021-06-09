window.addEventListener('DOMContentLoaded', (event) => {
    var player = new Delayed_video_player(_DELAYED_PLAYER_PATH_,
                                          _DELAYED_PLAYER_VIDEO_,
                                          0)
    player.init()
    var controller = new Controller(player);
    controller.init()
});
