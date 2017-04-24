var trackWidth =926;
var trackHeight = 70;

var clickedObj;
var selectedClipNum = 0;

function checkFileType(data){
	if(data.indexOf("video") != -1) return 'video';
	if(data.indexOf("audio") != -1) return 'audio';
	if(data.indexOf("image") != -1) return 'image';
	if(data.indexOf("filter") != -1) return 'filter';
	if(data.indexOf("trans") != -1) return 'trans';
}


function resizeTrackObj(){
	

	//
	var videoTrackObjsCnt = $.makeArray($(".video-obj").map(function(){
	    return $(this).attr("frames");
	}));
	
	var videoTrackTotalCnt = 0;
	
	for(var j = 0; j < videoTrackObjsCnt.length; j++){
		videoTrackTotalCnt += Number(videoTrackObjsCnt[j]);
	}
	
	var audio1TrackObjsCnt = $.makeArray($(".audio1-obj").map(function(){
	    return $(this).attr("frames");
	}));
	
	var audio1TrackTotalCnt = 0;
	
	for(var j = 0; j < audio1TrackObjsCnt.length; j++){
		audio1TrackTotalCnt += Number(audio1TrackObjsCnt[j]);
	}
	
	var audio2TrackObjsCnt = $.makeArray($(".audio2-obj").map(function(){
	    return $(this).attr("frames");
	}));
	
	var audio2TrackTotalCnt = 0;
	
	for(var j = 0; j < audio2TrackObjsCnt.length; j++){
		audio2TrackTotalCnt += Number(audio2TrackObjsCnt[j]);
	}
	
	
	var maxValuesOfEachTrack = [videoTrackTotalCnt, audio1TrackTotalCnt , audio2TrackTotalCnt];
	var maxValue = Math.max.apply(null, maxValuesOfEachTrack);
	
	var IdsOftrackObjs = $.makeArray($(".track-obj").map(function(){
	    return $(this).attr("id");
	}));
	//alert(IdsOftrackObjs.length);
	for(var i = 0; i < IdsOftrackObjs.length; i++){
		var thisId = IdsOftrackObjs[i];
		var thisCnt = $('#' + thisId).attr('frames');
		var newWidth = ( trackWidth * thisCnt ) / maxValue;
		$('#'+thisId).css({	
							'heigth': trackHeight,
							'width': newWidth
		});
		
	}
}

var video0TrackobjNum = 0;

function addVideoTrackVideoObj(id){
	var ffid = $('#' + id).attr('ffid');
	//alert(ffid);
	
	$.ajax({
		url : 'getVideoInfo',
		type : 'GET',
		data : {
			ffid : ffid
		},
		dataType : 'json',
		success : function(videoInfo) {
			//alert(videoInfo.count);
			var html = $('#video-track').html();
			//alert(html);
			var newid = 'video'+'Obj' + video0TrackobjNum;
			video0TrackobjNum++;
			html += '<div class="video-obj track-obj" ';
			html += ' frames=' + videoInfo.count/30 +' ';
			html += ' id=' + newid +' ';
			//html += ' path=' + videoInfo.extractPath +' ';
			html += ' clicked=' + 'false' +' ';
			html += '>';
			html += newid;
			html += '</div>';
			
			$('#video-track').html(html);
			add_video0(newid, videoInfo.extractPath ,videoInfo.count);
			resizeTrackObj();
			video0TrackEventRemover();
			video0TrackEventRegister();

		},
		error : function(e) {
			//alert(JSON.stringify(e));
		}
	});	
}

function video0TrackEventRemover(){
	$('.video-obj').on('click');
}

function seletedFreeOtherObj(){
	
}

function outputVideoEditor(){
	var html = '';
	html += '<div>';
	html += 	'<table>';
	html += 		'<tr>';
	html += 			'<td>Label</td>';
	html += 			'<td>Label</td>';
	html += 		'</tr>';
	html += 		'<tr>';
	html += 			'<td>Trim</td>';
	html += 			'<td><input type="number"></td>';
	html += 		'</tr>';
	html += 		'<tr>';
	html += 			'<td>Length</td>';
	html += 			'<td><input type="number"></td>';
	html += 		'</tr>';
	html += 	'</table>';
	html += '</div>';
	
	
}

function video0TrackEventRegister(){
	$('.video-obj').on('click', function(e) {
		//alert("haha");
		//alert($(this).html());
		var clicked = $(this).attr('clicked');
		if(clicked == 'false') {
			$(this).css({'border-color': '#ff0080'});
			$(this).attr('clicked', 'true');
			timeLineSplitEventHandler();
			clickedObj = $(this).attr('id');
			selectedClipNum = 1 * clickedObj.charAt(clickedObj.length-1);
			seletedFreeOtherObj();
			outputVideoEditor();
		}
		else {
			$(this).css({'border-color': '#000000'});
			$(this).attr('clicked', 'false');
			timeLineSplitEventHandlerRemove();
			clickedObj = '';
			selectedClipNum = 0;
		}
	});
}

