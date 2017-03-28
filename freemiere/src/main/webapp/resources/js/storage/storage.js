var myRootDir = '';
var menu = 'MyStorage';
var navRoot = 'MyStorage';

$(document).ready(function() {
	myRootDir += 'C:\\freemiere\\';
	myRootDir += 'lullulalal@naver.com'; // 사용자 email 로 고쳐야함
	myRootDir += '\\';

	loadList(myRootDir);

	
	$('#myStorage').click(function() {
		menu = 'MyStorage';
		navRoot = menu;
		loadList();
	});
	$('#shared').click(function() {
		menu = 'Shared';
		navRoot = menu;
		loadList();
	});
	$('#recent').click(function() {
		menu = 'Recent';
		navRoot = menu;
	});
	$('#bookMark').click(function() {
		menu = 'Bookmark';
		navRoot = menu;
		loadList();
	});
	$('#trash').click(function() {
		menu = 'Trash';
		navRoot = menu;
		loadList();
	});
	$('#btn-del').on('click',go_to_Trash);

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
						data += '<table class="fileBox">';
				
						data += '<tr>';
						data += '<input type="checkbox" class="file_check" ffid="'
									+ item.ffid
									+ '" '
									+'isshared="'
									+item.isShared
									+'" '
									+ 'id="file_check'+ index + '">';
						data += '</tr>';
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
						data += '	<td>';
						data += item.fileName;
						data += '	</td>';
						data += '</tr>';
						data += '</table>';
					});

	$('#outputList').html(data);
	
	// 하단 전체선택 버튼
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
			menu = 'List';
			loadList(path);
		});
	}
}

function outputNavi(fullPath) {

	if (fullPath != null) {
		var tmp = fullPath.split('\\');
		var rootDir = tmp[0] + '\\' + tmp[1] + '\\' + tmp[2] + '\\';

		path = fullPath.substring(rootDir.length, fullPath.length);
		var dirArray = path.split('\\');
	}
	function getPatialPath(dirArray, index) {
		var rtn = '';
		for (j = 0; j <= index; j++) {
			rtn += dirArray[j];
			rtn += '\\';
		}
		return rtn;
	}

	var data = '';
	// alert(navRoot);
	if (navRoot == 'MyStorage')
		data = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + '내 저장소</a>';
	else if (navRoot == 'Shared')
		data = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + '공유 저장소</a>';
	else if (navRoot == 'Bookmark')
		data = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + '즐겨 찾기</a>';
	else if (navRoot == 'Trash')
		data = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + '휴지통</a>';

	if (fullPath != null) {
		for (i = 0; i < dirArray.length - 1; i++) {
			data += '<a class="navbar-brand">/</a>';
			data += '<a class="navbar-brand naviBar"';
			data += ' path="' + (rootDir + getPatialPath(dirArray, i)) + '">';
			data += dirArray[i] + '</a>';
		}
	}

	$('#navigator').html(data);
	$(".naviBarRoot").click(function() {
		var path = $(this).attr('nav');
		menu = path;
		loadList();
	});

	$(".naviBar").click(function() {
		var path = $(this).attr('path');
		menu = 'List';
		alert(path);
		loadList(path);
	});
}
//삭제 버튼 클릭시 휴지통으로 보내기
function go_to_Trash(){
	var ffid=[];
	var isshared=[];
	$('.file_check').each(function(index, item){
		if($(item).is(":checked")){
			ffid.push($(item).attr('ffid'));
			isshared.push($(item).attr('isshared'));
		}
	});
	alert(ffid);
	alert(isshared);
	
jQuery.ajaxSettings.traditional = true;

	$.ajax({
		url: 'deleteFileFolder',
		type: 'POST',
		data:{ffid:ffid, isshared:isshared},
		success : function(){
			alert('휴지통으로 이동되었습니다.');
		},
		error: function(e){
			alert(JSON,stringify(e));
		}
	
	});
	loadList(path);
}
