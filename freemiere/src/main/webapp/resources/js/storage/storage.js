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

	// 스크롤메뉴
	var currentPosition = parseInt($(".navbar-nav").css("top"));
	$(window).scroll(function() {
		var position = $(window).scrollTop(); // 현재 스크롤바의 위치값을 반환합니다.
		$(".navbar-nav").stop().animate({
			"top" : position + currentPosition + "px"
		}, 500);
	});

	$('#myStorage').click(function() {
		menu = 'MyStorage';
		setNavRoot(menu);
		setNavTop(menu);
		// 하단 삭제버튼
		$('#btn-del').on('click', go_to_Trash);
		loadList();
	});
	$('#shared').click(function() {
		menu = 'Shared';
		setNavRoot(menu);
		setNavTop(menu);
		// 하단 삭제버튼
		$('#btn-del').on('click', go_to_Trash);
	
		loadList();
	});
	$('#recent').click(function() {
		menu = 'Recent';
		setNavRoot(menu);
		// 하단 삭제버튼
		$('#btn-del').on('click', go_to_Trash);
	});
	$('#bookMark').click(function() {
		menu = 'Bookmark';
		setNavRoot(menu);
		setNavTop(menu);
		// 하단 삭제버튼
		$('#btn-del').on('click', go_to_Trash);
		loadList();
	});
	$('#trash').click(function() {
		menu = 'Trash';
		setNavRoot(menu);
		setNavTop(menu);
		// 하단 삭제버튼
		$('#btn-del').on('click', go_to_Trash);
		// 복원 버튼
		$('#btn-resotre').on('click', restore);
		// 휴지통에서 완전 삭제
		$('#btncompleteDel').on('click', completeDelete);
		loadList();
	});
	$('#edit').click(function() {
		menu = 'Edit';
		setNavRoot(menu);
		loadList();
	});
	$('#search').click(function() {
		menu = 'Search';
		setNavRoot(menu);
		loadList();
	});
	// 하단 삭제버튼
	$('#btn-del').on('click', go_to_Trash);
	// 하단 업로드
	$('#file').change(function() {
		alert('up');
		var formData = new FormData();
		// formData.append('upload', $('input[type=file]')[0].files[0]);

		// 다중파일업로드
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
				alert("업로드 성공!!");
				loadListUnchangNav(nowPath);
			},
			error : function(e) {
				console.log(e);
			}
		});
	});
	// 드래그앤 드롭
	var dragDrop = $("#dragDropZone");
	$('#dragDropZone').on('dragenter dragover', function(e) {
		e.preventDefault();
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
	});

	// 하단 새폴더 버튼
	$('#btn-add').on('click', newDir);

	// $('#btn-download').on('click', fileDownLoad);

	// 복원 버튼
	$('#btn-resotre').on('click', restore);

	// 휴지통에서 완전 삭제
	$('#btncompleteDel').on('click', completeDelete);

});
// 최근작업파일
function loadRecentList(path) {
	if (menu == 'Recent')
		path = myRootDir;

	var url = 'load' + menu;
	$.ajax({
		url : url,
		type : 'GET',
		data : {
			'path' : path
		},
		dataType : 'json',
		success : outputRecentList,
		error : function(e) {
			alert(JSON.stringify(e));
		}
	});

	outputNavi(path);
}

