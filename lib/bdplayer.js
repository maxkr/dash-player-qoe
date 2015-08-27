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


var bdplayer;

function setupBDPlayer(mpdPath){

	document.getElementById("player").innerHTML = "<div  id=\"wrapper\"><div    id=\"bdbdplayer\"></div></div>";
	video = document.querySelector('bdbdplayer');

	var config = {
		key         : '',
		playback: {
			autoplay                : true				
		},
		source: {
			mpd : mpdPath
		},
	 	style: {
			width       : '640px',
			aspectratio : '16:9',
			controls    : false,
		},				
		events      : {
			onPlay: function() {
				if(paused){
					metrics.addPause(Date.now() - pausedTime);
					paused = false;
				}
				if (int < 0) {
					int = setInterval(pullMetrics, 250);
				}
				if(metrics.startupTimeEnd < 0){
					metrics.startupTimeEnd = Date.now();
				}
			},
			onStartBuffering: function(){
				stalled = true;
				stalledTime = Date.now();
			},
			onStopBuffering: function(){
				if(stalled){
					metrics.addStall(Date.now() - stalledTime);
					stalled = false;
				}
			},onPause: function(){
				paused = true;
				pausedTime = Date.now();
			},
			onError: function() {},
			onReady: function() {},
			onPlaybackFinished: function(e){},
		}
	};
	bdplayer = bitdash("player").setup(config); 
	document.querySelector(".bitdash-vc video").controls = false;
} 		

var int = -1;

var pullMetrics = function() {
	var requestWindow,
		downloadTimes,
		movingDownload,
		bandwidthValue,
		estBwVideo;

	metrics.pushVideoTime(bdplayer.getCurrentTime());
	metrics.pushBufferLevel(bdplayer.getVideoBufferLength()); 
	metrics.pushRepresentationBw(bdplayer.getPlaybackVideoData().bitrate);

	requestWindow = window.performance.getEntries()
		.slice(-20)
		.filter(function(req){return req.entryType == "resource" && !!req.duration && hasExtension(req.name, ['.m4s']);})
		.slice(-4);

	if (requestWindow.length > 0) {
		downloadTimes = requestWindow.map(function (req){return Math.abs(req.duration) / 1000;});

		movingDownload = {
			average: downloadTimes.reduce(function(l, r) {return l + r;}) / downloadTimes.length,
			high: downloadTimes.reduce(function(l, r) {return l < r ? r : l;}),
			low: downloadTimes.reduce(function(l, r) {return l < r ? l : r;}),
			count: downloadTimes.length
		};

		bandwidthValue = bdplayer.getDownloadedVideoData().bitrate;
		estBwVideo = Math.round( bandwidthValue / movingDownload.average);
		metrics.pushGuessedBw(estBwVideo);
	}

	if(playbackEnd < bdplayer.getCurrentTime()){ /* getCurrentTime in secs*/
		bdplayer.pause();
		mediaEnded();
		clearInterval(int);
	}
};
	

