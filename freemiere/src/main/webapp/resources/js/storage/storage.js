var myRootDir='';
var menu='MyStorage';
var navRoot='MyStorage';

//마우스 우클릭버튼
jQuery.fn.contextPopup = function(menuData) {
	// Define default settings
	var settings = {
		contextMenuClass: 'contextMenuPlugin',
      linkClickerClass: 'contextMenuLink',
		gutterLineClass: 'gutterLine',
		headerClass: 'header',
		seperatorClass: 'divider',
		title: '',
		items: []
	};
	
	// merge them
	$.extend(settings, menuData);

// Build popup menu HTML
function createMenu(e) {
  var menu = $('<ul class="' + settings.contextMenuClass + '"><div class="' + settings.gutterLineClass + '"></div></ul>')
    .appendTo(document.body);
  if (settings.title) {
    $('<li class="' + settings.headerClass + '"></li>').text(settings.title).appendTo(menu);
  }
  settings.items.forEach(function(item) {
    if (item) {
      var rowCode = '<li><a href="#" class="'+settings.linkClickerClass+'"><span class="itemTitle"></span></a></li>';
      // if(item.icon)
      //   rowCode += '<img>';
      // rowCode +=  '<span></span></a></li>';
      var row = $(rowCode).appendTo(menu);
      if(item.icon){
        var icon = $('<img>');
        icon.attr('src', item.icon);
        icon.insertBefore(row.find('.itemTitle'));
      }
      row.find('.itemTitle').text(item.label);
        
      if (item.isEnabled != undefined && !item.isEnabled()) {
          row.addClass('disabled');
      } else if (item.action) {
          row.find('.'+settings.linkClickerClass).click(function () { item.action(e); });
      }

    } else {
      $('<li class="' + settings.seperatorClass + '"></li>').appendTo(menu);
    }
  });
  menu.find('.' + settings.headerClass ).text(settings.title);
  return menu;
}

// On contextmenu event (right click)
this.on('contextmenu', function(e) {
  var menu = createMenu(e)
    .show();
  
  var left = e.pageX + 5, /* nudge to the right, so the pointer is covering the title */
      top = e.pageY;
  if (top + menu.height() >= $(window).height()) {
      top -= menu.height();
  }
  if (left + menu.width() >= $(window).width()) {
      left -= menu.width();
  }

  // Create and show menu
  menu.css({zIndex:1000001, left:left, top:top})
    .on('contextmenu', function() { return false; });

  // Cover rest of page with invisible div that when clicked will cancel the popup.
  var bg = $('<div></div>')
    .css({left:0, top:0, width:'100%', height:'100%', position:'absolute', zIndex:1000000})
    .appendTo(document.body)
    .on('contextmenu click', function() {
      // If click or right click anywhere else on page: remove clean up.
      bg.remove();
      menu.remove();
      return false;
    });

  // When clicking on a link in menu: clean up (in addition to handlers on link already)
  menu.find('a').click(function() {
    bg.remove();
    menu.remove();
  });

  // Cancel event, so real browser popup doesn't appear.
  return false;
});

return this;
};






