var myRootDir='';
var menu='MyStorage';
var nowPath='';

$(document).ready(function(){

	alert(loginMem);
	myRootDir += 'C:\\freemiere\\';
	myRootDir += loginMem; //사용자 email 로 고쳐야함
	myRootDir += '\\';
	
	loadList(myRootDir); 
	
	$('#myStorage').click(function(){
		menu='MyStorage';
		setNavRoot(menu);
		loadList(); 
	});   
	$('#shared').click(function(){
		menu='Shared';
		setNavRoot(menu);
		loadList(); 
	});
	$('#recent').click(function(){
		menu='Recent';
		setNavRoot(menu);
	});
	$('#bookMark').click(function(){
		menu='Bookmark';
		setNavRoot(menu);
		loadList();
	});
	$('#trash').click(function(){
		menu='Trash';
		setNavRoot(menu);
		loadList();
	});
	
});


function loadList(path){
	if (menu == 'MyStorage')
		path = myRootDir;
	
	var url='load' + menu;
	//alert(url);
	$.ajax({
		url: url,
		type: 'GET',
		data: {
			'path':path
		},
		dataType : 'json',
		success: outputList,
		error: function(e){
			alert(JSON.stringify(e));
		}
	});
	
	outputNavi(path);
}

function outputList(list){
	//alert(JSON.stringify(list));
	var data = '';

	$.each(list, function(index, item){
		data += '<table class="fileBox">';
		data += '<tr align="center">';
		data += '	<td>';
		
		if(item.isFolder == false){
			data += '<img class="file" src="./resources/img/storage/file.png">';	
		}else{
			if(item.isShared.toLowerCase()=='t'){
				if(item.bookState.toLowerCase()=='t')
					data += '<img class="folder sfolder" path="'+ item.path +'" src="./resources/img/storage/sbfolder.png">';
				else
					data += '<img class="folder sfolder" path="'+ item.path +'" src="./resources/img/storage/sfolder.png">';	
			}
			else {
				if(item.bookState.toLowerCase()=='t')
					data += '<img class="folder mfolder" path="'+ item.path +'" src="./resources/img/storage/mbfolder.png">';
				else
					data += '<img class="folder mfolder" path="'+ item.path +'" src="./resources/img/storage/mfolder.png">';
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

	if(navRoot != 'Trash') {
		$('.folder').dblclick(function(){
			var path = $(this).attr('path');
			nowPath = path;
			menu = 'List';
		    loadList(path);
		});
	}
}


//객체화 하자

var navRoot='MyStorage';
var nav='<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="' + navRoot + '">' + '내 저장소</a>';

function setNavRoot(nr){
	navRoot = nr;
	if(navRoot == 'MyStorage') {
		alert('haha');
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="' + navRoot + '">' + '내 저장소</a>';
	}
	else if(navRoot == 'Shared')
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="' + navRoot + '">' + '공유 저장소</a>';
	else if (navRoot == 'Bookmark')
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="' + navRoot + '">' + '즐겨 찾기</a>';
	else if (navRoot == 'Trash')
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="' + navRoot + '">' + '휴지통</a>';
	setNav();
}

function outputNavi(fullPath){
	//alert(nav);
	function getPatialPath(dirArray, index){
		var rtn = '';
		for(j = 0; j <= index; j++){
			rtn += dirArray[j];
			rtn += '\\';
		}
		return rtn;
	}
	
	if(fullPath != null){
		var tmp = fullPath.split('\\');
		var rootDir = tmp[0]+'\\'+tmp[1]+'\\'+tmp[2]+'\\';
		
		if(rootDir.length != fullPath.length){
			path = fullPath.substring(rootDir.length,fullPath.length);
			var dirArray=path.split('\\');
	
			var iEnd = dirArray.length-2;
			nav += '<a class="navbar-brand">/</a>';
			nav += '<a class="navbar-brand naviBar"';
			nav += ' path="' + ( rootDir + getPatialPath(dirArray, iEnd) ) + '">';
			nav += dirArray[iEnd] + '</a>';
		}
	}
	
	setNav();
	
	regEvent();
}

function regEvent(){
	$(".naviBarRoot").click(function(){
		var path = $(this).attr('nav');
		menu = path;
		setNavRoot(menu)
	    loadList();
	});
	
	$(".naviBar").click(function(){
		var path = $(this).attr('path');

		if(nowPath != path) {
			nowPath = path;
			menu = 'List';
		    loadList(path);
		}
	});
}

function setNav(){
	$('#navigator').html(nav);
}

	