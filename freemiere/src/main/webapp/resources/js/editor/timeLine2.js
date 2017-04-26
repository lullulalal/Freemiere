/**
 * 
 */

function getFileType(path){
	var imgExtarr = new Array('jpg', 'jpeg', 'png');
	var vdoExtarr = new Array('mp4', 'wemb', 'ogg');
	var adoExtarr = new Array('mp3');
	
	var rtn = 'file';
	
	var pathArray = path.split('\\');
	var fileArray = pathArray[pathArray.length-1].split('.');
	var ext = fileArray[fileArray.length-1];
	
	for (var i in imgExtarr) {
		if(imgExtarr[i] == ext.toLowerCase())
			return 'image';
	}
	
	for (var i in vdoExtarr) {
		if(vdoExtarr[i] == ext.toLowerCase())
			return 'video';
	}
	
	for (var i in adoExtarr) {
		if(adoExtarr[i] == ext.toLowerCase())
			return 'audio';
	}
	
	return rtn;
}

function getThumbFpath(path, type){
	var pathArray = path.split('/');
	var thumbPath = '';
	
	if(type == 'audio'){
		thumbPath = './resources/img/storage/audio.png';
		return thumbPath;
	}
	for (var j = 0; j < pathArray.length-1; j++) {
		thumbPath += pathArray[j];
		thumbPath += '/';
	}
	thumbPath += '.thumb/';
	thumbPath += pathArray[pathArray.length-1];
	thumbPath += '.png';
	return thumbPath;
}

var otherObjNum = {
		"vtrack-1" : "0",
		"vtrack-2" : "0",
		"atrack-1" : "0",
		"atrack-2" : "0"
};
function addObj(trackId, id){
	var path = $('#' + id).attr('path');
	var fname = getFileName(path);
	var type = getFileType(path);
	//alert(path);
	var thumbPath = getThumbFpath(path, type);
	//alert(thumbPath);
		
	var url = path.substring(2,path.length);
	//alert(url);
	var html = $('#' + trackId).html();
	var num = otherObjNum[trackId]*1;
	var newid = trackId + '-' + num;
	num++;
	otherObjNum[trackId] = num;
	//alert(JSON.stringify(otherObjNum));
	
	$.ajax({
		url : 'getObjectInfo',
		type : 'GET',
		data : {
			path : path,
			type : type
		},
		dataType : 'json',
		success : function(duration) {
			if(type == 'audio') {
				html += '<div class="draggable ui-widget-content audio-obj"';
			}
			else if( type == 'image') {
				html += '<div class="draggable ui-widget-content image-obj"';
			}
			html += ' frames=' + duration +' ';
			html += ' id=' + newid +' ';
			html += ' itemId=' + id +' ';
			//html += ' path=' + url +' ';
			html += ' fname=' + fname +' ';
			html += ' clicked=' + 'false' +' ';
			html += '>';
			html += '<img class="obj-thumb" src="' + thumbPath + '">'
			html += fname;
			html += '</div>';
			
		},
		error : function(e) {
			//alert(JSON.stringify(e));
		}
	});	
	
	/*$('#video-track').html(html);
	add_video0img(newid, url, fname);
	resizeTrackObj();
	video0TrackEventRemover();
	video0TrackEventRegister();*/
}