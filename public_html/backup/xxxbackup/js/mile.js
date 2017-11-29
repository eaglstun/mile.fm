onerror=handleErr;

function handleErr(msg,url,l){
	txt="There was an error on this page.\n\n";
	txt+="Error: " + msg + "\n";
	txt+="URL: " + url + "\n";
	txt+="Line: " + l + "\n\n";
	txt+="Click OK to continue.\n\n";
	alert(txt);
	return false;
};

function zoom(num){
	
	if ( num == 'in' ){
		num = mySize.scale * 2;
	} else if ( num == 'out' ) {
		num = mySize.scale / 2;
	};
	
	if (num > 72){
		num = 72;
	} else if( num < .0087){
		num = .0087890625;
	};	
	
	if(num == mySize.scale){
		return;
	};
	
	if(mags = $('mags')){
	
		s = (72 / num);
		n = Math.log(s) / Math.log(2);
		
		left = 126 - (n * 9);
		
		mags.style.left = left + "px";
	};
	
	//get the css style sheet 
	footBlock = document.styleSheets[0].cssRules[0].style;
	
	if (num < 18){
		mySize.mag = (18/num);

	} else {
		mySize.mag = 1;
	};
	
	mySize.scale = num;
	
	width = (num * 12 * mySize.mag) + "px";
	footBlock.height = width;
	footBlock.width = width;
	
	for (var x=0; x<mySize.numCols; x ++){
		for (var y=0; y<mySize.numRows; y ++){
			
			if ($("c"+x+"r"+y)){
				
				$("c"+x+"r"+y).forceReload = 1;
			};
		};
	};
	
	//need to reverse the equation, to set the mag x based on the zoom facotr
	leftX = (1 / num) * 72;
	
	setScreenClass();
};

function findTarget(e){
	
	try{
		//teh fahx
		t = e.target.id;
	} catch (err) {
		//teh sucx
		t = e.srcElement.id;
	};
	
	if(t.match(/pic/)){
		//console.log('findTarget, found pic: ' + t);
		doSelect(t);
	};
};

//initialize feet divs
function buildScreen(){
	
	//get rid of any divs due to scale or screen size 
	if(mySize.oldCols > mySize.numCols){
		for(var x=mySize.oldCols; x >= mySize.numCols; x --){
			for(var y=mySize.oldRows; y >= 0; y --){
				if(x >= mySize.numCols || y >= mySize.numRows){
					//console.log("remove: c"+x+"r"+y);
					try{
						$("c"+x+"r"+y).parentNode.removeChild($("c"+x+"r"+y));
					} catch (e) {
					
					};
				};
			};
		};
	};
	
	if(mySize.oldRows > mySize.numRows){
		for(var y = mySize.oldRows; y >= mySize.numRows; y --){
			for(var x = mySize.oldCols; x >= 0; x --){
				
				try{
					$("c"+x+"r"+y).parentNode.removeChild($("c"+x+"r"+y));
				} catch (e) {
				
				};
				
			};
		};
	};
	
	for (var x=0; x<mySize.numCols; x ++){
		for (var y=0; y<mySize.numRows; y ++){
			
			if (!$("c"+x+"r"+y)){
				
				var newdiv = document.createElement('div' );
			
				newdiv.setAttribute('id', "c"+x+"r"+y);
				newdiv.className = "footBlock";
				
				$('squaremile').appendChild(newdiv);
				
				$("c"+x+"r"+y).forceReload = 1;
			};
		};
	};
	
	moveScreen();
	setBrowserHash();
};

//delay loading image into mile div
function loadImage(cls, image){
	x = "doLoad('"+cls+"','"+image+"')";
	setTimeout(x, 1000);
};

//load a scaled image into the foot
function doLoad(cls, image){
	//console.log('cls: '+cls);
	if(getElementsByClass(cls)){
		obj = getElementsByClass(cls)[0];
		
		var pic = new Image();
		
		pic.onload = function(){
			this.obj.innerHTML = '<img src="'+image+'"/>';
			this.obj.style.backgroundImage = 'none';
			this.obj.style.backgroundColor = '#D16A38';
		};
		
		pic.obj = obj;
		pic.src = image;
		
	};
};

//handles positioning the foot divs
function moveScreen(){
	
	scale = mySize.scale / 72;
	
	xdiff = Math.floor(((mySize.myX) / mySize.totalWidth) * scale) * mySize.numCols * mySize.mag;
	xdiff = xdiff<0 ? 0: xdiff;
	
	ydiff = Math.floor(((mySize.myY) / mySize.totalHeight) * scale) * mySize.numRows * mySize.mag;
	ydiff = ydiff<0 ? 0: ydiff;
	
	adjX = mySize.myX / (scale);
	
	//position target on map
	posMap();
	
	widthDiff = (mySize.totalWidth-mySize.width) / 2;
	//console.log('widthDiff: ' + widthDiff);
	heightDiff= (mySize.totalHeight-mySize.height) / 2;
	
	var offsetLeftpx = Math.floor(((mySize.myX * scale) * -1) % (mySize.totalWidth)) + (mySize.width / 2) ;
	var offsetToppx = Math.floor(((mySize.myY * scale) * -1) % (mySize.totalHeight)) + (mySize.height / 2);
	//offset Left goes from half the screen width(720) down to this minus width of all feet drawn ~ (-2735) 
	
	if(mySize.myX < -1){
		var offsetLeftpx = ((mySize.myX * -1) * scale) + (mySize.width / 2);
	};
	
	if(mySize.myY < -1){
		var offsetToppx = ((mySize.myY * -1) * scale) + (mySize.height / 2);
	};
	
	
	
	offsetLeftpx = isNaN(offsetLeftpx) ? 0 : offsetLeftpx;
	offsetToppx = isNaN(offsetToppx) ? 0 : offsetToppx;
	
	$('offsetLeft').style.left = offsetLeftpx+"px";
	$('offsetTop').style.top = offsetToppx+"px";
	
	mySize.offsetLeft = offsetLeftpx;
	mySize.offsetTop = offsetToppx;
	
	$('squaremile').style.backgroundPosition = offsetLeftpx+"px "+offsetToppx+"px";
	
	//the limits of left and top value on screen before shifting
	minL = (0 - (widthDiff));
	maxL = (mySize.width + (widthDiff/2));
	
	//console.log('minL: '+minL);
	
	minT = (0- (heightDiff/2));
	maxT = (mySize.height + (heightDiff/2));
				
	//console.log('----------------' );
	for (var x=0; x<mySize.numCols; x ++){
		for (var y=0; y<mySize.numRows; y ++){
			
			//new left is the offset + pixel feet * column we are on
			newLeft = ((offsetLeftpx) + (x * mySize.oneFoot * mySize.mag)) ;
			newTop = ((offsetToppx) + (y * mySize.oneFoot  * mySize.mag));
			
			//this logic takes care of moving divs from left to right, up to down, etc
			
			if(newLeft > maxL){
				newLeft -= (mySize.totalWidth);
			} else if (newLeft < minL ){
				newLeft += (mySize.totalWidth);
			};
			
			if(newTop > maxT){
				newTop -= (mySize.totalHeight);
			} else if (newTop < (0 - heightDiff) * mySize.mag){
				newTop += (mySize.totalHeight);
			};
			//end that logic block
			
			//figure out which foot we are actually looking at	
			var mileX = ((newLeft - offsetLeftpx) / ((scale) * 864)) + 1 + xdiff;
			var mileY = ((newTop - offsetToppx) / ((scale) * 864)) + 1 + ydiff;
			
			var object = $("c"+x+"r"+y);
			
			object.style.left = newLeft + "px";
			object.style.top = newTop + "px";
			object.className = "footBlock "+mileX+""+mileY;
			
			if (counter == 9 && object.innerHTML == ""){
				object.forceReload = 1;	
				object.mileX = mileX;
				object.mileY = mileY;
			};
			
			if ((object.mileX != mileX) || (object.mileY != mileY) || (object.forceReload == 1) || mySize.travelling == 99){
				
				object.mileX = mileX;
				object.mileY = mileY;
				//$("c"+x+"r"+y).forceReload = 0;
				
				//fill in bk if outside of mile
				if ((mileX > 0) && (mileX < 5281) && (mileY > 0) && (mileY < 5281)){
					
					object.innerHTML = '';
					object.style.backgroundColor = '#FFF';
					
					//if scaled, show an image of the foot, else load the content in one by one
					if(mySize.scale > 9){
						//dbug(mySize.scale,'mySize.scale' );
						object.innerHTML = '';
						object.style.backgroundImage = 'url(static/loading_216.png)';
						
						if ((typeof(loadArray[mileX]) != 'object') ){
							loadArray[mileX] = new Array;
						};
						
						//mileY IS GOING IN TWICE EACH TIME.  WHY?
						loadArray[mileX].push(mileY);
						
					} else {
						//scale is less then 18. load a rendered image.
						object.innerHTML = '';
						object.style.backgroundImage = 'url(static/loading_216.png)';
						
						loadImage(mileX+""+mileY, 'image/mileX/'+mileX+'/mileY/'+mileY+'/scale/'+(72 / mySize.scale) + "\/mag\/" +mySize.mag);
					};
					
					if (mySize.travelling < 2 || mySize.travelling == 99 || ($("c"+x+"r"+y).forceReload == 1 && counter == 9)){
						object.forceReload = 0;
						//if we need to add to array 
						//which will be called via ajax, to load content
						if (typeof(loadArray[mileX]) != 'object'){
							loadArray[mileX] = new Array;
						};
						
						//$("c"+x+"r"+y).innerHTML = '<img src="static/loading.gif" class="loadingCircle"/>';
						loadArray[mileX].push(mileY); 
						
					};
				} else {
					object.style.backgroundImage = 'none';
					object.className = "footBlock outside";
					
					object.style.backgroundColor = '#D16A38';
					//object.innerHTML = 'mileX: '+mileX+'<br>mileY: '+mileY;
					//object.innerHTML = "c"+x+"r"+y+"<br/>xdiff: "+xdiff+"<br/>col: "+mileX+"<br/>row:"+mileY;
				};
			};
		};
	};
	
	//why is mySize.scale not 72 if loadArray > 1?
	if (mySize.travelling == 0 && loadArray.length > 0 && mySize.scale > 9){
		//console.log('moveScreen -> makeMapCall: ' + mySize.travelling + ' , scale: '+mySize.scale);
		makeMapCall();
	} else if(mySize.travelling == 0 && selectedElement.toSelect) {
		doSelect(selectedElement.toSelect);
	};
};

