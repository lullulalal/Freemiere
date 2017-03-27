function NavBar() {
  this.rootDir = rootDir;
}

NavBar.prototype.setRootDir = function(rootDir)
{
	this.rootDir = rootDir;
};

NavBar.prototype.printOut = function(fullPath)
{
	var tmp = fullPath.split('\\');
	var rootDir = tmp[0]+'\\'+tmp[1]+'\\'+tmp[2]+'\\';
	
	path = fullPath.substring(rootDir.length,fullPath.length);
	var dirArray=path.split('\\');
	
	function getPatialPath(dirArray, index){
		var rtn = '';
		for(j = 0; j <= index; j++){
			rtn += dirArray[j];
			rtn += '\\';
		}
		return rtn;
	}
	
	var data = '<a style="cursor:pointer" class="navbar-brand naviBar" path="' + myRootDir + '">' + '내 저장소</a>';
	for (i = 0; i < dirArray.length-1; i++) { 
		data += '<a class="navbar-brand">/</a>';
		data += '<a class="navbar-brand naviBar"';
		data += ' path="' + ( myRootDir + getPatialPath(dirArray, i) ) + '">';
		data += dirArray[i] + '</a>';
	}

	$('#navigator').html(data);
	$(".naviBar").click(function(){
		var path = $(this).attr('path');
	    loadList(path);
	});
};