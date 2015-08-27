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


/* distinguish our valuable video players ;) */
var noPlayer = 0;
var bdplayerId = 1;
var dashifplayerId = 2;
var shakaplayerId = 3;


/* POSSIBLE MEDIA EVENTS */

var media_events = new Array();

// was extracted from the spec in January 2014
media_events["loadstart"] = 0;
media_events["progress"] = 0;
media_events["suspend"] = 0;
media_events["abort"] = 0;
media_events["error"] = 0;
media_events["emptied"] = 0;
media_events["stalled"] = 0;
media_events["loadedmetadata"] = 0;
media_events["loadeddata"] = 0;
media_events["canplay"] = 0;
media_events["canplaythrough"] = 0;
media_events["playing"] = 0;
media_events["waiting"] = 0;
media_events["seeking"] = 0;
media_events["seeked"] = 0;
media_events["ended"] = 0;
media_events["durationchange"] = 0;
media_events["timeupdate"] = 0;
media_events["play"] = 0;
media_events["pause"] = 0;
media_events["ratechange"] = 0;
media_events["volumechange"] = 0;

/*****************/
/* METRICS START */
/*****************/

var metrics = {
	startupTimeBegin : 0,
	startupTimeEnd : -1,
	/* time until playback start */
	getStartupTime: function(){
		return this.startupTimeEnd - this.startupTimeBegin;
	},	
	/* the type of player used in this specific evaluation run */
	playerType: noPlayer,
	setPlayerType: function(type){
		this.playerType = type;
	},
	getPlayerType: function(){
		return this.playerType;
	},
	/* browser fingerprint */
	fingerprint: "",
	setFingerprint: function(fp){
		this.fingerprint = fp;
	},
	getFingerprint: function(){
		return this.fingerprint;
	},
	/* number of browser focus changes */
	bfchange: 0,
	getBFChange: function(){
		return this.bfchange;
	},
	setBFChange: function(n){
		this.bfchange = n;
	},
	incBFChange: function(){
		this.bfchange++;
	},
	/* fullscreen flag */
	fullscreen: "",
	setFullscreen: function(isFullscreen){
		this.fullscreen = isFullscreen;
	},
	getFullscreen: function(){
		return this.fullscreen;
	},
	/* number of pauses */
	pauses: [],
	addPause: function(duration){
		this.pauses.push(duration);
	},
	getPauses: function(){
		return this.pauses;
	},			
	/* number of stalls */
	stalls: [],
	addStall: function(duration){
		this.stalls.push(duration);
	},
	getStalls: function(){
		return this.stalls;
	},			
	/* buffer levels at discrete time points */
	buffer: [],
	getBufferLevels: function(){
		return this.buffer;
	},
	pushBufferLevel: function(level){
		this.buffer.push(level);
	},
	/* guessed Bandwith at discrete time points */
	guessedBw: [],
	getGuessedBw: function(){
		return this.guessedBw;
	},
	pushGuessedBw: function(gbw){
		this.guessedBw.push(gbw);
	},
	/* chosen representations at discrete time points */
	representationBw: [],
	getRepresentationBw: function(){
		return this.representationBw;
	},
	pushRepresentationBw: function(rbw){
		this.representationBw.push(rbw);
	},
	/* time for measurement of representation, buffer and bandwith estimation */
	times: [],
	pushVideoTime: function(time){
		this.times.push(time);
	},
	getVideoTime: function(){
		return this.times;
	},
	rateChanges: 0,
	incRateChanges: function(){
		rateChanges++;
	},
	getRateChanges: function(){
		return rateChanges;
	},
};


/***************/
/* METRICS END */
/***************/
