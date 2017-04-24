

$(document).ready(function () {
	$('#view').w2layout({
		name: 'view',
		panels: [
			{ type:'left', style: 'background: #262626', size:'13%' },
			{ type:'main', style: 'background: #262626', size:'47%'},
			{ type:'right', style: 'background: #262626', size:'40%'}
		]
	});
	outputPlayer();
	var fileTreeContents = '<div><ul id="treeDemo" class="ztree"></ul></div>';
	w2ui.view.content('left', fileTreeContents);
	
    loadMyStorageForEditor();
    requestFileList('root');    
    
    mm_load();
    
});


function outputPlayer(){
	
	var player = '';
	player += "<div>";
	player += 	"<canvas id='mm-canvas'></canvas>";
	player += "</div>";
	player += "<div>";
	player +=	 "<i class='fa fa-play player-editor player-editor-pp' aria-hidden='true' onclick='mm_player.paused = false'></i>";
	player +=	 "<i class='fa fa-pause player-editor player-editor-pp' aria-hidden='true' onclick='mm_player.paused = true'></i>";
    player +=	 " <input type='range' id='player-slider' step='0.001' value='0' min='0' max='1' oninput='javascript:sliderSync(\"pslider\")' />";   
    player +=	 "<i class='fa fa-volume-up player-editor' aria-hidden='true'></i> ";
    player +=	 " <input type='range' id='player-volume' step='0.001' value='1' min='0' max='2' oninput='' />";   
    player += "</div>";
    
    w2ui.view.content('right', player);
   
}

function outputFileList(list){
	var contents = '<div id="dragDropZone">';
	
	$.each(list,function(index, item) {
		contents += '<table class="fileBox"><tr><td class="fimage">';
		contents += '';
		
		if (item.isFolder == false) {
			var path = item.path;
			var pathArray = path.split('\\');
			var thumbPath = './storageResources/';
			var imgPath = './storageResources/';
			for (var j = 2; j < pathArray.length; j++) {
				imgPath += pathArray[j];
				thumbPath += pathArray[j] ;
				if(j < (pathArray.length-1) ) {
					thumbPath += '/';
					imgPath += '/';
				}
				if(j == (pathArray.length-2) )
					thumbPath += '.thumb/';
			}
			thumbPath += '.png';
			
			var fileType = getFileType(item.path);
			if( fileType == 'image'){
				contents += '<img id="image' + index + '" ondragstart="drag(event)" draggable="true" class="file fimage-editor" ffid="' + item.ffid + '" path="' + imgPath + '" src="' + thumbPath +'">';
			}
			else if(fileType == 'video'){
				
				var p = item.path;
				var videoPathrray = p.split('\\');
				var videoPath = './storageResources/';
				for (var j = 2; j < videoPathrray.length; j++) {
					videoPath += videoPathrray[j] ;
					if(j < (videoPathrray.length-1) )
						videoPath += '/';
				}
				
				contents += '<video id="video' + index 
						 + '" draggable="true" ondragstart="drag(event)" ' 
						 + 'path="' + videoPath + '" '
						 + 'ffid="' + item.ffid + '" '
						 + 'width=156 height=auto controls'
						 + ' poster="' + thumbPath +'">';
				contents +=   '<source src="' + videoPath + '" type="video/mp4">';
				contents +=   '<source src="' + videoPath + '" type="video/ogg">';
				contents +=   '<source src="' + videoPath + '" type="video/webm">';
				contents +=   'Your browser does not support the video tag.';
				contents += '</video>';
			}
			else if(fileType == 'audio'){
				
				var p = item.path;
				var audioPathrray = p.split('\\');
				var audioPath = './storageResources/';
				for (var j = 2; j < audioPathrray.length; j++) {
					audioPath += audioPathrray[j] ;
					if(j < (audioPathrray.length-1) )
						audioPath += '/';
				}
				contents +='<img draggable="true" ondragstart="drag(event)" ffid="' + item.ffid + '" path="' + audioPath + '" id="audio' + index + '" src="./resources/img/storage/audio.png">';
				contents +='<audio controls>';
				contents +='  <source src=' + audioPath + ' type="audio/mpeg">';
				contents +='  Your browser does not support the audio tag.';
				contents +='</audio>';
				  
			}
			else {
				contents += '<img  src="./resources/img/storage/file.png">';
			}
		} 
		contents += '</td></tr>';
		contents += '<tr><td class="fname">'; 
		contents += item.fileName;
		contents += '</td></tr>';
	});
	
	contents += '</div>';
	
	w2ui.view.content('main', contents);
	
	var dragDrop = $("#dragDropZone");
	$('#dragDropZone').on('dragenter dragover', function(e) {
		e.preventDefault();
		$(this).css('border', '2px solid #ff0080');
	});
	$('#dragDropZone').on('drop', function(e) {
		e.preventDefault();
		var files = e.originalEvent.dataTransfer.files;
		if (files.length < 1)
			return;
		$(this).css('border', '0px');
		FileMultiUpload(files, dragDrop);
	});
	$('#dragDropZone').on('dragleave dragend', function(e) {
		e.preventDefault();
		$(this).css('border', '0px');
	});
	
	$('.fimage-editor').on('dblclick', function(){
		var path = $(this).attr('path');
		alert(path);
		$.colorbox({maxWidth:"75%", maxHeight:"75%", href:path});
	});
}