function video0TrackRedrow(){
	video0TrackobjNum = 0;
	var html = '';
	$('#video-track').html(html);
	html +=			'<br><span class="track-name">';
	html +=				'<i class="fa fa-video-camera" aria-hidden="true"></i>';
	html +=			'</span>';
	var mash = mm_player.mash;
	var video0Clips = mm_player.mash.video[0].clips;
	//alert(JSON.stringify(video0Clips));
	for(var i = 0; i<video0Clips.length; i++){
		alert(JSON.stringify(video0Clips[i]));
		
		var newid = 'video'+'Obj' + video0TrackobjNum;
		video0TrackobjNum++;
		
		html += '<div class="video-obj track-obj" ';
		html += ' frames=' + video0Clips[i].frames +' ';
		html += ' id=' + newid +' ';
	//	html += ' path=' + videoInfo.extractPath +' ';
		html += ' clicked=' + 'false' +' ';
		html += '>';
		html += newid;
		html += '</div>';
	}
	
	$('#video-track').html(html);
	resizeTrackObj();
	timeLineSplitEventHandlerRemove();
	video0TrackEventRemover();
	video0TrackEventRegister();
}	

function changeSelectedClip(){
	var video0Clips = mm_player.mash.video[0].clips;
	var selectedClip = video0Clips[selectedClipNum];
	mm_player.selectedClip = selectedClip;
}

function timeLineSplitEventHandler(){
	$('#split').on('click', function(){
		changeSelectedClip()
		mm_player.split();
		video0TrackRedrow();
		timeLineSplitEventHandlerRemove();
	});
}

function timeLineSplitEventHandlerRemove(){
	$('#split').off('click');
}

function addVideoTrackImageObj(id){
	var path = $('#' + id).attr('path');
	
	var url = path.substring(2,path.length)
	var html = $('#video-track').html();
	var newid = id+'obj' + video0TrackobjNum;
	video0TrackobjNum++;
	html += '<div class="video-obj track-obj" ';
	html += ' frames=' + 2 +' ';
	html += ' id=' + newid +' ';
	html += ' path=' + url +' ';
	html += '>';
	html += newid;
	html += '</div>';
	
	$('#video-track').html(html);
	add_video0img(newid, url);
	resizeTrackObj();
}

function videoDragDropEventHandler(){
	$('#video-track').on('dragenter dragover', function(e) {
		e.preventDefault();
		$(this).css('border', '2px solid #ff0080');
	});
	
	$('#video-track').on('drop', function(e) {
		e.preventDefault();
		$(this).css('border', '0px');
		var data = e.originalEvent.dataTransfer.getData("text");
		if(data=='') return;
	
		if( checkFileType(data) != 'video' && 
			checkFileType(data) != 'image' &&
			checkFileType(data) != 'trans') return;
		
		//여기다가 할일을 
		if(checkFileType(data) == 'video') {
			addVideoTrackVideoObj(data);
		} else if(checkFileType(data) == 'image'){
			addVideoTrackImageObj(data);
		}
		
	});
	
	$('#video-track').on('dragleave dragend', function(e) {
		e.preventDefault();
		$(this).css('border', '0px');
	});	
}

function imageDragDropEventHandler(){
	$('#image-track').on('dragenter dragover', function(e) {
		e.preventDefault();
		$(this).css('border', '2px solid #ff0080');
	});
	
	$('#image-track').on('drop', function(e) {
		e.preventDefault();
		$(this).css('border', '0px');
		var data = e.originalEvent.dataTransfer.getData("text");
		if(data=='') return;
		
		if( checkFileType(data) != 'image') return;
			
		alert("image!!");
	});
	
	$('#image-track').on('dragleave dragend', function(e) {
		e.preventDefault();
		$(this).css('border', '0px');
	});	
}

function audio1DragDropEventHandler(){
	$('#audio1-track').on('dragenter dragover', function(e) {
		e.preventDefault();
		$(this).css('border', '2px solid #ff0080');
	});
	
	$('#audio1-track').on('drop', function(e) {
		e.preventDefault();
		$(this).css('border', '0px');
		var data = e.originalEvent.dataTransfer.getData("text");
		if(data=='') return;
		
		if( checkFileType(data) != 'audio') return;
			
		alert("audio!!");
	});
	
	$('#audio1-track').on('dragleave dragend', function(e) {
		e.preventDefault();
		$(this).css('border', '0px');
	});	
}

function audio2DragDropEventHandler(){
	$('#audio2-track').on('dragenter dragover', function(e) {
		e.preventDefault();
		$(this).css('border', '2px solid #ff0080');
	});
	
	$('#audio2-track').on('drop', function(e) {
		e.preventDefault();
		$(this).css('border', '0px');
		var data = e.originalEvent.dataTransfer.getData("text");
		if(data=='') return;
		
		if( checkFileType(data) != 'audio') return;
			
		alert("audio!!");
	});
	
	$('#audio2-track').on('dragleave dragend', function(e) {
		e.preventDefault();
		$(this).css('border', '0px');
	});	
}

function trackDragAndDropEventHander(){
	imageDragDropEventHandler();
	videoDragDropEventHandler();
	audio1DragDropEventHandler();
	audio2DragDropEventHandler();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}