//do the ajax call to load mile content
function makeMapCall(loc){

	//console.log('makeMapCall' );
	
	if(mySize.scale > 9){
		var arr = loc ? loc : loadArray;
		//console.log('arr: '+arr);
		//console.log('arr.length: '+arr.length);
		
		if(arr.length > 0 || loc){
			postArray = js_array_to_php_array(arr);
		} else {
			return;
		};
		
		loadFile = "array=" + escape(postArray);
		loadFile += "&scale=" + mySize.scale;
		
		mileFoot = new XHConn();
		mileFoot.connect("map/get", "POST", loadFile, insertIntoFoot);
	};
	
	loadArray.length = 0;
	
	setBrowserHash();
};

function insertIntoFoot(response){
	
	eval ('result = '+response.responseText);
	
	for (var i in result.feet){

		foot = getElementsByClass(i);

		if(foot[0]){
			content = result.feet[i];
			foot[0].innerHTML = content;
			loadImages(i);
			
			foot[0].style.backgroundImage = 'url(static/white.jpg)';
		};
	};
	
	for (var i in result.empty){
		foot = getElementsByClass(i);
		
		if(foot[0]){
			foot[0].innerHTML = '<!-- -->'; //blank will cause reload
			foot[0].style.backgroundImage = 'url(static/white.jpg)';
		};
	};
	
	if(selectedElement.toSelect){
		doSelect(selectedElement.toSelect);
	};

	//zIndex = (5280-(mileY))+(5280-(mileX));
};

//called to load images from map
function loadImages(footClass){
	//dbug(footClass, 'loadImages (footClass)' );
	
	foot = getElementsByClass(footClass);
	images = foot[0].childNodes;
	len = images.length;
	
	for(var i = 0 ; i < len ; i ++){
		id = images[i].id;
		src = images[i].src;
		//console.log(images[i]);
		
		content = src.replace("thumbs", "original");
		
		//console.log(id);
		var s = 'var '+id+' = new Image()';
		eval (s);
		
		var s = id+'.onload = function(){try{$("'+id+'").src = "'+content+'"; '+id+' = null}catch(e){}}';
		eval (s);
		
		var s = id+'.src = "'+content+'"';
		eval (s);
		
		var s = id+'.onerror = function(){}';
		//var s = id+'.onerror = function(){autoFlag('+id+')}';
		eval (s);
			
	}
	
};

function goSelect(){
	//console.log('goSelect: '+mySize.selectthis);
	if (mySize.selectthis && $(mySize.selectthis)){
		
		if (selectedElement.isSelected.id != mySize.selectthis){
			doSelect((mySize.selectthis));
		};
		
		mySize.selectthis = null;
	};
};

function js_array_to_php_array (a){
    var a_php = "";
    var total = 0;
    for (var key in a){
        total++;
        a_php = a_php + "s:" +
                String(key).length + ":\"" + String(key) + "\";s:" +
                String(a[key]).length + ":\"" + String(a[key]) + "\";";
    };
    a_php = "a:" + total + ":{" + a_php + "}";
    return a_php;
};

//make a shadow - elelment is on screen
function makeshadow(picID){
	
	selectedElement.isSelected = picID;
	selectedElement.toSelect = null;
	
	obj = $(picID);
	parent = obj.parentNode;
	//console.log(parent);
	
	//push it forward
	obj.style.zIndex = 50;
	
	//build a shadow
	width = (obj.width) * 1.25; 
	height = (obj.height) * 1.25; 
	left = (parseFloat(obj.style.left) - ((obj.width * 1.25) - obj.width) / 2) + "px";
	top = (parseFloat(obj.style.top) - ((obj.height * 1.25) - obj.height) / 2) + "px";
	
	//create in DOM
	shadow = document.createElement('img' );
	shadow.src = "static/shadow.png";
	shadow.width = width;
	shadow.height = height;
	shadow.style.left = left;
	shadow.style.top = top;
	shadow.setAttribute('id', 'contentShadow' );
	
	parent.appendChild(shadow);
	
	//the scale as relative to 72dpi
	scale = (mySize.scale / 72);
	pixelFoot = scale * 864;  
	
	/* consolodate into offsetleft & top*/
	left = parseInt(obj.style.left);
	middle = (parseInt(obj.width) / 2);
	offsetLeft = (left + middle) / scale;
	
	top = parseInt(obj.style.top);
	center = (parseInt(obj.height) / 2);
	offsetTop = (top + center) / scale;
	
	var goToCoords = {
		x: ((parent.mileX -1) * 864) + offsetLeft,
		y: ((parent.mileY -1) * 864) + offsetTop
	};
	
	//fix if off bottom of screen
	offsetY = parseInt(obj.height);
	offsetX = parseInt(obj.width);
	
	//adjst for map overlap
	if(offsetY > mySize.height){
		diffY = (offsetY - mySize.height) / 2;
		goToCoords['y'] += diffY;
	} else {
		diffY = 0;
	};
	
	fig = (mySize.width - offsetX) / 2 ;

	if( fig < 600){
		
		goToCoords['x'] += (500 - fig);
	} else {
		diffX = 0;
	};
	
	if((mySize.travelling == 0 && mySize.myX != goToCoords['x']) || (diffY != 0 || diffX != 0)){
		//console.log('makeshadow gotoloc' );
		//dbug(goToCoords, 'goToCoords' );
		
		goToLoc(goToCoords);
	} else {
		//in the right spot
	};
	
	//show the word balloon
	var comments = document.createElement('div' );
	comments.setAttribute('id', 'wordBalloon' );
	
	comments.style.left = parseInt(obj.style.left) + parseInt(obj.width) - (40 * scale) + "px";
	
	comments.style.top = parseInt(obj.style.top) + parseInt(obj.height) - 322 + "px";
	comments.innerHTML = '<div id="closeBalloon" onclick="doSelect(\''+picID+'\' );" class="btnX menuButton"></div><div id="balloonContent"></div>';
	
	parent.appendChild(comments);
		
	getComments(picID);
	
	return true;
}

