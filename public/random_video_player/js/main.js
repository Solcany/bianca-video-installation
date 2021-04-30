window.addEventListener('DOMContentLoaded', (event) => {
    var player = new Random_video_player(_RANDOM_PLAYER_PATH_, _RANDOM_PLAYER_VIDEOS_, 0)
    player.init()
    var controller = new Controller(player);
    controller.init()
});
