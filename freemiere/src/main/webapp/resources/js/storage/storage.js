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
	// 하단 삭제버튼
	$('#btn-del').on('click', go_to_Trash);

	// 하단 업로드버튼
	$('#btn-upload').on('click', fileFolderUpload);

	// 하단 새폴더 버튼
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

	$
			.each(
					list,
					function(index, item) {
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
							data += '<img class="file" src="./resources/img/storage/folder.png">';
						} else {
							if (item.isShared.toLowerCase() == 't') {
								if (item.bookState.toLowerCase() == 't')
									data += '<img class="folder sfolder" path="'
											+ item.path
											+ '" src="./resources/img/storage/folder.png">';
								else
									data += '<img class="folder sfolder" path="'
											+ item.path
											+ '" src="./resources/img/storage/folder.png">';
							} else {
								if (item.bookState.toLowerCase() == 't')
									data += '<img class="folder mfolder" path="'
											+ item.path
											+ '" src="./resources/img/storage/folder.png">';
								else
									data += '<img class="folder mfolder" path="'
											+ item.path
											+ '" src="./resources/img/storage/folder.png">';
							}
						}

						data += '	</td>';
						data += '</tr>';
						data += '<tr align="center">';
						data += '	<td>';
						data += item.fileName;
						data += '	</td>';
						data += '</tr>';
						data += '</table>';
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

var navRoot = 'MyStorage';
var nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
		+ navRoot + '">' + '내 저장소</a>';

function setNavRoot(nr) {
	navRoot = nr;
	if (navRoot == 'MyStorage') {
		alert('haha');
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + '내 저장소</a>';
	} else if (navRoot == 'Shared')
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + '공유저장소</a>';
	else if (navRoot == 'Bookmark')
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + '즐겨 찾기</a>';
	else if (navRoot == 'Trash')
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + '휴지통</a>';
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
			loadList(nowPath);
			alert('hi2');
		},
		error : function(e) {
			alert(JSON, stringify(e));
		}

	});
}

function newDir() {
	
var dirCreate = '';
	/*dirCreate += '<div class="modal fade" id="modal-register" tabindex="-1" role="dialog" aria-labelledby="modal-register-label" aria-hidden="true">';
	dirCreate += '<div class="modal-dialog">';
	dirCreate += '<div class="modal-content">';
	dirCreate += '<div class="modal-header">';
	dirCreate += '<button type="button" class="close" data-dismiss="modal">';
	dirCreate += '<span aria-hidden="true">&times;</span>';
	dirCreate += '<span class="sr-only">Close</span>';
	dirCreate += '</button>';
	dirCreate += '<h3 class="modal-title" id="modal-register-label">새 폴더 만들기</h3>';
	dirCreate += '</div>';
	dirCreate += '<div class="modal-body">';
	dirCreate += '<form role="form" action="" method="post" class="registration-form">';
	dirCreate += '<div class="form-group">';
	dirCreate += '<label class="sr-only" for="form-first-name">새폴더</label>';
	dirCreate += '<input type="text" name="form-first-name" placeholder="폴더명을 입력하세요" class="form-first-name form-control" id="form-first-name">';
	dirCreate += '</div>';
	dirCreate += '<button id ="confirm" type="submit" class="btn">확인</button>';
	dirCreate += '</form></div></div></div></div>';*/


	//아이디를 변경하지 말아주떼연.
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
		alert(folderName)
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
				loadList(nowPath);
			},
			error : function(e) {
				alert(JSON, stringify(e));
			}
		});
	});
	
	
}
