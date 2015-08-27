/*
 *
 * Copyright (c) 2015, Stefan Petscharnig, Maximilian Krumpholz. 
 * All rights reserved.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301 USA
 */


/* SHAKA CODE */

var shakaEstimator;
var shakaPlayer;


function setupShakaPlayer(mpdPath){

	/* http://shaka-player-demo.appspot.com/ */

	/* Install polyfills. */
	shaka.polyfill.installAll();
	/* Find the video element. */
	var video = document.getElementById("video");

	/* Construct a Player to wrap around it. */
	shakaPlayer = new shaka.player.Player(video);
	shakaEstimator = new shaka.util.EWMABandwidthEstimator();;

	for (key in media_events) {
		video.addEventListener(key, shakaEventHandler, false);
	}

	/* player init finished..		 */
	shakaPlay(mpdPath);
}	

/* handle the shaka events :D */
function shakaEventHandler(event){
	if(event.type == "loadstart"){
		/* Fires when the browser starts looking for the audio/video */
	}else if(event.type == "progress"){
		/* Fires when the browser is downloading the audio/video */
	}else if(event.type == "suspend"){
		/* Fires when the browser is intentionally not getting media data */
	}else if(event.type == "abort"){
		/* Fires when the loading of an audio/video is aborted */
	}else if(event.type == "error"){
		/* Fires when an error occurred during the loading of an audio/video */
	}else if(event.type == "emptied"){
		/* Fires when the current playlist is empty */
	}else if(event.type == "stalled"){
		stalled = true;
		stalledTime = Date.now();
		/* Fires when the browser is trying to get media data, but data is not available */
	}else if(event.type == "loadedmetadata"){
		/* Fires when the browser has loaded meta data for the audio/video */
	}else if(event.type == "loadeddata"){
		/* Fires when the browser has loaded the current frame of the audio/video */
	}else if(event.type == "canplay"){
		shakaPlayer.play();
		/* Fires when the browser can start playing the audio/video */
	}else if(event.type == "canplaythrough"){
		/* Fires when the browser can play through the audio/video without stopping for buffering*/
	}else if(event.type == "playing"){
		/* Fires when the audio/video is playing after having been paused or stopped for buffering */
		if(paused){
			metrics.addPause(Date.now() - pausedTime);
		}
		paused = false;
	}else if(event.type == "waiting"){
		/* Fires when the video stops because it needs to buffer the next frame */
	}else if(event.type == "seeking"){
		/* Fires when the user starts moving/skipping to a new position in the audio/video */
	}else if(event.type == "seeked"){
		/* Fires when the user is finished moving/skipping to a new position in the audio/video */
	}else if(event.type == "ended"){
		/* Fires when the current playlist is ended */
		//does not seem to work^^
		//mediaEnded(); /* fills in the form and submits... */ 
	}else if(event.type == "durationchange"){
		/* Fires when the duration of the audio/video is changed */
	}else if(event.type == "timeupdate"){
		/* Fires when the current playback position has changed */

		//log stalled time
		if(stalled & !paused){
			metrics.addStall(Date.now() - stalledTime);
		}
		stalled = false;

		metrics.pushVideoTime(video.currentTime);

		//buffer levels
		metrics.pushBufferLevel(video.buffered.end(0) - video.currentTime);

		//get stats from player
		var statistics = shakaPlayer.getStats();

		//guessed bandwidth
		metrics.pushGuessedBw(statistics.estimatedBandwidth);

		//representations
		metrics.pushRepresentationBw(statistics.streamStats.videoBandwidth);

		if( document.getElementById("video").currentTime > playbackEnd){
			document.getElementById("video").pause();
			mediaEnded();
		}
	}else if(event.type == "play"){
		/* Fires when the audio/video has been started or is no longer paused */
		if(metrics.startupTimeEnd < 0) { 
			/* in case of multiple fireings*/
			metrics.startupTimeEnd = Date.now();
		}
	}else if(event.type == "pause"){
		/* Fires when the audio/video has been paused */
		paused = true;
		pausedTime = Date.now();
	}else if(event.type == "ratechange"){ 
		/* Fires when the playing speed of the audio/video is changed */		
	}else if(event.type == "volumechange"){
		/* Fires when the volume has been changed */
	}else{
	}
}	

function shakaPlay(mediaUrl){ 	
	var protData = null;
	var videoSource =  new shaka.player.DashVideoSource(mediaUrl, protData, shakaEstimator);
	shakaPlayer.load(videoSource);

} 	