//doubleclick on content function
function doSelect(picID){
	
	//console.log('doSelect: ' + picID);
	selectedElement.toSelect = null;
	
	//something is selected? deselct it
	if(selectedElement.isSelected){
			
		try{
			obj = $(selectedElement.isSelected);
			obj.style.zIndex = 5;
			
			//remove the shadow
			shadow = $('contentShadow' );
			shadow.parentNode.removeChild(shadow);
			
			//remove the word balloon
			wordBalloon = $('wordBalloon' );
			wordBalloon.parentNode.removeChild(wordBalloon);
		} catch (e) {
			//nothing to deselect
		};
		
		if(selectedElement.isSelected == picID){
			selectedElement.isSelected = null;
			return false;
		};
	};
	
	selectedElement.isSelected = picID;
	
	if($(picID)){
		makeshadow(picID);
	};
	
	return true;
};

//automatic travelling - goes in 10 steps
//called on map double click
function goToLoc(coords){
	//coords required:
	//x: x loc in 72 dpi pixels
	//y: y loc in 72 dpi pixels
	
	//coords optional
	//id: element to select once travel is complete
	
	//dbug(coords, 'coords' );
	
	//cancel any existing travels
	if (intInterval){
		intInterval=window.clearInterval(intInterval);
	};
	
	//select something once we get there
	if (coords['id']){
		selectedElement.toSelect = coords['id'];
	};
	
	//
	mySize.travelling = 1;
	
	//55 is 10+9+8..etc
	travelX = Math.floor(mySize.myX - coords['x'])/55;
	travelY = Math.floor(mySize.myY - coords['y'])/55;
	
	intInterval=window.setInterval("doTravel(travelX, travelY, 10)", 50);
};

// automatically postitions the map, with parameters set in goToLoc()
function doTravel(travelX, travelY, count){
	
	counter++;
	
	mySize.myX -= (travelX * counter);
	mySize.myY -= (travelY * counter);

	if (counter >= count){
		intInterval = window.clearInterval(intInterval);
		counter = 0;
		mySize.travelling = 0;
	};
	
	moveScreen();
};

//get all comments for a selected id
function getComments(div){
	
	$('balloonContent').innerHTML = '<img src="static/ajax-loader.gif" class="balloonLoader"/>';
	
	var ajaxConn = new XHConn();
	ajaxConn.connect("map/comments", "POST", "id="+div.replace(/pic/, ''), returnComments);
	
};

function returnComments(html){
	$('balloonContent').innerHTML = (html.responseText);
	unDragElements('balloonContent' );
	
	activeVote();
};

function showComment(id){
	for (var i=1; i<6; i++){
	
		$('commentSection'+i).style.display = 'none';
		$('commentSection'+id).style.display = 'block';
		
		try {
			
			$('commentTab'+i).className = 'commentTab deSelected';
			$('commentTab'+id).className = 'commentTab';
		} catch (e){
		
		};
	};
};

//activate the voting block
function activeVote(){
	//attach listeners to voting block
	addListener($('thDown'), 'click', parseVote, false);
	addListener($('thUp'), 'click', parseVote, false);
}

//get a vote
function parseVote(){
	
	objid = this.getAttribute('for' );
	val = this.getAttribute('value' );
	
	//dont do ajax if the is current vote
	cls = this.className;
	if(cls.indexOf(" up") < 0 || cls.indexOf(" on") > 0){
		vote(objid, val);
	};
	
	//alert(cls.indexOf(" up"));
};

//send a vote in
function vote(objectid, direction){
	//direction -1= down, 1 = up
	
	$('voteBlock').innerHTML = '<img src="static/thumbs-loading.png" title="loading..."/>';
	
	var ajaxConn = new XHConn();
	var vars = "objectid="+objectid+"&direction="+direction;
	
	ajaxConn.connect("content/vote", "POST", vars, receiveVote);
};

function receiveVote(json){
	eval('result = ' + json.responseText);
	
	if(result.success == true){
		$('voteBlock').innerHTML = result.vote;
		activeVote();
	} else {
		
	};
};




function getThumb(vote, id){
	var voteBlock = "";
	
	if (vote == 1){
		voteBlock += '<img src="static/tup.gif" onclick="vote('+id+',-1)"/>';
	} else if (vote == -1){
		voteBlock += '<img src="static/tdown.gif" onclick="vote('+id+',1)"/>';
	} else {
		voteBlock += '<img src="static/tdown.gif" onclick="vote('+id+',-1)"/>';
		voteBlock += '<img src="static/tup.gif" onclick="vote('+id+',1)"/>';
	};
	
	return voteBlock;
};

//add a comment to a a section
function addComment(){
	showComment('3' );
	$('squareComment').focus();
};

function addTag(){
	showComment('4' );
	$('squareTag').focus();
};

//submit a comment, put into comment record
function submitComment(){
	
	var id = $('squareID').value;
	var comment = $('squareComment').value;
	
	$('commentBlock').innerHTML = '<img src="static/ajax-loader.gif"/>';
	
	var ajaxConn = new XHConn();
	ajaxConn.connect("map/comment", "POST", "action=add&id="+id+"&comment="+comment, returnComments);                             
	
};



//submit a tag, put into comment record
function submitTag(){
	
	var id = $('squareID').value;
	var tag = $('squareTag').value;
	
	//$('tagBlock').innerHTML = '<img src="static/ajax-loader.gif"/>';
	
	var ajaxConn = new XHConn();
	vars = "id="+id+"&tag="+tag;
	
	showComment('2' );
	
	ajaxConn.connect("map/tag", "POST", vars, returnComments);     
	
};



//flag content as innaprropriate
function doFlag(id, reason){
	var ajaxConn = new XHConn();
	action = "objectid="+id+"&reason="+reason
	ajaxConn.connect("map/flag", "POST", action, receiveFlag);
};

function receiveFlag(json){
	eval('result = '+json.responseText);
	
	if(result.msg){
		$('lightboxcontent').innerHTML = result.msg;
	} else {
		new FadeOut('lightboxbk',20);
	};
};

//do this when pic is missing
function autoFlag(id){
	var ajaxConn = new XHConn();
	//console.log('autoflag: '+id);
	query = "objectid="+id+"&reason=missing";
	//ajaxConn.connect("map/flag", "POST", query, receiveautoFlag);
};

