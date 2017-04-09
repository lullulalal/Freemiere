var myRootDir='';
var menu='MyStorage';
var nowPath='';

// 마우스 우클릭버튼
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
      // rowCode += '<img>';
      // rowCode += '<span></span></a></li>';
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
  
  var left = e.pageX + 5, /*
							 * nudge to the right, so the pointer is covering
							 * the title
							 */
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

  // Cover rest of page with invisible div that when clicked will cancel the
	// popup.
  var bg = $('<div></div>')
    .css({left:0, top:0, width:'100%', height:'100%', position:'absolute', zIndex:1000000})
    .appendTo(document.body)
    .on('contextmenu click', function() {
      // If click or right click anywhere else on page: remove clean up.
      bg.remove();
      menu.remove();
      return false;
    });

  // When clicking on a link in menu: clean up (in addition to handlers on
	// link already)
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

	alert(loginMem);
	myRootDir += 'C:\\freemiere\\';
	myRootDir += loginMem; // 사용자 email 로 고쳐야함
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
	// alert(path);
	var url='load' + menu;
	// alert(url);
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

// 편집버튼 눌렀을때 이동되는 경로
function edit(){
	location.href="createMovie";
}

function init(){
	loadList(nowPath);
}

// 공유 설정
function shareSet(obj){
	
	var set = '';
	set +='<div id="set01" class="modal fade">';
	set +='<div class="modal-dialog">';
	set +='<div class="modal-content">';
 	
	set +='<input type="text" placeholder='+obj.fileName+'>';
	set +='<h2 class="modal-title">'+obj.fileName+'<button type="button" class="close" data-dismiss="modal">x</button></h2>';
 	set +='<div class="modal-body">';
 	set +='<p>'+obj.info+'</p>';
 		
 	set +='<p>파일 크기 '+obj.volume+'</p>';
 	set +='<p>업로드날짜 '+obj.uploadDate+'</p>';
 	set +='<p>수정 날짜  '+obj.lastModify+'</p>';
 	
 	set +='<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
 	set +='</div>';
 	set +='</div>';
 	set +='</div>';
 	set +=' </div>';
	
$('#sharedSet').html(set);

$('#set01').modal();	
	
}













var sokObject;
function soksung(obj){
	sokObject = obj;
	
	var test = '';
		test +='<div id="id01" class="modal fade">';
	 	test +='<div class="modal-dialog">';
	 	test +='<div class="modal-content">';
	 	
	 	test +='<h2 class="modal-title">'+obj.fileName+'<button type="button" class="close" data-dismiss="modal">x</button></h2>';
	 	
	 	test +='<a data-toggle="modal" href="#test2" class="btn btn-primary">수정</a>';
	 	
	 	// test +='<button onclick="soksungUpdate(sokObject)" type="button"
		// class="w3-button w3-red">수정</button>'
	 	// test +='<input type="button" value="수정하기" id="sokUpdate"
		// onclick="soksungUpdate(sokObject); ">';
	 	test +='<div class="modal-body">';
	 	test +='<p>'+obj.info+'</p>';
	 		
	 	test +='<p>파일 크기 '+obj.volume+'</p>';
	 	test +='<p>업로드날짜 '+obj.uploadDate+'</p>';
	 	test +='<p>수정 날짜  '+obj.lastModify+'</p>';
	 	
	 	test +='<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
	 	test +='</div>';
	 	test +='</div>';
	 	test +='</div>';
	 	test +=' </div>';
		
	$('#test').html(test);		
	
	$('#id01').modal();	
}

function modalClose(){
	
	$('#test').modal('hide');
}




// 속성에서 수정눌렀을때
function soksungUpdate(obj){

	alert('오브젝트값 :' +JSON.stringify(obj));
	
	var test2 = '';
		test2 +='<div id="id01" class="modal fade">';
	 	test2 +='<div class="modal-dialog">';
	 	test2 +='<div class="modal-content">';
	 	
	 	test2 +='<input type="text" placeholder='+obj.fileName+'>';
	 	test2 +='<h2 class="modal-title">'+obj.fileName+'<button type="button" class="close" data-dismiss="modal">x</button></h2>';
	 	test2 +='<div class="modal-body">';
	 	test2 +='<p>'+obj.info+'</p>';
	 		
	 	test2 +='<p>파일 크기 '+obj.volume+'</p>';
	 	test2 +='<p>업로드날짜 '+obj.uploadDate+'</p>';
	 	test2 +='<p>수정 날짜  '+obj.lastModify+'</p>';
	 	
	 	test2 +='<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
	 	test2 +='</div>';
	 	test2 +='</div>';
	 	test2 +='</div>';
	 	test2 +=' </div>';
		
	$('#test2').html(test2);
	
	$('#id01').modal();	
}





