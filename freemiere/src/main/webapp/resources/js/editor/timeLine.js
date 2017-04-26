var trackWidth =926;
var trackHeight = 70;

var clickedObj;
var selectedClipNum = 0;
var video0TrackobjNum = 0;

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

function video0TrackEventRemover(){
	$('.video-obj').on('click');
}

function seletedFreeOtherObj(){
	var IdsOftrackObjs = $.makeArray($(".track-obj").map(function(){
	    return $(this).attr("id");
	}));
	//alert(IdsOftrackObjs.length);
	//alert(clickedObj);
	for(var i = 0; i < IdsOftrackObjs.length; i++){
		var thisId = IdsOftrackObjs[i];
		if(clickedObj == thisId) continue;
		$('#' + thisId).css({'border-color': '#2e2e2e'});
		$('#' + thisId).attr('clicked', 'false');
	}	
}

function clearEditor(){
	var html = '';
	w2ui.timeLine.content('right', html);
}



function outputVideoEditor(){
	
	var video0Clips = mm_player.mash.video[0].clips;
	var selectedClip = video0Clips[selectedClipNum];
	//alert(JSON.stringify(selectedClip));
	var frames = selectedClip.frames;
	var trim = selectedClip.trim;
	var label = getLabel(selectedClip.id);
	//step="0.1"
	var duration = -1;
	var media = mm_player.mash.media;
	for(var j = 0; j < media.length; j++){
		if(media[j].id == selectedClip.id){
			duration = media[j].duration;
			break;
		}
	}
	
	var htmlt = '';
	htmlt += '<div>';
	htmlt += 	'<table id="editorBox">';
	htmlt += 		'<tr>';
	htmlt += 			'<td><i class="fa fa-tag" aria-hidden="true">Label </i></td>';
	htmlt += 			'<td><p id="e-label">Label</p></td>';
	htmlt += 		'</tr>';
	if(duration != null){
		htmlt += 		'<tr>';
		htmlt += 			'<td><i class="fa fa-chevron-up" aria-hidden="true">Jump</i></td>';
		htmlt += 			'<td><input id="e-jump" class="e-num" type="number">Sec</td>';
		htmlt += 		'</tr>';
	}
	htmlt += 		'<tr>';
	htmlt += 			'<td><i class="fa fa-clock-o" aria-hidden="true">Time</i></td>';
	htmlt += 			'<td><input id="e-time" class="e-num" type="number">Sec</td>';
	htmlt += 		'</tr>';
	if(duration != null){
		htmlt += 		'<tr>';
		htmlt += 			'<td><i class="fa fa-volume-up" aria-hidden="true">Vol</i> </td>';
		htmlt += 			'<td><input type="range" id="editor-vol" step="0.001" value="1" min="0" max="2" oninput="volumeControll()" /></td>';
		htmlt += 		'</tr>';
	}
	htmlt += 		'<tr>';
	htmlt += 			'<td colspan="2"><i class="fa fa-magic" aria-hidden="true">Filter </i></td>';
	htmlt += 		'</tr>';
	htmlt += 		'<tr>';
	htmlt += 			'<td colspan="2"><div id="e-filter-box"></div></td>';
	htmlt += 		'</tr>';
	htmlt += 	'</table>';
	htmlt += '</div>';

	w2ui.timeLine.content('right', htmlt);
	$('#e-label').text(label);
	if(duration != null){
		
		$('#e-jump').attr('max', duration.toFixed(2));
		$('#e-jump').attr('min', 0);
		$('#e-jump').attr('value', trim.toFixed(2));
		$('#e-jump').attr('step', 1);
		
		$('#e-time').attr('max', duration.toFixed(2));
		
		var index = 0;
		for(var i = 0; i < mm_player.mash.video[0].clips.length; i++){
			//alert(JSON.stringify(selectedVideoClip));
			if( getType(mm_player.mash.video[0].clips[i].id) == 'image' ) continue;
			if(i==selectedClipNum) {
				var vol = mm_player.mash.audio[0].clips[index].gain;
				document.getElementById('editor-vol').value = vol;
				break;
			}
			index++;
		}
	}

	$('#e-time').attr('min', 0);
	$('#e-time').attr('value', frames.toFixed(2));
	$('#e-time').attr('step', 1);
	
	editorUnbinder();
	editorBinder();
}

function editorUnbinder(){
	$("#e-jump").unbind( 'change mouseup');
	$("#e-time").unbind( 'change mouseup');
}

