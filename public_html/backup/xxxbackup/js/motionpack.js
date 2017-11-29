// Cross-browser implementation of element.addEventListener()
// addListener(window, 'load', myFunction);
function addListener(element, type, expression, bubbling){
	bubbling = bubbling || false;
	if(window.addEventListener) { // Standard
		element.addEventListener(type, expression, bubbling);
		return true;
	} else if(window.attachEvent) { // IE
		element.attachEvent('on' + type, expression);
		return true;
	} else {
		return false;
	};
};

function removeListener(element, type, expression, bubbling){
	bubbling = bubbling || false;
	if(window.removeEventListener) { // Standard
		element.removeEventListener(type, expression, bubbling);
		return true;
	} else if(window.attachEvent) { // IE
		element.detachEvent('on' + type, expression);
		return true;
	} else {
		return false;	
	};
};

function mousemoveFunc(event){
	onScroll(event);
	
	if (dragging.object == "xxxxx"){
		//if the object is selectable (not draggable)
		return true;
		
	} else if (dragging.object == "smallAdd" && dragging.opacity > 51){
		dragging.opacity -=1;
		$(dragging.object).style.opacity = (dragging.opacity/100);
		//IE I HATE YOU
		document.onmousedown = function(){return false};
		return false;
	} else {
		document.onmousedown = function(){return false};
		return false;
	};
};

//grow or shrink an item depending on what is in it
function sizeItem(id, toHeight){

	var toShrink = $(id);
	
	var oldHeight = toShrink.offsetHeight < 0 ? 0 : toShrink.offsetHeight;
	
	toShrink.style.height = "auto";
	
	var newHeight = toShrink.offsetHeight;
	
	if (!toHeight){
		toHeight = newHeight;
	};
	
	toShrink.style.height = oldHeight+"px";
	toShrink.style.overflow = "hidden";
	
	if (toHeight < oldHeight ) {
		new Shrink(id, toHeight, 10);
		return false;
	} else {
		new Grow(id, toHeight, 10);
		return false;
	};
};


//makes an element draggable, pass in string.
function Drag(id){
	object = $(id);
	
	addListener(object, 'mousedown', function(event){
			getMouseDown(event, id);
			return false;
		},false);
		
	addListener(object, 'mousemove', mousemoveFunc, false);
	
		
	addListener(object, 'mouseup', function(event){
			getMouseUp(event);
		},false);
		
	unDragElements(id);
};

//makes an element undraggable - in effect makes page solid
function DragCancel(id){

	object = $(id);
	
	object.onmousedown = function(event){
		getMouseDown(event,'xxxxx' );
		document.onmousedown = function(){return true;};
		return true;
	};
};

//shrinks an element vertically
function Shrink(element, toHeight, speed, startHeight){
	
	//see if element was passed in as object, if not, objectify
	if (document.getElementById(element)){
		var element = $(element);
	} else {
		var element = element;
	};
	
	//if we pass in a destination height, use it, else shrink to 0
	var toHeight = toHeight ? toHeight : 0;
	
	//if we pass in a shrinking speed, use it, else set to 5
	if (speed){
		var shrinkspeed = speed;
	} else {
		var shrinkspeed = 5;
		speed=5;
	};
	
	if (parseInt(startHeight)){
		var height = startHeight;
	} else {
		var height = parseInt(element.offsetHeight);//get the height of the element passed in
	};
	
	var animate;//this will hold the setInterval
	
	function doShrink(){
		if (height-shrinkspeed > toHeight){
			height -= shrinkspeed;
			element.style.height = height+"px";
		} else {
			height = toHeight;
			element.style.height = height+"px";
			endShrink();
		}
		//accelerate
		shrinkspeed += (speed/5);
	};
	
	function endShrink(){
		clearInterval(animate);
	};
	
	function startShrink(){
		element.style.overflow = "hidden";

		for (i in element.childNodes){
			
			try {
				element.childNodes[i].style.overflow="hidden";
			} catch (err) {
				//
			};
		};
		
		animate = setInterval(doShrink, 10);
	};
	
	startShrink();//do it!
};