function initFileList(){
	w2ui.view.content('main', '');
}

function FileMultiUpload(files, dragDrop) {
	
	var formData = new FormData();
	formData.append('upload', $('input[type=file]')[0].files[0]);
	
	for (var i = 0; i < files.length; i++) {
		formData.append('upload[]', files[i]);
	}
	formData.append('nowPath', nowPath);

	$.ajax({
		url : 'fileUpload',
		type : 'POST',
		data : formData,
		contentType : false,
		processData : false,
		success : function() {
			alert("업로드 성공!!");
			requestFileList(nowPath);
		},
		error : function(e) {
			console.log(e);
		}
	});
}

$(document).ready(function () {
	
	$('#menu').w2layout({
		name: 'menu',
		panels: [
			{ type:'main', style: 'background: #2e2e2e', size:'80%'},
			{ type:'right', style: 'background: #2e2e2e', size:'20%'}
		]
	});
	
	var menuContents = '';
	menuContents += '<span class="menubox"><i class="imenu fa fa-folder-o fa-1x" aria-hidden="true"> Storage</i></span>';
	menuContents += '<span class="menubox"><i class="imenu fa fa-exchange fa-1x" aria-hidden="true"> Transition</i></span>';
	menuContents += '<span class="menubox"><i class="imenu fa fa-magic fa-1x" aria-hidden="true"> Filter</i></span>';
	menuContents += '<span class="menubox"><i class="imenu fa fa-floppy-o fa-1x" aria-hidden="true"> Save</i></span>';
	
	w2ui.menu.content('main', menuContents);
});

$(document).ready(function () {
	$('#timeLine').w2layout({
		name: 'timeLine',
		panels: [
			{ type:'main', style: 'background: #333333', size:'88%'},
			{ type:'bottom', style: 'background: #333333', size:'12%' },
			{ type:'right', style: 'background: #262626', size:'15%'}
		]
	});
	
	var toolContents = '';
	

	//toolContents += '<span><i class="imenu fa fa-plus-circle" aria-hidden="true"></i></span>';
	//toolContents += '<span style="padding-left: 10px"></span>';
	//toolContents += '<span><i class="imenu fa fa-minus-circle" aria-hidden="true"></i></span>';
	
	//w2ui.timeLine.content('top', toolContents);
	
	var bottomContents = '';
	bottomContents += '<span class="toolbox"><i class="itool fa fa-reply" aria-hidden="true"> undo</i></span>';
	bottomContents += '<span class="toolbox"><i class="itool fa fa-share" aria-hidden="true"> redo</i></span>';
	bottomContents += '<span class="toolbox"><i id="split" class="itool fa fa-scissors" aria-hidden="true"> split</i></span>';
	bottomContents += '<span class="toolbox"><i class="itool fa fa-trash" aria-hidden="true"> delete</i></span>';
	bottomContents += '<span class="toolbox"><i class="itool fa fa-trash-o" aria-hidden="true"> clear</i></span>';
	bottomContents += '<span style="padding-left: 450px"></span>';
	bottomContents += '<span class="bottombox"><i class="ibottom fa fa-plus" aria-hidden="true"> <span class="character">ADD VIDEO TRACK</span></i></span>';
	bottomContents += '<span class="bottombox"><i class="ibottom fa fa-plus" aria-hidden="true"> <span class="character">ADD AUDIO TRACK</span></i></span>';
	w2ui.timeLine.content('bottom', bottomContents);
	
	timeLineSlider();
	trackDragAndDropEventHander();
	//timeLineMenuEventHandler();
});



