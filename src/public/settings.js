// Settings for the front end of the video installation


/*
	Global settings
*/

const _SERVER_ADDRESS_ = 'http://localhost:4000'
const _VIDEOS_ = ['video-0.mp4',
                              'video-1.mp4',
                              'video-2.mp4',
                              'video-3.mp4']
const _VIDEOS_SCHEDULE_ = ['video-3.mp4', 
						   'video-0.mp4']  
const _ASSETS_PATH_ = '/assets/video/'
const _SCHEDULE_DUE_TIME_ = 15000
const _IS_STREAMING_EVENTS_ = true						                              
const _CAM_STREAM_DURATION_ = 10000

/*
	Individual players
*/


// Random player 0 
const _PLAYER_0_MIRROR_ = '/random_player_' + 0
const _PLAYER_0_PATH_ = _PLAYER_0_MIRROR_ + _ASSETS_PATH_


