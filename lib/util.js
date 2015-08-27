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


/***************************/
/* UTILITY FUNCTIONS START */
/***************************/

/* parse GET params */
function gup( name ){
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );
	if( results == null )
		return "";
	else
		return results[1];
}

/* generate one row of csv data out of an array */
function genCSV(array, delim){
	str = "";
	for(i=0;i<array.length;i++){
		if(i < array.length - 1)
			str += "" + array[i] + delim;
		else
			str += "" + array[i];
	}
	return str;
}

/* check if file has extension */

function hasExtension(fileName, exts) {
	return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
}

/* check whether the browser is in fullscreen mode */
function isFullscreen(){
	return window.innerHeight == screen.height;
}

/* at least for https://bitmovin-a.akamaihd.net/content/eval/2secs/bbb.mpd*/
function repStringToBW(rep){
	if(rep == "100k"){
		return 100846;
	}
	if(rep == "150k"){
		return 149906;
	}
	if(rep == "200k"){
		return 201092;
	}
	if(rep == "350k"){
		return 352578;
	}
	if(rep == "500k"){
		return 502591;
	}
	if(rep == "700k"){
		return 704686;
	}
	if(rep == "900k"){
		return 908156;
	}
	if(rep == "1100k"){
		return 1100683;
	}
	if(rep == "1300k"){
		return 1283639;
	}
	if(rep == "1600k"){
		return 1580668;
	}
	if(rep == "1900k"){
		return 1878279;
	}
	if(rep == "2300k"){
		return 2275571;
	}
	if(rep == "2800k"){
		return 2772593;
	}
	if(rep == "3400k"){
		return 3371127;
	}
	if(rep == "4500k"){
		return 4474927;
	}
	return rep.slice(0,-1) * 1000; //we assume that we have "k" at the end and guess a little bit^^
}
	

/*************************/
/* UTILITY FUNCTIONS END */					
/*************************/
