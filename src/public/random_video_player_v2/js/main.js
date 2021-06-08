window.addEventListener('DOMContentLoaded', (event) => {
    var player = new Random_video_player(_RANDOM_PLAYER_PATH_, 
    									 _RANDOM_PLAYER_VIDEOS_,
    									 _VIDEOS_SCHEDULE_,
    									 _SCHEDULE_DUE_TIME_, 
    									 _CAM_STREAM_DURATION_,
    									 _DEBUG_, 
    									 _NUM_)
    player.init();
    var controller = new Controller(player);
    controller.init();
});
