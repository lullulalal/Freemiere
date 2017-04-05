var myRootDir = '';
var menu = 'MyStorage';
var nowPath = '';

$(document).ready(function() {

	alert(loginMem);
	myRootDir += 'C:\\freemiere\\';
	myRootDir += loginMem;
	myRootDir += '\\';

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
		loadList(); 
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
$('#edit').click(function(){
		menu='Edit';
		setNavRoot(menu);
		loadList(); 
	});
	$('#search').click(function(){
		menu='Search';
		setNavRoot(menu);
		loadList(); 
	});
// 하단 삭제버튼
	$('#btn-del').on('click', go_to_Trash);
	// 하단 업로드버튼
	$('#btn-upload').on('click', fileFolderUpload);

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
	
	$.each(list,function(index, item) {
		
		if(item.strUpdate != null){
			data += item.strUpdate;
			
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


data += '<tr align="center">'
data += '	<td>';
if(item.isFolder == false){//폴더 안에 들어있는 파일
}else{
if(item.isShared.toLowerCase()=='t'){
if(item.bookState.toLowerCase()=='t')//북마크 찍은 폴더	
data += '<img class="folder sfolder" path="'+ item.path +'" src="./resources/img/storage/sbfolder.png">';	
else//파빨 공유 폴더	
data += '<img class="folder sfolder" path="'+ item.path +'" src="./resources/img/storage/folderballoon.png">';		
}	
else {	
if(item.bookState.toLowerCase()=='t')//북마크 찍은 폴더	
	
data += '<img class="folder mfolder" path="'+ item.path +'" src="./resources/img/storage/mbfolder.png">';
else//기본폴더
	
data += '<img class="folder mfolder" path="'+ item.path +'" src="./resources/img/storage/folderballoon_y.png">';
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
			if(item.strUpdate == '2017/03/89'){

			}else{
				data += '	<br>';//줄바끔 추가
			}
		}
		else {
			
		
		data += '<table class="fileBox">';
		data += '<tr align="center">';
		data += '	<td>';
		
		if(item.isFolder == false){//폴더 안에 들어있는 파일
			data += '<img class="file" src="./resources/img/storage/textFile.png">';	
		}else{
			if(item.isShared.toLowerCase()=='t'){
				data += '<h5>공유폴더</h5>';
				if(item.bookState.toLowerCase()=='t')//북마크 찍은 폴더
					data += '<img class="folder sfolder" path="'+ item.path +'" src="./resources/img/storage/sbfolder.png">';
				else//파빨 공유 폴더
					data += '<img class="folder sfolder" path="'+ item.path +'" src="./resources/img/storage/folderballoon.png">';	
			}
			
			else {
				if(item.bookState.toLowerCase()=='t')//북마크 찍은 폴더
					data += '<img class="folder mfolder" path="'+ item.path +'" src="./resources/img/storage/mbfolder.png">';
				else//기본폴더
					data += '<img class="folder mfolder" path="'+ item.path +'" src="./resources/img/storage/folderballoon_y.png">';
				
							}
						}

						data += '	</td>';
						data += '</tr>';
						data += '<tr align="center">';
						data += '	<td>';
						data += item.fileName;
						data += '	</td>';
						data += '</tr>';
		if(item.isShared.toLowerCase()=='t'){//공유포올더 일때 줄바꿈 
			data += '	<br>';//줄바끔 추가
		}
						data += '</table>';
		}
		

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

//객체화 하자

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
else if (navRoot == 'Recent')
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="' + navRoot + '">' + '최근 작업 파일</a>';
	else if (navRoot == 'Bookmark')
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + '즐겨 찾기</a>';
	else if (navRoot == 'Trash')
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
else if (navRoot == 'Edit')
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="' + navRoot + '">' + '영상편집</a>';
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


function setNav() {
	$('#navigator').html(nav);
}