function outputList(list){
	// alert(JSON.stringify(list));
	var data = '';

	$.each(list, function(index, item){
		data += '<table class="fileBox">';
		data += '<tr align="center">';
		data += '	<td>';
		
		
		//휴지통일경우
		if(item.isDeleted.toLowerCase() == 't'){
			if(item.isFolder == true){
			
				$(function() {
					  
				 	// var image = document.getElementById("#file");
				 	  
				     $('#sfolders'+item.ffid+'').contextPopup({
				       title: 'Image/Avi File',
				       items: [
				         {label:'복구',                 action:function() { 
				        	 $.ajax({
				    				url:'conRemove',
				    				type: 'POST',
				    				data: {ffid: item.ffid},
				    				success: function(obj) {
				    					alert('복구되었습니다.');
				    					init();
				    				},
				    				error: function(e) {
				    					alert(JSON.stringify(e));
				    					// alert('에-러');
				    				}
				    			}); 
				        	 
				         } },
				         
				         {label:'속성',                         action:function() { 
				        	 $.ajax({
				    				url:'info',
				    				type: 'POST',
				    				dataType: 'json',
				    				data: {ffid: item.ffid, path: item.path},
				    				success: function(obj) {
				    					
				    					soksung(obj);
				    				},
				    				error: function(e) {
				    					alert(JSON.stringify(e));
				    					// alert('에-러');
				    				}
				    			});
				        	  } },
				         {label:'삭제',                         action:function() {  
				        	 $.ajax({
			    				url:'conAllRemove',
			    				type: 'POST',
			    				data: {ffid: item.ffid},
			    				success: function(obj) {
			    					alert('삭제되었습니다.');
			    					init();
			    				},
			    				error: function(e) {
			    					alert(JSON.stringify(e));
			    					// alert('에-러');
			    				}
			    			}); 
				        	 } }
				         
				       ]
				     });
				  });
				
				data += '<img id="sfolders'+item.ffid+'" class="folder sfolder" path="'+ item.path +'" src="./resources/img/storage/sbfolder.png">';
			}else{
				$(function() {
					  
				 	// var image = document.getElementById("#file");
				 	  
				     $('#file'+item.ffid+'').contextPopup({
				       title: 'Image/Avi File',
				       items: [
				         {label:'복구',                 action:function() { 
				        	 $.ajax({
				    				url:'conRemove',
				    				type: 'POST',
				    				data: {ffid: item.ffid},
				    				success: function(obj) {
				    					alert('복구되었습니다.');
				    					init();
				    				},
				    				error: function(e) {
				    					alert(JSON.stringify(e));
				    					// alert('에-러');
				    				}
				    			}); 
				        	 
				         } },
				    	 
				       
				         
				         {label:'속성',                         action:function() { 
				        	 $.ajax({
				    				url:'info',
				    				type: 'POST',
				    				dataType: 'json',
				    				data: {ffid: item.ffid, path: item.path},
				    				success: function(obj) {
				    					
				    					soksung(obj);
				    				},
				    				error: function(e) {
				    					alert(JSON.stringify(e));
				    					// alert('에-러');
				    				}
				    			});
				        	  } },
				         {label:'삭제',                         action:function() {  
				        	 $.ajax({
			    				url:'conAllRemove',
			    				type: 'POST',
			    				data: {ffid: item.ffid},
			    				success: function(obj) {
			    					alert('휴지통으로 이동하였습니다.');
			    					init();
			    				},
			    				error: function(e) {
			    					alert(JSON.stringify(e));
			    					// alert('에-러');
			    				}
			    			}); 
				        	 } }
				         
				       ]
				     });
				  });
				data += '<img id="file'+item.ffid+'" src="'+item.path+'" onclick="window.open(this.src)">';
			}
				
				
			}
				
			
		else
			{
			
			
		// 이미지파일일 경우 띄우고 새창에서 이미지 보여지게 함.
		if(item.isFolder == false){
			
			// 중요의 상태가 T일 경우
			if(item.bookState.toLowerCase()=='t'){
				$(function() {
					  
				 	// var image = document.getElementById("#file");
				 	  
				     $('#file'+item.ffid+'').contextPopup({
				       title: 'Image/Avi File',
				       items: [
				         {label:'복사/이동',                 action:function() { location.href="http://www.naver.com" } },
				         {label:'게시',                   action:function() { alert('clicked 3') } },
				         null, // divider
				         
				    	 {label:'중요        ★' ,                 action:function() {      
				    		 $.ajax({
				    				url:'bookmarkUpdate',
				    				type: 'POST',
				    				data: {ffid: item.ffid, bookstate: item.bookState},
				    				success: function() {
				    					alert('중요하지 않군요... ');
				    					init();
				    				},
				    				error: function(e) {
				    					alert(JSON.stringify(e));
				    					// alert('에-러');
				    				}
				    			});	
				    	 } },
				       
				         
				         {label:'속성',                         action:function() { 
				        	 $.ajax({
				    				url:'info',
				    				type: 'POST',
				    				dataType: 'json',
				    				data: {ffid: item.ffid, path: item.path},
				    				success: function(obj) {
				    					
				    					soksung(obj);
				    				},
				    				error: function(e) {
				    					alert(JSON.stringify(e));
				    					// alert('에-러');
				    				}
				    			});
				        	  } },
				         {label:'삭제',                         action:function() {  
				        	 $.ajax({
			    				url:'conDelete',
			    				type: 'POST',
			    				data: {ffid: item.ffid},
			    				success: function(obj) {
			    					alert('휴지통으로 이동하였습니다.');
			    					init();
			    				},
			    				error: function(e) {
			    					alert(JSON.stringify(e));
			    					// alert('에-러');
			    				}
			    			}); 
				        	 } }
				         
				       ]
				     });
				  });
				
			// bookState가 F일 경우
				
			}else{ 
				$(function() {
					  
				 	// var image = document.getElementById("#file");
				 	  
				     $('#file'+item.ffid+'').contextPopup({
				       title: 'Image/Avi File',
				       items: [
				         {label:'복사/이동',                 action:function() { location.href="http://www.naver.com" } },
				         {label:'게시',                   action:function() { alert('clicked 3') } },
				         null, // divider
				         
				    	 {label:'중요' ,                 action:function() {      
				    		 $.ajax({
				    				url:'bookmarkUpdate',
				    				type: 'POST',
				    				data: {ffid: item.ffid, bookstate: item.bookState},
				    				success: function() {
				    					alert('중요로 변경되었습니다.');
				    					init();
				    				},
				    				error: function(e) {
				    					alert(JSON.stringify(e));
				    					// alert('에-러');
				    				}
				    			});	
				    	 } },
				       
				         
				       // {label:'중요', action:function() { alert('clicked 5') }
						// },
				         {label:'속성',                         action:function() { 
				        	 $.ajax({
				    				url:'info',
				    				type: 'POST',
				    				dataType: 'json',
				    				data: {ffid: item.ffid, path: item.path},
				    				success: function(obj) {
				    					
				    					soksung(obj);
				    				},
				    				error: function(e) {
				    					alert(JSON.stringify(e));
				    					// alert('에-러');
				    				}
				    			});
				         } },
				         {label:'삭제',                         action:function() { 
				        	 $.ajax({
				    				url:'conDelete',
				    				type: 'POST',
				    				data: {ffid: item.ffid},
				    				success: function(obj) {
				    					alert('휴지통으로 이동하였습니다.');
				    					init();
				    				},
				    				error: function(e) {
				    					alert(JSON.stringify(e));
				    					// alert('에-러');
				    				}
				    			}); 
				         } }
				         
				       ]
				     });
				  });
			}
			
			
			// data += '<img class="file"
			// src="./resources/img/storage/file.png">';
			data += '<img id="file'+item.ffid+'" src="'+item.path+'" onclick="window.open(this.src)">';
			// data += '<img class="file" src="./resources/img/storage/file.png"
			// onclick="window.open(this.src)">';
		}
		
		// 폴더일 경우
		else{
	
			if(item.isShared.toLowerCase()=='t'){
				
				if(item.bookState.toLowerCase()=='t')
				{
					// 폴더이면서 공유T, 중요 T
					$(function() {
						
						// var image = document.getElementById("#file");
						
						$('#sfolders'+item.ffid+'').contextPopup({
							title: 'My Popup Menu',
							items: [
								{label:'공유설정',             action:function() { 
									 $.ajax({
						    				url:'folderShare',
						    				type: 'POST',
						    				dataType: 'json',
						    				data: {ffid: item.ffid},
						    				success: function(obj) {
						    					shareSet(obj);
						    				},
						    				error: function(e) {
						    					alert(JSON.stringify(e));
						    					// alert('에-러');
						    				}
						    			}); 
									
									
									
									 } },
								{label:'복사/이동',                 action:function() { location.href="http://www.naver.com" } },
								{label:'중요        ★',                   action:function() { 
									$.ajax({
					    				url:'bookmarkUpdate',
					    				type: 'POST',
					    				data: {ffid: item.ffid, bookstate: item.bookState},
					    				success: function() {
					    					alert('중요하지 않군요... ');
					    					init();
					    				},
					    				error: function(e) {
					    					alert(JSON.stringify(e));
					    					// alert('에-러');
					    				}
					    			});	 } },
								null, // divider
								{label:'속성',                 action:function() { 
									$.ajax({
					    				url:'info',
					    				type: 'POST',
					    				dataType: 'json',
					    				data: {ffid: item.ffid, path: item.path},
					    				success: function(obj) {
					    					
					    					soksung(obj);
					    				},
					    				error: function(e) {
					    					alert(JSON.stringify(e));
					    					// alert('에-러');
					    				}
					    			});
								} },
								{label:'삭제',                         action:function() { 
									
									 $.ajax({
						    				url:'conDelete',
						    				type: 'POST',
						    				data: {ffid: item.ffid},
						    				success: function(obj) {
						    					alert('휴지통으로 이동하였습니다.');
						    					init();
						    				},
						    				error: function(e) {
						    					alert(JSON.stringify(e));
						    					// alert('에-러');
						    				}
						    			}); 
								} }
								
								]
						});
					});			
					
					data += '<img id="sfolders'+item.ffid+'" class="folder sfolder" path="'+ item.path +'" src="./resources/img/storage/sbfolder.png">';
					// data += '<img class="folder sfolder" path="'+ item.path
					// +'" src="./resources/img/storage/sbfolder.png">';
					}
				
				
				
				else{
					// 폴더이면서 공유 T, 중요 F
						$(function() {
						
						// var image = document.getElementById("#file");
						
						$('#sfolders'+item.ffid+'').contextPopup({
							title: 'My Popup Menu',
							items: [
								{label:'공유설정',            action:function() { shareSet(); } },
								{label:'복사/이동',                 action:function() { location.href="http://www.naver.com" } },
								{label:'중요        ★',                   action:function() { 
									$.ajax({
					    				url:'bookmarkUpdate',
					    				type: 'POST',
					    				data: {ffid: item.ffid, bookstate: item.bookState},
					    				success: function() {
					    					alert('중요하지 않군요... ');
					    					init();
					    				},
					    				error: function(e) {
					    					alert(JSON.stringify(e));
					    					// alert('에-러');
					    				}
					    			});	 } },
								null, // divider
								{label:'속성',                 action:function() { 
									$.ajax({
					    				url:'info',
					    				type: 'POST',
					    				dataType: 'json',
					    				data: {ffid: item.ffid, path: item.path},
					    				success: function(obj) {
					    					
					    					soksung(obj);
					    				},
					    				error: function(e) {
					    					alert(JSON.stringify(e));
					    					// alert('에-러');
					    				}
					    			});
								} },
								{label:'삭제',                         action:function() { 
									
									 $.ajax({
						    				url:'conDelete',
						    				type: 'POST',
						    				data: {ffid: item.ffid},
						    				success: function(obj) {
						    					alert('휴지통으로 이동하였습니다.');
						    					init();
						    				},
						    				error: function(e) {
						    					alert(JSON.stringify(e));
						    					// alert('에-러');
						    				}
						    			}); 
								} }
								
								]
						});
					});		
					data += '<img id="sfolders'+item.ffid+'" class="folder sfolder" path="'+ item.path +'" src="./resources/img/storage/sfolder.png">';	
					
				}
			}
			// ↑여기까지가 폴더이면서 중요T이면서 북마크 T,F설정

			
			// 폴더이면서 중요 F
			else {
						// 폴더이면서 중요F, 북마크 T일경우
				if(item.bookState.toLowerCase()=='t'){
					$(function() {
						
						// var image = document.getElementById("#file");
						
						$('#mfolders'+item.ffid+'').contextPopup({
							title: 'My Popup Menu',
							items: [
								{label:'공유설정',                action:function() { shareSet(); } },
								{label:'복사/이동',                 action:function() { location.href="http://www.naver.com" } },
								{label:'중요        ★',                   action:function() { 
									$.ajax({
					    				url:'bookmarkUpdate',
					    				type: 'POST',
					    				data: {ffid: item.ffid, bookstate: item.bookState},
					    				success: function() {
					    					alert('중요하지 않군요... ');
					    					init();
					    				},
					    				error: function(e) {
					    					alert(JSON.stringify(e));
					    					// alert('에-러');
					    				}
					    			});	 } },
								null, // divider
								{label:'속성',                 action:function() { 
									$.ajax({
					    				url:'info',
					    				type: 'POST',
					    				dataType: 'json',
					    				data: {ffid: item.ffid, path: item.path},
					    				success: function(obj) {
					    					
					    					soksung(obj);
					    				},
					    				error: function(e) {
					    					alert(JSON.stringify(e));
					    					// alert('에-러');
					    				}
					    			});
								} },
								{label:'삭제',                         action:function() { 
									
									 $.ajax({
						    				url:'conDelete',
						    				type: 'POST',
						    				data: {ffid: item.ffid},
						    				success: function(obj) {
						    					alert('휴지통으로 이동하였습니다.');
						    					init();
						    				},
						    				error: function(e) {
						    					alert(JSON.stringify(e));
						    					// alert('에-러');
						    				}
						    			}); 
								} }
								
								]
						});
					});		
					
					data += '<img id="mfolders'+item.ffid+'" class="folder mfolder" path="'+ item.path +'" src="./resources/img/storage/mbfolder.png">';
					// data += '<img class="folder mfolder" path="'+ item.path
					// +'" src="./resources/img/storage/mbfolder.png">';
				}
				

				// 폴더이면서 중요F, 북마크 F일경우
				else{
					$(function() {
						
						// var image = document.getElementById("#file");
						
						$('#mfolders'+item.ffid+'').contextPopup({
							title: 'My Popup Menu',
							items: [
								{label:'공유설정',             action:function() { shareSet(); } },
								{label:'복사/이동',                 action:function() { location.href="http://www.naver.com" } },
								{label:'중요',                   action:function() { 
									$.ajax({
					    				url:'bookmarkUpdate',
					    				type: 'POST',
					    				data: {ffid: item.ffid, bookstate: item.bookState},
					    				success: function() {
					    					alert('중요하지 않군요... ');
					    					init();
					    				},
					    				error: function(e) {
					    					alert(JSON.stringify(e));
					    					// alert('에-러');
					    				}
					    			});	 } },
								null, // divider
								{label:'속성',                 action:function() { 
									$.ajax({
					    				url:'info',
					    				type: 'POST',
					    				dataType: 'json',
					    				data: {ffid: item.ffid, path: item.path},
					    				success: function(obj) {
					    					
					    					soksung(obj);
					    				},
					    				error: function(e) {
					    					alert(JSON.stringify(e));
					    					// alert('에-러');
					    				}
					    			});
								} },
								{label:'삭제',                         action:function() { 
									
									 $.ajax({
						    				url:'conDelete',
						    				type: 'POST',
						    				data: {ffid: item.ffid},
						    				success: function(obj) {
						    					alert('휴지통으로 이동하였습니다.');
						    					init();
						    				},
						    				error: function(e) {
						    					alert(JSON.stringify(e));
						    					// alert('에-러');
						    				}
						    			}); 
								} }
								
								]
						});
					});					
					data += '<img id="mfolders'+item.ffid+'" class="folder mfolder" path="'+ item.path +'" src="./resources/img/storage/mfolder.png">';
					// data += '<img class="folder mfolder" path="'+ item.path
					// +'" src="./resources/img/storage/mfolder.png">';
				}
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
			nowPath = path;
			menu = 'List';
		    loadList(path);
		});
	}
}


// 객체화 하자

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
	// alert(nav);
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

	