function volumeControll(){
	if(clickedObj == '') return;
	var value = document.getElementById('editor-vol').value;
	var index = 0;
	for(var i = 0; i < mm_player.mash.video[0].clips.length; i++){
		//alert(JSON.stringify(selectedVideoClip));
		if( getType(mm_player.mash.video[0].clips[i].id) == 'image' ) continue;
		if(i==selectedClipNum) {
			mm_player.mash.audio[0].clips[index].gain = value;
			
			mm_player.__adjust_gain(mm_player.mash.audio[0].clips);
			break;
		}
		index++;
	}
}

function editorBinder(){
	$("#e-jump").bind('change mouseup', function () {
		var video0Clips = mm_player.mash.video[0].clips;
		var selectedClip = video0Clips[selectedClipNum];
		
		var jump = selectedClip.trim*1;
		var time = selectedClip.frames*1;
		var sum = jump + time;
		
		//alert(sum);
		var newJump = 1*document.getElementById("e-jump").value;
		var newTime = sum - newJump;

		$('#e-time').attr('value', newTime);
		//$('#e-time').attr('max', newTime);
		
		mm_player.mash.video[0].clips[selectedClipNum].frames = newTime;
		mm_player.mash.video[0].clips[selectedClipNum].trim = newJump;
		
		var preFrame = 0;
		for(var i = 0; i < mm_player.mash.video[0].clips.length; i++){
			mm_player.mash.video[0].clips[i].frame = preFrame;
			preFrame = preFrame + mm_player.mash.video[0].clips[i].frames;
		}
		
		var index = 0;
		for(var i = 0; i < mm_player.mash.video[0].clips.length; i++){
			//alert(JSON.stringify(selectedVideoClip));
			if( getType(mm_player.mash.video[0].clips[i].id) == 'image' ) continue;

			mm_player.mash.audio[0].clips[index].frame = mm_player.mash.video[0].clips[i].frame;
			mm_player.mash.audio[0].clips[index].trim = mm_player.mash.video[0].clips[i].trim;
			mm_player.mash.audio[0].clips[index].frames = mm_player.mash.video[0].clips[i].frames;
			index++;
		}
		
		mm_player.change('frame');
		mm_player.change('trim');
		video0TrackRedraw();
	});
	
	$("#e-time").bind('change mouseup', function () {
		var newTime = 1*document.getElementById("e-time").value;
		
		mm_player.mash.video[0].clips[selectedClipNum].frames = newTime;
		
		var preFrame = 0;
		for(var i = 0; i < mm_player.mash.video[0].clips.length; i++){
			mm_player.mash.video[0].clips[i].frame = preFrame;
			preFrame = preFrame + mm_player.mash.video[0].clips[i].frames;
		}

		var index = 0;
		for(var i = 0; i < mm_player.mash.video[0].clips.length; i++){
			//alert(JSON.stringify(selectedVideoClip));
			if( getType(mm_player.mash.video[0].clips[i].id) == 'image' ) continue;
			mm_player.mash.audio[0].clips[index].frame = mm_player.mash.video[0].clips[i].frame;
			mm_player.mash.audio[0].clips[index].frames = mm_player.mash.video[0].clips[i].frames;
			index++;
		}
		
 		mm_player.change('frames');
		
		video0TrackRedraw();          
	});
}

//클릭 및 클릭 해제
function video0TrackEventRegister(){
	$('.video-obj').on('click', function(e) {
		//alert("haha");
		//alert($(this).html());
		var clicked = $(this).attr('clicked');
		
		if(clicked == 'false') { //클릭되었을때
			$(this).css({'border-color': '#fff'});
			$(this).attr('clicked', 'true');
			
			timeLineSplitEventHandler();
			
			clickedObj = $(this).attr('id');
			selectedClipNum = 1 * clickedObj.charAt(clickedObj.length-1);
			outputVideoEditor();
			
			seletedFreeOtherObj();
			
		}
		else { //클릭 해제 되었을때
			$(this).css({'border-color': '#2e2e2e'});
			$(this).attr('clicked', 'false');
			timeLineSplitEventHandlerRemove();
			clickedObj = '';
			selectedClipNum = 0;
			clearEditor();
		}
	});
}

function getLabel(id){
	//alert(id);
	var label;
	var media = mm_player.mash.media;
	for(var j = 0; j < media.length; j++){
		if(media[j].id == id){
			label = media[j].label;
			break;
		}
	}
	return label;
}

