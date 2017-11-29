$j(document).ready(function () {
	//add js to reset password
	$j('a#loginHelp').click(function () {
		$j('#loginForgot').slideToggle();
		return false;
	});

	$j('form#loginForgot').submit(function () {

		query = prepArrayForAjax(getFormVars('loginForgot'));

		$j.ajax({
			url: this.action,
			success: showForgotResponse,
			type: 'POST',
			data: query
		});
		return false;
	});

	//js helper in sign up
	$j('form#signup input').each(function () {
		$j(this).focus(function () {
			$j(this).parent().next('p.loginHelperText').slideDown();
		});

		$j(this).blur(function () {
			$j(this).parent().next('p.loginHelperText').slideUp();
		});

	});

	//js to login form
	$j('form#loginForm').submit(function () {
		sendLogin();
		return false;
	});

	//js to signup form
	$j('form#signup').submit(function () {
		signUp();
		return false;
	});

	//cancel clicks on menu buttons
	$j('div.menuHead a').click(function () {
		return false;
	});



	//load control panel
	activateCpanel();

});

//add js to control panel
function activateCpanel() {
	//primary items
	$j('ul#controlPanel > li > a').click(function () {

		pri = $j(this);

		action = pri.attr('action');
		eval(action);

		sub = pri.attr('to');

		if (sub) {
			//handle primary selected items
			$j('div#control1 ul li a').removeClass('selected');
			pri.addClass('selected');

			$j('div#control2 ul.submenu').css({ display: 'none' });

			$j('#' + sub).css({ display: 'block' });

			//secondary items
			$j('div#control2 > ul > li > a').unbind();

			$j('div#control2 > ul > li > a').click(function () {

				link = $j(this);

				action = link.attr('action');
				eval(action);

				//handle selection
				$j('div#control2 ul li a').removeClass('selected');
				link.addClass('selected');

				return false;
			});
		};

		return false;
	});
};

//show response from reset password
function showForgotResponse(json) {
	eval('response=' + json);

	if (response.message) {
		$j('#resetMessage').html(response.message).slideDown();
	};

	if (response.success == true) {
		$j('#loginForgot').slideUp();
	};
};

//image preloader
if (document.images) {

	image_url = new Array();
	image_url[0] = "static/wordBalloon.png";
	image_url[1] = "static/loading.gif";
	image_url[2] = "static/ajax-loader.gif";

	var i = 0;
	for (i = 0; i < image_url.length; i++) {
		eval('preload_image_object' + i + ' = new Image()');
		eval('preload_image_object' + i + '.src = image_url[i]');
	};
};

init = false; //set to true once screen has loaded

//screen information
var mySize = {
	height: 0, //height of screen
	width: 0, //width of screen
	cpanelx: -10, //x loc of left side of cpanel
	cpanely: -5, // y loc of top of cpanel
	numCols: 0, // number of columns to draw at once
	numRows: 0, // number of rows to draw at once
	myX: 2280960, //x loc of screen // 2280960
	myY: 2280960, //y loc of screen
	offsetLeft: 0,
	oneFoot: 864, //pixel width of one foot
	totalWidth: 0, //pixel width of all feet drawn
	totalHeight: 0, //pixel height of all feet drawn
	travelling: 0, //value represtenting automatic travel status, 0 = not moving. 1 - moving automatic (goToLoc). 2 - dragging square mile
	hash: "", // the hash (#) keeps track of location
	hashtrack: 1, //0 for safari 2
	intervaltime: 300, //amount of milliseconds to check the hash
	scale: 36, //ppi
	mag: 1 //to show multiple feet inside 1 div
};

//variables for pic we are adding to the mile
var addPic = {
	width: 0, //width in inches 
	height: 0, //height in inches 
	source: "",
	inchX: 0, //inches from top left, (0,0)
	inchY: 0, //
	typeId: "",
	animate: "", // holds a motionpack object,
	move: {
		x: 0,
		y: 0,
		id: 0
	} //the element if we are moving an image already on the mile
};