function receiveautoFlag(XML){
	
};

//handles placing image during drag
function checkOverlap(e){
	
	//e = new MouseEvent(e);
	var posImg = $('posImg' );
	
	picWidth = addPic.width * mySize.scale;
	picHeight = addPic.height * mySize.scale;
	
	smX = e.clientX - (picWidth / 2);
	smY = e.clientY - (picHeight / 2);
	
	//the actaul x and y coorinates, in inches, from the top left
	mLeft = Math.floor(((mySize.myX + ((e.clientX - (mySize.width / 2)) * (72 / mySize.scale))) / 72) - (addPic.width / 2));
	mTop = Math.floor(((mySize.myY + ((e.clientY - (mySize.height / 2)) * (72 / mySize.scale))) / 72) - (addPic.height / 2)); 
	
	addPic.inchX = mLeft;
	addPic.inchY = mTop;
	
	//snap to grid / scale
	adjX = (((mySize.myX * (mySize.scale / 72)) + e.clientX - (mySize.width / 2) - (picWidth / 2)) % mySize.scale) ;
	adjY = ((mySize.myY * (mySize.scale / 72)) + e.clientY - (mySize.height / 2) - (picHeight / 2)) % mySize.scale ;
	
	if(adjX < 0){
		adjX+= mySize.scale;
	};
	
	if(adjY < 0){
		adjY+= mySize.scale;
	};
	
	smX -= (adjX);
	smY -= (adjY);
	
	posImg.style.left = smX + "px";
	posImg.style.top = smY + "px";
	
};


//check to see if dragged picture overlaps others on mouse up
function checkOverlap2() {
	
	//check map to see if something is already there
	//new Flash('posImg' );
	
	//set variables to send to php
	var postVars = "width="+(addPic.width);
	postVars += "&height="+(addPic.height);
	postVars += "&inchX=" + (addPic.inchX);
	postVars += "&inchY=" + (addPic.inchY);
	postVars += "&fileLoc=" + (addPic.source);
	
	if(addPic.move.id){
		postVars += "&id=" + (addPic.move.id);
	};
	
	var ajaxConn = new XHConn();
	ajaxConn.connect("mile/add/", "POST", postVars, checkOverlap3);
};

//response from ajax, to see if pic was inserted or overlaps
function checkOverlap3(json){
	
	eval('result = '+json.responseText);
	
	//new FadeOut('posImg' );
		
	if (result.success == true){
		//dbug(result.foot);
		//why do i have to eval this?  it doesnt like the result.foot.x part otherwise.
		eval('makeMapCall({ ' + result.foot.x + ':' + result.foot.y + ' })' );
		//alert(result.sqlInsert.length + 'inserts' );
		
		if(addPic.move.id){
			//moved an image successfully
			//dbug(addPic.move, 'addPic.move' );
			//dbug('removing posImg' );
			$(addPic.move.id).parentNode.removeChild($(addPic.move.id));
				
			addPic.move = {x:0, y:0, id: 0};
			
			//dont remove if we are moving
			
			
		};
		
		$('posImg').parentNode.removeChild($('posImg'));
		$('smallAdd').parentNode.removeChild($('smallAdd'));
			
	} else {
		
		$('posImg').parentNode.removeChild($('posImg'));
		
		if(addPic.move.id){
			$('smallAdd').style.left = addPic.move.x;
			$('smallAdd').style.top = addPic.move.y;
		} else {
			// or shoot back placer to cpanel
			$('smallAdd').style.left = "10px";
			$('smallAdd').style.top = "10px";
		};
		
		//there were overlaps. figure out where they are 
		num = result.overlap.length;
		
		overlapContainer = document.createElement('div' );
		overlapContainer.setAttribute('id', 'overlapContainer' );
		
		overlapContainerTop = mySize.height;
		overlapContainerLeft = mySize.width;
		overlapContainerWidth = 0;
		overlapContainerHeight = 0;
		
		$('squaremile').appendChild(overlapContainer);
		
		for(o in result.overlap){
			x = result.overlap[o]['x'];
			y = result.overlap[o]['y'];
			
			div = document.createElement('div' );
			div.style.position="absolute";
			
			div.style.width = (mySize.scale)+"px";
			div.style.height = (mySize.scale)+"px";
			
			left = ((x * 72) - mySize.myX) * (mySize.scale / 72) - mySize.scale + (mySize.width / 2);
			top = ((y * 72) - mySize.myY) * (mySize.scale / 72) - mySize.scale + (mySize.height / 2);
			
			overlapContainerLeft = left < overlapContainerLeft ? left : overlapContainerLeft;
			overlapContainerTop = top < overlapContainerTop ? top : overlapContainerTop;
			overlapContainerWidth = left > overlapContainerWidth ? left : overlapContainerWidth;
			overlapContainerHeight = top > overlapContainerHeight ? top : overlapContainerHeight;
			
			left -= overlapContainerLeft;
			top -= overlapContainerTop;
			
			div.style.left = left + "px";
			div.style.top = top + "px";
			
			div.style.backgroundColor = "#f00";
			
			$('overlapContainer').appendChild(div);
			
		};
		
		overlapContainerWidth -= (overlapContainerLeft - mySize.scale);
		overlapContainerHeight -= (overlapContainerTop - mySize.scale);
		
		$('overlapContainer').style.left = overlapContainerLeft + "px";
		$('overlapContainer').style.top = overlapContainerTop + "px";
		$('overlapContainer').style.height = overlapContainerHeight + "px";
		$('overlapContainer').style.width = overlapContainerWidth + "px";
		
		setTimeout("new FadeOut('overlapContainer')",500);
		
		
	};
};


//random number for goToLoc
function goToRandom(){

	coords = {
		x: Math.random() * 4561920,
		y: Math.random() * 4561920
	};
	
	goToLoc(coords);
};

//posMap positions the cursor to the appropriate location on the map
function posMap(){
	scale = (mySize.scale / 72); 

	$('marker').style.left=((mySize.myX/24000) )+"px";
	$('marker').style.top=((mySize.myY/24000) )+"px";
};

//moves the mile when the map target is dragged
function posMile(objectX, objectY){
	scale = (mySize.scale / 72);
	
	mySize.myX = Math.floor(objectX * 24010.105 );
	mySize.myY = Math.floor(objectY * 24010.105 );
	
	moveScreen();
};




function getCoordinates(e){
	
	//get mouse properties
	var e=new MouseEvent(e);
	
	//relX=(e.x-12)-myX-(mySize.width/2);
	//relY=(e.y-12)-myY-(mySize.height/2);
	
	//the location of the mouse relative to the top left corner
	//top left (0,0)
	//bottom right (4561919,4561919)
	relX=(mySize.myX) + (e.clientX) - (mySize.width/2);
	relY=(mySize.myY) + (e.clientY) - (mySize.height/2);
	
	//the inch that the mouse is in.
	//top left(1,1)
	//bottom right(63360,63360)
	squareX = Math.ceil(relX/72);
	squareY = Math.ceil(relY/72);
	
	//footX and footY refer to square foot sized areas - 1 thru 5280 
	footX = Math.ceil(squareX/12);
	footY = Math.ceil(squareY/12);
	
	//the c0r0 div type
	colType = ((footX-1)%(mySize.numCols));
	rowType = ((footY-1)%(mySize.numRows));
	
	msgText  = "relX: "+relX+"\n";
	msgText += "relY: "+relY+"\n";
	msgText += "squareX: "+squareX+"\n";
	msgText += "squareY: "+squareY+"\n";
	msgText += "footX: "+footX+"\n";
	msgText += "footY: "+footY+"\n";
	msgText += "colType: "+colType+"\n";
	msgText += "rowType: "+rowType+"\n";
	
};