function video0TrackRedraw(){
	video0TrackobjNum = 0;
	var html = '';
	html +=			'<span class="track-name">';
	html +=				'<i class="fa fa-video-camera" aria-hidden="true"></i>';
	html +=			'</span>';
	var mash = mm_player.mash;
	var media = mash.media;
	
	var video0Clips = mm_player.mash.video[0].clips;
	
	
	for(var i = 0; i<video0Clips.length; i++){
		//alert(JSON.stringify(mm_player.mash));
		var label = getLabel(video0Clips[i].id);
		
		var newid = 'video'+'Obj' + video0TrackobjNum;
		video0TrackobjNum++;
		
		var thumbPath = '';
		for(var j = 0; j < media.length; j++){
			if(media[j].id == video0Clips[i].id){
				//alert(JSON.stringify(media[j]));
				if (media[j].type == 'image'){
					thumbPath = getThumbPath(media[j].url);
				}else if (media[j].type == 'video'){
					thumbPath = media[j].url + '000000150.jpg';
				}else if (media[j].type == 'audio'){
				
				}
				break;
			}
		}
		
		html += '<div class="ui-state-default video-obj track-obj" ';
		html += ' frames=' + video0Clips[i].frames +' ';
		html += ' id=' + newid +' ';
		html += ' fname=' + newid +' ';
		//html += ' path=' + videoInfo.extractPath +' ';
		html += ' clicked=' + 'false' +' ';
		html += '>';
		html += '<img class="obj-thumb" src="' + thumbPath + '">'
		html += label;
		html += '</div>';
	}
	
	$('#video-track').html(html);
	resizeTrackObj();
	timeLineSplitEventHandlerRemove();
	video0TrackEventRemover();
	video0TrackEventRegister();
	selectedRedraw();

}

function selectedRedraw(){
	if(clickedObj=='') return;
	
	$('#' + clickedObj).css({'border-color': '#fff'});
	$('#' + clickedObj).attr('clicked', 'true');
	
	timeLineSplitEventHandler();
	
	//clickedObj = $(this).attr('id');
	//selectedClipNum = 1 * clickedObj.charAt(clickedObj.length-1);
	outputVideoEditor();
	//seletedFreeOtherObj();
}

function changeSelectedClip(){
	var audio0Clips = mm_player.mash.audio[0].clips;
	var selectedClip;
	var index = 0;
	for(var i = 0; i < mm_player.mash.video[0].clips.length; i++){
		//alert(JSON.stringify(selectedVideoClip));
		if( getType(mm_player.mash.video[0].clips[i].id) == 'image' ) continue;
		if(i==selectedClipNum) {
			selectedClip = audio0Clips[index];
			break;
		}
		index++;
	}
	mm_player.selectedClip = selectedClip;
	mm_player.split();
	
	var video0Clips = mm_player.mash.video[0].clips;
	selectedClip = video0Clips[selectedClipNum];
	mm_player.selectedClip = selectedClip;
	
	mm_player.split();
	
}

function timeLineSplitEventHandler(){
	$('#split').off('click');
	$('#split').on('click', function(){
		if(getType(mm_player.mash.video[0].clips[selectedClipNum].id) == 'image') return;
		changeSelectedClip()
		video0TrackRedraw();
		timeLineSplitEventHandlerRemove();
		clearEditor();
	});
}

function timeLineSplitEventHandlerRemove(){
	$('#split').off('click');
}

function addVideoTrackVideoObj(id){
	
	var ffid = $('#' + id).attr('ffid');
	//var fname = getFileName(path);
	//alert(ffid);
	var path = $('#' + id).attr('path');
	var fname = getFileName(path);
	//alert(path);
	var thumbPath = getThumbPath(path);
	//alert(thumbPath);
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
			html += '<div class="ui-state-default video-obj track-obj" ';
			html += ' frames=' + videoInfo.count/30 +' ';
			html += ' id=' + newid +' ';
			html += ' fname=' + fname +' ';
			html += ' itmeId=' + id +' ';
			//html += ' path=' + videoInfo.extractPath +' ';
			html += ' clicked=' + 'false' +' ';
			html += '>';
			html += '<img class="obj-thumb" src="' + thumbPath + '">'
			html +=  fname;
			html += '</div>';
			
			$('#video-track').html(html);
			add_video0(newid, videoInfo.extractPath.replace(/\\/gi, '/') ,videoInfo.count, fname);
			resizeTrackObj();
			video0TrackEventRemover();
			video0TrackEventRegister();

		},
		error : function(e) {
			//alert(JSON.stringify(e));
		}
	});	
}

