function checkFileType(data){
	if(data.indexOf("video") != -1) return 'video';
	if(data.indexOf("audio") != -1) return 'audio';
	if(data.indexOf("image") != -1) return 'image';
	if(data.indexOf("filter") != -1) return 'filter';
	if(data.indexOf("trans") != -1) return 'trans';
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
		
		//var path = $('#' + data).attr('path');
		alert("video!!");
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
