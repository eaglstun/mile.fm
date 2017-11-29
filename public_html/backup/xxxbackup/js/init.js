//image preloader
if (document.images){

	preload_image_object = new Image();
	
	image_url = new Array();
	image_url[0] = "static/wordBalloon.png";
	image_url[1] = "static/loading.gif";
	image_url[2] = "static/ajax-loader.gif";
	
	var i = 0;
	for(i=0; i<image_url.length; i++){
		preload_image_object.src = image_url[i];
	};
};

//screen information
var mySize ={
	height:0, //height of screen
	width:0, //width of screen
	cpanelx:-10, //x loc of left side of cpanel
	cpanely:-5, // y loc of top of cpanel
	numCols: 0, // number of columns to draw at once
    numRows: 0, // number of rows to draw at once
    myX: 2280960, //x loc of screen // 2280960
    myY: 2280960, //y loc of screen
    offsetLeft: 0,
    oneFoot: 864, //pixel width of one foot
    totalWidth: 0, //pixel width of all feet drawn
    totalHeight: 0 , //pixel height of all feet drawn
    travelling: 0, //value represtenting automatic travel status, 0 = not moving. 1 - moving automatic (goToLoc). 2 - dragging square mile
	hash:"", // the hash (#) keeps track of location
	hashtrack:1, //0 for safari 2
	intervaltime : 300, //amount of milliseconds to check the hash
    scale: 72, //ppi
    mag: 1 //to show multiple feet inside 1 div
};

//variables for pic we are adding to the mile
var addPic = {
	width : 0, //width in inches 
	height : 0, //height in inches 
	source : "",
	inchX: 0, //inches from top left, (0,0)
	inchY: 0, //
	typeId : "",
	animate : "", // holds a motionpack object,
	move: {x:0,
		   y:0,
		   id: 0} //the element if we are moving an image already on the mile
};

//keeps track of which element is selected
var selectedElement = {
	toSelect : null, //to select once traveling is done , by id
	isSelected : null //currently selected
};

//safari < 3 does not get hash tracking!
/*
if (BrowserDetect.browser == 'Safari' && BrowserDetect.version < 500){
	mySize.hashtrack = 0;
} else {
	//see if hash has changed
	var checkInterval = setInterval(checkHash, mySize.intervaltime);
};
*/

var loadPics = new Array();
var loadArray = new Array();

var regx = '';
var regy = '';
var regs = '';
var hash = window.location.hash;

regx += hash.match(/x=*\d*/);
regy += hash.match(/y=*\d*/);
regs += hash.match(/s=*\d*/);

regx = parseInt(regx.substr(2));
regy = parseInt(regy.substr(2));
regs = parseInt(regs.replace('s=', ''));

if (!isNaN(regx) && !isNaN(regy)){
	mySize.myX = regx;
	mySize.myY = regy;
	
	if(regs){
		zoom(regs);
	};
};

//control panel functions
var cpanelControls = {
	navs: Array(),
	content: Array(),
	friends: Array(),
	prefs: Array(),
	help: Array()
};

function resetcPanel(){
	for (x in cpanelControls){
		cpanelControls[x].length = 0;
	};
	
	$('control2').innerHTML = "";
};



//this keeps track of the object that is being dragged
var dragging = {
	object:'', //id of object
	opacity: 100 //transparency
};

// called once to initialize variables

if (document.domain=="localhost" ){
	var debugOn = 1;
} else {
	var debugOn = 0;
};

var gotoX=0;
var gotoY=0;

var travelX=0;
var travelY=0;

var counter=0;

var alive = "";

function startTracking(){
	alive = setInterval('keepAlive()',60000);
	//keepAlive();
};

//persistant session and tracking
function keepAlive(){
	var persistant = new XHConn();
	persistant.connect("user/keepalive", "POST", "x="+mySize.myX+"&y="+mySize.myY, confirmAlive);
};


//called on recieving keepAlive script
function confirmAlive(XML){
	xml = XML.responseText;
	eval("response = " + xml);
	//error handling - we are expecting either response.success = insert ot update, or response.success
	if (response.success == false){
		clearInterval (alive);
	};
};

//keep track if we are moving or not
var travelling=false;

var newdiv=false;

var success=false;

var relativestartX = 0;
var relativestartY = 0;
var relativeendX = 0;
var relativeendY = 0;

//set up other elements for global access
var intInterval = null;
var imPing = new Array;

//determining amount of square feet on screen at once
var ni = $('squaremile' );

