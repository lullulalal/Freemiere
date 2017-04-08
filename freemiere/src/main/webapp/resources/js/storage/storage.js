var myRootDir = '';
var menu = 'MyStorage';
var nowPath = '';

$(document).ready(function() {

	alert(loginMem);
	myRootDir += 'C:\\freemiere\\';
	myRootDir += loginMem;
	myRootDir += '\\';
	nowPath = myRootDir;
	loadList(myRootDir);

	// §ÌÅ¨Î°§Î©î
	var currentPosition = parseInt($(".navbar-nav").css("top"));
	$(window).scroll(function() {
		var position = $(window).scrollTop(); // ÑÏû¨ §ÌÅ¨Î°§Î∞îÑÏπòÍ∞íÏùÑ Î∞òÌôò©Îãà
		$(".navbar-nav").stop().animate({
			"top" : position + currentPosition + "px"
		}, 500);
	});

	$('#myStorage').click(function() {
		menu = 'MyStorage';
		setNavRoot(menu);
		loadList();
	});
	$('#shared').click(function() {
		menu = 'Shared';
		setNavRoot(menu);
		loadList();
	});
	$('#recent').click(function() {
		menu = 'Recent';
		setNavRoot(menu);
	});
	$('#bookMark').click(function() {
		menu = 'Bookmark';
		setNavRoot(menu);
		loadList();
	});
	$('#trash').click(function() {
		menu = 'Trash';
		setNavRoot(menu);
		loadList();
	});
	// òÎã® †úÎ≤ÑÌäº
	$('#btn-del').on('click', go_to_Trash);

	// òÎã® ÖÎ°ú
	$('#file').change(function() {
		var formData = new FormData();
		//formData.append('upload', $('input[type=file]')[0].files[0]);

		// §Ï§ëåÏùºÖÎ°ú
		$($("#file")[0].files).each(function(index, file) {
			formData.append("multi_file[]", file);
		});
		formData.append('nowPath', nowPath);

		$.ajax({
			url : 'fileUpload',
			type : 'POST',
			data : formData,
			contentType : false,
			processData : false,
			success : function() {
				alert("ÖÎ°ú±Í≥µ!!");
				loadList(nowPath);
			},
			error : function(e) {
				console.log(e);
			}
		});
	});
	// úÎûòÍ∑∏Ïï§ úÎ°≠
	var dragDrop = $("#dragDropZone");
	$('#dragDropZone').on('dragenter dragover', function(e) {
		e.preventDefault();
		//$(this).css('border', '3px solid #00b386');
	});
	$('#dragDropZone').on('dragleave', function(e) {

		e.preventDefault();
		// $(this).css('border','');
	});
	$('#dragDropZone').on('drop', function(e) {
		e.preventDefault();
		var files = e.originalEvent.dataTransfer.files;
		if (files.length < 1)
			return;
		$(this).css('border', '0px');
		FileMultiUpload(files, dragDrop);
//Ï≤¥ÌÅ¨ Î∞ïÏä§ ¥Î¶≠úÏãú
	$('.fileBox').on('click', changeColor);
	});
	//Ï≤¥ÌÅ¨ Î∞ïÏä§ ¥Î¶≠úÏãú
	$('.fileBox').on('click', changeColor);
	// òÎã® àÌè¥Î≤ÑÌäº
	$('#btn-add').on('click', newDir);

});

function loadList(path) {
	if (menu == 'MyStorage')
		path = myRootDir;

	var url = 'load' + menu;
	// alert(url);
	$.ajax({
		url : url,
		type : 'GET',
		data : {
			'path' : path
		},
		dataType : 'json',
		success : outputList,
		error : function(e) {
			alert(JSON.stringify(e));
		}
	});

	outputNavi(path);
}

function outputList(list) {
	// alert(JSON.stringify(list));
	var data = '';

	data += '<ul class="fileTable">'
	$.each(list,function(index, item) {
						data +='<li class="fileItem">'
						data += '<table class="fileBox">';
						data += '<tr><td>';
						data += '<input type="checkbox" class="file_check" ffid="'
								+ item.ffid
								+ '" '
								+ 'bookState="'
								+ item.bookState
								+ '"'
								+ 'isshared="'
								+ item.isShared
								+ '" '
								+ 'id="file_check'
								+ index + '">';
						data += '</td></tr>';
						data += '<tr align="center">';
						data += '	<td>';
						if (item.isFolder == false) {
							data += '<img class="file" src="./resources/img/storage/file.png">';
						} else {
							if (item.isShared.toLowerCase() == 't') {
								if (item.bookState.toLowerCase() == 't')
									data += '<img class="folder sfolder" path="'
											+ item.path
											+ '" src="./resources/img/storage/sbfolder.png">';
								else
									data += '<img class="folder sfolder" path="'
											+ item.path
											+ '" src="./resources/img/storage/sfolder.png">';
							} else {
								if (item.bookState.toLowerCase() == 't')
									data += '<img class="folder mfolder" path="'
											+ item.path
											+ '" src="./resources/img/storage/mbfolder.png">';
								else
									data += '<img class="folder mfolder" path="'
											+ item.path
											+ '" src="./resources/img/storage/mfolder.png">';
							}
						}

						data += '	</td>';
						data += '</tr>';
						data += '<tr align="center">';
						data += '	<td class="fileName">';
						data += item.fileName;
						data += '	</td>';
						data += '</tr>';
						data += '</table>';
						data +='</li>';
					});
	data += '</ul>';

	$('#outputList').html(data);

	// òÎã® ÑÏ≤¥†ÌÉù/¥Ï Î©îÎâ¥Î≤ÑÌäº
	$('#btn-all').click(function() {
		alert('hi1');
		if ($('.file_check').is(':checked')) {
			// ¥Ï
			$('.file_check').each(function(index, item) {
				$(this).prop("checked", false);
			});
		} else {
			// †ÌÉù
			$('.file_check').each(function(index, item) {
				$(this).prop("checked", true);
			});
		}

	});
	

	if (navRoot != 'Trash') {
		$('.folder').dblclick(function() {
			var path = $(this).attr('path');
			nowPath = path;
			menu = 'List';
			loadList(path);
		});
	}
}