//grows an element vertically
function Grow(element, setHeight, speed, bound){
	
	//see if element was passed in as object, if not, objectify
	if ($(element)){
		var element = $(element);
	} else {
		var element = element;
	};
	
	//if we pass in a destination height, use it, else grow to the full height
	if (setHeight){
		var toHeight = setHeight;
	} else {
		oldheight = element.offsetHeight;
		
		//expand to see how big it should be
		element.style.overflow = "visible";
		element.style.height = "auto";
		
		toHeight = element.offsetHeight;
		
		//back to original height
		element.style.overflow = "hidden";
		element.style.height = oldheight+'px';
	};
	
	//if we pass in a grwoing speed, use it, else set to 5
	if (speed){
		var growspeed = speed;
	} else {
		var growspeed = 5;
		speed=5;
	};
	
	//if we pass in a bounding box, use it, else dont
	if (bound){
		var bound = $(bound);
	} else {
		var bound = false;
	};
	
	
	
	var height = parseInt(element.offsetHeight);//get the height of the element passed in
	var animate;//this will hold the setInterval
	
	function doGrow(){
		if (height + growspeed < toHeight){
			height += growspeed;
			element.style.height = height+"px";
			if (bound){
				checkBound();	
			};
		} else {
			height = toHeight;
			element.style.height = height+"px";
			
			//check to see if we are in bounding box
			if (bound){
				checkBound();
			};
			endGrow();
		};
		//accelerate
		growspeed += (speed/5);
	};
	
	function endGrow(){
		clearInterval(animate);
		if (!setHeight){
				element.style.height = "auto";
			};
		for (i in element.childNodes){
			
			try{
				element.childNodes[i].style.overflow="";
			} catch(err) {
				//
			};
			
		};


		//see if this is a im window, if so set div at bottom
		element.style.overflow = "visible";
		if (!setHeight){
			//element.style.height = "auto";
		};
		
	};
	
	function startGrow(){
		element.style.overflow = "hidden";
		animate = setInterval(doGrow, 10);
	};
	
	function checkBound(){
		
		if (parseInt(bound.style.top) + parseInt(bound.offsetHeight) > (mySize.height+30)){
			
			bound.style.top = mySize.height + 30 - parseInt(bound.offsetHeight) + "px";
		};
	};
	
	startGrow();//do it!
};

//flashes by changing opacity 
function Flash(element){

	//see if element was passed in as object, if so, get id
	
	if ($(element)){
		var element = element;
	} else {
		var element = element.id;
	};
	
	
	var cycle = 3.14;//start going down
	var opacity = 100;
	var animate;//this will hold the setInterval
	
	function doFlash(){
		if ($(element)){
			cycle +=.4;
			sine = Math.abs(Math.sin(cycle))*50;
			
			opacity = (100 - sine)/100;
			
			$(element).style.opacity = opacity;//normal browsers
			$(element).style.filter = "alpha(opacity='"+(100 - sine)+"')";//IE SUCKS
			
		} else {
			endFlash();
		};
	};
	
	var endFlash = function(){
		clearInterval(animate);
	};
	
	function startFlash(){
		animate = setInterval(doFlash, 40);
	};
	
	startFlash();//do it!
};

//make input/text and textarea elemnts inside a div undraggable
function unDragElements(id){

	IDToUndrag = $(id);
	
	var objectstoUndrag = getElementsByClass('noDrag', IDToUndrag);
	
	//debugArray(objectstoUndrag);
	
	for (i in objectstoUndrag){
		//console.log("ONJECTS TO UNDRAG: "+objectstoUndrag[i].id);
		new DragCancel(objectstoUndrag[i].id);
	};
};


