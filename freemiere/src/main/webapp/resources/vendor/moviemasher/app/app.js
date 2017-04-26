/*jshint unused:false */
/*global MovieMasher:true*/
'use strict';
var mm_player;

function myHandler(){
	if(document.getElementById('t-slider') != null &&
	document.getElementById('player-slider') != null) {
		document.getElementById('t-slider').value = mm_player.position;
		document.getElementById('player-slider').value = mm_player.position;
	}
}

function eventOnDraw( ctx, eventName ){
	  var fireEvent = function(){
	    var evt = document.createEvent("Events");
	    evt.initEvent(eventName, true, true);
	    ctx.canvas.dispatchEvent( evt );
	  }
	  var stroke = ctx.stroke;
	  ctx.stroke = function(){
	    stroke.call(this);
	    fireEvent();
	  };
	  var fillRect = ctx.fillRect;
	  ctx.fillRect = function(x,y,w,h){
	    fillRect.call(this,x,y,w,h);
	    fireEvent();
	  };
	  var fill = ctx.fill;
	  ctx.fill = function(){
	    fill.call(this);
	    fireEvent();
	  };
}

var videoTotalDuration = 0;
var videoClips = 0;

function add_video0(id, url, count, fname){
	var duration = count/30;
	var cntLength = String(count.toString()).length;
	var zeroPlus = '';
	for(var i = 0; i < 9-cntLength; i++){
		zeroPlus += '0';
	}
	//var fname = getFileName(url);
    var add = {
    		'label': fname,
    		'id': id,
    		'type': 'video', 
    		'url': url,
    		'fps': 30,
    		'pattern': (zeroPlus+'%.jpg'),
    		'duration' : duration
   };
   mm_player.add(add, 'video', videoTotalDuration , 0);
  
   add = {
		      'label': fname,
		      'type': 'audio',
		      'id': 'audio' + id,
		      'url': url + 'audio.mp3',
		      'duration': duration,
  };
   
  mm_player.add(add, 'audio', videoTotalDuration , 0);
  
  videoTotalDuration += duration;
  
}


//function 

function add_video0img(id, url, fname){
	alert(url);
	//var fname = getFileName(url);
	var add = {
	      'label': fname,
	      'type': 'image',
	      'id': id,
	      'url': url,
	};
	mm_player.add(add, 'video', videoTotalDuration , 0);
	//alert(JSON.stringify(mm_player.mash, null, '\t'));
	videoTotalDuration += 2;
}

function mm_load() {
	  var canvas = document.getElementById('mm-canvas');
	  
	  var myContext = canvas.getContext('2d');
	  canvas.addEventListener( 'blargle', myHandler, false );
	  eventOnDraw( myContext, 'blargle' );
	  
	  if (canvas && MovieMasher && MovieMasher.supported) {
	    mm_player = MovieMasher.player();
	    // register the filters we use
	    MovieMasher.register(MovieMasher.Constant.filter, [
	      { "id":"color", "source": "resources/vendor/moviemasher/dist/filters/color.js" },
	      { "id":"drawtext", "source": "resources/vendor/moviemasher/dist/filters/drawtext.js" },
	      { "id":"overlay", "source": "resources/vendor/moviemasher/dist/filters/overlay.js" },
	      { "id":"scale", "source": "resources/vendor/moviemasher/dist/filters/scale.js" },
	      { "id":"setsar", "source": "resources/vendor/moviemasher/dist/filters/setsar.js" }
	    ]);
	    // register at least a default font, since we're allowing a module that uses fonts
	    MovieMasher.register(MovieMasher.Constant.font, {
	      "label": "Freemiere Mash",
	      "id":"com.moviemasher.font.default",
	      "source": "resources/vendor/moviemasher/app/media/font/default.ttf",
	      "family":"Freemiere Mash"
	    });
	    mm_player.canvas_context = canvas.getContext('2d');
	    mm_player.mash = {
	    		"label": "Freemiere Mash",
	    		"quantize": 1,
	    		"backcolor": "rgb(0,0,0)",
	    		"id": "freemiere",
	    		"media": [],
	    		"video": [
	    			{
	    				"type": "video",
	    				"index": 0,
	    				"clips": []
	    			},
	    			{
	    				"type": "video",
	    				"index": 1,
	    				"clips": []
	    			},
	    			{
	    				"type": "video",
	    				"index": 1,
	    				"clips": []
	    			}
	    		],
	    		"audio": [
	    			{
	    				"type": "audio",
	    				"index": 0,
	    				"clips": []
	    			},
	    			{
	    				"type": "audio",
	    				"index": 1,
	    				"clips": []
	    			},
	    			{
	    				"type": "audio",
	    				"index": 2,
	    				"clips": []
	    			}
	    		]
	    	};
	  }
}