var squareX=0;
var squareY=0;
var dragPlane=false;
var scrollbarLeft=0;
var scrollbarTop=0;

var rebuild=false;

var rebuildId="nothing";

var loadFile="nothing";

//done setting up width and height


//shrink debug or grow
function toggleDebug(){
	if (debugOn){
		debugOn = 0;
		new Shrink('debugon', 0, 10);
	} else {
		debugOn = 1;
		new sizeItem('debugon', 0);
	};
};





//set up window dimensions / properties
function setScreenClass(){
	
	if (window.innerWidth) {
		// good browsers
		mySize.width = window.innerWidth;
		mySize.height = window.innerHeight;
	} else if (document.body.offsetWidth){
		// IE
		mySize.width = document.body.offsetWidth;
		mySize.height = document.body.offsetHeight;
	}
	
	$('squaremile').style.width=mySize.width+"px";
	$('squaremile').style.height=mySize.height+"px";
	
	$('squaremile').style.top="0px";
	$('squaremile').style.left="0px";
	
	// if the lightbox is showing, then resize the content
	if($('lightboxcontent')){
		containerHeight = $('lightboxlight').offsetHeight;
		$('lightboxcontent').style.height = containerHeight-25 + "px";
	}
	
	// set cpanel location
	$('cpanel').style.left=mySize.cpanelx+"px";
	$('cpanel').style.top=mySize.cpanely+"px";
	
	// figure out how many rows and cols to draw at once 
	mySize.oneFoot = (mySize.scale * 12);
	
	// see if we need to remove any foot divs
	if(mySize.numCols){
		mySize.oldCols = mySize.numCols;
		mySize.oldRows = mySize.numRows;
	};
	
	mySize.numCols = Math.ceil(mySize.width / (mySize.oneFoot * mySize.mag) ) + 3; // number of columns to draw at once
    mySize.numRows = Math.ceil(mySize.height / (mySize.oneFoot * mySize.mag) ) + 3; // number of rows to draw at once
	
	mySize.numCols += (mySize.numCols % 2);
	mySize.numRows += (mySize.numRows % 2);
	
	mySize.totalWidth = mySize.numCols * mySize.oneFoot * mySize.mag;
	mySize.totalHeight = mySize.numRows * mySize.oneFoot * mySize.mag;
	
	buildScreen();
};



document.onmousedown = getMouseDown;
document.onmouseup = getMouseUp;

window.onload = setScreenClass; 
window.onresize = setScreenClass;

new Drag('cpanel' );
new Drag('squaremile' );
new Drag('marker' );





function checkHash(){
	if ((window.location.hash != mySize.hash) && mySize.travelling == 0){

		mySize.hash = window.location.hash;

		var regx = '';
		var regy = '';
		var regselect = '';
		
		regx += mySize.hash.match(/x=*\d*/);
		regy += mySize.hash.match(/y=*\d*/);
		regselect += mySize.hash.match(/select=*\d*/);
		
		regx=regx.substr(2);
		regy=regy.substr(2);
		regselect = regselect.substr(7);
		
		if (!isNaN(regx) && !isNaN(regy)){
			goToLoc(regx,regy,regselect);
		};
	};	
};



//from above
var checkInterval = setInterval(checkHash, mySize.intervaltime);

//turn an array of values into a post string for ajax
function prepArrayForAjax( array ) {
	output = "";
    for (i in array){
    	output += i +"="+array[i]+"&";
    }
    return output;
};

function keyAction(e){
	//console.log('key: '+e.which);
	key = e.which;
	
	switch(key){
		case 27:
			//escape key
			//close lightbox?
			if($('closeLB')){
				new FadeOut('lightboxbk',20);
			};
			break;
	};
};

//log in from the mile control panel
function sendLogin(){
	//get loginform parms 
	var params = prepForQuery(getFormVars('loginForm'));
	
	var logIn = new XHConn();
	logIn.connect("user/login", "POST", params, receiveLogin);
	
};


//fix for mouse out of window (dragging bug)
addListener($('body'), 'mouseout', function(event){
			//debugArray(event.relatedTarget);
			if(event.fromElement && !event.toElement){
				//internet explorer
				getMouseUp(event);
			} else if (!event.fromElement && !event.relatedTarget){
				//better? who knows
				getMouseUp(event);
			}
			return false;
		},true);
		
//listen for double clicks
addListener($('squaremile'), 'dblclick', findTarget, false);

//listen for key press
addListener(document, 'keydown', keyAction, false);

loadCpanel();
posMap();
startTracking();

new Drag('mags' );