function addVideoTrackImageObj(id){
	var path = $('#' + id).attr('path');
	var fname = getFileName(path);
	var thumbPath = getThumbPath(path);
	
	//alert(fname);
	//var result = s.replace(/oo/gi, 'ZZ');
	var url = path.substring(2,path.length);
	//alert(url);
	var html = $('#video-track').html();
	var newid = 'video'+'Obj' + video0TrackobjNum;
	video0TrackobjNum++;
	html += '<div class="ui-state-default video-obj track-obj" ';
	html += ' frames=' + 2 +' ';
	html += ' id=' + newid +' ';
	html += ' itemId=' + id +' ';
	//html += ' path=' + url +' ';
	html += ' fname=' + fname +' ';
	html += ' clicked=' + 'false' +' ';
	html += '>';
	html += '<img class="obj-thumb" src="' + thumbPath + '">'
	html += fname;
	html += '</div>';
	
	$('#video-track').html(html);
	add_video0img(newid, url, fname);
	resizeTrackObj();
	video0TrackEventRemover();
	video0TrackEventRegister();
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


function otherTrackDragDropEventHandler(trackId, type){
	$('#' + trackId).on('dragenter dragover', function(e) {
		e.preventDefault();
		$(this).css('border', '2px solid #ff0080');
	});
	
	$('#' + trackId).on('drop', function(e) {
		e.preventDefault();
		$(this).css('border', '0px');
		var data = e.originalEvent.dataTransfer.getData("text");
		if(data=='') return;
		
		if( checkFileType(data) != type) return;
			
		alert(type);
		addObj(trackId, data );
		
	});
	
	$('#' + trackId).on('dragleave dragend', function(e) {
		e.preventDefault();
		$(this).css('border', '0px');
	});	
}

function trackDragAndDropEventHander(){
	videoDragDropEventHandler();
	
	otherTrackDragDropEventHandler('vtrack-1', 'image');
	otherTrackDragDropEventHandler('vtrack-2', 'image');
	otherTrackDragDropEventHandler('atrack-1', 'audio');
	otherTrackDragDropEventHandler('atrack-2', 'audio');
	//imageDragDropEventHandler();
	//imageDragDropEventHandler();
	//audio1DragDropEventHandler();
	//audio2DragDropEventHandler();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function reorderingVideo0Clips(videoOrders){
	
	var video0Clips = mm_player.mash.video[0].clips;
	var newVideo0Clips = [];
	var newTimeInfo = new Array(video0Clips.length);
	
	//alert(JSON.stringify(video0Clips));
	
	for(var i = 1; i < videoOrders.length; i++){
		var num = 1 * videoOrders[i].charAt(videoOrders[i].length-1);
		//alert(videoOrders[i] + ': ' + num);
		var selectedClip = video0Clips[num];
		//alert(JSON.stringify(selectedClip));
		newVideo0Clips[i-1] = selectedClip;
		//alert(i-1);
	}
	
	var preFrame = 0;
	for(var i = 0; i < newVideo0Clips.length; i++){
		newVideo0Clips[i].frame = preFrame;
		preFrame = preFrame + newVideo0Clips[i].frames;
	}
	//alert(JSON.stringify(newVideo0Clips));
	mm_player.mash.video[0].clips = newVideo0Clips;
	video0TrackRedraw();
	
	//audio
	var audio0Clips = mm_player.mash.audio[0].clips;
	var newAudio0Clips = [];
	
	var index = 0;
	for(var i = 0; i < newVideo0Clips.length; i++){
		var selectedVideoClip = newVideo0Clips[i];
		//alert(JSON.stringify(selectedVideoClip));
		if( getType(selectedVideoClip.id) == 'image' ) continue;

		//alert(selectedVideoClip);
		
		var selectedAudioClip = audio0Clips[index];
		newAudio0Clips[index] = selectedAudioClip;

		newAudio0Clips[index].frame = selectedVideoClip.frame;
		newAudio0Clips[index].trim = selectedVideoClip.trim;
		newAudio0Clips[index].frames = selectedVideoClip.frames;
		index++;
	}
	
	mm_player.mash.audio[0].clips = newAudio0Clips;
}

function getType(id){
	//alert(id);
	var type;
	var media = mm_player.mash.media;
	for(var j = 0; j < media.length; j++){
		if(media[j].id == id){
			type = media[j].type;
			break;
		}
	}
	return type;
}