//called after upload
function resizeRename(fileLoc){
	//alert('resize: '+fileLoc);
	var ajaxConn = new XHConn();
	ajaxConn.connect("php/resizeRename.php", "POST", "fileLoc="+fileLoc, resizeDone);
};


//called after hotlink or upload of image
function readyToAdd(imgloc, width, height){
	
	$('m1main').innerHTML = "Please Wait...";
	$('m1err').innerHTML = "";
	
	var pic = new Image();
	
	pic.onerror = function(){
		alert ('there was an error! sorry!\n'+imgloc);
	};
	
	pic.onload = function(){
	
		//set up varialbes in global identifier
		addPic.height = Math.ceil(height/72);
		addPic.width = Math.ceil(width/72);
		addPic.source = imgloc;
		
		//scale picture proportionally for thumbnail
		if (addPic.height > addPic.width){
			var smallH = 100;
			var smallW = (addPic.width/addPic.height) * 100;
		} else {
			var smallW = 100;
			var smallH = (addPic.height/addPic.width) * 100;
		};
		
		if($('smallAdd')){
			$('smallAdd').parentNode.removeChild($('smallAdd'));
		};
		
		if(addPic.move.id){
			moving = $(addPic.move.id);
			moving.style.opacity = 1;
			moving.style.padding = "0px";
			moving.style.borderWidth = "0px";
			
			addPic.move ={x:0,
						   y:0,
						   id: 0};
		};
		
		//format html 
		uploadText = '<div style="position:relative"><div class="dragHelp">';
		uploadText += '	<img src="static/moveicon.png"/><br/>';
		uploadText += '	Drag it onto an empty space on the mile!';
		uploadText += '</div>';
		
		uploadText += '	<img src="content/original/'+imgloc+'" id="smallAdd" style="top:10px;left:10px;z-index:50000;width:'+smallW+'px; height:'+smallH+'px;" /></div>';
		
		menu = $('m1' );
		setTitle( menu , 'Add Your Picture' );
		setNav( menu , 'off' );
		
		$('m1main').innerHTML = uploadText;
		
		new sizeItem('m1' );
		
		new Drag('smallAdd' );
	}
	
	pic.src = 'content/original/'+imgloc;
	
};

//move an image that is already placed on the mile
function move(id){
	
	//remove the shadow
	shadow = $('contentShadow' );
	shadow.parentNode.removeChild(shadow);
	
	//remove the word balloon
	balloon = $('wordBalloon' );
	balloon.parentNode.removeChild(balloon);
	
	//set up the positioning div		
	id = 'pic'+id;
	milepic = $(id);
	milepic.style.opacity = .5;
	
	milepic.style.paddingBottom = "20px";
	milepic.style.backgroundColor = "#f00";
	milepic.style.border = "2px solid #f00";
	
	//set up the scaled thumb
	
	if($('smallAdd')){
		$('smallAdd').parentNode.removeChild($('smallAdd'));
	};
	
	var smallAdd = document.createElement('img' );
		
	smallAdd.setAttribute('id', "smallAdd");
	smallAdd.src = milepic.src;
	
	smallAdd.style.left = milepic.style.left;
	smallAdd.style.top = milepic.style.top;
	
	smallAdd.style.zIndex = 5000;
	
	milepic.parentNode.appendChild(smallAdd);
	
	//set up varialbes in global identifier
	addPic.height = Math.ceil(milepic.height / mySize.scale);
	addPic.width = Math.ceil(milepic.width / mySize.scale);
	addPic.source = milepic.src;
	
	smallAdd.width = addPic.width * mySize.scale;
	smallAdd.height = addPic.height * mySize.scale;
	
	addPic.move.x = milepic.style.left;
	addPic.move.y = milepic.style.top;
	addPic.move.id = id;
	
	//dbug($('smallAdd').width, "$('smallAdd').width");
	//dbug(addPic, 'move() addPic' );
	
	new Drag('smallAdd' );
}
	
//set browser hash to current location
function setBrowserHash(){
	
	scale = mySize.scale / 72;
	
	newHash = "x="+ Math.floor(mySize.myX) +"&y="+ Math.floor(mySize.myY);
	if (mySize.scale != 72){
		newHash += "&s="+mySize.scale;
	};
	
	oldHash = mySize.hash;
	
	if (newHash != oldHash){
		mySize.hash = "#"+newHash;
		window.location.hash = newHash;
	};
};






//click tracking and ad redirect
function clickThru(adLink, adID){
	window.open(adLink,'mywindow' );
	
	var ajaxConn = new XHConn();
	ajaxConn.connect("process/", "POST", "action=clickTrack&adID="+adID);
};

//flag an offensive, copyight image etc
function startReport(id){
	content = "<h2>What do you want to report?<h2>";
	
	var pic = new Image();
	image = $('pic'+id).src;
	pic.src= image;
	width = pic.width;
	height = pic.height;
	
	if (addPic.height > addPic.width){
		var smallH = 200;
		var smallW = (width/height) * 200;
	} else {
		var smallW = 200;
		var smallH = (height/width) * 200;
	};
	
	content += '<img src="'+image+'" style="float:right" width="'+smallW+'" height="'+smallH+'"/>';
	
	content += '<li><a href="" onclick="doFlag('+id+',\'copyright\' );return false;">Copyrighted Image</a></li>';
	content += '<li><a href="" onclick="doFlag('+id+',\'image\' );return false;">Inappropriate Image</a></li>';
	content += '<li><a href="" onclick="doFlag('+id+',\'comment\' );return false;">Offensive Comment / Spam</a></li>';
	
	content += '<li><a href="" onclick="new FadeOut(\'lightboxbk\',20);return false;">Never Mind</a></li>';
	
	//new Lightbox(content, true);
	new Lightbox({
		close: true,
		content: content,
		title: 'Report bad content'
	});
};


///cpanel below
//load primary control panel elements via ajax call
function loadCpanel(){
	var profile = new XHConn();
	profile.connect("user/getpanel", "POST", "", receiveCpanel);
};

function receiveCpanel(response){
	
	resetcPanel();
	
	eval('result = '+response.responseText);
	eval(result.script);
	
	$('control1').innerHTML = "<ul>"+result.html+"</ul>";
	
	sizeItem('control1' );
};

//debug function via AJAX call
function getDebug(action){
	var debug = new XHConn();
	debug.connect("debug/", "POST", "", receiveDebug);	
};

function receiveDebug(XML){
	//eval ('result = ' + XML.responseText);
	//console.log(XML.responseText);
};


//item from control1 is clicked, load submenu
function getControl(which){
	
	//remove selected from others 
	lis = $('control1').getElementsByTagName('a' );
	for (i in lis){
		if(lis[i].id){$(lis[i].id).className = '';};
		if(lis[i].id == 'menu_'+which){
			arrowIndex = i;
		};
	};
	
	//add selected state 
	$('menu_'+which).className = 'selected';
	
	var msgText = "<ul>";
	
	for (var i = 0; i < cpanelControls[which].length; i+=2){
		msgText += '<li>';
		msgText += '<a class="'+(arrowIndex == (i/2) ? 'special' : '')+'" href="" '+cpanelControls[which][i+1]+'>'+cpanelControls[which][i];
		msgText += '</a></li>';
	};
	
	$('control2').innerHTML = msgText + "</ul>";	
};



