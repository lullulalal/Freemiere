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

	// €ν¬λ‘€λ©
	var currentPosition = parseInt($(".navbar-nav").css("top"));
	$(window).scroll(function() {
		var position = $(window).scrollTop(); // μ¬ €ν¬λ‘€λ°μΉκ°μ λ°ν©λ
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
	// λ¨  λ²νΌ
	$('#btn-del').on('click', go_to_Trash);

	// λ¨ λ‘
	$('#file').change(function() {
		var formData = new FormData();
		//formData.append('upload', $('input[type=file]')[0].files[0]);

		// €μ€μΌλ‘
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
				alert("λ‘±κ³΅!!");
				loadList(nowPath);
			},
			error : function(e) {
				console.log(e);
			}
		});
	});
	// λκ·Έμ€ λ‘­
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
//μ²΄ν¬ λ°μ€ ΄λ¦­μ
	$('.fileBox').on('click', changeColor);
	});
	//μ²΄ν¬ λ°μ€ ΄λ¦­μ
	$('.fileBox').on('click', changeColor);
	// λ¨ ν΄λ²νΌ
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

	// λ¨ μ²΄ ν/΄μ λ©λ΄λ²νΌ
	$('#btn-all').click(function() {
		alert('hi1');
		if ($('.file_check').is(':checked')) {
			// ΄μ
			$('.file_check').each(function(index, item) {
				$(this).prop("checked", false);
			});
		} else {
			//  ν
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
		+ navRoot + '">' + '₯μ</a>';

function setNavRoot(nr) {
	navRoot = nr;
	if (navRoot == 'MyStorage') {
		alert('haha');
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + '₯μ</a>';
	} else if (navRoot == 'Shared')
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + 'κ³΅μ ₯μ</a>';
	else if (navRoot == 'Bookmark')
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + 'μ¦κ²¨ μ°ΎκΈ°</a>';
	else if (navRoot == 'Trash')
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + '΄μ/a>';
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

// ΄μ΅μΌλ‘΄λ
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
			alert('΄μ΅μΌλ‘΄λ μ΅λ');
			loadList(nowPath);

		},
		error : function(e) {
			alert(JSON, stringify(e));
		}

	});
}
// λκ·Έμ€λ‘­ μΌ λ‘
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
			alert("λ‘±κ³΅!!");
			loadList(nowPath);
		},
		error : function(e) {
			console.log(e);
		}
	});
}//μ²΄ν¬λ°μ€ ΄λ¦­λ°°κ²½λ³κ²
function changeColor(){
	if($('fileBox').is(':checked')){
		$()
	}

	dirCreate += '</span></div>';
	dirCreate += '<div class="section">';
	dirCreate += '<label><b>΄λ ΄λ¦</b></label>';
	dirCreate += '<input class="w3-input w3-border w3-margin-bottom" type="text" placeholder="μ±΄λλͺμ λ ₯μΈ" name="insertFolderName" id="insertFolderName">';
	dirCreate += '<button id="confirm" class="w3-button w3-block w3-blue w3-section w3-padding">μΈ</button>';
	dirCreate += '</div>';
	dirCreate += '<div class="w3-container w3-border-top w3-padding-16 w3-light-grey">';
	dirCreate += '<button onclick="document.getElementById(\'newFolder\').style.display=\'none\'" type="button" class="w3-button w3-red">μ·¨μ</button>';
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
				alert('μ±λ£');
				document.getElementById('newFolder').style.display='none';
				loadList(nowPath);
			},
			error : function(e) {
				alert(JSON, stringify(e));
			}
		});
	});
	
	
}