$(document).ready(function(){
	myRootDir += 'C:\\freemiere\\';
	myRootDir += 'lullulalal@naver.com'; //사용자 email 로 고쳐야함
	myRootDir += '\\';
	
	loadList(myRootDir); 
	
	$('#myStorage').click(function(){
		menu='MyStorage';
		navRoot=menu;
		loadList(); 
	});
	$('#shared').click(function(){
		menu='Shared';
		navRoot=menu;
		loadList(); 
	});
	$('#recent').click(function(){
		menu='Recent';
		navRoot=menu;
	});
	$('#bookMark').click(function(){
		menu='Bookmark';
		navRoot=menu;
		loadList();
	});
	$('#trash').click(function(){
		menu='Trash';
		navRoot=menu;
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

//편집버튼 눌렀을때 이동되는 경로
function edit(){
	location.href="createMovie";
}

function outputList(list){
	//alert(JSON.stringify(list));
	var data = '';
	
	$.each(list, function(index, item){
		data += '<table class="fileBox">';
		data += '<tr align="center">';
		data += '	<td>';
		
		//이미지파일일 경우 띄우고 새창에서 이미지 보여지게 함.
		if(item.isFolder == false){
			$(function() {
				  
			 	// var image = document.getElementById("#file"); 
			 	  
			     $('#file').contextPopup({
			       title: 'Image/Avi File',
			       items: [
			         {label:'편집',    action:function() { edit(); } },
			         {label:'복사/이동',                 action:function() { location.href="http://www.naver.com" } },
			         {label:'게시',                   action:function() { alert('clicked 3') } },
			         null, // divider
			         
			    	 {label:'중요' ,                 action:function() {      
			    		 $.ajax({
			    				url:'bookmarkUpdate',
			    				type: 'POST',
			    				data: {ffid: item.ffid},
			    				success: function() {
			    					alert('변경되었습니다.');
			    					
			    				},
			    				error: function(e) {
			    					alert(JSON.stringify(e));
			    					//alert('에-러');
			    				}
			    			});	
			    	 } },
			       
			         
			       // {label:'중요',                 action:function() { 	  alert('clicked 5')       } },
			         {label:'속성',                         action:function() { alert('clicked 5') } },
			         {label:'삭제',                         action:function() { alert('clicked 6') } }
			         
			       ]
			     });
			  });
			//data += '<img class="file" src="./resources/img/storage/file.png">';
			data += '<img id="file" src="./resources/img/storage/file.png">';
			//data += '<img class="file" src="./resources/img/storage/file.png" onclick="window.open(this.src)">';
		}
		
		else{
			$(function() {
				
				// var image = document.getElementById("#file"); 
				
				$('.sfolder').contextPopup({
					title: 'My Popup Menu',
					items: [
						{label:'공유설정',    /*  icon:'icons/shopping-basket.png',  */            action:function() { alert('clicked 1') } },
						{label:'복사/이동',                 action:function() { location.href="http://www.naver.com" } },
						{label:'중요',                   action:function() { alert('clicked 3') } },
						null, // divider
						{label:'삭제',                 action:function() { alert('clicked 4') } },
						{label:'속성',                         action:function() { alert('clicked 5') } }
						
						]
				});
			});					
			if(item.isShared.toLowerCase()=='t'){
				
				if(item.bookState.toLowerCase()=='t')
				{
					data += '<img class="folder sfolder" path="'+ item.path +'" src="./resources/img/storage/sbfolder.png">';
					}
				else{
					
					
					data += '<img class="folder sfolder" path="'+ item.path +'" src="./resources/img/storage/sfolder.png">';	
					
				}
			}
			else {
				$(function() {
					
					// var image = document.getElementById("#file"); 
					
					$('.mfolder').contextPopup({
						title: 'My Popup Menu',
						items: [
							{label:'공유설정',    action:function() { alert('clicked 1') } },
							{label:'복사/이동',                 action:function() { location.href="http://www.naver.com" } },
							{label:'중요',                   action:function() { alert('clicked 3') } },
							null, // divider
							{label:'삭제',                 action:function() { alert('clicked 4') } },
							{label:'속성',                         action:function() { alert('clicked 5') } }
							
							]
					});
				});					
				if(item.bookState.toLowerCase()=='t'){
					data += '<img class="folder mfolder" path="'+ item.path +'" src="./resources/img/storage/mbfolder.png">';
				}
				else{
								
					data += '<img class="folder mfolder" path="'+ item.path +'" src="./resources/img/storage/mfolder.png">';
				}
			}
		}
		
		data += '	</td>';
		data += '</tr>';
		data += '<tr align="center">';
		data += '	<td>';
		data += item.fileName;
		data += '	</td>';
		data += '	<td>';
		data += item.ffid;
		data += '	</td>';
		data += '</tr>';
		data += '</table>';
	});
	
	$('#outputList').html(data);

	if(navRoot != 'Trash') {
		$('.folder').dblclick(function(){
			var path = $(this).attr('path');
			menu = 'List';
		    loadList(path);
		});
	}
}

function outputNavi(fullPath){

	if(fullPath != null){
		var tmp = fullPath.split('\\');
		var rootDir = tmp[0]+'\\'+tmp[1]+'\\'+tmp[2]+'\\';
		
		path = fullPath.substring(rootDir.length,fullPath.length);
		var dirArray=path.split('\\');
	}
	function getPatialPath(dirArray, index){
		var rtn = '';
		for(j = 0; j <= index; j++){
			rtn += dirArray[j];
			rtn += '\\';
		}
		return rtn;
	}
	
	var data = '';
	//alert(navRoot);
	if(navRoot == 'MyStorage')
		data = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="' + navRoot + '">' + '내 저장소</a>';
	else if(navRoot == 'Shared')
		data = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="' + navRoot + '">' + '공유 저장소</a>';
	else if (navRoot == 'Bookmark')
		data = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="' + navRoot + '">' + '즐겨 찾기</a>';
	else if (navRoot == 'Trash')
		data = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="' + navRoot + '">' + '휴지통</a>';
	
	if(fullPath != null){
		for (i = 0; i < dirArray.length-1; i++) { 
			data += '<a class="navbar-brand">/</a>';
			data += '<a class="navbar-brand naviBar"';
			data += ' path="' + ( rootDir + getPatialPath(dirArray, i) ) + '">';
			data += dirArray[i] + '</a>';
		}
	}
	
	$('#navigator').html(data);
	$(".naviBarRoot").click(function(){
		var path = $(this).attr('nav');
		menu = path;
	    loadList();
	});
	
	$(".naviBar").click(function(){
		var path = $(this).attr('path');
		menu = 'List';
		alert(path);
	    loadList(path);
	});
}


/*금요일시험 포맷된컴퓨터에서 세팅 설치파일은 오라클 jdk sts
프로퍼티같은거는 다안에들어가있음
테이블/인서트문 다있음.
로그인기능도있음
DB에 저장되는 것
DB에 저장된것 읽기
jsp에서는 jquery, jstl사용

저장/셀렉트하는부분 하나랑
서브쿼리랑 조인으로 불러오는 페이지 하나가있음.
select * 쓸일은 절대없음. group by 기능도있음.
인터셉터부분 나옴.
마이바티스/pdf파일은 줄거임*/

	