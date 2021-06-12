window.addEventListener('DOMContentLoaded', (event) => {
    var player = new Random_video_player(_ASSETS_PATH_, 
    									 _VIDEOS_,
    									 _VIDEOS_SCHEDULE_,
    								 	 _SCHEDULE_DUE_TIME_, 
    									 _CAM_STREAM_DURATION_,
    									 _IS_STREAMING_EVENTS_,
    									 0)
    player.init();
    var controller = new Controller(player);
    controller.init();
});
