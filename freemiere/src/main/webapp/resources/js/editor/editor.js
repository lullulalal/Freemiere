


$(document).ready(function () {
	$('#view').w2layout({
		name: 'view',
		panels: [
			{ type:'left', style: 'background: #262626', size:'20%' },
			{ type:'main', style: 'background: #262626', size:'40%'},
			{ type:'right', style: 'background: #262626', size:'40%'}
		]
	});
	
	var fileTreeContents = '<div><ul id="treeDemo" class="ztree"></ul></div>';
	w2ui.view.content('left', fileTreeContents);

    loadMyStorageForEditor();
    requestFileList('root');

});

function outputFileList(list){
	var contents = '';
	
	$.each(list,function(index, item) {
		contents += '<table class="fileBox"><tr><td class="fimage">';
		contents += '';
		contents += '<img src="resources/img/editor/test.png">';
		contents += '</td></tr>';
		contents += '<tr><td class="fname">'; 
		contents += item.fileName;
		contents += '</td></tr>';
	});
	
	w2ui.view.content('main', contents);
}

function initFileList(){
	w2ui.view.content('main', '');
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
	menuContents += '<span class="menubox"><i class="imenu fa fa-folder-o fa-2x" aria-hidden="true"></i></span>';
	menuContents += '<span class="menubox"><i class="imenu fa fa-text-width fa-2x" aria-hidden="true"></i></span>';
	menuContents += '<span class="menubox"><i class="imenu fa fa-exchange fa-2x" aria-hidden="true"></i></span>';
	menuContents += '<span class="menubox"><i class="imenu fa fa-filter fa-2x" aria-hidden="true"></i></span>';
	menuContents += '<span class="menubox"><i class="imenu fa fa-clone fa-2x" aria-hidden="true"></i></span>';
	menuContents += '<span class="menubox"><i class="imenu fa fa-picture-o fa-2x" aria-hidden="true"></i></span>';
	menuContents += '<span class="menubox"><i class="imenu fa fa-floppy-o fa-2x" aria-hidden="true"></i></span>';
	
	w2ui.menu.content('main', menuContents);
});

$(document).ready(function () {
	$('#timeLine').w2layout({
		name: 'timeLine',
		panels: [
			{ type:'top', style: 'background: #333333', size:'10%' },
			{ type:'main', style: 'background: #333333', size:'80%'},
			{ type:'bottom', style: 'background: #333333', size:'10%' }
		]
	});
	
	var toolContents = '';
	
	toolContents += '<span class="toolbox"><i class="itool fa fa-reply" aria-hidden="true"></i></span>';
	toolContents += '<span class="toolbox"><i class="itool fa fa-share" aria-hidden="true"></i></span>';
	toolContents += '<span class="toolbox"><i class="itool fa fa-scissors" aria-hidden="true"></i></span>';
	toolContents += '<span class="toolbox"><i class="itool fa fa-trash-o" aria-hidden="true"></i></span>';
	toolContents += '<span style="padding-left: 800px"></span>';
	toolContents += '<span><i class="imenu fa fa-plus-circle" aria-hidden="true"></i></span>';
	toolContents += '<span style="padding-left: 10px"></span>';
	toolContents += '<span><i class="imenu fa fa-minus-circle" aria-hidden="true"></i></span>';
	
	w2ui.timeLine.content('top', toolContents);
	
	var bottomContents = '';
	bottomContents += '<span class="bottombox"><i class="ibottom fa fa-plus" aria-hidden="true"> <span class="character">ADD VIDEO TRACK</span></i></span>';
	bottomContents += '<span class="bottombox"><i class="ibottom fa fa-plus" aria-hidden="true"> <span class="character">ADD AUDIO TRACK</span></i></span>';
	w2ui.timeLine.content('bottom', bottomContents);
});