function outputRecentList(dateFile) {
	 alert(JSON.stringify(dateFile));
	var data = '';
	var length = dateFile.length;
	var length1 = dateFile.strUpdate;
	 
	$.each(dateFile, function(key, value) {
		alert(key + ': ' + JSON.stringify(value)); 
		alert(value.path);
		consol.log(JSON.stringify(value).ffid);
	/*
	 * for(var i=0; i<length; i++){ var key = "date"+i; //
	 * console.log(dateFile.key); }
	 */

			/*
			 * data += JSON.stringify(value).path; //data += item.path; data += '<table
			 * class="fileBox">'; data += '<tr><td>'; data += '<input
			 * type="checkbox" class="file_check" ffid="' +
			 * JSON.stringify(value).ffid + '" ' + 'bookState="' +
			 * JSON.stringify(value).bookState + '"' + 'isshared="' +
			 * JSON.stringify(value).isShared + '" ' + 'id="file_check' + key +
			 * '">'; data += '</td></tr>';
			 * 
			 * data += '<tr align="center">' data += ' <td>'; if
			 * (JSON.stringify(value).isFolder == false) {// 폴더 안에 들어있는 파일 data += '<img
			 * class="file" src="./resources/img/storage/file.png">'; } else {
			 * if (JSON.stringify(value).isShared.toLowerCase() == 't') { if
			 * (JSON.stringify(value).bookState.toLowerCase() == 't')// 북마크 //
			 * 찍은 // 폴더 data += '<img class="folder sfolder" path="' +
			 * JSON.stringify(value).path + '"
			 * src="./resources/img/storage/sbfolder.png">'; else // 파빨 공유 폴더
			 * data += '<img class="folder sfolder" path="' +
			 * JSON.stringify(value).path + '"
			 * src="./resources/img/storage/folderballoon.png">'; } else { if
			 * (JSON.stringify(value).bookState.toLowerCase() == 't')// 북마크찍은 //
			 * 폴더
			 * 
			 * data += '<img class="folder mfolder" path="' +
			 * JSON.stringify(value).path + '"
			 * src="./resources/img/storage/mbfolder.png">'; else // 기본폴더 data += '<img
			 * class="folder mfolder" path="' + JSON.stringify(value).path + '"
			 * src="./resources/img/storage/folderballoon_y.png">'; } } data += '
			 * </td>'; data += '</tr>'; data += '<tr align="center">'; data += '
			 * <td>'; data += JSON.stringify(value).fileName; data += ' </td>';
			 * data += '</tr>'; data += '</table>'; if(dateFile){ data += '<br>'; }
			 * //})
			 */

	});
	

	$('#outputList').html(data);

	// 하단 전체선택 메뉴버튼
	$('#btn-all').click(function() {
		// alert('hi');
		$('.file_check').each(function(index, item) {
			$(this).attr("checked", "checked");
		});
	});

	$('.folder').dblclick(function() {
		$('.file_check').attr("checked", "checked");
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



// 내저장소
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
	// setNavTop(menu);
}
function loadListUnchangNav(path) {
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
}


function outputList(list) {
	var data = '';
	$.each(list, function(index, item) {
						data += '<li class="fileItem">'

		
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
								+ 'path="'
								+ item.path
								+ '"'
				+ 'id="file_check'
				+ index + '">';
								+ '" >';
			data += '</td></tr>';

			data += '<tr align="center">'
						data += '	<td class="filebox-td">';
			if (item.isFolder == false) {// 폴더 안에 들어있는 파일
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
								data += '<img class="file fimage" path="' + imgPath + '" src="' + thumbPath +'">';
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
								
								data += '<video width=156 height=156 controls poster="' + thumbPath +'">';
								data +=   '<source src="' + videoPath + '" type="video/mp4">';
								data +=   '<source src="' + item.path + '" type="video/ogg">';
								data +=   '<source src="' + item.path + '" type="video/webm">';
								data +=   'Your browser does not support the video tag.';
								data += '</video>';
							}
							else {
				data += '<img class="file" src="./resources/img/storage/file.png">';
							}
			} else {
				if (item.isShared.toLowerCase() == 't') {
								if (item.bookState.toLowerCase() == 't') {
									data += '<label for="file_check' + index
											+ '">';
					data += '<img class="folder sfolder" path="'
					+ item.path
					+ '" src="./resources/img/storage/sbfolder.png">';
									data += '</label>';
								} else {
									data += '<label for="file_check' + index
											+ '">';
					data += '<img class="folder sfolder" path="'
					+ item.path
											+ '" src="./resources/img/storage/sfolder.png" >';
									data += '</label>';
								}
				} else {
								if (item.bookState.toLowerCase() == 't') {
									data += '<label for="file_check' + index
											+ '">';
						data += '<img class="folder mfolder" path="'
								+ item.path
								+ '" src="./resources/img/storage/mbfolder.png">';
									data += '</label>';
								} else {
									data += '<label for="file_check' + index
											+ '">';
						data += '<img class="folder mfolder" path="'
												+ item.path
											+ '" src="./resources/img/storage/mfolder.png" >';
									data += '</label>';
								}
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
						data += '</li>';

	});
	data += '</ul>';
	

	$('#outputList').html(data);

	// 하단 전체선택 메뉴버튼
	$('#btn-all').click(function() {
		alert('hi1');
		if ($('.file_check').is(':checked')) {
			// 선택해제
			$('.file_check').each(function(index, item) {
				$(this).prop("checked", false);
				$('.file').css('background-color', '');
				$('.folder').css('background-color', '');
			});
		} else {
			// 선택
			$('.file_check').each(function(index, item) {
				$(this).prop("checked", true);
				$('.file').css('background-color', '#ccebff');
				$('.folder').css('background-color', '#ccebff');
			});
		}
	});

	// 이미지 클릭시 색깔 바꾸기
	$('.file').click(function() {
		alert('hi!!!!!!!!!!!!1');
		$(this).toggleClass('highlight');
	});

	$('.folder').click(function() {
		$(this).toggleClass('highlight');
	});
	$('.folder').dblclick(function() {
		$('.file_check').attr("checked", "checked");
	});	
	
	if (navRoot != 'Trash') {
		$('.folder').dblclick(function() {
			var path = $(this).attr('path');
			nowPath = path;
			menu = 'List';
			loadList(path);
		});
	}
	
	$('.fimage').on('dblclick', function(){
		var path = $(this).attr('path');
		$.colorbox({maxWidth:"75%", maxHeight:"75%", href:path});
	});
	
}

	

// 객체화 하자
	
var navRoot = 'MyStorage';
var nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
		+ navRoot + '">' + '내 저장소</a>';

function setNavRoot(nr) {
	navRoot = nr;
	if (navRoot == 'MyStorage') {
		// alert('haha');
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + '내 저장소</a>';
	} else if (navRoot == 'Shared')
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + '공유 저장소</a>';
	else if (navRoot == 'Recent')
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + '최근 작업 파일</a>';
	else if (navRoot == 'Bookmark')
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + '즐겨 찾기</a>';
	else if (navRoot == 'Trash')
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + '휴지통</a>';
	else if (navRoot == 'Edit')
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + '영상편집</a>';
	setNav();
}

function setNavTop(nr) {
	// alert(nr);
	var data = '';
	navRoot = nr;

	if (navRoot == 'MyStorage') {
		data += '<ul class="nav navbar-nav">';
		data += '	<li class="active">';
		data += '		<a href="#">';
		data += '			<input type="button" class="btn btn-outline-success" id="btn-all" value="전체선택">';
		data += '		</a>';
		data += '	</li>';
		data += '	<li>';
		data += '		<a href="#">';
		data += '			<input type="button" class="btn btn-outline-success" id="btn-del" value="삭제">';
		data += '		</a>';
		data += '	</li>';
		data += '	<li>';
		data += '		<a href="#">';
		data += '			<input type="button" class="btn btn-outline-success" id="btn-add" value="새폴더">';
		data += '		</a>';
		data += '	</li>'
		data += '	<li>';
		data += '		<a href="#">';
		data += '			<form class="filebox" action="fileDownload" id="fileDownload" method="post" enctype="multipart/form-data">';
		data += '				<input type="button" class="btn btn-outline-success" id="btn-download" value="다운로드">';
		data += '			</form>';
		data += '		</a>';
		data += '	</li>';
		data += '	<li>';
		data += '		<a href="#">';
		data += '			<form id=' + 'fileUpForm'
				+ ' method="post" enctype="multipart/form-data">';
		data += '				<label for="file" class="btn btn-primary">업로드</label>';
		data += '				<input type="file" id="file" name="upload" class="btn btn-primary" multiple style="display: none;" />';
		data += '			</form>';
		// data += ' </a>';
		data += '	</li>';
		data += '</ul>';

		$('#setNavTop').html(data);
	} else if (navRoot == 'Shared') {
		data += '<ul class="nav navbar-nav">';
		data += '	<li class="active">';
		data += '		<a href="#">';
		data += '			<input type="button" class="btn btn-outline-success" id="btn-all" value="전체선택">';
		data += '		</a>';
		data += '	</li>';
		data += '	<li>';
		data += '		<a href="#">';
		data += '			<input type="button" class="btn btn-outline-success" id="btn-del" value="삭제">';
		data += '		</a>';
		data += '	</li>';
		data += '	<li>';
		data += '		<a href="#">';
		data += '			<form class="filebox" action="fileDownload" id="fileDownload" method="post" enctype="multipart/form-data">';
		data += '				<input type="button" class="btn btn-outline-success" id="btn-download" value="다운로드">';
		data += '			</form>';
		data += '		</a>';
		data += '	</li>';
		data += '	<li>';
		data += '		<a href="#">';
		data += '			<form id=' + 'fileUpForm'
				+ ' method="post" enctype="multipart/form-data">';
		data += '				<label for="file" class="btn btn-primary">업로드</label>';
		data += '				<input type="file" id="file" name="upload" class="btn btn-primary" multiple style="display: none;" />';
		data += '			</form>';
		data += '		</a>';
		data += '	</li>';
		data += '</ul>';
		$('#setNavTop').html(data);
	} else if (navRoot == 'Bookmark') {
		data += '<ul class="nav navbar-nav">';
		data += '	<li class="active">';
		data += '		<a href="#">';
		data += '			<input type="button" class="btn btn-outline-success" id="btn-all" value="전체선택">';
		data += '		</a>';
		data += '	</li>';
		data += '	<li>';
		data += '		<a href="#">';
		data += '			<input type="button" class="btn btn-outline-success" id="btn-del" value="삭제">';
		data += '		</a>';
		data += '	</li>';
		data += '	<li>';
		data += '		<a href="#">';
		data += '			<form class="filebox" action="fileDownload" id="fileDownload" method="post" enctype="multipart/form-data">';
		data += '				<input type="button" class="btn btn-outline-success" id="btn-download" value="다운로드">';
		data += '			</form>';
		data += '		</a>';
		data += '	</li>';
		data += '	<li>';
		data += '		<a href="#">';
		data += '			<form id=' + 'fileUpForm'
				+ ' method="post" enctype="multipart/form-data">';
		data += '				<label for="file" class="btn btn-primary">업로드</label>';
		data += '				<input type="file" id="file" name="upload" class="btn btn-primary" multiple style="display: none;" />';
		data += '			</form>';
		data += '		</a>';
		data += '	</li>';
		data += '</ul>';
		$('#setNavTop').html(data);
	} else if (navRoot == 'Trash') {
		data += '<ul class="nav navbar-nav">';
		data += '	<li class="active">';
		data += '		<a href="#">';
		data += '			<input type="button" class="btn btn-outline-success" id="btn-all" value="전체선택">';
		data += '		</a>';
		data += '	</li>';
		data += '	<li>';
		data += '		<a href="#">';
		data += '			<input type="button" class="btn btn-outline-success" id="btncompleteDel" value="삭제">';
		data += '		</a>';
		data += '	</li>';
		data += '	<li>';
		data += '		<a href="#">';
		data += '			<input type="button" class="btn btn-outline-success" id="btn-resotre" value="복원">';
		data += '		</a>';
		data += '	</li>';
		$('#setNavTop').html(data);
	}else if(navRoot == 'recent'){
		data += '<ul class="nav navbar-nav">';
		data += '	<li class="active">';
		data += '		<a href="#">';
		data += '			<input type="button" class="btn btn-outline-success" id="btn-all" value="전체선택">';
		data += '		</a>';
		data += '	</li>';
		data += '	<li>';
		data += '		<a href="#">';
		data += '			<input type="button" class="btn btn-outline-success" id="btncompleteDel" value="삭제">';
		data += '		</a>';
		data += '	</li>';
		data += '	<li>';
		data += '		<a href="#">';
		data += '			<form class="filebox" action="fileDownload" id="fileDownload" method="post" enctype="multipart/form-data">';
		data += '				<input type="button" class="btn btn-outline-success" id="btn-download" value="다운로드">';
		data += '			</form>';
		data += '		</a>';
		data += '	</li>';
	}
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
		if(path='MyStorage')
			nowPath = myRootDir;
		else
			nowPath = '';
		menu = path;
		setNavRoot(menu)
		loadList();
	});

	$(".naviBar").click(function() {
		var naviArray = $('.naviBar');
		var num = 0;
		for (var i = 0; i < naviArray.length; i++) {
			if(naviArray[i].outerHTML == $(this)[0].outerHTML){
				num = i;
				break;
			}
		}
		var path = $(this).attr('path');
		
		if(nowPath.length >= path.length){
			nav = '';
			setNavRoot(navRoot);
			for (var i = 0; i < num; i++) {
				nav += '<a class="navbar-brand">/</a>';
				nav += naviArray[i].outerHTML;
			}
		}
		nowPath = path;
		menu = 'List';
		loadList(path);
	});
}

// 휴지통으로 이동
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
			alert('휴지통으로 이동 되었습니다.');
			loadListUnchangNav(nowPath);
		},
		error : function(e) {
			alert(JSON, stringify(e));
		}

	});
}
// 드래그앤드롭 파일 업로드
function FileMultiUpload(files, dragDrop) {

	var formData = new FormData();
	/* formData.append('upload', $('input[type=file]')[0].files[0]); */

	for (var i = 0; i < files.length; i++) {
		formData.append('upload[]', files[i]);
	}
	alert(nowPath);
	formData.append('nowPath', nowPath);

	$.ajax({
		url : 'fileUpload',
		type : 'POST',
		data : formData,
		contentType : false,
		processData : false,
		success : function() {
			alert("업로드 성공!!");
			loadListUnchangNav(nowPath);
		},
		error : function(e) {
			console.log(e);
		}
	});

}
function newDir() {
	alert('hell');

	var dirCreate = '';
	// 아이디를 변경하지 말아주떼연.
	/*
	 * dirCreate += '<div class="modal fade" id="modal-register" tabindex="-1"
	 * role="dialog" aria-labelledby="modal-register-label"
	 * aria-hidden="true">'; dirCreate += '<div class="modal-dialog">';
	 * dirCreate += '<div class="modal-content">'; dirCreate += '<div
	 * class="modal-header">'; dirCreate += '<button type="button"
	 * class="close" data-dismiss="modal">'; dirCreate += '<span
	 * aria-hidden="true">&times;</span>'; dirCreate += '<span
	 * class="sr-only">Close</span>'; dirCreate += '</button>'; dirCreate += '<h3 class="modal-title" id="modal-register-label">새
	 * 폴더 만들기</h3>'; dirCreate += '</div>'; dirCreate += '<div
	 * class="modal-body">'; dirCreate += '<form role="form" action=""
	 * method="post" class="registration-form">'; dirCreate += '<div
	 * class="form-group">'; dirCreate += '<label class="sr-only"
	 * for="form-first-name">새폴더</label>'; dirCreate += '<input type="text"
	 * name="form-first-name" placeholder="폴더명을 입력하세요" class="form-first-name
	 * form-control" id="form-first-name">'; dirCreate += '</div>'; dirCreate += '<button
	 * id ="confirm" type="submit" class="btn">확인</button>'; dirCreate += '</form></div></div></div></div>';
	 */

	// 아이디를 변경하지 말아주떼연.
	dirCreate += '<div class="w3-modal-content w3-card-4 w3-animate-zoom" style="max-width:600px">';
	dirCreate += '<div class="w3-center"><br>';
	dirCreate += '<span onclick="document.getElementById(\'newFolder\').style.display=\'none\'" class="w3-button w3-xlarge w3-hover-red w3-display-topright" title="Close Modal">&times;';
	dirCreate += '</span></div>';
	dirCreate += '<div class="section">';
	dirCreate += '<label><b>새 폴더 이름</b></label>';
	dirCreate += '<input class="w3-input w3-border w3-margin-bottom" type="text" placeholder="생성할 폴더명을 입력하세요." name="insertFolderName" id="insertFolderName">';
	dirCreate += '<button id="confirm" class="w3-button w3-block w3-blue w3-section w3-padding">확인</button>';
	dirCreate += '</div>';
	dirCreate += '<div class="w3-container w3-border-top w3-padding-16 w3-light-grey">';
	dirCreate += '<button onclick="document.getElementById(\'newFolder\').style.display=\'none\'" type="button" class="w3-button w3-red">취소</button>';
	dirCreate += '</div></div>';

	$('#newFolder').html(dirCreate);
	
	document.getElementById('newFolder').style.display='block';
	
	$('#confirm').click(function() {

		var folderName = document.getElementById('insertFolderName').value;
		alert(nowPath)
		$.ajax({
			url : 'newDir',
			type : 'POST',
			data : {
				folderName : folderName,
				path : nowPath
			},
			success : function() {
				alert('생성완료');
				document.getElementById('newFolder').style.display='none';
				loadListUnchangNav(nowPath);
			},
			error : function(e) {
				alert(JSON, stringify(e));
			}
		});
	});
}