//a sub menu is selected 
function hliteSub(obj){
	
	l = obj.parentNode;
	p = l.parentNode;
	
	for(a in p.childNodes){

		if(l == p.childNodes[a]){
			if(new RegExp('\\bselected\\b').test(obj.className) == false){
				obj.className += " selected";
			};
		} else {

			x = p.childNodes[a];
			try{
				y = x.childNodes[0];

				var rep = y.className.match(' selected') ? ' selected': 'selected';
      			y.className = y.className.replace(rep,'' );
			} catch (e) {
			
			};
			
		};
	};
};

//get information about a friend
function getFriendInfo(id, obj){

	$('friendProfilemain').innerHTML = 'Loading...';
	$('friendAddmain').innerHTML = 'Loading...';
	$('friendCommentmain').innerHTML = 'Loading...';
	new sizeItem('m4' );
	
	menu = $('m4' );
	setTitle( menu , obj.getAttribute('user'));
	setNav( menu , 'off' );
	
	//load the users profile
	var profile = new XHConn(id);
	profile.connect("user/public", "POST", "userid="+id, receiveFriendProfile);
};

function receiveFriendProfile(json, id){
	
	eval('result = ' + json.responseText);
	profile = result.profile;
	
	$('friendProfilemain').innerHTML = profile;
	
	//set up thumbs menu for friend recent adds
	friendRecent = new thumbsMenu({
			action: 'thumbs/recentAdds',
			title: 'Recently Added', 
			container: 'friendAdd', 
			limit: 4,
			listThumbs: result.adds,
			vars: {userid: id}
		});
		
	//set up thumbs menu for friend recent comments
	friendComents = new thumbsMenu({
			action: 'thumbs/recentComments',
			title: 'Recent Comments', 
			container: 'friendComment', 
			limit: 4,
			listThumbs: result.comments,
			vars: {userid: id}
		});
		
	new Grow('m4' );
};

//get friends of logged in user
function getFriends(){
	userFriends = new thumbsMenu({
		action: 'thumbs/friends',
		title: 'Your Friends', 
		container: 'm2'
	});
	
	new Grow('m2' );
};

 
//retrieve user information
function getAccount(){

	$('m2main').innerHTML = 'Loading Your Account Info...<br/><img src="static/ajax-loader.gif"/>';
	$('m2err').innerHTML = "";
	
	menu = $('m2' );
	setTitle( menu , 'Your Account Info' );
	setNav( menu , 'off' );
	
	sizeItem('m2' );
	
	var profile = new XHConn();
	profile.connect("user/account", "POST", "", receiveAccount);
};

//received user profile info
function receiveAccount(XML){
	var account = XML.responseText;
	
	//output to screen
	$('m2main').innerHTML = account;
	sizeItem('m2' );
	
	//make text inputs not move screen on drag
	unDragElements('cpanel' );	
};

//takes new profile info and sends back to server
function UpdateProfile(){
	query = prepArrayForAjax(getFormVars('userAccount'));
	
	var profile = new XHConn();
	profile.connect("user/update", "POST", query, profileSuccess);
	
};

//called after user updates account information
function profileSuccess(xml){
	
	eval ('result = '+xml.responseText);
	
	format = '';
	
	if (result.success.length > 0){
		for(i in result.success){
			format += '<li>' + result.success[i] + '</li>';
		};
	};
	
	if (result.errors.length > 0){
		for(i in result.success){
			format += '<li>' + result.errors[i] + '</li>';
		};
	}
	
	$('m2main').innerHTML = (format);
	
	sizeItem('m2' );
};


function closeCpanel(x){
	new Shrink(('m'+x), 0, 10);
};

//hotlink to an image, step 1
function addImage(){
	
	var msgText = '	<h4>Enter URL of image:</h4>';
	
	msgText += '	<form action="javascript:addImage2();" name ="addForm">';	
	msgText += '		<input type="text" class="stdInput noDrag" id="imgLoc" />';
	msgText += '		<input type="submit" value="Link It!" class="stdButton leftMargin" />';
	msgText += '	</form>';
	
	msgText += '	<span class="helperText">Enter full path to the image, eg http://www.server.com/pic.jpg</span>';
	
	menu = $('m1' );
	setTitle( menu , 'Hotlink to an image on the web' );
	setNav( menu , 'off' );
	
	$('m1main').innerHTML = msgText;
	$('m1err').innerHTML = "";
	
	new sizeItem('m1' );
	
	unDragElements('cpanel' );
};

//hotlink to an image, step 2
function addImage2() {
	contentInsert = $('imgLoc').value;
	if (contentInsert){
		$('imgLoc').value = "";
		
		var add = new XHConn();
		add.connect("content/add", "POST", "content="+contentInsert, uploadComplete);
		$('m1main').innerHTML = 'Please Wait';
	}	else  {
		$('m1err').innerHTML = "Try linking to an image file";
	};
};

function uploadComplete(json){
	eval ('result = ' + json.responseText);

	if(result.success == true){
		readyToAdd(result.name, result.dims.width, result.dims.height);
	} else {
		$('m1main').innerHTML = 'There was an error loading the file.  Please check the address and try again.';
	};
};

//upload from your cpu
function startUpload(){
	
	menu = $('m1' );
	setTitle( menu , 'Upload an image from your computer' );
	setNav( menu , 'off' );
	
	/*
	msgText = '<embed flashvars="" pluginspage="http://www.adobe.com/go/getflashplayer" src="js/uploader.swf" type="application/x-shockwave-flash" id="upload" params="menu=false" height="85" width="288"></embed>';
	
	msgText += '<input type="button" class="stdButton" onclick="" value="Browse..."/>';
	msgText += '<span class="helperText">JPG, GIF, and PNG only, please.</span>';
	*/
	
	msgText = "The uploader is not quite working yet!  You can link an image on the web for now.";
	
	$('m1main').innerHTML = msgText;
	$('m1err').innerHTML = '';
	
	new sizeItem('m1' );
	
};

//get the list of images that are waiting for this user 
//from plugin or email
var getWaiting;

function getWaitingList(start){
	getWaiting = new thumbsMenu({
		action: 'thumbs/waiting',
		title: 'Your Waiting List', 
		container: 'm2'
	});
	
	new Grow('m2' );
};

function getPopular(start){

	$('m2main').innerHTML = "Loading popular";
	new Grow('m2' );
	
	popularThumbs = new thumbsMenu({
		action: 'thumbs/popular',
		title: 'Most Popular', 
		container: 'm2'
	});
};


function getRecent(start){
	recentThumbs = new thumbsMenu({
		action: 'thumbs/recent',
		title: 'Recently Added', 
		container: 'm2'
	});
	
	new Grow('m2' );
};

//get the coordinates from the coords="" attribute of an elemnt, go there
function findCoords(){

	text = "coords = " + this.getAttribute('coords' );
	eval(text);
	
	//dbug(coords, 'findCoords() coords' );
	goToLoc(coords);
};


function recDel(json){
	//console.log(json.responseText);
};