//called on mousedown
function getMouseDown(e, whattoscroll){
	
	document.onmousemove = mousemoveFunc;
		
	if (e == null) {e = window.event;};

	if (dragging.object == ''){
		dragging.object = whattoscroll;
		//var e = new MouseEvent(e);
		getMouseLocStart(e);
		dragPlane=true;
	};
	
	//size the adding image according to scale;
	if(whattoscroll == 'smallAdd'){
		//dbug(addPic, 'getMouseDown() addPic' );
		
		posImg = document.createElement('img' );
		
		posImg.setAttribute('id',"posImg");
		
		posImg.width=((addPic.width * mySize.scale));
		posImg.height = ((addPic.height * mySize.scale));
		
		posImg.style.left = "100px";
		posImg.style.top = "100px";
		posImg.style.backgroundColor = "#f00";
		//posImg.style.left=((relCol-1)*72)+"px";
		//posImg.style.top=((relRow-1)*72)+"px";
		
		thumbsrc = ('content/original/'+addPic.source);
		th = thumbsrc.replace('http://localhost/newsquare/beta/content/original/', '' ); //bad
		th = thumbsrc.replace('http://mile.fm/beta/content/original/', '' ); //bad

		posImg.src = th;
		
		$('squaremile').appendChild(posImg);
		
		//dbug($('posImg').width, "$('posImg').width");
		
		
		
	} else if(whattoscroll == 'squaremile'){
		mySize.travelling = 2;
		//console.log('whattoscroll: '+whattoscroll+ ', mySize.travelling: '+mySize.travelling);
	};
};

//gets mouse coordinates at start of drag
function getMouseLocStart(e) {
	relativestartX=(e.clientX);
	relativestartY=(e.clientY);
};

//called all the time!  if dragplane = true, we are dragging somethjing
function onScroll(e) {
	
	//relX = (mySize.myX + ((e.clientX - (mySize.width / 2)) * (72 / mySize.scale))) / 72;
	//console.log('relX: '+relX);
	
	whattoscroll = dragging.object;
	scale = (mySize.scale / 72);
	
	//
	
	if (!dragPlane){
		//do nothing
	} else {
		//debugArray (e);
		document.body.style.cursor="move";
		
		getMouseLocEnd(e);
		
		objectLockX = 1;
		
		//dbug('whattoscroll: '+whattoscroll);
		//handle placing the image on the map
		if (whattoscroll == 'smallAdd'){
			checkOverlap(e);
		};
		
		moveX = Math.floor(relativestartX-relativeendX);
		moveY = Math.floor(relativestartY-relativeendY);
		
		//console.log('onScroll moveX: '+moveX);
		
		if ($(whattoscroll)) {
			dragObject = $(whattoscroll);
		
			if (whattoscroll == 'squaremile'){
				
				//we are moving the mile
				//d = ((mySize.mag * 72) / mySize.scale);
				d = (72 / mySize.scale ) * 2;
				//console.log('d: ' + d);
				moveX *= d;
				moveY *= d;
				
				relativestartX -= Math.floor(moveX / d);
				relativestartY -= Math.floor(moveY / d);
				
				
				//change global variables
				mySize.myX = (mySize.myX + moveX);
				mySize.myY = (mySize.myY + moveY);
				
				//console.log('onScroll mySize.myX: '+mySize.myX);
				
				moveScreen();
			} else {
				//we are moving an object
				relativestartX -= (moveX);
				relativestartY -= (moveY);
				
				//console.log('relativestartX: '+relativestartX);
				
				//console.log('whattoscroll: '+whattoscroll);
				
				db = '';
				
				objectX = parseInt($(whattoscroll).style.left) || 0;
				objectX -= moveX;
				
				objectY = parseInt($(whattoscroll).style.top) || 0;
				objectY -= moveY;
				
				if (whattoscroll == 'cpanel'){
					mySize.cpanelx = objectX;
					mySize.cpanely = objectY;
				} else if (whattoscroll == 'marker'){
					//we are moving the target, position the mile
					if (objectX<0) objectX=0;
					if (objectY<0) objectY=0;
					if (objectX>190) objectX=190;
					if (objectY>190) objectY=190;
					mySize.travelling = 3;
					posMile(objectX,objectY);
				} else if(whattoscroll == 'mags'){
					if (objectX<9) objectX = 9;
					if (objectX>126) objectX = 126;
					
					objectY=0;
				};
				
				
				dragObject.style.left = (objectX)+"px";
				dragObject.style.top = (objectY)+"px";
				
			};
		};
	};
};

/*
function MouseEvent(e) {
	if(e) {
		//moz
	  	e = e; 
	} else {
		//IE
	  	e = window.event; 
	};
	
	if(e.pageX) {
	  	this.clientX = e.pageX; 
	} else {
	  	this.clientX = e.clientX; 
	};
	
	if(e.pageY) {
	  	this.clientY = e.pageY; 
	} else {
	  	this.clientY = e.clientY; 
	};

	if(e.target) {
	  	this.target = e.target; 
	} else {
	  	this.target = e.srcElement;
	};
};
*/


