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


var dashifPlayer;

function setupDAHIFPlayer(mpdPath){
	/* http://dashif.org/reference/players/javascript/1.4.0/samples/dash-if-reference-player/index.html */
	/* have a look at the metrics above... */

	var video = document.getElementById("video");
	
	var context = new Dash.di.DashContext(); 
	dashifPlayer = new MediaPlayer(context);  

	dashifPlayer.startup();
	dashifPlayer.attachView(video);
	dashifPlayer.setAutoPlay(true);

	for (key in media_events) { 
		video.addEventListener(key, dashifEventHandler, false);
	}

	/*load */

	dashifPlay(mpdPath);

}
function dashifPlay(mediaUrl){				
	dashifPlayer.attachSource(mediaUrl);
	dashifPlayer.setAutoSwitchQuality(true);
} 	
/* handle the dashif events */
function dashifEventHandler(event){
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
	}else if(event.type == "durationchange"){
		/* Fires when the duration of the audio/video is changed */
	}else if(event.type == "timeupdate"){
		/* Fires when the current playback position has changed */

		//log stalled time
		if(stalled & !paused){
			metrics.addStall(Date.now() - stalledTime);
		}
		stalled = false;

		//rate changes: calculate from representations
		metrics.pushVideoTime(video.currentTime);

        //get stats from player
        dimetrics = getCribbedMetricsFor("video");

		//buffer levels
		metrics.pushBufferLevel(dimetrics.bufferLengthValue);

		//guessed bandwidth
		metrics.pushRepresentationBw(dimetrics.bandwidthValue);
		metrics.pushGuessedBw(dimetrics.estBwVideo); 

		//representations
		if( document.getElementById("video").currentTime > playbackEnd){
			/* representation switches */
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
	function getCribbedMetricsFor(type) {
					
		var dimetrics = dashifPlayer.getMetricsFor(type),
			metricsExt = dashifPlayer.getMetricsExt(),
			repSwitch,
			httpRequests,
			bufferLevel,
			bufferLengthValue = 0,
			bandwidthValue,
			movingDownload = {};

			fillmoving = function(type, Requests){
				var requestWindow,
					downloadTimes;

				requestWindow = Requests
					.slice(-20)
					.filter(function(req){return req.responsecode >= 200 && req.responsecode < 300 && !!req.mediaduration && req.type === "Media Segment" && req.stream === type;})
					.slice(-4);
				if (requestWindow.length > 0) {					
					downloadTimes = requestWindow.map(function (req){ return Math.abs(req.tfinish.getTime() - req.trequest.getTime()) / 1000;});

					movingDownload[type] = {
						average: downloadTimes.reduce(function(l, r) {return l + r;}) / downloadTimes.length, 
						high: downloadTimes.reduce(function(l, r) {return l < r ? r : l;}), 
						low: downloadTimes.reduce(function(l, r) {return l < r ? l : r;}), 
						count: downloadTimes.length
					};
				}
			};

		if (dimetrics && metricsExt) {
			repSwitch = metricsExt.getCurrentRepresentationSwitch(dimetrics);
			httpRequests = metricsExt.getHttpRequests(dimetrics);
			bufferLevel = metricsExt.getCurrentBufferLevel(dimetrics);

			fillmoving("video", httpRequests);
			
			if (repSwitch !== null) {			
				bandwidthValue = repStringToBW(repSwitch.to); 
			}

			if (isNaN(bandwidthValue) || bandwidthValue === undefined) {
				bandwidthValue = 0;
			}
			if (bufferLevel !== null) {
				bufferLengthValue = bufferLevel.level.toPrecision(5);
			}

			var estBwVideo = Math.round( bandwidthValue / movingDownload["video"].average);

			document.data.estvidbw.value = estBwVideo;

			return {
                bufferLengthValue: bufferLengthValue,
				estBwVideo: estBwVideo,
				bandwidthValue: bandwidthValue				
			}
		}else {
			return null;
		}
	}		