//object to handle building next / prev menu items
function thumbsMenu(vars, customQuery){
	
	var options = {
		xhconn:		new XHConn(),
		container:	'm2', //where it goes
		action:		'getRecent', //the function that does the ajax call
		listThumbs:	new Array(0), //holds the aray of thumbs /coordinates
		index:		0, //where we are in our list
		limit:		8, //how many thumbs do we show at once
		title: 		'Thumbs Menu', //the text to display in menu header
		vars:		{} //any extra post varaibles that do not change, like {userid: 9}
	};
	
	//set variables passes in into the option
	for (i in vars){
		options[i] = vars[i];
	};
	
	//define other parts of the menu
	
	options.titleId = getElementsByClass('cTitle' , $(options.container), 'span')[0];
	options.nextId = options.container+"next";
	options.prevId = options.container+"prev";
	options.mainId = options.container+"main";
	
	$(options.prevId).style.display = 'none';
	$(options.nextId).style.display = 'none';
	
	var ajaxCall = function(){
		//set the message title

		options.titleId.innerHTML = "Loading "+options.title+"...";
		$(options.mainId).innerHTML = '<img src="static/ajax-loader.gif"/>';
		
		var query = "start="+(options.listThumbs.length) + "&" + prepForQuery(options.vars);
		
		options.xhconn = new XHConn();
		options.xhconn.connect(options.action, "POST", query, function(xml){
			eval ('json = ' + xml.responseText);
			
			if(json.success == 'false'){
				$(options.container+'main').innerHTML = json.html;
				
				options.titleId.innerHTML = options.title;
				
			} else {
				concatTo(json);
			};
			
		});
	};
	
	
	//add the new records we received via ajax to the array	
	var concatTo = function (newThumbs){
		if(newThumbs){
			oldThumbs = options.listThumbs;
			
			x = oldThumbs.concat(newThumbs);
			//dbug(newThumbs, 'newThumbs' );
			
			options.listThumbs = x;
		} else {
		
		};
			
		setNav();
		formatNav();
		formatThumbs();
		formatTitle();
		//sizeItem(options.container,50);
	};
	
	var formatTitle = function(title){

		if (title){
			options.title = title;
		};
		
		len = (options.index + options.limit) < options.listThumbs.length ? (options.index + options.limit) : options.listThumbs.length;

		//dbug(options.listThumbs, 'options.listThumbs' );
		
		newtitle = options.title +" ( "+(options.index + 1)+" - "+len+" )";
		
		options.titleId.innerHTML = newtitle;
	};
	
	//decide if next and prev buttons are to show
	var setNav = function(){
		
		if (options.listThumbs.length > (options.index + options.limit)){
			$(options.nextId).style.visibility = 'visible';
			$(options.nextId).style.display = 'inline';
		} else {
			$(options.nextId).style.visibility = 'hidden';
			$(options.nextId).style.display = 'inline';
		};
		
		
	};
	
	//set action for the previous and next buttons
	var formatNav = function(){

		//set the next button to go to the next set of thumbs
		$(options.nextId).onclick = function(){

			$(options.prevId).style.visibility = 'visible';
			$(options.prevId).style.display = 'inline';
			
			options.index += options.limit;
			formatTitle();
			setNav();
			//if we are past the limit, do another ajax call
			if (options.index + options.limit >= (options.listThumbs.length)){
				//disable the next button
				$(options.nextId).onclick = function(){};
				//$(options.nextId).className = 'inactive';
				$(options.nextId).style.visibility = 'hidden';
				ajaxCall();
			} else {
				formatThumbs();
			};
		};
		
		//set the prev button
		$(options.prevId).onclick = function(){
			options.index -= options.limit;
			formatTitle();
			setNav();
			
			if (options.index >= 0){
				formatThumbs();
			} else {
				options.index = 0;
			};
			
			if (options.index == 0){
				$(options.prevId).style.visibility = 'hidden';
			}
		};
		
		//dbug(options.index, 'options.index' );
	};
	
	//build the html that goes into whatever div
	var formatThumbs = function(){
	
		//where we are in the index, plus the number of how many we want to see
		end = (options.index + options.limit) < options.listThumbs.length ? (options.index + options.limit) : options.listThumbs.length;
		
		//the html we insert into the appropriate menu
		output = '<div>';
		
		//any scripts to eval afterwards
		afterI = "";
		
		
		
		for ( i = options.index ; i < end ; i++ ){
			if(options.listThumbs[i]){
			
				id = options.mainId + 'Thumb' + options.listThumbs[i]['id'];
				
				output += '<div class="panelThumbs" id="'+id+'" ';
				//add location if is in there - want to go to
				if(options.listThumbs[i]['locX']){
				
					coords = {
						x: options.listThumbs[i]['locX'],
						y: options.listThumbs[i]['locY'],
						id: options.listThumbs[i]['id']
					};
					
					output += 'coords=\''+serial(coords)+'\' ';
					
					//attach listener to for go to loc
					afterI += "addListener($('"+id+"'), 'click', findCoords, false);";
					
				} else if (options.listThumbs[i]['loc']){
					//if this is their waiting list
					output += 'onclick="readyToAdd(\''+ options.listThumbs[i]['thumb'] +'\', '+options.listThumbs[i]['width']+', '+options.listThumbs[i]['height']+')" ';
				} else if (options.listThumbs[i]['userid']){
					//this is their friends list
					output += 'onclick="getFriendInfo(\''+options.listThumbs[i]['userid']+'\', this)" user=\''+options.listThumbs[i]['user']+'\' ';
				} else {
					//other?
					output += ' ';
				};
				
				//close the <div class="panelThumbs"
				output += '>';
				
				//the actual thumbnail image
				output += '	<img class="panelThumb" src="static/72spacer.gif" style="background-image:url(content/thumbs/' + options.listThumbs[i]['thumb'] + ')"/>';
				
				//add in vote count if there
				if(options.listThumbs[i]['votes']){
					output += '	<span class="addedDate">' + options.listThumbs[i]['votes'] + ' votes</span>';
				};
				
				//add user name if there
				if(options.listThumbs[i]['user']){
					output += '	<span class="addedDate">' + options.listThumbs[i]['user'] + '</span>';
				};	
				
				//add in date added if there
				if(options.listThumbs[i]['date']){
					output += '	<span class="addedDate">' + options.listThumbs[i]['date'] + '</span>';
				}
				
				//add option to delete if this is waiting list 
				if(options.listThumbs[i]['loc']){
					output += '	<img class="deletePic" indx="'+i+'" del="'+options.listThumbs[i]['loc']+'" src="static/deletePic.png" id="del'+options.listThumbs[i]['id']+'">';	
					afterI += "addListener($('del"+options.listThumbs[i]['id']+"'), 'click', function(e){confirmDelete(e,options.listThumbs)}, false);";
				};
				
				output += '</div>';
			} else {
				end --;
				console.log('end --' );
				//alert(i);
			};
		};
		
		output += '<br style="clear:both"/></div>';
		
		$(options.mainId).innerHTML = output;

		//dbug(afterI, 'afterI' );
		eval(afterI);	
	};
	
	var confirmDelete = function(e, obj){
		if(e) {
			//moz
			e.stopPropagation();
		} else {
			//IE
			e = window.event; 
		};
		
		del = e.target.getAttribute('del' );
		indx = e.target.getAttribute('indx' );
		
		//console.log('indx: '+indx);
		//console.log('obj: '+obj);
		
		uploadText = '<img src="content/original/'+del+'" height="100" width="100" style="float:left;margin:10px"> Are you sure you want to delete this picture from your waiting list?<br/>';
		
		uploadText += '<a class="fakeButton" id="confirmDelete">Yes</a> <a class="fakeButton">No</a>';
		$('m1main').innerHTML = uploadText;
			
		addListener($('confirmDelete'), 'click', function(){doDelete(del, obj, indx)}, false);
		
		menu = $('m1' );
		setTitle( menu , 'Confirm Delete' );
	
		new sizeItem('m1', 140);
	};

	var doDelete = function(src, obj, indx){
		del = new XHConn();
		del.connect("thumbs/delete", "POST", "src="+src, recDel);
		obj.splice(indx, 1);
		formatThumbs();
		
		if(options.listThumbs.length < (options.index + 8)){
			ajaxCall();
		};
	};

	//load initial content
	if(!options.listThumbs.length){
		ajaxCall();
	} else {
		setNav();
		formatTitle();
		formatNav();
		formatThumbs();
	};
};

