var nowPath = 'root'

function loadMyStorageForEditor() {
	var url = 'loadMyStorageForEditor';
	$.ajax({
		url : url,
		type : 'GET',
		dataType : 'json',
		success : function(nodes) {
			alert(JSON.stringify(nodes));
		    var setting = {
		            view: {
		                addHoverDom: addHoverDom,
		                removeHoverDom: removeHoverDom,
		                selectedMulti: false
		            },
		            data: {
		                simpleData: {
		                    enable: true
		                }
		            },
		            edit: {
		                enable: false
		            },
					callback: {
						//beforeClick: beforeClick,
						onClick: onClick
					}
		     };
		    
	        $.fn.zTree.init($("#treeDemo"), setting, nodes);
	        
		},
		error : function(e) {
			alert(JSON.stringify(e));
		}
	});
}

function onClick(event, treeId, treeNode, clickFlag) {
	requestFileList(treeNode.path)
}	

function requestFileList(path){
	
	$.ajax({
		url : 'loadListFile',
		type : 'GET',
		data : {
			path : path
		},
		dataType : 'json',
		success : function(list) {
			nowPath = path;
			outputFileList(list);
		},
		error : function(e) {
			//alert(JSON.stringify(e));
			initFileList();
		}
	});	
}

var newCount = 1;
function addHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='add node' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    
    var btn = $("#addBtn_"+treeNode.tId);
    if (btn) btn.bind("click", function(){
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, name:"new node" + (newCount++)});
        return false;
    });
};

function removeHoverDom(treeId, treeNode) {
    $("#addBtn_"+treeNode.tId).unbind().remove();
};
