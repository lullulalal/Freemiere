var myRootDir = '';
var menu = 'MyStorage';
var nowPath = '';

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
		nowPath = myRootDir;
		//삭제버튼
		$('#btn-del').on('click', go_to_Trash);
		//업로드버튼
		$('#file').on('click',fileUpload);
		
		loadList();
	});
	$('#shared').click(function() {
		menu = 'Shared';
		setNavRoot(menu);
		setNavTop(menu);
		//삭제버튼
		$('#btn-del').on('click', go_to_Trash);
		//업로드버튼
		$('#file').on('click',fileUpload);
		loadList();
	});
	$('#recent').click(function() {
		menu = 'Recent';
		setNavRoot(menu);
		/*// 하단 삭제버튼
		$('#btn-del').on('click', go_to_Trash);*/
	});
	$('#bookMark').click(function() {
		menu = 'Bookmark';
		setNavRoot(menu);
		setNavTop(menu);
		// 하단 삭제버튼
		$('#btn-del').on('click', go_to_Trash);
		//업로드버튼
		$('#file').on('click',fileUpload);
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

	setNavTop(menu);

	// 하단 삭제버튼
	$('#btn-del').on('click', go_to_Trash);
	//업로드
	$('#fileUpload').change(function() {
		alert('up');
		var formData = new FormData();
		// formData.append('upload', $('input[type=file]')[0].files[0]);

		// 다중파일업로드
		$($("#fileUpload")[0].files).each(function(index, file) {
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
	      $(this).css('border', '3px solid #00b386');
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
	      $(this).css('border', '0px');
	   });

	// 하단 새폴더 버튼
	$('#btn-add').on('click', newDir);

	// $('#btn-download').on('click', fileDownLoad);

	/*// 복원 버튼
	$('#btn-resotre').on('click', restore);*/

	/*// 휴지통에서 완전 삭제
	$('#btncompleteDel').on('click', completeDelete);*/

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


//편집버튼 눌렀을때 이동되는 경로
function edit(){
	location.href="createMovie";
}

function init(){
	loadList(nowPath);
}

//파일속성
function soksung(obj){
	sokObject = obj;
	
	$(document).ready(function() {
		$("#myBtn").click(function(){
	        $("#fName").attr("readonly",false);
	    });	
		$("#conUp").click(function(){
	        $("#content").attr("readonly",false);
	    });	
		
		$("#subm").click(function(){
			var fName = $('#fName').val();	
			var info = $('#content').val();
			var ffid = obj.ffid;
			var nowPa = nowPath;
			$.ajax({
				url:'sokUpdate',
				type: 'POST',
				dataType: 'json',
				data: {ffid: ffid, filename: fName, info: info, path: nowPa},
				success: function(obj) {
					alert('성공하였습니다.');
					init();
				},
				error: function(e) {
					alert(JSON.stringify(e));
					// alert('에-러');
				}
			});
	    });	
	});
	
	var test = '';
		test +='<form id= "updateForm">';
		test +='<div id="id01" class="modal fade">';
	 	test +='<div class="modal-dialog">';
	 	test +='<div class="modal-content">';
	 	
	 	test +='<h2 class="modal-title">';
	 	
	 	test +='<input id="fName" type="text" placeholder='+obj.fileName+' readonly=readonly>';
	 	
	 	test +='<button type="button" class="close" data-dismiss="modal">x</button></h2>';
	 	
	 	test +='<button type="button"class="btn btn-info btn-lg" id="myBtn">제목수정</button>';
	 	
	 	test +='<div class="modal-body">';
	 	test += '<textarea id="content" rows="10" cols="30" readonly=readonly>'+obj.info+'</textarea>';
	 	test +='<button type="button"class="btn btn-info btn-lg" id="conUp">내용수정</button>';
		test +='<p>파일크기'+obj.volume+'</p>';
	 	test +='<p>업로드날짜 '+obj.uploadDate+'</p>';
	 	test +='<p>수정 날짜  '+obj.lastModify+'</p>';
	 	test +='<button id="subm" type="button" class="btn btn-default">수정하기</button>';
	 	test +='<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
	 	test +='</div>';
	 	test +='</div>';
	 	test +='</div>';
	 	test +=' </div>';
	 	test +='</form>';
	$('#test').html(test);		
	
	$('#id01').modal();	
}


//폴더속성일 경우
function soksungFolder(obj){

	$(document).ready(function() {
		$("#myBtn").click(function(){
	        $("#fName").attr("readonly",false);
	    });	
		$("#conUp").click(function(){
	        $("#content").attr("readonly",false);
	    });	
		
		$("#subm").click(function(){
			var fName = $('#fName').val();	
			var info = $('#content').val();
			var ffid = obj.ffid;
			var nowPa = nowPath;
			$.ajax({
				url:'sokUpdate',
				type: 'POST',
				dataType: 'json',
				data: {ffid: ffid, filename: fName, info: info, path: nowPa},
				success: function(obj) {
					alert('성공하였습니다.');
					init();
				},
				error: function(e) {
					alert(JSON.stringify(e));
					// alert('에-러');
				}
			});
	    });	
	});
	
	var test = '';
		test +='<form id= "updateForm">';
		test +='<div id="id01" class="modal fade">';
	 	test +='<div class="modal-dialog">';
	 	test +='<div class="modal-content">';
	 	
	 	test +='<h2 class="modal-title">';
	 	
	 	test +='<input id="fName" type="text" placeholder='+obj.fileName+' readonly=readonly>';
	 	
	 	test +='<button type="button" class="close" data-dismiss="modal">x</button></h2>';
	 	
	 	test +='<button type="button"class="btn btn-info btn-lg" id="myBtn">제목수정</button>';
	 	
	 	test +='<div class="modal-body">';
	 	
	 
	 	test += '<textarea id="content" rows="10" cols="30" readonly=readonly>'+obj.info+'</textarea>';
	 	test +='<button type="button"class="btn btn-info btn-lg" id="conUp">내용수정</button>';
		test +='<p>파일크기'+obj.volume+'</p>';
	 	test +='<p>수정 날짜  '+obj.lastModify+'</p>';
	 	
	 	test +='<button id="subm" type="button" class="btn btn-default">수정하기</button>';
	 	test +='<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
	 	
	 	test +='</div>';
	 	test +='</div>';
	 	test +='</div>';
	 	test +=' </div>';
	 	test +='</form>';
	$('#test').html(test);		
	
	$('#id01').modal();	
}

//휴지통에 있는 속성일 경우
function soksungTrash(obj){

	$(document).ready(function() {
		$("#myBtn").click(function(){
	        $("#fName").attr("readonly",false);
	    });	
		$("#conUp").click(function(){
	        $("#content").attr("readonly",false);
	    });	
	});
	
	var test = '';
		test +='<form id= "updateForm">';
		test +='<div id="id01" class="modal fade">';
	 	test +='<div class="modal-dialog">';
	 	test +='<div class="modal-content">';
	 	
	 	test +='<h2 class="modal-title">';
	 	
	 	test +='<input id="fName" type="text" placeholder='+obj.fileName+' readonly=readonly>';
	 	
	 	test +='<button type="button" class="close" data-dismiss="modal">x</button></h2>';
	 	
	 	test +='<div class="modal-body">';
	 	
	 
	 	test += '<textarea id="content" rows="10" cols="30" readonly=readonly>'+obj.info+'</textarea>';
		test +='<p>파일크기'+obj.volume+'</p>';
	 	test +='<p>수정 날짜  '+obj.lastModify+'</p>';
	 	
	 	test +='<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
	 	
	 	test +='</div>';
	 	test +='</div>';
	 	test +='</div>';
	 	test +=' </div>';
	 	test +='</form>';
	$('#test').html(test);		
	
	$('#id01').modal();	
}





//공유 설정
function shareSet(obj){
	
	var User;
	//alert(JSON.stringify(obj));
	var set = '';
	
	set +='<form id= "updateForm">';
	set +='<div id="sharedS" class="modal fade">';
	set +='<div class="modal-dialog">';
	set +='<div class="modal-content">';
	 	
	set +='<h2 class="modal-title">';
	 	
	set +='<input id="fName" type="text" placeholder="아이디 검색">';
	set +='<button type="button"class="btn btn-info btn-lg" id="search">검색</button>';
	set += '</form>';
	set +='<button type="button" class="close" data-dismiss="modal">x</button></h2>';
	
		
		
		set +='<div class="modal-body">';
		
		set +='<div id="auth1">';
		set +='<textarea id="content" rows="2" cols="30" readonly=readonly></textarea>';
		set +='<form id= "updateForm2">';
		set +='<select id="selectAuth" name="selectAuth">';
		set +='<option value="Owner">Owner</option>';
		set +='<option value="View">View</option>'
		set +='<option value="Edit">Edit</option>'
		set +='</select>'
		set +='<button type="button"class="btn btn-info btn-lg" id="addAuth">추가</button>';
		set +='</div>';
		
		set +='<div id="shareList">';
		set +='<textarea id="content" rows="10" cols="30" readonly=readonly>';
		
		
		
		
	$.each(obj, function(index, item){
		$(document).ready(function() {
			$("#search").click(function(){
		        var searchName = $('#fName').val();
		        $.ajax({
					url:'searchUser',
					type: 'POST',
					dataType: 'json',
					data: {email: searchName},
					success: function(search) {
						if(search != null){
							User = search.email;
							alert(User);
							$('#content').val(User);
						}					
					},
					error: function(e) {
						//alert(JSON.stringify(e));
						 alert('존재하지 않습니다.');
					}
				});
				
		    });	
			
			$("#addAuth").click(function(){
				var selectAuth = document.getElementById("selectAuth");
				
				var ffid = item.ffid;
				var email = $('#content').val();
				var select = selectAuth.value;
				alert('얘들어 값이나오렴 !'+email+'    '+ ffid +'     ' +select);
				
				$.ajax({
					url:'setAuth',
					type: 'POST',
					//dataType: 'json',
					data: {auth: select, ffid:ffid, email:email},
					success: function(obj) {
						alert('등록완료');
						document.getElementById('sharedS').style.display = 'none';
						$('.modal-backdrop').remove();
						init();
					},
					error: function(e) {
						alert(JSON.stringify(e));
						// alert('에-러');
					}
				});
		    });	
		});
		
		set += item.email+'&nbsp;&nbsp;&nbsp;'+item.auth;
		 	
	});
	set += '</textarea>';
	set +='</div>';
	set +='</form>';
	set +='</div>';
	
	
	set +='</div>';
	set +='</div>';
 	set +=' </div>';
 	set +='</form>';
	$('#sharedSet').html(set);		
	
	$('#sharedS').modal();	
}

//공유 설정2
function shareSet2(ffid){
	
	var User;
	//alert(JSON.stringify(obj));
	var set = '';
	
	alert('ffid 자알받았습니다.' +ffid)
		$(document).ready(function() {
			$("#search").click(function(){
		        var searchName = $('#fName').val();
		        $.ajax({
					url:'searchUser',
					type: 'POST',
					dataType: 'json',
					data: {email: searchName},
					success: function(search) {
						if(search != null){
							User = search.email;
							alert(User);
							$('#content').val(User);
						}					
					},
					error: function(e) {
						//alert(JSON.stringify(e));
						 alert('존재하지 않습니다.');
					}
				});
				
		    });	
			
			$("#addAuth").click(function(){
				var selectAuth = document.getElementById("selectAuth");
				
				var email = $('#content').val();
				var select = selectAuth.value;
				alert('얘들어 값이나오렴 !'+email+'    '+ ffid +'     ' +select);
				
				$.ajax({
					url:'setAuth',
					type: 'POST',
					//dataType: 'json',
					data: {auth: select, ffid:ffid, email:email},
					success: function(obj) {
						alert('등록완료');
						document.getElementById('sharedS').style.display = 'none';
						$('.modal-backdrop').remove();
						init();
					},
					error: function(e) {
						alert(JSON.stringify(e));
						// alert('에-러');
					}
				});
		    });	
		});
		
		
		
		set +='<form id= "updateForm">';
		set +='<div id="sharedS" class="modal fade">';
		set +='<div class="modal-dialog">';
		set +='<div class="modal-content">';
		 	
		set +='<h2 class="modal-title">';
		 	
		set +='<input id="fName" type="text" placeholder="아이디 검색">';
		set +='<button type="button"class="btn btn-info btn-lg" id="search">검색</button>';
		set += '</form>';
		set +='<button type="button" class="close" data-dismiss="modal">x</button></h2>';
		
			
			
			set +='<div class="modal-body">';
			
			set +='<div id="auth1">';
			set +='<textarea id="content" rows="2" cols="30" readonly=readonly></textarea>';
			set +='<form id= "updateForm2">';
			set +='<select id="selectAuth" name="selectAuth">';
			set +='<option value="Owner">Owner</option>';
			set +='<option value="View">View</option>'
			set +='<option value="Edit">Edit</option>'
			set +='</select>'
			set +='<button type="button"class="btn btn-info btn-lg" id="addAuth">추가</button>';
			set +='</div>';
			
			set +='<div id="shareList">';
			//set +='<textarea id="content" rows="10" cols="30" readonly=readonly>'+item.email+'&nbsp;&nbsp;&nbsp;'+item.auth+'</textarea>';
			set +='</div>';
			set +='</form>';
			set +='</div>';
			
			
			set +='</div>';
			set +='</div>';
		 	set +=' </div>';
		 	set +='</form>';
		 	
		 	$('#sharedSet').html(set);		
			
			$('#sharedS').modal();	
}


function outputList(list) {
	// alert(JSON.stringify(list));
	var data = '';

	data += '<ul class="fileTable">'
	$.each(list,function(index, item) {
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
								+ '"' + 'id="file_check' + index + '" >';
						data += '</td></tr>';

						data += '<tr align="center">';
						data += '	<td class="filebox-td">';
						
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
								    					
								    					soksungTrash(obj);
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
								    					
								    					soksungTrash(obj);
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
						
						else{
///////////////////////////////////////////////////////////////////////////////////////					
							if(item.isFolder == false){
								
								// 중요의 상태가 T일 경우
								if(item.bookState.toLowerCase()=='t'){
									$(function() {
										  
									 	// var image = document.getElementById("#file");
									 	  
									     $('#file'+item.ffid+'').contextPopup({
									       title: 'Image/Avi File',
									       items: [
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
									var path = item.path;
									var pathArray = path.split('\\');
									var thumbPath = './storageResources/';
									var imgPath = './storageResources/';
									for (var j = 2; j < pathArray.length; j++) {
										imgPath += pathArray[j];
										thumbPath += pathArray[j];
										if (j < (pathArray.length - 1)) {
											thumbPath += '/';
											imgPath += '/';
										}
										if (j == (pathArray.length - 2))
											thumbPath += '.thumb/';
									}
									thumbPath += '.png';

									var fileType = getFileType(item.path);
									if (fileType == 'image') {
										data += '<label for="file_check' + index + '">';
										data += '<img id="file'+item.ffid+'" class="file fimage" path="'
												+ imgPath + '" src="' + thumbPath
												+ '">';
										data += '</label>';
									} else if (fileType == 'video') {

										var p = item.path;
										var videoPathrray = p.split('\\');
										var videoPath = './storageResources/';
										for (var j = 2; j < videoPathrray.length; j++) {
											videoPath += videoPathrray[j];
											if (j < (videoPathrray.length - 1))
												videoPath += '/';
										}
										data += '<video width=156 height=156 controls poster="'
												+ thumbPath + '">';
										data += '<source src="' + videoPath
												+ '" type="video/mp4">';
										data += '<source src="' + item.path
												+ '" type="video/ogg">';
										data += '<source src="' + item.path
												+ '" type="video/webm">';
										data += 'Your browser does not support the video tag.';
										data += '</video>';
									} else {
										data += '<label for="file_check' + index + '">';
										data += '<img id="file'+item.ffid+'" class="file" src="./resources/img/storage/file.png">';
										data += '</label>';
									}
									
									// bookState가 F일 경우
								}else{ 
									$(function() {
										  
									 	// var image = document.getElementById("#file");
									 	  
									     $('#file'+item.ffid+'').contextPopup({
									       title: 'Image/Avi File',
									       items: [
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
									var path = item.path;
									var pathArray = path.split('\\');
									var thumbPath = './storageResources/';
									var imgPath = './storageResources/';
									for (var j = 2; j < pathArray.length; j++) {
										imgPath += pathArray[j];
										thumbPath += pathArray[j];
										if (j < (pathArray.length - 1)) {
											thumbPath += '/';
											imgPath += '/';
										}
										if (j == (pathArray.length - 2))
											thumbPath += '.thumb/';
									}
									thumbPath += '.png';

									var fileType = getFileType(item.path);
									if (fileType == 'image') {
										data += '<label for="file_check' + index + '">';
										data += '<img id="file'+item.ffid+'" class="file fimage" path="'
												+ imgPath + '" src="' + thumbPath
												+ '">';
										data += '</label>';
									} else if (fileType == 'video') {

										var p = item.path;
										var videoPathrray = p.split('\\');
										var videoPath = './storageResources/';
										for (var j = 2; j < videoPathrray.length; j++) {
											videoPath += videoPathrray[j];
											if (j < (videoPathrray.length - 1))
												videoPath += '/';
										}
										data += '<video width=156 height=156 controls poster="'
												+ thumbPath + '">';
										data += '<source src="' + videoPath
												+ '" type="video/mp4">';
										data += '<source src="' + item.path
												+ '" type="video/ogg">';
										data += '<source src="' + item.path
												+ '" type="video/webm">';
										data += 'Your browser does not support the video tag.';
										data += '</video>';
									} else {
										data += '<label for="file_check' + index + '">';
										data += '<img id="file'+item.ffid+'" class="file" src="./resources/img/storage/file.png">';
										data += '</label>';
									}
									
								}
								
								
								// data += '<img class="file"
								// src="./resources/img/storage/file.png">';
								//	data += '<img id="file'+item.ffid+'" src="'+item.path+'" onclick="window.open(this.src)">';
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
										    					
										    					soksungFolder(obj);
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
													{label:'공유설정',            action:function() { 
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
													{label:'중요',                   action:function() { 
														$.ajax({
										    				url:'bookmarkUpdate',
										    				type: 'POST',
										    				data: {ffid: item.ffid, bookstate: item.bookState},
										    				success: function() {
										    					alert('중요로 설정되었습니다.');
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
										    					
										    					soksungFolder(obj);
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
													{label:'공유설정',                action:function() {
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
										    					
										    					soksungFolder(obj);
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
													{label:'공유설정',             action:function() { 
														var ffid = item.ffid;
														$.ajax({
										    				url:'folderShare2',
										    				type: 'POST',
										    				dataType: 'json',
										    				data: {ffid: item.ffid},
										    				success: function(obj) {
										    					shareSet2(obj.ffid);
										    				},
										    				error: function(e) {
										    					alert(JSON.stringify(e));
										    					// alert('에-러');
										    				}
										    			}); 
														
														
													} },
													{label:'중요',                   action:function() { 
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
										    			});	 } },
													null, // divider
													{label:'속성',                 action:function() { 
														$.ajax({
										    				url:'info',
										    				type: 'POST',
										    				dataType: 'json',
										    				data: {ffid: item.ffid, path: item.path},
										    				success: function(obj) {
										    					
										    					soksungFolder(obj);
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
		$(this).toggleClass('highlight');
	});

	$('.folder').click(function() {
		$(this).toggleClass('highlight');
	});

	if (navRoot != 'Trash') {
		$('.folder').dblclick(function() {
			var path = $(this).attr('path');
			nowPath = path;
			menu = 'List';
			loadList(path);
		});
	}

	$('.fimage').on('dblclick', function() {
		var path = $(this).attr('path');
		$.colorbox({
			maxWidth : "75%",
			maxHeight : "75%",
			href : path
		});
	});

}

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
				+ navRoot + '">' + '공유저장소</a>';
	else if (navRoot == 'Bookmark')
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + '즐겨 찾기</a>';
	else if (navRoot == 'Trash')
		nav = '<a style="cursor:pointer" class="navbar-brand naviBarRoot" nav="'
				+ navRoot + '">' + '휴지통</a>';
	setNav();
}

function setNavTop(nr) {
	// alert(nr);
	var data = '';
	navRoot = nr;

	if (navRoot == 'MyStorage') {
		data += '<ul class="nav navbar-nav">';
		data += '	<li class="active">';
		data += '		<a id="btn-all" class=' + 'topMenu' + '>';
		data += '			<i class="fa fa-check-square-o" aria-hidden="true">';
		data += '			</i> 전체선택';
		data += '		</a>';
		data += '	</li>';
		data += '	<li>';
		data += '		<a id="btn-del" class=' + 'topMenu' + '>';
		data += '			<i class="fa fa-trash" aria-hidden="true">';
		data += '			</i> 삭제';
		data += '		</a>';
		data += '	</li>';
		data += '	<li>';
		data += '		<a id="btn-add" class=' + 'topMenu' + '>';
		data += '			<i class="fa fa-plus-square-o" aria-hidden="true">';
		data += '			</i> 새폴더';
		data += '		</a>'
		data += '	</li>';
		data += '	<li>';
		data += '		<label for="fileUpload" class=topMenu>';
		data += '				<a id="file" > <i class="fa fa-cloud-upload" aria-hidden="true">';
		data += '					업로드</i></a>';
		data += '		</label>';
		data += '		<input type="file" id="fileUpload" name="upload" multiple="multiple"> ';
		data += '			</form>';
		data += '	</li>'
		data += '</ul>';

		$('#setNavTop').html(data);
	} else if (navRoot == 'Shared') {
		data += '<ul class="nav navbar-nav">';
		data += '	<li class="active">';
		data += '		<a id="btn-all" class=' + 'topMenu' + '>';
		data += '			<i class="fa fa-check-square-o" aria-hidden="true">';
		data += '			</i> 전체선택';
		data += '		</a>';
		data += '	</li>';
		data += '	<li>';
		data += '		<a id="btn-del" class=' + 'topMenu' + '>';
		data += '			<i class="fa fa-trash" aria-hidden="true">';
		data += '			</i> 삭제';
		data += '		</a>';
		data += '	</li>';
		data += '	<li>';
		data += '		<label for="fileUpload" class=topMenu>';
		data += '				<a id="file" > <i class="fa fa-cloud-upload" aria-hidden="true">';
		data += '					업로드</i></a>';
		data += '		</label>';
		data += '		<input type="file" id="fileUpload" name="upload" multiple="multiple"> ';
		data += '			</form>';
		data += '	</li>'
		data += '</ul>';
			
		$('#setNavTop').html(data);
	} else if (navRoot == 'Bookmark') {
		data += '<ul class="nav navbar-nav">';
		data += '	<li class="active">';
		data += '		<a id="btn-all" class=' + 'topMenu' + '>';
		data += '			<i class="fa fa-check-square-o" aria-hidden="true">';
		data += '			</i> 전체선택';
		data += '		</a>';
		data += '	</li>';
		data += '	<li>';
		data += '		<a id="btn-del" class=' + 'topMenu' + '>';
		data += '			<i class="fa fa-trash" aria-hidden="true">';
		data += '			</i> 삭제';
		data += '		</a>';
		data += '	</li>';
		data += '	<li>';
		data += '		<label for="fileUpload" class=topMenu>';
		data += '				<a id="file" > <i class="fa fa-cloud-upload" aria-hidden="true">';
		data += '					업로드</i></a>';
		data += '		</label>';
		data += '		<input type="file" id="fileUpload" name="upload" multiple="multiple"> ';
		data += '			</form>';
		data += '	</li>'
		data += '</ul>';
		
			$('#setNavTop').html(data);
	} else if (navRoot == 'Trash') {
		data += '<ul class="nav navbar-nav">';
		data += '	<li class="active">';
		data += '		<a id="btn-all" class=' + 'topMenu' + '>';
		data += '			<i class="fa fa-check-square-o" aria-hidden="true">';
		data += '			</i> 전체선택';
		data += '		</a>';
		data += '	</li>';
		data += '	<li>';
		data += '		<a id="btncompleteDel" class=' + 'topMenu' + '>';
		data += '			<i class="fa fa-trash" aria-hidden="true">';
		data += '			</i> 삭제';
		data += '		</a>';
		data += '	</li>';
		data += '	<li>';
		data += '		<a id="btn-resotre" class=' + 'topMenu' + '>';
		data += '			<i class="fa fa-reply" aria-hidden="true">';
		data += '			</i> 복원';
		data += '		</a>';
		data += '	</li>';
		data += '</ul>';
		
			$('#setNavTop').html(data);
	} else if (navRoot == 'recent') {
		data += '<ul class="nav navbar-nav">';
		data += '	<li class="active">';
		data += '		<a id="btn-all" class=' + 'topMenu' + '>';
		data += '			<i class="fa fa-check-square-o" aria-hidden="true">';
		data += '			</i> 전체선택';
		data += '		</a>';
		data += '	</li>';
		data += '	<li>';
		data += '		<a id="btn-del" class=' + 'topMenu' + '>';
		data += '			<i class="fa fa-trash" aria-hidden="true">';
		data += '			</i> 삭제';
		data += '		</a>';
		data += '	</li>';
		data += '</ul>';
		
		$('#setNavTop').html(data);
	}
	
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
		if (path = 'MyStorage')
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
			if (naviArray[i].outerHTML == $(this)[0].outerHTML) {
				num = i;
				break;
			}
		}
		var path = $(this).attr('path');

		if (nowPath.length >= path.length) {
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

function fileUpload(){
	alert("파일1");
	$('#fileUpload').click(function(){
		alert("파일2");
		$('#fileUpload').change(function() {
			alert('up');
			var formData = new FormData();
			// formData.append('upload', $('input[type=file]')[0].files[0]);
			
			// 다중파일업로드
			$($("#fileUpload")[0].files).each(function(index, file) {
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

//휴지통으로 이동
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
function newDir() {

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

	document.getElementById('newFolder').style.display = 'block';

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
				document.getElementById('newFolder').style.display = 'none';
				loadListUnchangNav(nowPath);
			},
			error : function(e) {
				alert(JSON, stringify(e));
			}
		});
	});
}

function getFileType(path) {
	var imgExtarr = new Array('jpg', 'jpeg', 'png');
	var vdoExtarr = new Array('mp4', 'wemb', 'ogg');

	var rtn = 'file';

	var pathArray = path.split('\\');
	var fileArray = pathArray[pathArray.length - 1].split('.');
	var ext = fileArray[fileArray.length - 1];

	for ( var i in imgExtarr) {
		if (imgExtarr[i] == ext.toLowerCase())
			return 'image';
	}

	for ( var i in vdoExtarr) {
		if (vdoExtarr[i] == ext.toLowerCase())
			return 'video';
	}

	return rtn;

}

// 복원
function restore() {
	alert('복원');
	var path = [];
	$('.file_check').each(function(index, item) {
		if ($(item).is(":checked")) {
			path.push($(item).attr('path'));
		}
	});
	
	alert(path);
	jQuery.ajaxSettings.traditional = true;

	$.ajax({
		url : 'restore',
		type : 'POST',
		data : {
			path : path
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
	var path = [];
	$('.file_check').each(function(index, item) {
		if ($(item).is(":checked")) {
			path.push($(item).attr('path'));
		}
	});
	
	alert(path);
	jQuery.ajaxSettings.traditional = true;

	$.ajax({
		url : 'completeDeleteFileFolder',
		type : 'POST',
		data :{
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