function getFileType(path){
	var imgExtarr = new Array('jpg', 'jpeg', 'png');
	var vdoExtarr = new Array('mp4', 'wemb', 'ogg');
	
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
	
	return rtn;
}




// 복원
function restore() {
	var ffid = [];

	$('.file_check').each(function(index, item) {
		if ($(item).is(":checked")) {
			ffid.push($(item).attr('ffid'));
		}
	});

	jQuery.ajaxSettings.traditional = true;

	$.ajax({
		url : 'restore',
		type : 'POST',
		data : {
			ffid : ffid
		},
		success : function() {
			alert('복원되었습니다.');
			loadList(nowPath);

		},
		error : function(e) {
			alert(JSON, stringify(e));
		}

	});

}
	// 휴지통에서 삭제
function completeDelete() {
		alert('hi~~~');
		var ffid = [];
		var path = [];

		$('.file_check').each(function(index, item) {
			if ($(item).is(":checked")) {
				ffid.push($(item).attr('ffid'));
				path.push($(item).attr('path'));
			}
		});

		alert(ffid);
		alert(path);
		jQuery.ajaxSettings.traditional = true;

		$.ajax({
			url : 'completeDeleteFileFolder',
			type : 'POST',
			data : {
				ffid : ffid,
				path : path
			},
			success : function() {
				alert('삭제되었습니다.');
				loadList(nowPath);

			},
			error : function(e) {
				alert(JSON, stringify(e));
			}

	});
}