//first step of inviting a friend
function startInvite(){
	new Lightbox({
		close: true,
		url: 'user/invite',
		title: 'Invite a friend!'
	});
};

//submit an email for invitation
function submitInvite($email){
	submitEmail = $email ? $email : $('inviteEmail').value;
	
	if (emailValidate(submitEmail)){
		var invite = new XHConn();
		action = "action=addInvite&email="+submitEmail;
		invite.connect("process/", "POST", action, receiveLbPost);
	} else {
		alert ('Email does not appear to be valid - please check' );
	};
};


//submit customized letter for invitation
function finalInvite(){
	var customtext = encodeURIComponent(myNicEditor.nicInstances.getContent());
	var inviteEmail = $('inviteEmail').value;
	
	action = "action=submitInvite&customtext="+customtext+"&inviteEmail="+inviteEmail;
	
	var invite = new XHConn();
	
	invite.connect("process/", "POST", action, receiveLbPost);
};



//log in / log out functions
//generic get log in text - called to hide and show divs
function startLogin(){

	$('loginMessage').innerHTML = "";
	
	sizeItem('m5' );
};



	
//called on receiving login xml
function receiveLogin(XML){
	
	eval('result = ' + XML.responseText);
	
	
	if (result.success == true){
		//successful login
		
		//hide elements
		$('loginMessage').style.display = "none";
		$('loginMessage').innerHTML = "";
		new Shrink('m5', "", 10);
		
		var userid = result.userid;
		var username = result.username;
		
		//load cPanel
		resetcPanel();
		loadCpanel();
		
		//set up the tracking interval and do it once immediately
		startTracking();
		
	} else {
		//unsuccessful login
		$('loginMessage').style.display='block';
		$('loginMessage').innerHTML = result.message;
		$('username').value = "";
		$('password').value = "";
		
		new sizeItem('m5' );
	};
	
};

//bye bye
function doLogout(){
	$('loginMessage').innerHTML = "Doing Logout...";
	
	var logIn = new XHConn();
	logIn.connect("user/logout", "POST", "", receiveLogout);
};

//called upon receiving logout php
function receiveLogout(XML){
	
	//load cPanel
	resetcPanel();
	loadCpanel();
	
	clearInterval (alive);
};


//get a new user via the mile!
function startSignup(x){
	new Lightbox({
		close: true,
		url: 'user/signup',
		title: 'Send Feedback'
	});
};

function receiveSignup(XML){
	$('lightboxcontent').innerHTML = XML.responseText;
	new unDragElements('lightboxcontent' );
	loadCpanel();
};

//sign up form, validate all form info
function validateSignUp(){

	signup = getFormVars('signUpForm' );
	
	var okay = true;
	var errmsg = [];
	
	if (signup.choosePass != signup.confirmPass){
		errmsg.push("Your passwords do not match!");
	};
	
	if (signup.chooseUName.length<2){
		errmsg.push("Your user name must be at least 2 characters.");
	};
	
	if(signup.newEmail && !emailValidate(signup.newEmail)){
		errmsg.push("Your email address does not appear to be valid.");
	};
	
	if (errmsg.length < 1) {
		signup = prepForQuery(signup);
		//alert(signup);
		postVars = "action=procSignup&"+signup;
		
		$('signupMsg').innerHTML = '';
		
		var signUp = new XHConn();
		
		signUp.connect("process/", "POST", postVars, receiveSignup);
	} else {
		output = "Please fix the following errors: ";
		
		for (i=0; i<errmsg.length; i++){
			output += errmsg[i]+"<br/>";
		};
		
		$('signupMsg').innerHTML = output;
	};
};

//toggle the scaled map
function toggleMap(){
	var vis = $('map').style.display;
	if (vis == 'none'){
		$('map').style.display = "block";
	} else {
		$('map').style.display = "none";
	};
	
};


//get the users profile
function getProfile(){
	
	$('m2main').innerHTML = "Loading Your Profile...";
	new Shrink('m2' );
	
	menu = $('m2' );
	setTitle( menu , 'Loading Your Profile...' );
	setNav( menu, 'off' );
	
	var profile = new XHConn();
	profile.connect("user/profile", "POST", "", receiveProfile);
};

function receiveProfile(XML){

	$('m2main').innerHTML = XML.responseText;
	
	menu = $('m2' );
	setTitle( menu , 'Your Profile' );
	setNav( menu , 'off' );
	
	new Grow('m2' );
	
};

function profileEdit(){
	unDragElements('cpanel' );
};

function openSearch(){
	menu = $('m2' );
	setTitle( menu , 'Search For an Image' );
	setNav( menu , 'off' );
	
	var msgText = '<form name="searchParms" action="javascript:sendSearchParms();">';
	msgText += '<input type="text" class="stdInput noDrag" name="searchTerm" id="searchTerm"/>';
	msgText += '<input type="button" value="Search" class="stdButton" onclick="sendSearchParms();" />';
	msgText += '</form>';

	$('m2main').innerHTML = msgText;
	
	new sizeItem('m2' );
	
	unDragElements('cpanel' );
};



function sendSearchParms(term){
	
	search = term ? term : $('searchTerm').value;
	
	searchThumbs = new thumbsMenu({
		action: 'thumbs/search/query/' + search,
		title: 'Search Results', 
		container: 'm2',
		limit: 4
	});
	
	$('m2main').innerHTML ='';
	
	menu = $('m2' );
	setTitle( menu , 'Searching... Please Wait' );
	
	new Grow('m2' );
};

function receiveSearch(XML){
	$('m3title').innerHTML = "Search Results";
	$('m3main').innerHTML = XML.responseText;
};

function receiveLbPost(XML){
	$('lightboxcontent').innerHTML = XML.responseText;
	
	if ($('myNicPanel')){
		myNicEditor = new nicEditor({buttonList : ['bold','italic','underline','strikeThrough','undo']});
		myNicEditor.addInstance('nicArea' );
		myNicEditor.setPanel('myNicPanel' );
	};
	
	unDragElements('lightboxcontent' );
};

function scrollTo(id){
	scrollID = $(id);
	scrollTop = scrollID.offsetTop;
	
	$('lightboxcontent').scrollTop = scrollTop;
};

//get the how to screens
function getHelp(){
	new Lightbox({
		close: true,
		url: 'help/main',
		title: 'Help!'
	});
};

//get form to send in user feedback
function startFeedback(){
	new Lightbox({
		close: true,
		url: 'user/feedback',
		title: 'Send Feedback'
	});
};

function sendFeedback(){
	vars = prepForQuery(getFormVars('formFeedback'))

	var sendFeedback = new XHConn();
	sendFeedback.connect("help/feedback", "POST", vars, returnFeedback);
	
	$('formFeedback').innerHTML = 'Please Wait...';
};

function returnFeedback(json){
	eval( 'result = ' + json.responseText);
	$('lightboxcontent').innerHTML = result.html;
};
	
function getTerms(){
	new Lightbox({
		close: true,
		url: 'help/terms',
		title: 'Terms and Conditions / Privacy Policy'
	});
};

function getAbout(){
	new Lightbox({
		close: true,
		url: 'help/about',
		title: 'About the Square Mile'
	});
};

function getAPI(){
	new Lightbox({
		close: true,
		url: 'help/api',
		title: 'API For Developers'
	});
};

function expandMethod(which){
	next = getNext(which);
	if(next.style.display == "block"){
		next.style.display = "none";
	} else {
		next.style.display = "block";
	};
};