var navRoot = 'MyStorage';
var nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
		+ navRoot + '">' + 'Ä•ÏÜå</a>';

function setNavRoot(nr) {
	navRoot = nr;
	if (navRoot == 'MyStorage') {
		alert('haha');
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + 'Ä•ÏÜå</a>';
	} else if (navRoot == 'Shared')
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + 'Í≥µÏú†Ä•ÏÜå</a>';
	else if (navRoot == 'Bookmark')
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + 'Ï¶êÍ≤® Ï∞æÍ∏∞</a>';
	else if (navRoot == 'Trash')
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + '¥Ï/a>';
	setNav();
}

function outputNavi(fullPath) {
	// alert(nav);
	function getPatialPath(dirArray, index) {
		var rtn = '';
		for (j = 0; j <= index; j++) {
			rtn += dirArray[j];
			rtn += '\\';
		}
		return rtn;
	}

	if (fullPath != null) {
		var tmp = fullPath.split('\\');
		var rootDir = tmp[0] + '\\' + tmp[1] + '\\' + tmp[2] + '\\';

		if (rootDir.length != fullPath.length) {
			path = fullPath.substring(rootDir.length, fullPath.length);
			var dirArray = path.split('\\');

			var iEnd = dirArray.length - 2;
			nav += '<a class="navbar-brand">/</a>';
			nav += '<a class="navbar-brand naviBar"';
			nav += ' path="' + (rootDir + getPatialPath(dirArray, iEnd)) + '">';
			nav += dirArray[iEnd] + '</a>';
		}
	}

	setNav();

	regEvent();
}

function setNav() {
	$('#navigator').html(nav);
}

function regEvent() {
	$(".naviBarRoot").click(function() {
		var path = $(this).attr('nav');
		menu = path;
		setNavRoot(menu)
		loadList();
	});

	$(".naviBar").click(function() {
		var path = $(this).attr('path');

		if (nowPath != path) {
			nowPath = path;
			menu = 'List';
			loadList(path);
		}
	});
}

// ¥ÏµÏúºÎ°¥Îèô
function go_to_Trash() {
	var ffid = [];
	var isshared = [];
	var bookState = [];

	$('.file_check').each(function(index, item) {

		if ($(item).is(":checked")) {
			ffid.push($(item).attr('ffid'));
			isshared.push($(item).attr('isshared'));
			bookState.push($(item).attr('bookState'))
		}
	});
	alert(ffid);

	jQuery.ajaxSettings.traditional = true;

	$.ajax({
		url : 'deleteFileFolder',
		type : 'POST',
		data : {
			ffid : ffid,
			isshared : isshared,
			bookState : bookState,
		},
		success : function() {
			alert('¥ÏµÏúºÎ°¥Îèô òÏóàµÎãà');
			loadList(nowPath);

		},
		error : function(e) {
			alert(JSON, stringify(e));
		}

	});
}
// úÎûòÍ∑∏Ïï§úÎ°≠ åÏùº ÖÎ°ú
function FileMultiUpload(files, dragDrop) {

	var formData = new FormData();
	//formData.append('upload', $('input[type=file]')[0].files[0]);
	
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
			alert("ÖÎ°ú±Í≥µ!!");
			loadList(nowPath);
		},
		error : function(e) {
			console.log(e);
		}
	});
}//Ï≤¥ÌÅ¨Î∞ïÏä§ ¥Î¶≠Î∞∞Í≤ΩÎ≥ÄÍ≤
function changeColor(){
	if($('fileBox').is(':checked')){
		$()
	}

	dirCreate += '</span></div>';
	dirCreate += '<div class="section">';
	dirCreate += '<label><b>¥Îçî ¥Î¶Ñ</b></label>';
	dirCreate += '<input class="w3-input w3-border w3-margin-bottom" type="text" placeholder="ùÏÑ±¥ÎçîÎ™ÖÏùÑ ÖÎ†•òÏÑ∏" name="insertFolderName" id="insertFolderName">';
	dirCreate += '<button id="confirm" class="w3-button w3-block w3-blue w3-section w3-padding">ïÏù∏</button>';
	dirCreate += '</div>';
	dirCreate += '<div class="w3-container w3-border-top w3-padding-16 w3-light-grey">';
	dirCreate += '<button onclick="document.getElementById(\'newFolder\').style.display=\'none\'" type="button" class="w3-button w3-red">Ï∑®ÏÜå</button>';
	dirCreate += '</div></div>';

	$('#newFolder').html(dirCreate);
	
	document.getElementById('newFolder').style.display='block';
	
	$('#confirm').click(function() {

		var folderName = document.getElementById('insertFolderName').value;
		alert(folderName)
		$.ajax({
			url : 'newDir',
			type : 'POST',
			data : {
				folderName : folderName,
				path : nowPath
			},
			success : function() {
				alert('ùÏÑ±ÑÎ£å');
				document.getElementById('newFolder').style.display='none';
				loadList(nowPath);
			},
			error : function(e) {
				alert(JSON, stringify(e));
			}
		});
	});
	
	
}