//keeps track of which element is selected
var selectedElement = {
	toSelect: null, //to select once traveling is done , by id
	isSelected: null //currently selected
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


if (!isNaN(regx) && !isNaN(regy)) {
	mySize.myX = regx;
	mySize.myY = regy;

	if (regs) {
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

//this keeps track of the object that is being dragged
var dragging = {
	object: '', //id of object
	opacity: 100 //transparency
};

var dragPlane = false;

// called once to initialize variables

if (document.domain == "localhost") {
	var debugOn = 1;
} else {
	var debugOn = 0;
};

var gotoX = 0;
var gotoY = 0;
var travelX = 0;
var travelY = 0;
var counter = 0;
var alive;

function startTracking() {
	alive = setInterval('keepAlive()', 60000);
};

//persistant session and tracking
function keepAlive() {

	$j.ajax({
		data: {
			x: mySize.myX,
			y: mySize.myY
		},
		success: confirmAlive,
		type: 'POST',
		url: '/profile/keepalive',
	});
};


//called on recieving keepAlive script
function confirmAlive(json) {

	eval("response = " + json);

	//not logged in anymore
	if (response.success != true) {
		clearInterval(alive);
	};
};

//keep track if we are moving or not
var travelling = false;

var newdiv = false;

var success = false;

var relativestartX = 0;
var relativestartY = 0;
var relativeendX = 0;
var relativeendY = 0;

//set up other elements for global access 
var intInterval = null; //?wut

//determining amount of square feet on screen at once

var squareX = 0;
var squareY = 0;

var scrollbarLeft = 0;
var scrollbarTop = 0;

var rebuild = false;

var rebuildId = "nothing";

var loadFile = "nothing";

//done setting up width and height

//set up window dimensions / properties
function setScreenClass() {

	if (window.innerWidth) {
		// good browsers
		mySize.width = window.innerWidth;
		mySize.height = window.innerHeight;
	} else if (document.body.offsetWidth) {
		// IE
		mySize.width = document.body.offsetWidth;
		mySize.height = document.body.offsetHeight;
	};

	$j('#squaremile').css({
		width: mySize.width + "px",
		height: mySize.height + "px",
		top: '0px',
		left: '0px'
	});

	// if the lightbox is showing, then resize the content
	sizeLB();

	// set cpanel location
	$j('#cpanel').css({
		left: mySize.cpanelx + "px",
		top: mySize.cpanely + "px"
	});

	// figure out how many rows and cols to draw at once 
	mySize.oneFoot = (mySize.scale * 12);

	// see if we need to remove any foot divs
	if (mySize.numCols) {
		mySize.oldCols = mySize.numCols;
		mySize.oldRows = mySize.numRows;
	};

	mySize.numCols = Math.ceil(mySize.width / (mySize.oneFoot * mySize.mag)) + 3; // number of columns to draw at once
	mySize.numRows = Math.ceil(mySize.height / (mySize.oneFoot * mySize.mag)) + 3; // number of rows to draw at once

	mySize.numCols += (mySize.numCols % 2);
	mySize.numRows += (mySize.numRows % 2);

	mySize.totalWidth = mySize.numCols * mySize.oneFoot * mySize.mag;
	mySize.totalHeight = mySize.numRows * mySize.oneFoot * mySize.mag;

	buildScreen();
};

window.onload = setScreenClass;
window.onresize = setScreenClass;



function checkHash() {
	if ((window.location.hash != mySize.hash) && mySize.travelling == 0) {

		mySize.hash = window.location.hash;

		var regx = '';
		var regy = '';
		var regselect = '';

		regx += mySize.hash.match(/x=*\d*/);
		regy += mySize.hash.match(/y=*\d*/);
		regselect += mySize.hash.match(/select=*\d*/);



		regx = regx.substr(2);
		regy = regy.substr(2);
		regselect = regselect.substr(7);

		if (!isNaN(regx) && !isNaN(regy)) {
			goToLoc({
				x: regx,
				y: regy,
				id: regselect
			});
		};
	};
};

//from above
var checkInterval = setInterval(checkHash, mySize.intervaltime);

//turn an array of values into a post string for ajax
function prepArrayForAjax(array) {
	output = "";
	for (i in array) {
		output += i + "=" + array[i] + "&";
	}
	return output;
};

function keyAction(e) {

	key = e.which;

	switch (key) {
		case 27:
			//escape key
			//close lightbox?
			if ($j('#closeLB')) {
				$j('#lightboxbk').fadeOut('normal', function () {
					$j('#lightboxbk').remove();
				});
			};
			break;
	};
};

//log in from the mile control panel
function sendLogin() {
	//get loginform parms 
	var params = prepForQuery(getFormVars('loginForm'));

	$j.ajax({
		url: '/profile/login',
		type: 'post',
		data: params,
		success: receiveLogin
	});
};

//called on receiving login result
function receiveLogin(json) {

	eval('result = ' + json);

	if (result.success == true) {
		//successful login

		//hide elements
		$j('#loginMessage').css({ display: 'none' });
		$j('#loginMessage').html('');
		$j('#m5').slideUp();

		$j('div#control1').html(result.panelLeft);
		$j('div#control2').html(result.panelRight);

		activateCpanel();

		closeCpanel(6);

		//set up the tracking interval and do it once immediately
		startTracking();

	} else {
		//unsuccessful login
		$j('#loginMessage').html(result.message).css({ display: 'block' });

		$j('input#password').val('');

		$j('#m5').slideDown();
	};

	delete result;
};

//bye bye
function doLogout() {
	$j('#loginMessage').html('Logging out..');

	closeCpanel(2);

	$j.ajax({
		url: '/profile/logout',
		type: 'POST',
		success: receiveLogout
	});
};

//called upon receiving logout php
function receiveLogout(json) {
	eval('result=' + json);

	$j('div#control1').html(result.panelLeft);
	$j('div#control2').html(result.panelRight);

	clearInterval(alive);
	activateCpanel();

	delete result;
};

//listen for double clicks
$j('#squaremile').dblclick(findTarget);

//listen for key press
$j(document).keydown(keyAction);


posMap();
startTracking();



//figure out zoom after dragging mag
function findScale() {
	mags = $j('#mags');

	left = parseInt(mags.css('left')) - (parseInt(mags.css('left')) % 9);
	mags.css({ left: left + "px" });

	left = (126 - left);
	zoomX = 72 / (Math.pow(2, ((left) / 9)));
	zoom(zoomX);
};

//make the map marker draggable
$j('#marker').draggable({
	drag: moveTarget,
	containment: $j('#map'),
	stop: moveTargetDone
});

//we are moving the target, position the mile
function moveTarget() {
	x = parseInt($j(this).css('left'));
	y = parseInt($j(this).css('top'));
	mySize.travelling = 3;
	posMile(x, y);
};

function moveTargetDone() {
	mySize.travelling = 0;
	endMile();
	setBrowserHash();
	moveScreen();
	makeMapCall();
};

//make the cpanel draggable

$j('#cpanel').draggable({
	stop: getCpanelLoc,
	containment: $j('#squaremile'),
	cursor: 'move'
});

//make the mag glass draggable
$j('#mags').draggable({
	axis: 'x',
	containment: $j('#zoomscale'),
	stop: findScale
});

function startMile(e, ui) {
	relativestartX = mySize.myX;
	relativestartY = mySize.myY;

	mySize.travelling = 2;
};

function endMile() {

	mySize.travelling = 0;
	setBrowserHash();

	$j('div.footBlock').each(function () {
		foot = $j(this);
		if (foot.attr('forcereload') == 1) {

			milex = foot.attr('milex');
			miley = foot.attr('miley');

			if (milex > 0 && miley > 0 && milex < 5281 && miley < 5281) {
				inbounds = true;

				foot.css({
					backgroundImage: 'none',
					backgroundColor: 'transparent'
				});

			} else {

				inbounds = false;

				foot.css({
					backgroundImage: 'none',
					backgroundColor: '#D16A38'
				});
			}


			if (mySize.scale > 9 && inbounds) {
				//load the content in one by one

				if ((typeof (loadArray[milex]) != 'object')) {
					loadArray[milex] = new Array;
				};

				loadArray[milex].push(miley);

			} else if (mySize.scale < 18 && inbounds) {
				//scale is less then 18. load a rendered image.
				foot.html('');

				foot.css({
					backgroundImage: 'url(static/loading_216.png)',
					backgroundColor: '#fff'
				});

				loadImage(milex + "" + miley, 'image/mileX/' + milex + '/mileY/' + miley + '/scale/' + (72 / mySize.scale) + "\/mag\/" + mySize.mag);
			};

			//reset the mile info
			foot.attr({
				forcereload: 0
			});
		};
	});

	if (loadArray.length > 0 && mySize.scale > 9) {
		makeMapCall();
		delete loadArray;
		loadArray = new Array();
	};
};

$j('#squaremile').draggable({
	start: startMile,
	drag: moveMile,
	stop: endMile
});

function moveMile(e, ui) {
	d = (72 / mySize.scale) * 2;

	mySize.myX = (relativestartX - (ui.position.left * d));
	mySize.myY = (relativestartY - (ui.position.top * d));

	ui.position.top = 0;
	ui.position.left = 0;

	moveScreen();
};

function getCpanelLoc() {
	x = parseInt($j(this).css('left'));
	y = parseInt($j(this).css('top'));

	mySize.cpanelx = x;
	mySize.cpanely = y;
};
