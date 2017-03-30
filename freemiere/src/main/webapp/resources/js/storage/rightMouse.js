/*(function() {

   마우스 오른쪽 메뉴 변수 
  var test = document.getElementById("context-menus");
  $(document).ready(function() {
		$('#image').on('click',rightMouseListener);
		
	});
   마우스 클릭 리스너를 초기 실행시킨다. 
  function init() {
   
	  leftMouseListener();
  }

   마우스 왼클릭 감지 
  function leftMouseListener() {
	  document.addEventListener("contextmenu", function(e) {
	      event.preventDefault();
	      toggleOnOff(1);
	      showMenu(e.x, e.y);
	    });
	  
  }

   마우스 우클릭 감지 
  function rightMouseListener() {

	  document.addEventListener("click", function(e) {
      toggleOnOff(0);
    })
  }

   마우스 메뉴 on & off 
  function toggleOnOff(num) {
    num === 1 ? test.classList.add("active") : test.classList.remove("active");
  }

   마우스 클릭한 지점에서 메뉴 보여줌 
  function showMenu(x, y) {
    //console.log(test);
    test.style.top = y + "px";
    test.style.left = x + "px";

  }

  
  
  init();
})();*/















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