function getMouseUp(e){
	
	document.onmousemove = null;
	document.body.style.cursor="";
	
	dragPlane=false;
	
	if (dragging.object=='marker'){
		mySize.travelling = 99;	
		moveScreen();
		if (mySize.hashtrack == 1){
			setBrowserHash();
		};
		makeMapCall();
	} else if (dragging.object=='squaremile'){
		if (mySize.hashtrack == 1){
			setBrowserHash();
		};
		
		mySize.travelling = 0;
		
		makeMapCall();
	} else if(dragging.object=='mags'){
		//snap to 9px zoom scales
		mags = $('mags' );
		left = parseInt(mags.style.left) - (parseInt(mags.style.left) % 9);
		mags.style.left = left + "px";
		
		left = (126 - left);
		zoomX = 72 / (Math.pow(2,((left) / 9)));
		
		zoom(zoomX);
		
	} else if (dragging.object=='smallAdd'){
		dragging.opacity = 100;
		$(dragging.object).style.opacity = (dragging.opacity / 100);
		
		checkOverlap2();
	};
	
	dragging.object = '';
};



function getMouseLocEnd(e) {
	try {
		relativeendX=(e.clientX);
		relativeendY=(e.clientY);	
	} catch (err){
	
	};
};

//mapCoord is called when double click on scaled map - travels to that location.
function mapCoord(e){
	//var e=new MouseEvent(e);
	
	mapX=(e.clientX)-(mySize.width-190);
	mapY=(e.clientY)-(mySize.height-190);			
	
	if (mapX<0){mapX=0;};
	if (mapX>190){mapX=190;};
	if (mapY>190){mapY=190;};
		
	//goto variables to reflect changes in scale
	gotoX=mapX*24000;
	gotoY=mapY*24000;
	//go to this location
	goToLoc(gotoX,gotoY);
	return false;
};


function Lightbox(options){
	var newdiv = document.createElement('div' );
			
	newdiv.setAttribute('id', 'lightboxbk' );
	
	lightboxHtml = '<img class="lbshadow" src="static/shadow.png"/><div id="lightboxlight"><span class="lightboxTitle">'+options.title+'</span>';
	
	//add the close x 
	if (options.close){
		lightboxHtml += '<div class="menuButton btnX" id="closeLB" onclick="new FadeOut(\'lightboxbk\',20);"></div>';
	};
	
	//add initial content 
	if(!options.content){
		options.content = 'Loading...';
		var lbCon = new XHConn();
		lbCon.connect(options.url, "POST", '', receiveLbPost);
	};
	
	lightboxHtml += '<div id="lightboxcontent"" class="noDrag">'+options.content+'</div>';
	lightboxHtml += '</div>';
	
	newdiv.innerHTML = lightboxHtml;
	
	$('body').appendChild(newdiv);
	
	//set the size of the lightbox content to match the container
	containerHeight = $('lightboxlight').offsetHeight;
	$('lightboxcontent').style.height = containerHeight-25 + "px";
	
	if (mySize.pngs < 1){
		//ie6 png fix
	};
	
	//make the contents undraggable :p
	new unDragElements('lightboxlight' );
	
};



//fades an element out and removes it
function FadeOut(element,speed){
	
	var opacity = 100;
	
	//see if element was passed in as object, if not, objectify
	if ($(element)){
		var element = $(element);
	} else {
		var element = element;
	};
	
	if (!speed){
		speed = 2;
	};
	
	var animate;//this will hold the setInterval
	
	function doFadeOut(){
		if (opacity > 0){
			opacity -= speed;
			element.style.opacity = (opacity/100);
			element.style.filter = "alpha(opacity='"+opacity+"')";//IE SUCKS
		} else {
			try{
				element.parentNode.removeChild(element);
				endFade();
			} catch (e){
				//
			};
		};
		
	};
	
	function endFade(){
		clearInterval(animate);
	};
	
	function startFade(){
		
		animate = setInterval(doFadeOut, 1);
	};
	
	startFade();//do it!
};