function timeLineSlider(){
	
	var t_slider = '';
	t_slider += '<span style="padding-left:33px">';
	t_slider += "</span>";
	t_slider += "<span class='fslider'>";
	t_slider +=		"<input type='range' id='t-slider' step='0.001' value='0' min='0' max='1' oninput='javascript:sliderSync(\"tslider\")' />";   
	t_slider += "</span>";
	
	t_slider +=	'<div>';
	t_slider +=		'<div class="track" id="image-filter-track">';
	t_slider +=			'<span class="track-name">';
	t_slider +=				'<i class="fa fa-magic" aria-hidden="true"></i>';
	t_slider +=			'</span>';
	t_slider +=		'</div>';
	t_slider +=	'</div>';
	
	t_slider +=	'<div>';
	t_slider +=		'<div  class="track" id="image-track">';
	t_slider +=			'<br><span class="track-name">';
	t_slider +=				'<i class="fa fa-picture-o" aria-hidden="true"></i>';
	t_slider +=			'</span>';
	t_slider +=		'</div>';
	t_slider +=	'</div>';
	
	t_slider +=	'<div>';
	t_slider +=		'<div class="track" id="video-filter-track">';
	t_slider +=			'<span class="track-name">';
	t_slider +=				'<i class="fa fa-magic" aria-hidden="true"></i>';
	t_slider +=			'</span>';
	t_slider +=		'</div>';
	t_slider +=	'</div>';
	
	t_slider +=	'<div>';
	t_slider +=		'<div  class="track" id="video-track">';
	t_slider +=			'<br><span class="track-name">';
	t_slider +=				'<i class="fa fa-video-camera" aria-hidden="true"></i>';
	t_slider +=			'</span>';
	t_slider +=		'</div>';
	t_slider +=	'</div>';
	
	t_slider +=	'<div>';
	t_slider +=		'<div class="track" id="audio1-track">';
	t_slider +=			'<br><span class="track-name">';
	t_slider +=				'<i class="fa fa-music" aria-hidden="true"></i>';
	t_slider +=			'</span>';
	t_slider +=		'</div>';
	t_slider +=	'</div>';
	
	t_slider +=	'<div>';
	t_slider +=		'<div class="track" id="audio2-track">';
	t_slider +=			'<br><span class="track-name">';
	t_slider +=				'<i class="fa fa-music" aria-hidden="true"></i>';
	t_slider +=			'</span>';
	t_slider +=		'</div>';
	t_slider +=	'</div>';
	
    w2ui.timeLine.content('main', t_slider);
}

function sliderSync(stype){

	var svalue;
	var tsvalue = document.getElementById('t-slider').value;
	var psvalue = document.getElementById('player-slider').value;
	
	if(stype == 'tslider') {
		document.getElementById('player-slider').value = tsvalue;
		svalue = tsvalue;
	} else if (stype == 'pslider'){
		document.getElementById('t-slider').value = psvalue;
		svalue = psvalue;
	}
	
	mm_player.position=svalue;
}

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



