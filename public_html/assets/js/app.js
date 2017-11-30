(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./globals');
console.log('mySize', mySize);

var init = require('./init');
var mile = require('./mile');
var cpanel = require('./cpanel');
var core = require('./core');

},{"./core":2,"./cpanel":3,"./globals":4,"./init":5,"./mile":6}],2:[function(require,module,exports){
'use strict';

function serial(arr) {
    x = JSON.stringify(arr);
    return x;
};

//set the title in a cpanel menu
function setTitle(obj, title) {
    $j('#' + obj + ' .cTitle').html(title);
};

function plural(number, name) {
    if (number != 1) {
        return number + " " + name + "s";
    } else {
        return number + " " + name;
    };
};

//toggle vis of nav buttons a cpanl menu
function setNav(obj, state) {

    nav = $j('#' + obj + ' .menuNav');

    if (state == 'off') {
        nav.css({ visibility: 'hidden' });
        nav.children().each(function () {
            $j(this).css({ display: 'none' });
        });
    } else {
        nav.css({ visibility: 'visible' });
        nav.children().each(function () {
            $j(this).css({ display: 'inline' });
        });
    };
};

//trim() function
String.prototype.trim = function () {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
};

function hex_md5(s) {
    return binl2hex(core_md5(str2binl(s), s.length * chrsz));
};

function b64_md5(s) {
    return binl2b64(core_md5(str2binl(s), s.length * chrsz));
};

function str_md5(s) {
    return binl2str(core_md5(str2binl(s), s.length * chrsz));
};

function hex_hmac_md5(key, data) {
    return binl2hex(core_hmac_md5(key, data));
};

function b64_hmac_md5(key, data) {
    return binl2b64(core_hmac_md5(key, data));
};

function str_hmac_md5(key, data) {
    return binl2str(core_hmac_md5(key, data));
};

//Calculate the HMAC-MD5, of a key and some data

function core_hmac_md5(key, data) {
    var bkey = str2binl(key);
    if (bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

    var ipad = Array(16),
        opad = Array(16);
    for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    };

    var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
    return core_md5(opad.concat(hash), 512 + 128);
};

//gets all the inputs of a form and sends back an array 
function getFormVars(name) {
    form = document[name];
    output = {};
    for (i = 0; i < form.elements.length; i++) {
        //if the form element doesnt have a name, dont use it
        if (form[i].name) {
            //md5 all passwords
            if (form[i].type == "password") {
                x = hex_md5(form[i].value);
            } else if (form[i].type == "checkbox") {
                x = form[i].checked;
            } else {
                x = form[i].value.trim();
            };

            //alert(x);

            output[form[i].name] = x;
        };
    };

    return output;
};

//concats all values in an array for easy GET or POST query
function prepForQuery(array) {
    sendback = [];

    for (i in array) {
        sendback.push(i + "=" + array[i]);
    };

    return sendback.join("&");
};

//return true if valid email
function emailValidate(str) {
    var at = "@";var dot = ".";var lat = str.indexOf(at);var lstr = str.length;var ldot = str.indexOf(dot);var valid = 1;if (str.indexOf(at) == -1) {
        valid = 0;
    };if (str.indexOf(at) == -1 || str.indexOf(at) == 0 || str.indexOf(at) == lstr) {
        valid = 0;
    };if (str.indexOf(dot) == -1 || str.indexOf(dot) == 0 || str.indexOf(dot) == lstr) {
        valid = 0;
    };if (str.indexOf(at, lat + 1) != -1) {
        valid = 0;
    };if (str.substring(lat - 1, lat) == dot || str.substring(lat + 1, lat + 2) == dot) {
        valid = 0;
    };if (str.indexOf(dot, lat + 2) == -1) {
        valid = 0;
    };if (str.indexOf(" ") != -1) {
        valid = 0;
    };return valid;
};

var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode      */

//Add integers, wrapping at 2^32. 
//This uses 16-bit operations internally to work around bugs in some JS interpreters.
function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);var msw = (x >> 16) + (y >> 16) + (lsw >> 16);return msw << 16 | lsw & 0xFFFF;
};

//Calculate the MD5 of an array of little-endian words, and a bit length
function core_md5(x, len) {
    x[len >> 5] |= 0x80 << len % 32;
    x[(len + 64 >>> 9 << 4) + 14] = len;
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
        d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
        d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
        d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
    };
    return Array(a, b, c, d);
};

//These functions implement the four basic operations the algorithm uses.
function md5_cmn(q, a, b, x, s, t) {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
};

function md5_ff(a, b, c, d, x, s, t) {
    return md5_cmn(b & c | ~b & d, a, b, x, s, t);
};

function md5_gg(a, b, c, d, x, s, t) {
    return md5_cmn(b & d | c & ~d, a, b, x, s, t);
};

function md5_hh(a, b, c, d, x, s, t) {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
};

function md5_ii(a, b, c, d, x, s, t) {
    return md5_cmn(c ^ (b | ~d), a, b, x, s, t);
};

//Bitwise rotate a 32-bit number to the left.
function bit_rol(num, cnt) {
    return num << cnt | num >>> 32 - cnt;
};

//Convert a string to an array of little-endian words
//If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
function str2binl(str) {
    var bin = Array();var mask = (1 << chrsz) - 1;for (var i = 0; i < str.length * chrsz; i += chrsz) {
        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << i % 32;
    };return bin;
};

//Convert an array of little-endian words to a string
function binl2str(bin) {
    var str = "";var mask = (1 << chrsz) - 1;for (var i = 0; i < bin.length * 32; i += chrsz) {
        str += String.fromCharCode(bin[i >> 5] >>> i % 32 & mask);
    };return str;
};

//Convert an array of little-endian words to a hex string.
function binl2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";var str = "";for (var i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 + 4 & 0xF) + hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 & 0xF);
    };return str;
};

//Convert an array of little-endian words to a base-64 string
function binl2b64(binarray) {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i += 3) {
        var triplet = (binarray[i >> 2] >> 8 * (i % 4) & 0xFF) << 16 | (binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4) & 0xFF) << 8 | binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4) & 0xFF;
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;else str += tab.charAt(triplet >> 6 * (3 - j) & 0x3F);
        }
    };
    return str;
};

},{}],3:[function(require,module,exports){
'use strict';

//generic get log in text - called to hide and show divs
function menuShow(n) {
    $j('#m' + n).slideDown('fast', function () {
        $j('#m' + n + 'main').slideDown('fast');
    });

    $j('#m' + n + ' h5 div.btnMM').css({ backgroundPosition: 'center top' });
};

//a sub menu is selected 
function hliteSub(obj) {
    l = $j(obj).parent();
    p = l.parent();

    p.children().each(function () {
        $j(this).children().removeClass('selected');
    });
};

//toggles the cpanel button w the next node
function menuToggle(obj) {

    //console.log(obj);

    togglee = $j(obj.parentNode).next();
    //console.log(togglee);

    togglee.slideToggle("normal", function () {
        h = this.offsetHeight;
        if (h > 0) {
            $j(obj).css({ backgroundPosition: 'center top' });
        } else {
            $j(obj).css({ backgroundPosition: 'center bottom' });
        };
    });
};

function closeCpanel(x) {
    $j('#m' + x).slideUp();
};

//swich between panes on profile
function toggleProfile(which) {

    //show all the tabs
    $j('ul.profileEdit li').each(function () {
        $j(this).css({ display: "inline" });
    });

    //hide the selected tab
    $j('#profileLink' + which).css({ display: "none" });

    //hide all content tabs
    $j('div.profileTab').each(function () {
        $j(this).css({ display: "none" });
    });

    //show the right profile tab
    $j('#profile' + which).css({ display: "block" });
};

//send in user profile
function sendProfile() {
    query = prepForQuery(getFormVars('cp_prof'));

    $j.ajax({
        data: query,
        success: recProf,
        type: 'POST',
        url: 'profile/update'
    });
};

function recProf(json) {
    eval('response = ' + json);

    $j('#profileHTML').html(response.profile);

    toggleProfile(1);
};

//send in external info
function sendExt() {
    query = prepForQuery(getFormVars('cp_ext'));

    $j.ajax({
        url: 'profile/update-ext',
        type: 'POST',
        data: query,
        success: recExt
    });

    p = $j('#profileNewLink').get(0);
    p[p.selectedIndex].setAttribute('username', $j('#extLink').val());
};

function recExt(json) {
    eval('response = ' + json);
    $j('#userExternal').html(response.links);
};

//for changing values for exernal sites
function updateExt() {
    s = $j('#profileNewLink').get(0);

    v = s.selectedIndex;

    url = s[v].getAttribute('url');

    if (!url) {
        $j('#extLink').val('');
        $j('#xlinklabel').html('&nbsp;');
        return;
    };

    b = url.substr(0, url.indexOf('%'));
    len = url.indexOf('%', url.indexOf('%') + 1) - 2 - url.indexOf('%') + 1;

    u = url.substr(url.indexOf('%') + 1, len);
    v = s[v].getAttribute(u);

    if (v == 'null') {} else {
        $j('#extLink').val(v);
    };

    $j('#xlinklabel').html(b);
};

},{}],4:[function(require,module,exports){
(function (global){
"use strict";

//screen information

global.mySize = {
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
global.addPic = {
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
        id: 0 //the element if we are moving an image already on the mile
    } };

//keeps track of which element is selected
global.selectedElement = {
    toSelect: null, //to select once traveling is done , by id
    isSelected: null //currently selected
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

$j(document).ready(function () {

    var containerHeight = 0;

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

/**
 *  add js to control panel 
 *  @return bool
 */
function activateCpanel() {
    //primary items
    $j('ul#controlPanel > li > a').click(function () {

        var pri = $j(this);

        var action = pri.attr('action'),
            sub = pri.attr('to');

        eval(action);

        if (sub) {
            //handle primary selected items
            $j('div#control1 ul li a').removeClass('selected');
            pri.addClass('selected');

            $j('div#control2 ul.submenu').css({ display: 'none' });

            $j('#' + sub).css({ display: 'block' });

            //secondary items
            $j('div#control2 > ul > li > a').unbind();

            $j('div#control2 > ul > li > a').click(function () {
                var $link = $j(this);

                var action = $link.attr('action');

                eval(action);

                //handle selection
                $j('div#control2 ul li a').removeClass('selected');
                $link.addClass('selected');

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

var init = false; //set to true once screen has loaded

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
        url: '/profile/keepalive'
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
var scale;
var squareX = 0;
var squareY = 0;

var scrollbarLeft = 0;
var scrollbarTop = 0;

var rebuild = false;

var rebuildId = "nothing";

var loadFile = "nothing";

//done setting up width and height

/**
 * 
 */
function sizeLB() {
    var containerHeight = $j('#lightboxlight').height();

    $j('#lightboxcontent').css({
        height: containerHeight - 25 + "px"
    });
};

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
    mySize.oneFoot = mySize.scale * 12;

    // see if we need to remove any foot divs
    if (mySize.numCols) {
        mySize.oldCols = mySize.numCols;
        mySize.oldRows = mySize.numRows;
    };

    mySize.numCols = Math.ceil(mySize.width / (mySize.oneFoot * mySize.mag)) + 3; // number of columns to draw at once
    mySize.numRows = Math.ceil(mySize.height / (mySize.oneFoot * mySize.mag)) + 3; // number of rows to draw at once

    mySize.numCols += mySize.numCols % 2;
    mySize.numRows += mySize.numRows % 2;

    mySize.totalWidth = mySize.numCols * mySize.oneFoot * mySize.mag;
    mySize.totalHeight = mySize.numRows * mySize.oneFoot * mySize.mag;

    buildScreen();
};

window.onload = setScreenClass;
window.onresize = setScreenClass;

function checkHash() {
    if (window.location.hash != mySize.hash && mySize.travelling == 0) {

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

function findTarget(e) {

    try {
        //teh fahx
        t = e.target.id;
    } catch (err) {
        //teh sucx
        t = e.srcElement.id;
    };

    if (t.match(/pic/)) {
        doSelect(t);
    };
};

//called upon receiving logout php
function receiveLogout(json) {
    eval('result=' + json);

    $j('div#control1').html(result.panelLeft);
    $j('div#control2').html(result.panelRight);

    clearInterval(alive);
    activateCpanel();
};

//listen for double clicks
$j('#squaremile').dblclick(findTarget);

//listen for key press
$j(document).keydown(keyAction);

//posMap positions the cursor to the appropriate location on the map
function posMap() {
    scale = mySize.scale / 72;

    $j('#marker').css({ left: mySize.myX / 24000 + "px" });
    $j('#marker').css({ top: mySize.myY / 24000 + "px" });
};

posMap();
startTracking();

//figure out zoom after dragging mag
function findScale() {
    mags = $j('#mags');

    left = parseInt(mags.css('left')) - parseInt(mags.css('left')) % 9;
    mags.css({ left: left + "px" });

    left = 126 - left;
    zoomX = 72 / Math.pow(2, left / 9);
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

                if (_typeof(loadArray[milex]) != 'object') {
                    loadArray[milex] = new Array();
                };

                loadArray[milex].push(miley);
            } else if (mySize.scale < 18 && inbounds) {
                //scale is less then 18. load a rendered image.
                foot.html('');

                foot.css({
                    backgroundImage: 'url(static/loading_216.png)',
                    backgroundColor: '#fff'
                });

                loadImage(milex + "" + miley, 'image/mileX/' + milex + '/mileY/' + miley + '/scale/' + 72 / mySize.scale + "\/mag\/" + mySize.mag);
            };

            //reset the mile info
            foot.attr({
                forcereload: 0
            });
        };
    });

    if (loadArray.length > 0 && mySize.scale > 9) {
        makeMapCall();

        loadArray = new Array();
    };
};

$j('#squaremile').draggable({
    start: startMile,
    drag: moveMile,
    stop: endMile
});

function moveMile(e, ui) {
    d = 72 / mySize.scale * 2;

    mySize.myX = relativestartX - ui.position.left * d;
    mySize.myY = relativestartY - ui.position.top * d;

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

},{}],6:[function(require,module,exports){
'use strict';

/*
 *
 */
function zoom(num) {

    if (num == 'in') {
        num = mySize.scale * 2;
    } else if (num == 'out') {
        num = mySize.scale / 2;
    };

    if (num > 72) {
        num = 72;
    } else if (num < .0087) {
        num = .0087890625;
    };

    if (num == mySize.scale) {
        return;
    };

    if (m = $j('#mags')) {

        s = 72 / num;
        n = Math.log(s) / Math.log(2);

        left = 126 - n * 9;

        m.css({ left: left + "px" });
    };

    //get the css style sheet 
    if (document.styleSheets[0].cssRules) {
        //correct
        footBlock = document.styleSheets[0].cssRules[0].style;
    } else if (document.styleSheets[0].rules) {
        //ie
        footBlock = document.styleSheets[0].rules[0].style;
    } else {
        //who knows
        return false;
    };

    if (num < 18) {
        mySize.mag = 18 / num;
    } else {
        mySize.mag = 1;
    };

    mySize.scale = num;

    width = num * 12 * mySize.mag + "px";
    footBlock.height = width;
    footBlock.width = width;

    for (var x = 0; x < mySize.numCols; x++) {
        for (var y = 0; y < mySize.numRows; y++) {

            if ($j("#c" + x + "r" + y)) {

                $j("#c" + x + "r" + y).attr('forcereload', 1).html('');
            };
        };
    };

    //need to reverse the equation, to set the mag x based on the zoom facotr
    leftX = 1 / num * 72;

    setScreenClass();
};

//initialize feet divs
function buildScreen() {

    //get rid of any divs due to scale or screen size 
    if (mySize.oldCols > mySize.numCols) {
        for (var x = mySize.oldCols; x >= mySize.numCols; x--) {
            for (var y = mySize.oldRows; y >= 0; y--) {

                if (x >= mySize.numCols || y >= mySize.numRows) {
                    $j("#c" + x + "r" + y).remove();
                };
            };
        };
    };

    if (mySize.oldRows > mySize.numRows) {
        for (var y = mySize.oldRows; y >= mySize.numRows; y--) {
            for (var x = mySize.oldCols; x >= 0; x--) {
                $j("#c" + x + "r" + y).remove();
            };
        };
    };

    for (var x = 0; x < mySize.numCols; x++) {
        for (var y = 0; y < mySize.numRows; y++) {

            if ($j("#c" + x + "r" + y).length == 0) {

                var newdiv = document.createElement('div');

                newdiv.setAttribute('id', "c" + x + "r" + y);
                newdiv.className = "footBlock";

                $j('#squaremile').append(newdiv);

                $j("#c" + x + "r" + y).attr('forcereload', 1);
            };
        };
    };

    moveScreen();

    endMile();
};

//delay loading image into mile div
function loadImage(cls, image) {
    x = "doLoad('" + cls + "','" + image + "')";
    setTimeout(x, 500);
};

//load a scaled image into the foot
function doLoad(cls, image) {

    var obj;

    if (obj = $j('.' + cls)) {

        pic = new Image();

        pic.onload = function () {
            obj.html('<img src="' + image + '"/>');
            obj.css({
                backgroundImage: 'none',
                backgroundColor: '#D16A38'
            });
        };

        pic.obj = obj;
        pic.src = image;
    };
};

//handles positioning the foot divs
function moveScreen() {
    scale = mySize.scale / 72;

    xdiff = Math.floor(mySize.myX / mySize.totalWidth * scale) * mySize.numCols * mySize.mag;
    xdiff = xdiff < 0 ? 0 : xdiff;

    ydiff = Math.floor(mySize.myY / mySize.totalHeight * scale) * mySize.numRows * mySize.mag;
    ydiff = ydiff < 0 ? 0 : ydiff;

    adjX = mySize.myX / scale;

    //position target on map
    posMap();

    widthDiff = (mySize.totalWidth - mySize.width) / 2;
    heightDiff = (mySize.totalHeight - mySize.height) / 2;

    var offsetLeftpx = Math.floor(mySize.myX * scale * -1 % mySize.totalWidth) + mySize.width / 2;
    var offsetToppx = Math.floor(mySize.myY * scale * -1 % mySize.totalHeight) + mySize.height / 2;
    //offset Left goes from half the screen width(720) down to this minus width of all feet drawn ~ (-2735) 

    if (mySize.myX < -1) {
        var offsetLeftpx = mySize.myX * -1 * scale + mySize.width / 2;
    };

    if (mySize.myY < -1) {
        var offsetToppx = mySize.myY * -1 * scale + mySize.height / 2;
    };

    offsetLeftpx = isNaN(offsetLeftpx) ? 0 : offsetLeftpx;
    offsetToppx = isNaN(offsetToppx) ? 0 : offsetToppx;

    $j('#offsetLeft').css({ left: offsetLeftpx + "px" });
    $j('#offsetTop').css({ top: offsetToppx + "px" });

    mySize.offsetLeft = offsetLeftpx;
    mySize.offsetTop = offsetToppx;

    //the limits of left and top value on screen before shifting
    minL = 0 - widthDiff;
    maxL = mySize.width + widthDiff / 2;

    minT = 0 - heightDiff / 2;
    maxT = mySize.height + heightDiff / 2;

    //$j('squaremile').style.backgroundPosition = offsetLeftpx+"px "+offsetToppx+"px";

    for (var x = 0; x < mySize.numCols; x++) {
        for (var y = 0; y < mySize.numRows; y++) {

            //new left is the offset + pixel feet * column we are on
            newLeft = offsetLeftpx + x * mySize.oneFoot * mySize.mag;
            newTop = offsetToppx + y * mySize.oneFoot * mySize.mag;

            //this logic takes care of moving divs from left to right, up to down, etc

            if (newLeft > maxL) {
                newLeft -= mySize.totalWidth;
            } else if (newLeft < minL) {
                newLeft += mySize.totalWidth;
            };

            if (newTop > maxT) {
                newTop -= mySize.totalHeight;
            } else if (newTop < (0 - heightDiff) * mySize.mag) {
                newTop += mySize.totalHeight;
            };
            //end that logic block

            //figure out which foot we are actually looking at	
            var mileX = (newLeft - offsetLeftpx) / (scale * 864) + 1 + xdiff;
            var mileY = (newTop - offsetToppx) / (scale * 864) + 1 + ydiff;

            var object = $j("#c" + x + "r" + y);

            object.css({
                left: newLeft + "px",
                top: newTop + "px"
            });

            //reset z index if not selected
            if (object.attr('selected') != 'true') {
                object.css({
                    //zIndex: (5280-(mileY))+(5280-(mileX))
                    zIndex: defaultZIndex(mileY, mileX)
                });
            };

            object.get(0).className = "footBlock " + mileX + "" + mileY;

            if (counter == 9 && object.html() == "") {
                object.attr({
                    forcereload: 1
                });
            };

            if (object.attr('milex') != mileX || object.attr('miley') != mileY || mySize.travelling == 99) {
                object.attr({
                    forcereload: 1,
                    milex: mileX,
                    miley: mileY
                });

                object.html('');
            };
        };
    };
};

//do the ajax call to load mile content
function makeMapCall(loc) {
    if (mySize.scale > 9) {
        var arr = loc ? loc : loadArray;

        if (arr.length > 0 || loc) {
            postArray = js_array_to_php_array(arr);
        } else {
            return;
        };

        loadFile = "array=" + escape(postArray);
        loadFile += "&scale=" + mySize.scale;

        $j.ajax({
            url: '/map/get',
            type: 'POST',
            data: loadFile,
            success: insertIntoFoot
        });
    };
};

function insertIntoFoot(json) {

    if (init == false) {
        init = true;

        $j('#squaremile').css({
            backgroundColor: '#fff'
        });
    };

    eval('result = ' + json);

    for (var i in result.feet) {

        foot = $j('.' + i);

        if (foot.get(0)) {

            content = result.feet[i];
            foot.html(content);
            loadImages(i);

            foot.css({ backgroundImage: 'none' });
        } else {};
    };

    for (var i in result.empty) {

        foot = $j('.' + i);
        if (foot) {
            foot.html('<!-- -->'); //blank will cause reload
            //foot.css({ backgroundImage:'url(static/white.jpg)' });
        };
    };

    if (selectedElement.toSelect) {
        doSelect(selectedElement.toSelect);
    };
};

//called to load images from map
function loadImages(footClass) {

    //console.log(footClass, 'footClass' ); //1143
    // all the images inside of foot
    images = $j('div.' + footClass + ' a img');

    //replace the low res version w full
    //fix this - not preloading
    images.each(function () {
        src = this.src.replace("/thumbs", "/original");
        this.src = src;
    });

    //prevent tiny earl
    foot.click(function () {
        return false;
    });
};

function js_array_to_php_array(a) {
    var a_php = "";
    var total = 0;
    for (var key in a) {
        total++;
        a_php = a_php + "s:" + String(key).length + ":\"" + String(key) + "\";s:" + String(a[key]).length + ":\"" + String(a[key]) + "\";";
    };
    a_php = "a:" + total + ":{" + a_php + "}";
    return a_php;
};

//make a shadow - elelment is on screen
function makeshadow(picID) {

    selectedElement.isSelected = picID;
    selectedElement.toSelect = null;

    //image selected
    obj = $j('#' + picID);
    obj.css({ zIndex: 50 });

    //the foot image is in
    p = obj.parents('div.footBlock');
    p.css({
        zIndex: 50000
        //backgroundColor: '#f00' 
    }).attr({ selected: 'true' });

    //create in DOM
    shadow = document.createElement('img');

    $j(shadow).attr({
        src: '/static/shadow.png',
        width: obj.width() * 1.25,
        height: obj.height() * 1.25,
        id: 'contentShadow'
    }).css({
        left: parseFloat(obj.css('left')) - (obj.width() * 1.25 - obj.width()) / 2 + 'px',
        top: parseFloat(obj.css('top')) - (obj.height() * 1.25 - obj.height()) / 2 + 'px',
        zIndex: 49
    });

    obj.after(shadow);

    //the scale as relative to 72dpi
    scale = mySize.scale / 72;
    pixelFoot = scale * 864;

    //offset left & top
    lft = (parseInt(obj.css('left')) + parseInt(obj.width()) / 2) / scale;
    tp = (parseInt(obj.css('top')) + parseInt(obj.height()) / 2) / scale;

    var goToCoords = {
        x: mySize.myX,
        y: mySize.myY,
        move: false
    };

    imgpos = obj.offset();
    imgwid = parseInt(obj.width());
    imghei = parseInt(obj.height());

    if (imgpos) {
        if (imgpos.left < 0 || imgpos.left + imgwid > mySize.width) {
            goToCoords.x = (p.attr('mileX') - 1) * 864 + lft;
            goToCoords.move = true;
        }

        if (imgpos.top < 0 || imgpos.top + imghei > mySize.height) {
            goToCoords.y = (p.attr('mileY') - 1) * 864 + tp;
            goToCoords.move = true;
        }
    };

    //fix if off bottom of screen
    offsetY = parseInt(obj.height());
    offsetX = parseInt(obj.width());

    //adjst for map overlap
    if (offsetY > mySize.height) {
        diffY = (offsetY - mySize.height) / 2;
        goToCoords['y'] += diffY;
    } else {
        diffY = 0;
    };

    fig = (mySize.width - offsetX) / 2;

    if (fig < 600) {
        diffX = 500 - fig;
        goToCoords['x'] += diffX;
    } else {
        diffX = 0;
    };

    if (goToCoords.move == true) {
        //move to prevent overlap w map
        goToLoc(goToCoords);
    } else {
        //in the right spot
    };

    //show the word balloon
    var comments = document.createElement('div');

    $j(comments).css({
        left: parseInt(obj.css('left')) + parseInt(obj.width()) - 40 * scale + "px",
        top: parseInt(obj.css('top')) + parseInt(obj.height()) - 322 + "px"
    }).attr({
        id: 'wordBalloon'
    }).html('<div id="closeBalloon" onclick="doSelect(\'' + picID + '\' );"></div><div id="balloonContent"></div>');

    p.append(comments);

    getComments(picID);

    return true;
};

function defaultZIndex(row, col) {
    return 5280 - row + (5280 - col);
};

//doubleclick on content function
function doSelect(picID) {

    selectedElement.toSelect = null;

    //something is selected? deselct it
    if (o = selectedElement.isSelected) {

        //the selected image
        $j('#' + o).css({
            zIndex: '1'
        });

        $j('#contentShadow').remove();
        $j('#wordBalloon').remove();

        //the foot the image is in
        p = $j('#' + o).parents('div.footBlock');
        p.css({
            backgroundColor: 'transparent',
            zIndex: defaultZIndex(p.attr('mileY'), p.attr('mileX'))
        });

        if (selectedElement.isSelected == picID) {
            selectedElement.isSelected = null;
            return false;
        };
    };

    selectedElement.isSelected = picID;

    if ($j('#' + picID)) {
        makeshadow(picID);
    };

    return true;
};

//automatic travelling - goes in 10 steps
//called on map double click
function goToLoc(coords) {
    //coords - array - required:
    //x: x loc in 72 dpi pixels
    //y: y loc in 72 dpi pixels

    //coords optional
    //id: element to select once travel is complete

    //cancel any existing travels
    if (intInterval) {
        intInterval = window.clearInterval(intInterval);
    };

    //select something once we get there
    if (coords['id']) {
        if (coords['id'].indexOf('pic') == -1) {
            coords['id'] = 'pic' + coords['id'];
        };
        selectedElement.toSelect = coords['id'];
    };

    mySize.travelling = 1;

    //55 is 10+9+8..etc
    travelX = Math.floor(mySize.myX - coords['x']) / 55;
    travelY = Math.floor(mySize.myY - coords['y']) / 55;

    if (!isNaN(travelX) && !isNaN(travelY)) {
        intInterval = window.setInterval("doTravel(travelX, travelY, 10)", 50);
    } else {
        //dbug('error in goToLoc' );
    };
};

// automatically postitions the map, with parameters set in goToLoc()
function doTravel(travelX, travelY, count) {

    counter++;

    mySize.myX -= travelX * counter;
    mySize.myY -= travelY * counter;

    moveScreen();

    if (counter >= count) {
        intInterval = window.clearInterval(intInterval);
        counter = 0;
        mySize.travelling = 0;

        endMile();
    };
};

//get all comments for a selected id
function getComments(div) {

    $j('#balloonContent').html('<img src="/static/ajax-loader.gif" class="balloonLoader"/>');

    id = div.replace(/pic/, '');

    $j.ajax({
        url: '/map/get-comments',
        type: 'POST',
        data: {
            id: id
        },
        success: returnComments
    });
};

function returnComments(html) {
    $j('#balloonContent').html(html);

    //activate comment submit
    $j('form#commentForm').click(function () {
        submitComment();
    });

    activeVote();
};

function showComment(id) {
    $j('div.commentSection').each(function () {
        $j(this).css({ display: 'none' });
    });

    $j('#commentSection' + id).css({ display: 'block' });

    $j('div#commentTabs div.commentTab').each(function () {
        $j(this).addClass('deSelected');
    });

    $j('#commentTab' + id).removeClass('deSelected');
};

//activate the voting block
function activeVote() {
    //attach listeners to voting block
    $j('#thDown').click(parseVote);
    $j('#thUp').click(parseVote);
};

//get a vote
function parseVote() {

    objid = this.getAttribute('for');
    val = this.getAttribute('value');

    //dont do ajax if the is current vote
    if (!$j(this).hasClass('up')) {
        vote(objid, val);
    };
};

//send a vote in
function vote(objectid, direction) {
    //direction -1= down, 1 = up

    $j('#voteBlock').html('<img src="/static/thumbs-loading.png" title="loading..."/>');

    $j.ajax({
        url: '/content/vote',
        type: 'POST',
        data: {
            objectid: objectid,
            direction: direction
        },
        success: receiveVote
    });
};

function receiveVote(json) {

    eval('result = ' + json);

    if (result.success == true) {
        $j('#voteBlock').html(result.vote);
        activeVote();
    } else {};
};

function getThumb(vote, id) {
    var voteBlock = "";

    if (vote == 1) {
        voteBlock += '<img src="/static/tup.gif" onclick="vote(' + id + ',-1)"/>';
    } else if (vote == -1) {
        voteBlock += '<img src="/static/tdown.gif" onclick="vote(' + id + ',1)"/>';
    } else {
        voteBlock += '<img src="/static/tdown.gif" onclick="vote(' + id + ',-1)"/>';
        voteBlock += '<img src="/static/tup.gif" onclick="vote(' + id + ',1)"/>';
    };

    return voteBlock;
};

//add a comment to a a section
function addComment() {
    showComment('3');
    $j('#squareComment').focus();
};

function addTag() {
    showComment('4');
    $j('#squareTag').focus();
};

//submit a comment, put into comment record
function submitComment() {

    var id = $j('#squareID').val();
    var comment = $j('#squareComment').val();

    $j('#commentBlock').html('<img src="/static/ajax-loader.gif"/>');

    $j.ajax({
        url: '/map/comment',
        type: 'POST',
        data: {
            action: 'add',
            id: id,
            comment: comment
        },
        success: returnComments
    });
};

//submit a tag, put into comment record
function submitTag() {

    var id = $j('#squareID').val();
    var tag = $j('#squareTag').val();

    showComment('2');

    $j.ajax({
        url: '/map/tag',
        type: 'POST',
        data: {
            id: id,
            tag: tag
        },
        success: returnComments
    });
};

//flag content as innaprropriate
function doFlag(id, reason) {
    $j.ajax({
        url: '/map/flag',
        type: 'POST',
        data: {
            objectid: id,
            reason: reason
        },
        success: receiveFlag
    });
};

function receiveFlag(json) {
    eval('result = ' + json);

    if (result.msg) {
        $j('#lightboxcontent').html(result.msg);
    } else {
        closeLB();
    };
};

//do this when pic is missing
function autoFlag(id) {
    $j.ajax({
        url: '/map/flag',
        type: 'POST',
        data: {
            objectid: id,
            reason: 'missing'
        },
        success: receiveFlag
    });
};

function receiveautoFlag(json) {};

//random number for goToLoc
function goToRandom() {

    coords = {
        x: Math.random() * 4561920,
        y: Math.random() * 4561920
    };

    goToLoc(coords);
};

//moves the mile when the map target is dragged
function posMile(objectX, objectY) {
    scale = mySize.scale / 72;

    mySize.myX = Math.floor(objectX * 24010.105);
    mySize.myY = Math.floor(objectY * 24010.105);

    moveScreen();
};

function getCoordinates(e) {

    //get mouse properties
    var e = new MouseEvent(e);

    //relX=(e.x-12)-myX-(mySize.width/2);
    //relY=(e.y-12)-myY-(mySize.height/2);

    //the location of the mouse relative to the top left corner
    //top left (0,0)
    //bottom right (4561919,4561919)
    relX = mySize.myX + e.clientX - mySize.width / 2;
    relY = mySize.myY + e.clientY - mySize.height / 2;

    //the inch that the mouse is in.
    //top left(1,1)
    //bottom right(63360,63360)
    squareX = Math.ceil(relX / 72);
    squareY = Math.ceil(relY / 72);

    //footX and footY refer to square foot sized areas - 1 thru 5280 
    footX = Math.ceil(squareX / 12);
    footY = Math.ceil(squareY / 12);

    //the c0r0 div type
    colType = (footX - 1) % mySize.numCols;
    rowType = (footY - 1) % mySize.numRows;

    msgText = "relX: " + relX + "\n";
    msgText += "relY: " + relY + "\n";
    msgText += "squareX: " + squareX + "\n";
    msgText += "squareY: " + squareY + "\n";
    msgText += "footX: " + footX + "\n";
    msgText += "footY: " + footY + "\n";
    msgText += "colType: " + colType + "\n";
    msgText += "rowType: " + rowType + "\n";
};

//activate the add picture, link or upload - not waiting list
function dragActivate() {
    $j('#smallAdd').draggable({
        start: activateSmallAdd,
        drag: smallAddDrag,
        stop: checkSmallAdd
    });
};

function activateSmallAdd() {

    //remove the base url
    thumbsrc = addPic.source;

    posImg = document.createElement('img');

    $j(posImg).attr({
        id: 'posImg',
        src: thumbsrc,
        width: addPic.width * mySize.scale,
        height: addPic.height * mySize.scale
    }).css({
        left: '100px',
        top: '100px'
    });

    $j('#squaremile').append(posImg);

    $j("#posImg").animate({
        opacity: .5
    });
};

function smallAddDrag(e) {
    posImg = $j('#posImg');

    picWidth = addPic.width * mySize.scale;
    picHeight = addPic.height * mySize.scale;

    smX = e.clientX - picWidth / 2;
    smY = e.clientY - picHeight / 2;

    //the actual x and y coorinates, in inches, from the top left
    mLeft = Math.floor((mySize.myX + (e.clientX - mySize.width / 2) * (72 / mySize.scale)) / 72 - addPic.width / 2);
    mTop = Math.floor((mySize.myY + (e.clientY - mySize.height / 2) * (72 / mySize.scale)) / 72 - addPic.height / 2);

    addPic.inchX = mLeft;
    addPic.inchY = mTop;

    //snap to grid / scale
    adjX = (mySize.myX * (mySize.scale / 72) + e.clientX - mySize.width / 2 - picWidth / 2) % mySize.scale;
    adjY = (mySize.myY * (mySize.scale / 72) + e.clientY - mySize.height / 2 - picHeight / 2) % mySize.scale;

    if (adjX < 0) {
        adjX += mySize.scale;
    };

    if (adjY < 0) {
        adjY += mySize.scale;
    };

    smX -= adjX;
    smY -= adjY;

    posImg.css({ left: smX + "px", top: smY + "px" });
};

//check to see if dragged picture overlaps others on mouse up
function checkSmallAdd() {

    postVars = activateCpanelPlacer();

    $j.ajax({
        data: postVars,
        success: checkOverlap,
        type: 'POST',
        url: '/mile/add/'
    });
};

//response from ajax, to see if pic was inserted or overlaps
function checkOverlap(json) {
    //not from waiting list
    eval('result = ' + json);

    if (result.success == true) {

        p = $j('#' + selectedElement.isSelected).parent();

        p.css({
            //zIndex: defaultZIndex(5280-(p.attr('mileY')))+(5280-(p.attr('mileX')))
            zIndex: defaultZIndex(p.attr('mileY'), p.attr('mileX'))
        });

        imageAdded();
    } else {
        removePlacer();
    };
};

//move an image that is already placed on the mile
function move(id) {

    //remove the shadow
    $j('#contentShadow').remove();

    //remove the word balloon
    $j('#wordBalloon').remove();

    //set up the positioning div		
    id = 'pic' + id;
    milepic = $j('#' + id);

    milepic.css({
        backgroundColor: '#D16A38',
        border: "2px solid #D16A38",
        opacity: .5,
        paddingBottom: "20px"
    });

    //set up the scaled thumb
    $j('#smallAdd').remove();

    //set up varialbes in global identifier
    addPic = {
        height: Math.ceil(milepic.attr('height') / mySize.scale),
        width: Math.ceil(milepic.attr('width') / mySize.scale),
        source: milepic.attr('src'),
        move: {
            x: milepic.css('left'),
            y: milepic.css('top'),
            id: id
        }
    };

    var smallAdd = document.createElement('img');

    src = milepic.attr('src');

    $j(smallAdd).attr({
        id: 'smallAdd',
        src: src,
        width: addPic.width * mySize.scale,
        height: addPic.height * mySize.scale
    }).css({
        left: milepic.css('left'),
        top: milepic.css('top'),
        zIndex: 5000
    });

    milepic.parent().append(smallAdd);

    //activate the add picture
    dragActivate();
};

//set browser hash to current location
function setBrowserHash() {

    scale = mySize.scale / 72;

    newHash = "x=" + Math.floor(mySize.myX) + "&y=" + Math.floor(mySize.myY);
    newHash += "&s=" + mySize.scale;

    oldHash = mySize.hash;

    if (newHash != oldHash && !isNaN(Math.floor(mySize.myX))) {
        mySize.hash = "#" + newHash;
        window.location.hash = newHash;
    };
};

//flag an offensive, copyight image etc
function startReport(id) {
    content = "<h2>What do you want to report?<h2>";

    image = $j('#pic' + id).attr('src');

    var pic = new Image();
    pic.src = image;
    width = pic.width;
    height = pic.height;

    if (addPic.height > addPic.width) {
        var smallH = 200;
        var smallW = width / height * 200;
    } else {
        var smallW = 200;
        var smallH = height / width * 200;
    };

    content += '<img src="' + image + '" style="float:right" width="' + smallW + '" height="' + smallH + '"/>';

    content += '<li><a onclick="doFlag(' + id + ',\'copyright\' );">Copyrighted Image</a></li>';
    content += '<li><a onclick="doFlag(' + id + ',\'image\' );">Inappropriate Image</a></li>';
    content += '<li><a onclick="doFlag(' + id + ',\'comment\' );">Offensive Comment / Spam</a></li>';

    content += '<li><a onclick="closeLB();">Never Mind</a></li>';

    //new Lightbox(content, true);
    new Lightbox({
        close: true,
        content: content,
        title: 'Report bad content'
    });
};

///cpanel below

//item from control1 is clicked, load submenu
function getControl(which) {

    //remove selected from others 
    $j('#control1 a').each(function (index) {
        $j(this).removeClass('selected');
        if (this.id == 'menu_' + which) {
            arrowIndex = index;
        };
    });

    //add selected state 
    $j('#menu_' + which).addClass('selected');

    var msgText = '<ul>';

    for (var i = 0; i < cpanelControls[which].length; i += 2) {
        msgText += '<li>';
        msgText += '<a class="' + (arrowIndex == i / 2 ? 'special' : '') + '" ' + cpanelControls[which][i + 1] + '>' + cpanelControls[which][i];
        msgText += '</a></li>';
    };

    $j('#control2').html(msgText + '</ul>');
};

//get information about a friend
function getFriendInfo(id, obj) {

    $j('#friendProfilemain').html('Loading...');
    $j('#friendAddmain').html('Loading...');
    $j('#friendCommentmain').html('Loading...');
    $j('#m4').slideDown();

    setTitle('m4', obj.getAttribute('user'));
    setNav('m4', 'off');

    $j.ajax({
        url: '/profile/public',
        type: 'POST',
        data: {
            userid: id
        },
        success: function success(data) {
            receiveFriendProfile(data, id);
        }
    });
};

function receiveFriendProfile(json, id) {

    eval('result = ' + json);
    profile = result.profile;

    $j('#friendProfilemain').html(profile);

    //set up thumbs menu for friend recent adds
    friendRecent = new thumbsMenu({
        action: '/thumbs/recentAdds',
        title: 'Recently Added',
        container: 'friendAdd',
        limit: 4,
        listThumbs: result.adds,
        rss: '/rss',
        vars: { userid: id }
    });

    //set up thumbs menu for friend recent comments
    friendComents = new thumbsMenu({
        action: '/thumbs/recentComments',
        title: 'Recent Comments',
        container: 'friendComment',
        limit: 4,
        listThumbs: result.comments,
        vars: { userid: id }
    });

    $j('#m4').slideDown();
};

//get friends of logged in user
function getFriends() {
    userFriends = new thumbsMenu({
        action: '/thumbs/friends',
        title: 'Your Friends',
        container: 'm2',
        rss: '/rss/friends/userid/93'
    });

    $j('#m2').slideDown();
};

//get favorites of logged in user
function getFaves() {
    userFaves = new thumbsMenu({
        action: '/thumbs/favorites',
        title: 'Your Favorites',
        container: 'm2'
    });

    $j('#m2').slideDown();
};

//retrieve user information
function getAccount() {

    $j('#m2main').html('Loading Your Account Info...<br/><img src="/static/ajax-loader.gif"/>');
    $j('#m2err').html('');

    setTitle('m2', 'Your Account Info');
    setNav('m2', 'off');

    $j('#m2').slideDown();

    $j.ajax({
        url: '/profile/account',
        type: 'POST',
        success: receiveAccount
    });
};

//received user profile info
function receiveAccount(html) {

    //output to screen
    $j('#m2main').html(html);
    $j('#m2').slideDown();
};

//takes new profile info and sends back to server
function UpdateProfile() {
    query = prepArrayForAjax(getFormVars('userAccount'));

    $j.ajax({
        url: '/profile/update-account',
        type: 'POST',
        data: query,
        success: profileSuccess
    });
};

//called after user updates account information
function profileSuccess(json) {

    eval('result = ' + json);

    format = '';

    if (result.success.length > 0) {
        for (i in result.success) {
            format += '<li>' + result.success[i] + '</li>';
        };
    };

    if (result.errors.length > 0) {
        for (i in result.success) {
            format += '<li>' + result.errors[i] + '</li>';
        };
    }

    $j('#m2main').html(format);
    $j('#m2').slideDown();
};

//hotlink to an image, step 1
function addImage() {

    var msgText = '	<h4>Enter URL of image:</h4>';

    msgText += '	<form action="javascript:addImage2();" name ="addForm">';
    msgText += '		<input type="text" class="stdInput" id="imgLoc" />';
    msgText += '		<input type="submit" value="Link It!" class="stdButton leftMargin" />';
    msgText += '	</form>';

    msgText += '	<span class="helperText">Enter full path to the image, <br/>eg http://www.server.com/pic.jpg</span>';

    setTitle('m1', 'Hotlink to an image on the web');
    setNav('m1', 'off');

    $j('#m1main').html(msgText);
    $j('#m1err').html();
    $j('#m1').slideDown();
};

//hotlink to an image, step 2
function addImage2() {
    contentInsert = $j('#imgLoc').val();
    if (contentInsert) {
        $j('#imgLoc').val('');
        $j.ajax({
            data: {
                content: contentInsert
            },
            success: uploadComplete,
            type: 'POST',
            url: '/content/add'
        });

        $j('#m1main').html('Please Wait');
    } else {
        $j('#m1err').html('Try linking to an image file');
    };
};

function uploadComplete(json) {
    eval('result = ' + json);

    if (result.success == true) {
        readyToAdd('/content/original/' + result.name, result.dims.width, result.dims.height);

        //activate the add picture
        dragActivate();
    } else {
        $j('#m1main').html('There was an error loading the file.  Please check the address and try again.');
    };
};

//upload from your cpu
function startUpload() {

    setTitle('m1', 'Upload an image from your computer');
    setNav('m1', 'off');

    msgText = "The uploader is not quite working yet!  You can link an image on the web for now.";

    $j('#m1main').html(msgText);
    $j('#m1err').html('');

    $j('#m1').slideDown();
};

//get the list of images that are waiting for this user 
//from plugin or email
var getWaiting;

function getWaitingList(start) {
    getWaiting = new thumbsMenu({
        action: '/thumbs/waiting',
        title: 'Your Waiting List',
        container: 'm2'
    });

    $j('#m2').slideDown();
};

function getPopular(start) {

    $j('#m2main').html('Loading popular...');
    $j('#m2').slideDown();

    popularThumbs = new thumbsMenu({
        action: '/thumbs/popular',
        title: 'Most Popular',
        container: 'm2'
    });
};

function getRecent(start) {
    recentThumbs = new thumbsMenu({
        action: '/thumbs/recent',
        title: 'Recently Added',
        container: 'm2'
    });

    $j('#m2').slideDown();
};

//get the coordinates from the coords="" attribute of an elemnt, go there
function findCoords() {
    text = "coords = " + $j(this).attr('coords');
    eval(text);

    goToLoc(coords);
};

function recDel(json) {};

//object to handle building next / prev menu items
function thumbsMenu(vars, customQuery) {

    var options = {
        action: 'getRecent', //the function that does the ajax call
        container: 'm2', //where it goes
        index: 0, //where we are in our list
        limit: 8, //how many thumbs do we show at once
        listThumbs: new Array(0), //holds the aray of thumbs /coordinates
        rss: '', // url to RSS feed
        selected: 0, //which one we have clicked on
        title: 'Thumbs Menu', //the text to display in menu header
        vars: {} //any extra post varaibles that do not change, like {userid: 9}
    };

    //set variables passes in into the option
    for (i in vars) {
        options[i] = vars[i];
    };

    //define other parts of the menu
    options.titleId = $j('#' + options.container + " .cTitle").get(0);
    options.nextId = options.container + "next";
    options.prevId = options.container + "prev";
    options.mainId = options.container + "main";

    $j('#' + options.prevId).css({ display: 'none' });
    $j('#' + options.nextId).css({ display: 'none' });

    //toggle rss feed
    if (options.rss) {
        disp = 'block';
    } else {
        disp = 'none';
    };

    rssfeed = $j('#' + options.container + ' a.btnRSS').css({ display: disp });

    rssfeed.attr('href', options.rss);

    var ajaxCall = function ajaxCall() {
        //set the message title

        options.titleId.innerHTML = "Loading " + options.title + "...";
        $j('#' + options.mainId).html('<img src="/static/ajax-loader.gif"/>');

        var query = "start=" + options.listThumbs.length + "&" + prepForQuery(options.vars);

        $j.ajax({
            data: query,
            type: 'POST',
            success: function success(json) {
                eval('result = ' + json);

                if (result.success == 'false') {
                    $j('#' + options.container + 'main').html(result.html);

                    options.titleId.innerHTML = options.title;
                } else {
                    concatTo(result);
                };
            },
            url: options.action
        });
    };

    //add the new records we received via ajax to the array	
    var concatTo = function concatTo(newThumbs) {
        if (newThumbs.thumbs) {
            oldThumbs = options.listThumbs;

            x = oldThumbs.concat(newThumbs.thumbs);

            options.listThumbs = x;
        } else {};

        if (newThumbs.stamp) {
            options.vars.stamp = newThumbs.stamp;
        };

        setNav();
        formatNav();
        formatThumbs();
        formatTitle();
    };

    var formatTitle = function formatTitle(title) {

        if (title) {
            options.title = title;
        };

        len = options.index + options.limit < options.listThumbs.length ? options.index + options.limit : options.listThumbs.length;

        newtitle = options.title + " ( " + (options.index + 1) + " - " + len + " )";

        options.titleId.innerHTML = newtitle;
    };

    //decide if next and prev buttons are to show
    var setNav = function setNav() {

        if (options.listThumbs.length > options.index + options.limit) {
            $j('#' + options.nextId).css({ visibility: 'visible' });
            $j('#' + options.nextId).css({ display: 'inline' });
        } else {
            $j('#' + options.nextId).css({ visibility: 'hidden' });
            $j('#' + options.nextId).css({ display: 'inline' });
        };
    };

    //set action for the previous and next buttons
    var formatNav = function formatNav() {

        //set the next button to go to the next set of thumbs
        $j('#' + options.nextId).unbind('click').click(function () {
            $j('#' + options.prevId).css({ visibility: 'visible' });
            $j('#' + options.prevId).css({ display: 'inline' });

            options.index += options.limit;
            formatTitle();
            setNav();
            //if we are past the limit, do another ajax call
            if (options.index + options.limit >= options.listThumbs.length) {
                //disable the next button
                $j('#' + options.nextId).css({ visibility: 'hidden' });
                ajaxCall();
            } else {
                formatThumbs();
            };

            return false;
        });

        //set the prev button
        $j('#' + options.prevId).unbind('click').click(function () {
            options.index -= options.limit;

            formatTitle();
            setNav();

            if (options.index >= 0) {
                formatThumbs();
            } else {
                options.index = 0;
            };

            if (options.index == 0) {
                $j('#' + options.prevId).css({ visibility: 'hidden' });
            };
        });
    };

    //build the html that goes into whatever div
    var formatThumbs = function formatThumbs() {

        //where we are in the index, plus the number of how many we want to see
        end = options.index + options.limit < options.listThumbs.length ? options.index + options.limit : options.listThumbs.length;

        //the html we insert into the appropriate menu
        output = '<div>';

        //any scripts to eval afterwards
        afterI = "";

        for (i = options.index; i < end; i++) {
            if (options.listThumbs[i]) {

                id = options.mainId + 'Thumb' + options.listThumbs[i]['id'];

                output += '<div class="panelThumbs" id="' + id + '" ';
                //add location if is in there - want to go to
                if (options.listThumbs[i]['locX']) {

                    coords = {
                        x: options.listThumbs[i]['locX'],
                        y: options.listThumbs[i]['locY'],
                        id: options.listThumbs[i]['id']
                    };

                    output += 'coords=\'' + serial(coords) + '\' ';

                    //attach listener to for go to loc
                    afterI += "$j('#" + id + "').click(findCoords);";
                } else if (options.listThumbs[i]['loc']) {
                    //if this is their waiting list
                    afterI += "$j('#" + id + "').click(function(e){waitingList(e, options.listThumbs[" + i + "], " + i + ")});";
                } else if (options.listThumbs[i]['userid']) {
                    //this is their friends list
                    output += 'onclick="getFriendInfo(\'' + options.listThumbs[i]['userid'] + '\', this)" user=\'' + options.listThumbs[i]['user'] + '\' ';
                } else {
                    //other?
                    output += ' ';
                };

                //close the <div class="panelThumbs"
                output += '>';

                //the actual thumbnail image
                if (options.listThumbs[i]['userid']) {
                    //user pic
                    dir = '/profile';
                } else {
                    //anything else
                    dir = '/thumbs';
                };

                output += '	<img class="panelThumb" src="/static/72spacer.gif" style="background-image:url(/content/' + dir + '/' + options.listThumbs[i]['thumb'] + ')"/>';

                //add in vote count if there
                if (options.listThumbs[i]['votes']) {
                    output += '	<span class="addedDate">' + plural(options.listThumbs[i]['votes'], 'vote') + '</span>';
                };

                //add user name if there
                if (options.listThumbs[i]['user']) {
                    output += '	<span class="addedDate">' + options.listThumbs[i]['user'] + '</span>';
                };

                //add in date added if there
                if (options.listThumbs[i]['date']) {
                    output += '	<span class="addedDate">' + options.listThumbs[i]['date'] + '</span>';
                }

                //add option to delete if this is waiting list 
                if (options.listThumbs[i]['loc']) {
                    output += '	<img class="deletePic" indx="' + i + '" del="' + options.listThumbs[i]['loc'] + '" src="/static/deletePic.png" id="del' + options.listThumbs[i]['id'] + '">';
                    afterI += "$j('#del" + options.listThumbs[i]['id'] + "').click(function(e){confirmDelete(e, options.listThumbs)});";
                };

                output += '</div>';
            } else {
                end--;
            };
        };

        output += '<br style="clear:both"/></div>';

        $j('#' + options.mainId).html(output);

        eval(afterI);
    };

    var waitingList = function waitingList(e, obj, i) {

        $j('#m1main').html('Please Wait...');
        $j('#m1err').html('');
        setTitle('m1', 'Add Your Picture');
        setNav('m1', 'off');

        options.selected = i;

        imgloc = '/content/original/' + obj.loc;
        height = obj.height;
        width = obj.width;

        var pic = new Image();

        pic.onerror = function () {
            alert('there was an error! sorry!\n' + imgloc);
        };

        pic.onload = function () {

            $j('#smallAdd').remove();

            if (addPic.move.id) {
                $j('#' + addPic.move.id).css({
                    borderWidth: '0px',
                    opacity: 1,
                    padding: '0px'
                });

                addPic.move = {
                    x: 0,
                    y: 0,
                    id: 0
                };
            };

            readyToAdd(imgloc, width, height);
            dActivate();
        };

        pic.src = imgloc;
    };

    var dActivate = function dActivate() {
        //activate the add picture for wiating list - not upload / link
        $j('#smallAdd').draggable({
            start: activateSmallAdd,
            drag: smallAddDrag,
            stop: cSmallAdd
        });
    };

    //check to see if dragged picture overlaps others on mouse up
    var cSmallAdd = function cSmallAdd() {
        //waiting list add
        postVars = activateCpanelPlacer();

        $j.ajax({
            data: postVars,
            success: cOverlap,
            type: 'POST',
            url: '/mile/add/'
        });
    };

    var cOverlap = function cOverlap(json) {
        //check overlaps on wiating list add
        eval('result = ' + json);

        if (result.success == true) {
            //remove from waiting list
            i = options.selected;
            options.listThumbs.splice(i, 1);

            formatThumbs();
            imageAdded();
        } else {
            removePlacer();
        };
    };

    var confirmDelete = function confirmDelete(e, obj) {
        if (e) {
            //moz
            e.stopPropagation();
        } else {
            //IE
            e = window.event;
        };

        del = e.target.getAttribute('del');
        indx = e.target.getAttribute('indx');

        uploadText = '<img src="/content/original/' + del + '" height="100" width="100" style="float:left;margin:10px"> Are you sure you want to delete this picture from your waiting list?<br/>';

        uploadText += '<a class="fakeButton" id="confirmDelete">Yes</a> <a class="fakeButton">No</a>';
        $j('#m1main').html(uploadText);

        $j('#confirmDelete').click(function () {
            doDelete(del, obj, indx);
        });

        setTitle('m1', 'Confirm Delete');
        setNav('m1', 'off');

        $j('#m1').slideDown();
    };

    var doDelete = function doDelete(src, obj, indx) {
        $j.ajax({
            data: {
                src: src
            },
            success: recDel,
            type: 'post',
            url: '/thumbs/delete'
        });

        obj.splice(indx, 1);
        formatThumbs();

        if (options.listThumbs.length < options.index + 8) {
            ajaxCall();
        };

        $j('#m1main').html('');
        closeCpanel(1);
    };

    //load initial content
    if (!options.listThumbs.length) {
        ajaxCall();
    } else {
        setNav();
        formatTitle();
        formatNav();
        formatThumbs();
    };
};

//sign up form, validate all form info
function signUp() {

    v = getFormVars('signup');

    var errmsg = [];

    if (!v.user || v.user.length < 2) {
        errmsg.push("Your user name must be at least 2 characters.");
    };

    if (v.email && !emailValidate(v.email)) {
        errmsg.push("Your email address does not appear to be valid.");
    };

    if (errmsg.length < 1) {
        $j('#signupMsg').html('Processing..please wait...');
        $j('#signupbutton').hide();

        v = prepForQuery(v);

        $j.ajax({
            url: '/profile/signup',
            type: 'post',
            data: v,
            success: receiveSignup
        });
    } else {
        output = "Please fix the following errors: <br/>";

        for (i = 0; i < errmsg.length; i++) {
            output += errmsg[i] + "<br/>";
        };

        $j('#signupMsg').html(output);
    };
};

function receiveSignup(json) {
    eval('result = ' + json);

    if (result.errors.length > 0) {
        $j('#signupbutton').show();

        output = "Please fix the following errors: <br/>";

        for (i = 0; i < result.errors.length; i++) {
            output += result.errors[i] + "<br/>";
        };

        $j('#signupMsg').html(output);
    } else if (result.success == true) {

        $j('div#control1').html(result.panelLeft);
        $j('div#control2').html(result.panelRight);

        closeCpanel(6);
        closeCpanel(5);

        activateCpanel();

        //set up the tracking interval and do it once immediately
        startTracking();
    };
};

//get the users profile
function getProfile() {

    $j('#m2main').html('Loading Your Profile...');
    $j('#m2').slideDown('normal');

    setTitle('m2', 'Loading Your Profile...');
    setNav('m2', 'off');

    $j.ajax({
        url: '/profile/get',
        type: 'POST',
        success: receiveProfile
    });
};

function receiveProfile(html) {

    $j('#m2main').html(html);

    setTitle('m2', 'Your Profile');
    setNav('m2', 'off');

    $j('#m2').slideDown();
};

function openSearch() {

    setTitle('m2', 'Search For an Image');
    setNav('m2', 'off');

    var msgText = '<form name="searchParams" id="searchParams" action="/search" method="post">';
    msgText += '<input type="text" class="stdInput" name="searchTerm" id="searchTerm" />';
    msgText += '<input type="button" value="Search" class="stdButton" onclick="sendSearchParms();" />';
    msgText += '</form>';

    $j('#m2main').html(msgText);
    $j('#m2').slideDown();

    $j('form#searchParams').submit(function () {
        sendSearchParms();
        return false;
    });
};

function sendSearchParms(term) {

    search = term ? term : $j('#searchTerm').val();
    search = encodeURIComponent(search);

    searchThumbs = new thumbsMenu({
        action: '/thumbs/search/query/' + search,
        title: 'Search Results',
        container: 'm2',
        limit: 4
    });

    $j('#m2main').html('');

    setTitle('m2', 'Searching... Please Wait');

    $j('#m2').slideDown();
};

function receiveSearch(xml) {
    $j('#m3title').html('Search Results');
    $j('#m3main').html(xml.responseText);

    $j('#m3').slideDown();
};

//get the how to screens
function getHelp() {
    new Lightbox({
        close: true,
        url: '/help/main',
        title: 'Help!'
    });
};

//get form to send in user feedback
function startFeedback() {
    new Lightbox({
        close: true,
        url: '/help/feedback',
        title: 'Send Feedback'
    });
};

function sendFeedback() {
    vars = prepForQuery(getFormVars('formFeedback'));

    var sendFeedback = new XHConn();
    sendFeedback.connect("help/feedback", "POST", vars, returnFeedback);

    $j('#formFeedback').html('Please Wait...');
};

function returnFeedback(json) {
    eval('result = ' + json.responseText);
    $j('#lightboxcontent').html(result.html);
};

function getTerms() {
    new Lightbox({
        close: true,
        url: '/help/terms',
        title: 'Terms and Conditions / Privacy Policy'
    });
};

function getAbout() {
    new Lightbox({
        close: true,
        url: '/help/about',
        title: 'About the mile'
    });
};

function getAPI() {
    new Lightbox({
        close: true,
        url: 'help/api',
        title: 'API For Developers'
    });
};

function expandMethod(which) {
    next = getNext(which);
    if (next.style.display == "block") {
        next.style.display = "none";
    } else {
        next.style.display = "block";
    };
};

//linked an image, or from waiting list.
function readyToAdd(imgloc, width, height) {
    //set up varialbes in global identifier
    addPic.height = Math.ceil(height / 72);
    addPic.width = Math.ceil(width / 72);
    addPic.source = imgloc;

    //scale picture proportionally for thumbnail
    if (height > width) {
        smallH = 100;
        smallW = width / height * 100;
    } else {
        smallW = 100;
        smallH = height / width * 100;
    };

    //format html 
    uploadText = '<div class="dragHelp">';
    uploadText += '	<img src="' + imgloc + '" id="smallAdd" style="width:' + smallW + 'px; height:' + smallH + 'px;" />';
    uploadText += '	<img src="/static/moveicon.png"/><br/>';
    uploadText += '	Drag it onto an empty space on the mile!';
    uploadText += '</div>';

    $j('#m1main').html(uploadText);
    $j('#m1').slideDown('normal');
};

//adding the image was unsuccessful.
function removePlacer() {
    $j('#posImg').remove();

    if (addPic.move.id) {
        $j('#smallAdd').css({
            left: addPic.move.x,
            top: addPic.move.y
        });
    } else {
        // or shoot back placer to cpanel
        $j('#smallAdd').animate({
            left: '190px',
            top: '10px'
        }, 1000);
    };

    //there were overlaps. figure out where they are 
    num = result.overlap.length;

    overlapContainer = document.createElement('div');
    overlapContainer.setAttribute('id', 'overlapContainer');

    overlapContainerTop = mySize.height;
    overlapContainerLeft = mySize.width;
    overlapContainerWidth = 0;
    overlapContainerHeight = 0;

    $j('#squaremile').append(overlapContainer);

    overlapContainerWidth -= overlapContainerLeft - mySize.scale;
    overlapContainerHeight -= overlapContainerTop - mySize.scale;

    for (o in result.overlap) {
        x = result.overlap[o]['x'];
        y = result.overlap[o]['y'];

        div = document.createElement('div');

        left = (x * 72 - mySize.myX) * (mySize.scale / 72) - mySize.scale + mySize.width / 2;
        top = (y * 72 - mySize.myY) * (mySize.scale / 72) - mySize.scale + mySize.height / 2;

        overlapContainerLeft = left < overlapContainerLeft ? left : overlapContainerLeft;
        overlapContainerTop = top < overlapContainerTop ? top : overlapContainerTop;
        overlapContainerWidth = left > overlapContainerWidth ? left : overlapContainerWidth;
        overlapContainerHeight = top > overlapContainerHeight ? top : overlapContainerHeight;

        left -= overlapContainerLeft;
        top -= overlapContainerTop;

        $j(div).css({
            left: left + 'px',
            top: top + 'px',
            backgroundColor: '#D16A38',
            width: mySize.scale + 'px',
            height: mySize.scale + 'px',
            position: 'absolute'
        });

        $j('#overlapContainer').append(div);
    };

    $j('#overlapContainer').css({
        left: overlapContainerLeft + "px",
        top: overlapContainerTop + "px",
        height: overlapContainerHeight + "px",
        width: overlapContainerWidth + "px"
    });

    setTimeout("$j('#overlapContainer').fadeOut('normal', function(){$j('#overlapContainer').remove()})", 500);
};

function imageAdded() {

    $j('#posImg').remove();
    $j('#smallAdd').remove();

    closeCpanel(1);
    $j('#m1main').html('');

    //dbug(result.foot);
    //why do i have to eval this?  it doesnt like the result.foot.x part otherwise.
    eval('makeMapCall({ ' + result.foot.x + ':' + result.foot.y + ' })');

    if (addPic.move.id) {
        //moved an image successfully
        $j('#' + addPic.move.id).remove();

        addPic.move = { x: 0, y: 0, id: 0 };
    };
};

function activateCpanelPlacer() {

    $j("#posImg").animate({
        opacity: 1
    });

    postVars = "width=" + addPic.width;
    postVars += "&height=" + addPic.height;
    postVars += "&inchX=" + addPic.inchX;
    postVars += "&inchY=" + addPic.inchY;
    postVars += "&fileLoc=" + addPic.source;

    if (addPic.move.id) {
        postVars += "&id=" + addPic.move.id;
    };

    return postVars;
};

//close lightbox
function closeLB() {
    $j('#lightboxbk').fadeOut('normal', function () {
        $j('#lightboxbk').remove();
    });
};

function Lightbox(options) {
    var newdiv = document.createElement('div');

    newdiv.setAttribute('id', 'lightboxbk');

    lightboxHtml = '<img class="lbshadow" src="/static/shadow.png"/><div id="lightboxlight"><span class="lightboxTitle">' + options.title + '</span>';

    //add initial content 
    if (!options.content) {
        options.content = 'Loading...';

        $j.ajax({
            url: options.url,
            type: 'post',
            success: receiveLbPost
        });
    };

    lightboxHtml += '<div id="lightboxcontent">' + options.content + '</div>';
    lightboxHtml += '</div>';

    newdiv.innerHTML = lightboxHtml;

    $j('#body').append(newdiv);

    //add the close x 
    if (options.close) {
        $j('#lightboxlight').after('<div id="closeLB" onclick="closeLB();"></div>');
    };

    //set the size of the lightbox content to match the container
    sizeLB();
};

function receiveLbPost(json) {
    eval("result = " + json);

    $j('#lightboxcontent').html(result.html);
};

//mapCoord is called when double click on scaled map - travels to that location.
function mapCoord(e) {
    //var e=new MouseEvent(e);

    mapX = e.clientX - (mySize.width - 190);
    mapY = e.clientY - (mySize.height - 190);

    if (mapX < 0) {
        mapX = 0;
    };
    if (mapX > 190) {
        mapX = 190;
    };
    if (mapY > 190) {
        mapY = 190;
    };

    //goto variables to reflect changes in scale
    gotoX = mapX * 24000;
    gotoY = mapY * 24000;
    //go to this location
    goToLoc(gotoX, gotoY);
    return false;
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvYXBwLmpzIiwiYXNzZXRzL2pzL2NvcmUuanMiLCJhc3NldHMvanMvY3BhbmVsLmpzIiwiYXNzZXRzL2pzL2dsb2JhbHMuanMiLCJhc3NldHMvanMvaW5pdC5qcyIsImFzc2V0cy9qcy9taWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxRQUFTLFdBQVQ7QUFDQSxRQUFRLEdBQVIsQ0FBYSxRQUFiLEVBQXVCLE1BQXZCOztBQUVBLElBQUksT0FBTyxRQUFTLFFBQVQsQ0FBWDtBQUNBLElBQUksT0FBTyxRQUFTLFFBQVQsQ0FBWDtBQUNBLElBQUksU0FBUyxRQUFTLFVBQVQsQ0FBYjtBQUNBLElBQUksT0FBTyxRQUFTLFFBQVQsQ0FBWDs7Ozs7QUNOQSxTQUFTLE1BQVQsQ0FBaUIsR0FBakIsRUFBdUI7QUFDbkIsUUFBSSxLQUFLLFNBQUwsQ0FBZ0IsR0FBaEIsQ0FBSjtBQUNBLFdBQU8sQ0FBUDtBQUNIOztBQUVEO0FBQ0EsU0FBUyxRQUFULENBQW1CLEdBQW5CLEVBQXdCLEtBQXhCLEVBQWdDO0FBQzVCLE9BQUksTUFBTSxHQUFOLEdBQVksVUFBaEIsRUFBNkIsSUFBN0IsQ0FBbUMsS0FBbkM7QUFDSDs7QUFFRCxTQUFTLE1BQVQsQ0FBaUIsTUFBakIsRUFBeUIsSUFBekIsRUFBZ0M7QUFDNUIsUUFBSyxVQUFVLENBQWYsRUFBbUI7QUFDZixlQUFPLFNBQVMsR0FBVCxHQUFlLElBQWYsR0FBc0IsR0FBN0I7QUFDSCxLQUZELE1BRU87QUFDSCxlQUFPLFNBQVMsR0FBVCxHQUFlLElBQXRCO0FBQ0g7QUFDSjs7QUFFRDtBQUNBLFNBQVMsTUFBVCxDQUFpQixHQUFqQixFQUFzQixLQUF0QixFQUE4Qjs7QUFFMUIsVUFBTSxHQUFJLE1BQU0sR0FBTixHQUFZLFdBQWhCLENBQU47O0FBRUEsUUFBSyxTQUFTLEtBQWQsRUFBc0I7QUFDbEIsWUFB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QVAsR0FBZ0IsR0FBbEMsQ0FBUDs7QUFFQSxRQUFLLE9BQU8sQ0FBWixFQUFnQjtBQUFFLGVBQU8sQ0FBUDtBQUFXO0FBQzdCLFFBQUssT0FBTyxHQUFaLEVBQWtCO0FBQUUsZUFBTyxHQUFQO0FBQWE7QUFDakMsUUFBSyxPQUFPLEdBQVosRUFBa0I7QUFBRSxlQUFPLEdBQVA7QUFBYTs7QUFFakM7QUFDQSxZQUFRLE9BQU8sS0FBZjtBQUNBLFlBQVEsT0FBTyxLQUFmO0FBQ0E7QUFDQSxZQUFTLEtBQVQsRUFBZ0IsS0FBaEI7QUFDQSxXQUFPLEtBQVA7QUFDSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCAnLi9nbG9iYWxzJyApO1xuY29uc29sZS5sb2coICdteVNpemUnLCBteVNpemUgKTtcblxubGV0IGluaXQgPSByZXF1aXJlKCAnLi9pbml0JyApO1xubGV0IG1pbGUgPSByZXF1aXJlKCAnLi9taWxlJyApO1xubGV0IGNwYW5lbCA9IHJlcXVpcmUoICcuL2NwYW5lbCcgKTtcbmxldCBjb3JlID0gcmVxdWlyZSggJy4vY29yZScgKTsiLCJmdW5jdGlvbiBzZXJpYWwoIGFyciApIHtcbiAgICB4ID0gSlNPTi5zdHJpbmdpZnkoIGFyciApXG4gICAgcmV0dXJuIHg7XG59O1xuXG4vL3NldCB0aGUgdGl0bGUgaW4gYSBjcGFuZWwgbWVudVxuZnVuY3Rpb24gc2V0VGl0bGUoIG9iaiwgdGl0bGUgKSB7XG4gICAgJGooICcjJyArIG9iaiArICcgLmNUaXRsZScgKS5odG1sKCB0aXRsZSApO1xufTtcblxuZnVuY3Rpb24gcGx1cmFsKCBudW1iZXIsIG5hbWUgKSB7XG4gICAgaWYgKCBudW1iZXIgIT0gMSApIHtcbiAgICAgICAgcmV0dXJuIG51bWJlciArIFwiIFwiICsgbmFtZSArIFwic1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudW1iZXIgKyBcIiBcIiArIG5hbWU7XG4gICAgfTtcbn07XG5cbi8vdG9nZ2xlIHZpcyBvZiBuYXYgYnV0dG9ucyBhIGNwYW5sIG1lbnVcbmZ1bmN0aW9uIHNldE5hdiggb2JqLCBzdGF0ZSApIHtcblxuICAgIG5hdiA9ICRqKCAnIycgKyBvYmogKyAnIC5tZW51TmF2JyApO1xuXG4gICAgaWYgKCBzdGF0ZSA9PSAnb2ZmJyApIHtcbiAgICAgICAgbmF2LmNzcyggeyB2aXNpYmlsaXR5OiAnaGlkZGVuJyB9ICk7XG4gICAgICAgIG5hdi5jaGlsZHJlbigpLmVhY2goIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGooIHRoaXMgKS5jc3MoIHsgZGlzcGxheTogJ25vbmUnIH0gKTtcbiAgICAgICAgfSApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG5hdi5jc3MoIHsgdmlzaWJpbGl0eTogJ3Zpc2libGUnIH0gKTtcbiAgICAgICAgbmF2LmNoaWxkcmVuKCkuZWFjaCggZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkaiggdGhpcyApLmNzcyggeyBkaXNwbGF5OiAnaW5saW5lJyB9ICk7XG4gICAgICAgIH0gKTtcbiAgICB9O1xufTtcblxuLy90cmltKCkgZnVuY3Rpb25cblN0cmluZy5wcm90b3R5cGUudHJpbSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJlcGxhY2UoIC9eXFxzKi8sIFwiXCIgKS5yZXBsYWNlKCAvXFxzKiQvLCBcIlwiICk7XG59O1xuXG5mdW5jdGlvbiBoZXhfbWQ1KCBzICkgeyByZXR1cm4gYmlubDJoZXgoIGNvcmVfbWQ1KCBzdHIyYmlubCggcyApLCBzLmxlbmd0aCAqIGNocnN6ICkgKTsgfTtcblxuZnVuY3Rpb24gYjY0X21kNSggcyApIHsgcmV0dXJuIGJpbmwyYjY0KCBjb3JlX21kNSggc3RyMmJpbmwoIHMgKSwgcy5sZW5ndGggKiBjaHJzeiApICk7IH07XG5cbmZ1bmN0aW9uIHN0cl9tZDUoIHMgKSB7IHJldHVybiBiaW5sMnN0ciggY29yZV9tZDUoIHN0cjJiaW5sKCBzICksIHMubGVuZ3RoICogY2hyc3ogKSApOyB9O1xuXG5mdW5jdGlvbiBoZXhfaG1hY19tZDUoIGtleSwgZGF0YSApIHsgcmV0dXJuIGJpbmwyaGV4KCBjb3JlX2htYWNfbWQ1KCBrZXksIGRhdGEgKSApOyB9O1xuXG5mdW5jdGlvbiBiNjRfaG1hY19tZDUoIGtleSwgZGF0YSApIHsgcmV0dXJuIGJpbmwyYjY0KCBjb3JlX2htYWNfbWQ1KCBrZXksIGRhdGEgKSApOyB9O1xuXG5mdW5jdGlvbiBzdHJfaG1hY19tZDUoIGtleSwgZGF0YSApIHsgcmV0dXJuIGJpbmwyc3RyKCBjb3JlX2htYWNfbWQ1KCBrZXksIGRhdGEgKSApOyB9O1xuXG4vL0NhbGN1bGF0ZSB0aGUgSE1BQy1NRDUsIG9mIGEga2V5IGFuZCBzb21lIGRhdGFcblxuZnVuY3Rpb24gY29yZV9obWFjX21kNSgga2V5LCBkYXRhICkge1xuICAgIHZhciBia2V5ID0gc3RyMmJpbmwoIGtleSApO1xuICAgIGlmICggYmtleS5sZW5ndGggPiAxNiApIGJrZXkgPSBjb3JlX21kNSggYmtleSwga2V5Lmxlbmd0aCAqIGNocnN6ICk7XG5cbiAgICB2YXIgaXBhZCA9IEFycmF5KCAxNiApLFxuICAgICAgICBvcGFkID0gQXJyYXkoIDE2ICk7XG4gICAgZm9yICggdmFyIGkgPSAwOyBpIDwgMTY7IGkrKyApIHtcbiAgICAgICAgaXBhZFsgaSBdID0gYmtleVsgaSBdIF4gMHgzNjM2MzYzNjtcbiAgICAgICAgb3BhZFsgaSBdID0gYmtleVsgaSBdIF4gMHg1QzVDNUM1QztcbiAgICB9O1xuXG4gICAgdmFyIGhhc2ggPSBjb3JlX21kNSggaXBhZC5jb25jYXQoIHN0cjJiaW5sKCBkYXRhICkgKSwgNTEyICsgZGF0YS5sZW5ndGggKiBjaHJzeiApO1xuICAgIHJldHVybiBjb3JlX21kNSggb3BhZC5jb25jYXQoIGhhc2ggKSwgNTEyICsgMTI4ICk7XG59O1xuXG4vL2dldHMgYWxsIHRoZSBpbnB1dHMgb2YgYSBmb3JtIGFuZCBzZW5kcyBiYWNrIGFuIGFycmF5IFxuZnVuY3Rpb24gZ2V0Rm9ybVZhcnMoIG5hbWUgKSB7XG4gICAgZm9ybSA9IGRvY3VtZW50WyBuYW1lIF07XG4gICAgb3V0cHV0ID0ge307XG4gICAgZm9yICggaSA9IDA7IGkgPCBmb3JtLmVsZW1lbnRzLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAvL2lmIHRoZSBmb3JtIGVsZW1lbnQgZG9lc250IGhhdmUgYSBuYW1lLCBkb250IHVzZSBpdFxuICAgICAgICBpZiAoIGZvcm1bIGkgXS5uYW1lICkge1xuICAgICAgICAgICAgLy9tZDUgYWxsIHBhc3N3b3Jkc1xuICAgICAgICAgICAgaWYgKCBmb3JtWyBpIF0udHlwZSA9PSBcInBhc3N3b3JkXCIgKSB7XG4gICAgICAgICAgICAgICAgeCA9IGhleF9tZDUoIGZvcm1bIGkgXS52YWx1ZSApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggZm9ybVsgaSBdLnR5cGUgPT0gXCJjaGVja2JveFwiICkge1xuICAgICAgICAgICAgICAgIHggPSBmb3JtWyBpIF0uY2hlY2tlZDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgeCA9ICggZm9ybVsgaSBdLnZhbHVlICkudHJpbSgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy9hbGVydCh4KTtcblxuICAgICAgICAgICAgb3V0cHV0WyBmb3JtWyBpIF0ubmFtZSBdID0geDtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgcmV0dXJuICggb3V0cHV0ICk7XG59O1xuXG4vL2NvbmNhdHMgYWxsIHZhbHVlcyBpbiBhbiBhcnJheSBmb3IgZWFzeSBHRVQgb3IgUE9TVCBxdWVyeVxuZnVuY3Rpb24gcHJlcEZvclF1ZXJ5KCBhcnJheSApIHtcbiAgICBzZW5kYmFjayA9IFtdO1xuXG4gICAgZm9yICggaSBpbiBhcnJheSApIHtcbiAgICAgICAgc2VuZGJhY2sucHVzaCggaSArIFwiPVwiICsgYXJyYXlbIGkgXSApO1xuICAgIH07XG5cbiAgICByZXR1cm4gc2VuZGJhY2suam9pbiggXCImXCIgKTtcbn07XG5cbi8vcmV0dXJuIHRydWUgaWYgdmFsaWQgZW1haWxcbmZ1bmN0aW9uIGVtYWlsVmFsaWRhdGUoIHN0ciApIHsgdmFyIGF0ID0gXCJAXCI7IHZhciBkb3QgPSBcIi5cIjsgdmFyIGxhdCA9IHN0ci5pbmRleE9mKCBhdCApOyB2YXIgbHN0ciA9IHN0ci5sZW5ndGg7IHZhciBsZG90ID0gc3RyLmluZGV4T2YoIGRvdCApOyB2YXIgdmFsaWQgPSAxOyBpZiAoIHN0ci5pbmRleE9mKCBhdCApID09IC0xICkgeyB2YWxpZCA9IDAgfTsgaWYgKCBzdHIuaW5kZXhPZiggYXQgKSA9PSAtMSB8fCBzdHIuaW5kZXhPZiggYXQgKSA9PSAwIHx8IHN0ci5pbmRleE9mKCBhdCApID09IGxzdHIgKSB7IHZhbGlkID0gMCB9OyBpZiAoIHN0ci5pbmRleE9mKCBkb3QgKSA9PSAtMSB8fCBzdHIuaW5kZXhPZiggZG90ICkgPT0gMCB8fCBzdHIuaW5kZXhPZiggZG90ICkgPT0gbHN0ciApIHsgdmFsaWQgPSAwIH07IGlmICggc3RyLmluZGV4T2YoIGF0LCAoIGxhdCArIDEgKSApICE9IC0xICkgeyB2YWxpZCA9IDAgfTsgaWYgKCBzdHIuc3Vic3RyaW5nKCBsYXQgLSAxLCBsYXQgKSA9PSBkb3QgfHwgc3RyLnN1YnN0cmluZyggbGF0ICsgMSwgbGF0ICsgMiApID09IGRvdCApIHsgdmFsaWQgPSAwIH07IGlmICggc3RyLmluZGV4T2YoIGRvdCwgKCBsYXQgKyAyICkgKSA9PSAtMSApIHsgdmFsaWQgPSAwIH07IGlmICggc3RyLmluZGV4T2YoIFwiIFwiICkgIT0gLTEgKSB7IHZhbGlkID0gMCB9OyByZXR1cm4gdmFsaWQgfTtcblxudmFyIGhleGNhc2UgPSAwOyAvKiBoZXggb3V0cHV0IGZvcm1hdC4gMCAtIGxvd2VyY2FzZTsgMSAtIHVwcGVyY2FzZSAgICAgICAgKi9cbnZhciBiNjRwYWQgPSBcIlwiOyAvKiBiYXNlLTY0IHBhZCBjaGFyYWN0ZXIuIFwiPVwiIGZvciBzdHJpY3QgUkZDIGNvbXBsaWFuY2UgICAqL1xudmFyIGNocnN6ID0gODsgLyogYml0cyBwZXIgaW5wdXQgY2hhcmFjdGVyLiA4IC0gQVNDSUk7IDE2IC0gVW5pY29kZSAgICAgICovXG5cbi8vQWRkIGludGVnZXJzLCB3cmFwcGluZyBhdCAyXjMyLiBcbi8vVGhpcyB1c2VzIDE2LWJpdCBvcGVyYXRpb25zIGludGVybmFsbHkgdG8gd29yayBhcm91bmQgYnVncyBpbiBzb21lIEpTIGludGVycHJldGVycy5cbmZ1bmN0aW9uIHNhZmVfYWRkKCB4LCB5ICkgeyB2YXIgbHN3ID0gKCB4ICYgMHhGRkZGICkgKyAoIHkgJiAweEZGRkYgKTsgdmFyIG1zdyA9ICggeCA+PiAxNiApICsgKCB5ID4+IDE2ICkgKyAoIGxzdyA+PiAxNiApOyByZXR1cm4gKCBtc3cgPDwgMTYgKSB8ICggbHN3ICYgMHhGRkZGICkgfTtcblxuLy9DYWxjdWxhdGUgdGhlIE1ENSBvZiBhbiBhcnJheSBvZiBsaXR0bGUtZW5kaWFuIHdvcmRzLCBhbmQgYSBiaXQgbGVuZ3RoXG5mdW5jdGlvbiBjb3JlX21kNSggeCwgbGVuICkge1xuICAgIHhbIGxlbiA+PiA1IF0gfD0gMHg4MCA8PCAoICggbGVuICkgJSAzMiApO1xuICAgIHhbICggKCAoIGxlbiArIDY0ICkgPj4+IDkgKSA8PCA0ICkgKyAxNCBdID0gbGVuO1xuICAgIHZhciBhID0gMTczMjU4NDE5MztcbiAgICB2YXIgYiA9IC0yNzE3MzM4Nzk7XG4gICAgdmFyIGMgPSAtMTczMjU4NDE5NDtcbiAgICB2YXIgZCA9IDI3MTczMzg3ODtcbiAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSArPSAxNiApIHtcbiAgICAgICAgdmFyIG9sZGEgPSBhO1xuICAgICAgICB2YXIgb2xkYiA9IGI7XG4gICAgICAgIHZhciBvbGRjID0gYztcbiAgICAgICAgdmFyIG9sZGQgPSBkO1xuICAgICAgICBhID0gbWQ1X2ZmKCBhLCBiLCBjLCBkLCB4WyBpICsgMCBdLCA3LCAtNjgwODc2OTM2ICk7XG4gICAgICAgIGQgPSBtZDVfZmYoIGQsIGEsIGIsIGMsIHhbIGkgKyAxIF0sIDEyLCAtMzg5NTY0NTg2ICk7XG4gICAgICAgIGMgPSBtZDVfZmYoIGMsIGQsIGEsIGIsIHhbIGkgKyAyIF0sIDE3LCA2MDYxMDU4MTkgKTtcbiAgICAgICAgYiA9IG1kNV9mZiggYiwgYywgZCwgYSwgeFsgaSArIDMgXSwgMjIsIC0xMDQ0NTI1MzMwICk7XG4gICAgICAgIGEgPSBtZDVfZmYoIGEsIGIsIGMsIGQsIHhbIGkgKyA0IF0sIDcsIC0xNzY0MTg4OTcgKTtcbiAgICAgICAgZCA9IG1kNV9mZiggZCwgYSwgYiwgYywgeFsgaSArIDUgXSwgMTIsIDEyMDAwODA0MjYgKTtcbiAgICAgICAgYyA9IG1kNV9mZiggYywgZCwgYSwgYiwgeFsgaSArIDYgXSwgMTcsIC0xNDczMjMxMzQxICk7XG4gICAgICAgIGIgPSBtZDVfZmYoIGIsIGMsIGQsIGEsIHhbIGkgKyA3IF0sIDIyLCAtNDU3MDU5ODMgKTtcbiAgICAgICAgYSA9IG1kNV9mZiggYSwgYiwgYywgZCwgeFsgaSArIDggXSwgNywgMTc3MDAzNTQxNiApO1xuICAgICAgICBkID0gbWQ1X2ZmKCBkLCBhLCBiLCBjLCB4WyBpICsgOSBdLCAxMiwgLTE5NTg0MTQ0MTcgKTtcbiAgICAgICAgYyA9IG1kNV9mZiggYywgZCwgYSwgYiwgeFsgaSArIDEwIF0sIDE3LCAtNDIwNjMgKTtcbiAgICAgICAgYiA9IG1kNV9mZiggYiwgYywgZCwgYSwgeFsgaSArIDExIF0sIDIyLCAtMTk5MDQwNDE2MiApO1xuICAgICAgICBhID0gbWQ1X2ZmKCBhLCBiLCBjLCBkLCB4WyBpICsgMTIgXSwgNywgMTgwNDYwMzY4MiApO1xuICAgICAgICBkID0gbWQ1X2ZmKCBkLCBhLCBiLCBjLCB4WyBpICsgMTMgXSwgMTIsIC00MDM0MTEwMSApO1xuICAgICAgICBjID0gbWQ1X2ZmKCBjLCBkLCBhLCBiLCB4WyBpICsgMTQgXSwgMTcsIC0xNTAyMDAyMjkwICk7XG4gICAgICAgIGIgPSBtZDVfZmYoIGIsIGMsIGQsIGEsIHhbIGkgKyAxNSBdLCAyMiwgMTIzNjUzNTMyOSApO1xuICAgICAgICBhID0gbWQ1X2dnKCBhLCBiLCBjLCBkLCB4WyBpICsgMSBdLCA1LCAtMTY1Nzk2NTEwICk7XG4gICAgICAgIGQgPSBtZDVfZ2coIGQsIGEsIGIsIGMsIHhbIGkgKyA2IF0sIDksIC0xMDY5NTAxNjMyICk7XG4gICAgICAgIGMgPSBtZDVfZ2coIGMsIGQsIGEsIGIsIHhbIGkgKyAxMSBdLCAxNCwgNjQzNzE3NzEzICk7XG4gICAgICAgIGIgPSBtZDVfZ2coIGIsIGMsIGQsIGEsIHhbIGkgKyAwIF0sIDIwLCAtMzczODk3MzAyICk7XG4gICAgICAgIGEgPSBtZDVfZ2coIGEsIGIsIGMsIGQsIHhbIGkgKyA1IF0sIDUsIC03MDE1NTg2OTEgKTtcbiAgICAgICAgZCA9IG1kNV9nZyggZCwgYSwgYiwgYywgeFsgaSArIDEwIF0sIDksIDM4MDE2MDgzICk7XG4gICAgICAgIGMgPSBtZDVfZ2coIGMsIGQsIGEsIGIsIHhbIGkgKyAxNSBdLCAxNCwgLTY2MDQ3ODMzNSApO1xuICAgICAgICBiID0gbWQ1X2dnKCBiLCBjLCBkLCBhLCB4WyBpICsgNCBdLCAyMCwgLTQwNTUzNzg0OCApO1xuICAgICAgICBhID0gbWQ1X2dnKCBhLCBiLCBjLCBkLCB4WyBpICsgOSBdLCA1LCA1Njg0NDY0MzggKTtcbiAgICAgICAgZCA9IG1kNV9nZyggZCwgYSwgYiwgYywgeFsgaSArIDE0IF0sIDksIC0xMDE5ODAzNjkwICk7XG4gICAgICAgIGMgPSBtZDVfZ2coIGMsIGQsIGEsIGIsIHhbIGkgKyAzIF0sIDE0LCAtMTg3MzYzOTYxICk7XG4gICAgICAgIGIgPSBtZDVfZ2coIGIsIGMsIGQsIGEsIHhbIGkgKyA4IF0sIDIwLCAxMTYzNTMxNTAxICk7XG4gICAgICAgIGEgPSBtZDVfZ2coIGEsIGIsIGMsIGQsIHhbIGkgKyAxMyBdLCA1LCAtMTQ0NDY4MTQ2NyApO1xuICAgICAgICBkID0gbWQ1X2dnKCBkLCBhLCBiLCBjLCB4WyBpICsgMiBdLCA5LCAtNTE0MDM3ODQgKTtcbiAgICAgICAgYyA9IG1kNV9nZyggYywgZCwgYSwgYiwgeFsgaSArIDcgXSwgMTQsIDE3MzUzMjg0NzMgKTtcbiAgICAgICAgYiA9IG1kNV9nZyggYiwgYywgZCwgYSwgeFsgaSArIDEyIF0sIDIwLCAtMTkyNjYwNzczNCApO1xuICAgICAgICBhID0gbWQ1X2hoKCBhLCBiLCBjLCBkLCB4WyBpICsgNSBdLCA0LCAtMzc4NTU4ICk7XG4gICAgICAgIGQgPSBtZDVfaGgoIGQsIGEsIGIsIGMsIHhbIGkgKyA4IF0sIDExLCAtMjAyMjU3NDQ2MyApO1xuICAgICAgICBjID0gbWQ1X2hoKCBjLCBkLCBhLCBiLCB4WyBpICsgMTEgXSwgMTYsIDE4MzkwMzA1NjIgKTtcbiAgICAgICAgYiA9IG1kNV9oaCggYiwgYywgZCwgYSwgeFsgaSArIDE0IF0sIDIzLCAtMzUzMDk1NTYgKTtcbiAgICAgICAgYSA9IG1kNV9oaCggYSwgYiwgYywgZCwgeFsgaSArIDEgXSwgNCwgLTE1MzA5OTIwNjAgKTtcbiAgICAgICAgZCA9IG1kNV9oaCggZCwgYSwgYiwgYywgeFsgaSArIDQgXSwgMTEsIDEyNzI4OTMzNTMgKTtcbiAgICAgICAgYyA9IG1kNV9oaCggYywgZCwgYSwgYiwgeFsgaSArIDcgXSwgMTYsIC0xNTU0OTc2MzIgKTtcbiAgICAgICAgYiA9IG1kNV9oaCggYiwgYywgZCwgYSwgeFsgaSArIDEwIF0sIDIzLCAtMTA5NDczMDY0MCApO1xuICAgICAgICBhID0gbWQ1X2hoKCBhLCBiLCBjLCBkLCB4WyBpICsgMTMgXSwgNCwgNjgxMjc5MTc0ICk7XG4gICAgICAgIGQgPSBtZDVfaGgoIGQsIGEsIGIsIGMsIHhbIGkgKyAwIF0sIDExLCAtMzU4NTM3MjIyICk7XG4gICAgICAgIGMgPSBtZDVfaGgoIGMsIGQsIGEsIGIsIHhbIGkgKyAzIF0sIDE2LCAtNzIyNTIxOTc5ICk7XG4gICAgICAgIGIgPSBtZDVfaGgoIGIsIGMsIGQsIGEsIHhbIGkgKyA2IF0sIDIzLCA3NjAyOTE4OSApO1xuICAgICAgICBhID0gbWQ1X2hoKCBhLCBiLCBjLCBkLCB4WyBpICsgOSBdLCA0LCAtNjQwMzY0NDg3ICk7XG4gICAgICAgIGQgPSBtZDVfaGgoIGQsIGEsIGIsIGMsIHhbIGkgKyAxMiBdLCAxMSwgLTQyMTgxNTgzNSApO1xuICAgICAgICBjID0gbWQ1X2hoKCBjLCBkLCBhLCBiLCB4WyBpICsgMTUgXSwgMTYsIDUzMDc0MjUyMCApO1xuICAgICAgICBiID0gbWQ1X2hoKCBiLCBjLCBkLCBhLCB4WyBpICsgMiBdLCAyMywgLTk5NTMzODY1MSApO1xuICAgICAgICBhID0gbWQ1X2lpKCBhLCBiLCBjLCBkLCB4WyBpICsgMCBdLCA2LCAtMTk4NjMwODQ0ICk7XG4gICAgICAgIGQgPSBtZDVfaWkoIGQsIGEsIGIsIGMsIHhbIGkgKyA3IF0sIDEwLCAxMTI2ODkxNDE1ICk7XG4gICAgICAgIGMgPSBtZDVfaWkoIGMsIGQsIGEsIGIsIHhbIGkgKyAxNCBdLCAxNSwgLTE0MTYzNTQ5MDUgKTtcbiAgICAgICAgYiA9IG1kNV9paSggYiwgYywgZCwgYSwgeFsgaSArIDUgXSwgMjEsIC01NzQzNDA1NSApO1xuICAgICAgICBhID0gbWQ1X2lpKCBhLCBiLCBjLCBkLCB4WyBpICsgMTIgXSwgNiwgMTcwMDQ4NTU3MSApO1xuICAgICAgICBkID0gbWQ1X2lpKCBkLCBhLCBiLCBjLCB4WyBpICsgMyBdLCAxMCwgLTE4OTQ5ODY2MDYgKTtcbiAgICAgICAgYyA9IG1kNV9paSggYywgZCwgYSwgYiwgeFsgaSArIDEwIF0sIDE1LCAtMTA1MTUyMyApO1xuICAgICAgICBiID0gbWQ1X2lpKCBiLCBjLCBkLCBhLCB4WyBpICsgMSBdLCAyMSwgLTIwNTQ5MjI3OTkgKTtcbiAgICAgICAgYSA9IG1kNV9paSggYSwgYiwgYywgZCwgeFsgaSArIDggXSwgNiwgMTg3MzMxMzM1OSApO1xuICAgICAgICBkID0gbWQ1X2lpKCBkLCBhLCBiLCBjLCB4WyBpICsgMTUgXSwgMTAsIC0zMDYxMTc0NCApO1xuICAgICAgICBjID0gbWQ1X2lpKCBjLCBkLCBhLCBiLCB4WyBpICsgNiBdLCAxNSwgLTE1NjAxOTgzODAgKTtcbiAgICAgICAgYiA9IG1kNV9paSggYiwgYywgZCwgYSwgeFsgaSArIDEzIF0sIDIxLCAxMzA5MTUxNjQ5ICk7XG4gICAgICAgIGEgPSBtZDVfaWkoIGEsIGIsIGMsIGQsIHhbIGkgKyA0IF0sIDYsIC0xNDU1MjMwNzAgKTtcbiAgICAgICAgZCA9IG1kNV9paSggZCwgYSwgYiwgYywgeFsgaSArIDExIF0sIDEwLCAtMTEyMDIxMDM3OSApO1xuICAgICAgICBjID0gbWQ1X2lpKCBjLCBkLCBhLCBiLCB4WyBpICsgMiBdLCAxNSwgNzE4Nzg3MjU5ICk7XG4gICAgICAgIGIgPSBtZDVfaWkoIGIsIGMsIGQsIGEsIHhbIGkgKyA5IF0sIDIxLCAtMzQzNDg1NTUxICk7XG4gICAgICAgIGEgPSBzYWZlX2FkZCggYSwgb2xkYSApO1xuICAgICAgICBiID0gc2FmZV9hZGQoIGIsIG9sZGIgKTtcbiAgICAgICAgYyA9IHNhZmVfYWRkKCBjLCBvbGRjICk7XG4gICAgICAgIGQgPSBzYWZlX2FkZCggZCwgb2xkZCApXG4gICAgfTtcbiAgICByZXR1cm4gQXJyYXkoIGEsIGIsIGMsIGQgKVxufTtcblxuLy9UaGVzZSBmdW5jdGlvbnMgaW1wbGVtZW50IHRoZSBmb3VyIGJhc2ljIG9wZXJhdGlvbnMgdGhlIGFsZ29yaXRobSB1c2VzLlxuZnVuY3Rpb24gbWQ1X2NtbiggcSwgYSwgYiwgeCwgcywgdCApIHsgcmV0dXJuIHNhZmVfYWRkKCBiaXRfcm9sKCBzYWZlX2FkZCggc2FmZV9hZGQoIGEsIHEgKSwgc2FmZV9hZGQoIHgsIHQgKSApLCBzICksIGIgKSB9O1xuXG5mdW5jdGlvbiBtZDVfZmYoIGEsIGIsIGMsIGQsIHgsIHMsIHQgKSB7IHJldHVybiBtZDVfY21uKCAoIGIgJiBjICkgfCAoICggfmIgKSAmIGQgKSwgYSwgYiwgeCwgcywgdCApIH07XG5cbmZ1bmN0aW9uIG1kNV9nZyggYSwgYiwgYywgZCwgeCwgcywgdCApIHsgcmV0dXJuIG1kNV9jbW4oICggYiAmIGQgKSB8ICggYyAmICggfmQgKSApLCBhLCBiLCB4LCBzLCB0ICkgfTtcblxuZnVuY3Rpb24gbWQ1X2hoKCBhLCBiLCBjLCBkLCB4LCBzLCB0ICkgeyByZXR1cm4gbWQ1X2NtbiggYiBeIGMgXiBkLCBhLCBiLCB4LCBzLCB0ICkgfTtcblxuZnVuY3Rpb24gbWQ1X2lpKCBhLCBiLCBjLCBkLCB4LCBzLCB0ICkgeyByZXR1cm4gbWQ1X2NtbiggYyBeICggYiB8ICggfmQgKSApLCBhLCBiLCB4LCBzLCB0ICkgfTtcblxuLy9CaXR3aXNlIHJvdGF0ZSBhIDMyLWJpdCBudW1iZXIgdG8gdGhlIGxlZnQuXG5mdW5jdGlvbiBiaXRfcm9sKCBudW0sIGNudCApIHsgcmV0dXJuICggbnVtIDw8IGNudCApIHwgKCBudW0gPj4+ICggMzIgLSBjbnQgKSApIH07XG5cbi8vQ29udmVydCBhIHN0cmluZyB0byBhbiBhcnJheSBvZiBsaXR0bGUtZW5kaWFuIHdvcmRzXG4vL0lmIGNocnN6IGlzIEFTQ0lJLCBjaGFyYWN0ZXJzID4yNTUgaGF2ZSB0aGVpciBoaS1ieXRlIHNpbGVudGx5IGlnbm9yZWQuXG5mdW5jdGlvbiBzdHIyYmlubCggc3RyICkgeyB2YXIgYmluID0gQXJyYXkoKTsgdmFyIG1hc2sgPSAoIDEgPDwgY2hyc3ogKSAtIDE7IGZvciAoIHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGggKiBjaHJzejsgaSArPSBjaHJzeiApIHsgYmluWyBpID4+IDUgXSB8PSAoIHN0ci5jaGFyQ29kZUF0KCBpIC8gY2hyc3ogKSAmIG1hc2sgKSA8PCAoIGkgJSAzMiApIH07IHJldHVybiBiaW4gfTtcblxuLy9Db252ZXJ0IGFuIGFycmF5IG9mIGxpdHRsZS1lbmRpYW4gd29yZHMgdG8gYSBzdHJpbmdcbmZ1bmN0aW9uIGJpbmwyc3RyKCBiaW4gKSB7IHZhciBzdHIgPSBcIlwiOyB2YXIgbWFzayA9ICggMSA8PCBjaHJzeiApIC0gMTsgZm9yICggdmFyIGkgPSAwOyBpIDwgYmluLmxlbmd0aCAqIDMyOyBpICs9IGNocnN6ICkgeyBzdHIgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSggKCBiaW5bIGkgPj4gNSBdID4+PiAoIGkgJSAzMiApICkgJiBtYXNrICkgfTsgcmV0dXJuIHN0ciB9O1xuXG4vL0NvbnZlcnQgYW4gYXJyYXkgb2YgbGl0dGxlLWVuZGlhbiB3b3JkcyB0byBhIGhleCBzdHJpbmcuXG5mdW5jdGlvbiBiaW5sMmhleCggYmluYXJyYXkgKSB7IHZhciBoZXhfdGFiID0gaGV4Y2FzZSA/IFwiMDEyMzQ1Njc4OUFCQ0RFRlwiIDogXCIwMTIzNDU2Nzg5YWJjZGVmXCI7IHZhciBzdHIgPSBcIlwiOyBmb3IgKCB2YXIgaSA9IDA7IGkgPCBiaW5hcnJheS5sZW5ndGggKiA0OyBpKysgKSB7IHN0ciArPSBoZXhfdGFiLmNoYXJBdCggKCBiaW5hcnJheVsgaSA+PiAyIF0gPj4gKCAoIGkgJSA0ICkgKiA4ICsgNCApICkgJiAweEYgKSArIGhleF90YWIuY2hhckF0KCAoIGJpbmFycmF5WyBpID4+IDIgXSA+PiAoICggaSAlIDQgKSAqIDggKSApICYgMHhGICkgfTsgcmV0dXJuIHN0ciB9O1xuXG4vL0NvbnZlcnQgYW4gYXJyYXkgb2YgbGl0dGxlLWVuZGlhbiB3b3JkcyB0byBhIGJhc2UtNjQgc3RyaW5nXG5mdW5jdGlvbiBiaW5sMmI2NCggYmluYXJyYXkgKSB7XG4gICAgdmFyIHRhYiA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrL1wiO1xuICAgIHZhciBzdHIgPSBcIlwiO1xuICAgIGZvciAoIHZhciBpID0gMDsgaSA8IGJpbmFycmF5Lmxlbmd0aCAqIDQ7IGkgKz0gMyApIHtcbiAgICAgICAgdmFyIHRyaXBsZXQgPSAoICggKCBiaW5hcnJheVsgaSA+PiAyIF0gPj4gOCAqICggaSAlIDQgKSApICYgMHhGRiApIDw8IDE2ICkgfCAoICggKCBiaW5hcnJheVsgaSArIDEgPj4gMiBdID4+IDggKiAoICggaSArIDEgKSAlIDQgKSApICYgMHhGRiApIDw8IDggKSB8ICggKCBiaW5hcnJheVsgaSArIDIgPj4gMiBdID4+IDggKiAoICggaSArIDIgKSAlIDQgKSApICYgMHhGRiApO1xuICAgICAgICBmb3IgKCB2YXIgaiA9IDA7IGogPCA0OyBqKysgKSB7XG4gICAgICAgICAgICBpZiAoIGkgKiA4ICsgaiAqIDYgPiBiaW5hcnJheS5sZW5ndGggKiAzMiApIHN0ciArPSBiNjRwYWQ7XG4gICAgICAgICAgICBlbHNlIHN0ciArPSB0YWIuY2hhckF0KCAoIHRyaXBsZXQgPj4gNiAqICggMyAtIGogKSApICYgMHgzRiApXG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBzdHJcbn07IiwiLy9nZW5lcmljIGdldCBsb2cgaW4gdGV4dCAtIGNhbGxlZCB0byBoaWRlIGFuZCBzaG93IGRpdnNcbmZ1bmN0aW9uIG1lbnVTaG93KCBuICkge1xuICAgICRqKCAnI20nICsgbiApLnNsaWRlRG93biggJ2Zhc3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgJGooICcjbScgKyBuICsgJ21haW4nICkuc2xpZGVEb3duKCAnZmFzdCcgKTtcbiAgICB9ICk7XG5cbiAgICAkaiggJyNtJyArIG4gKyAnIGg1IGRpdi5idG5NTScgKS5jc3MoIHsgYmFja2dyb3VuZFBvc2l0aW9uOiAnY2VudGVyIHRvcCcgfSApO1xufTtcblxuLy9hIHN1YiBtZW51IGlzIHNlbGVjdGVkIFxuZnVuY3Rpb24gaGxpdGVTdWIoIG9iaiApIHtcbiAgICBsID0gJGooIG9iaiApLnBhcmVudCgpO1xuICAgIHAgPSBsLnBhcmVudCgpO1xuXG4gICAgcC5jaGlsZHJlbigpLmVhY2goIGZ1bmN0aW9uKCkge1xuICAgICAgICAkaiggdGhpcyApLmNoaWxkcmVuKCkucmVtb3ZlQ2xhc3MoICdzZWxlY3RlZCcgKTtcbiAgICB9ICk7XG5cblxufTtcblxuLy90b2dnbGVzIHRoZSBjcGFuZWwgYnV0dG9uIHcgdGhlIG5leHQgbm9kZVxuZnVuY3Rpb24gbWVudVRvZ2dsZSggb2JqICkge1xuXG4gICAgLy9jb25zb2xlLmxvZyhvYmopO1xuXG4gICAgdG9nZ2xlZSA9ICRqKCBvYmoucGFyZW50Tm9kZSApLm5leHQoKTtcbiAgICAvL2NvbnNvbGUubG9nKHRvZ2dsZWUpO1xuXG4gICAgdG9nZ2xlZS5zbGlkZVRvZ2dsZSggXCJub3JtYWxcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGggPSAoIHRoaXMub2Zmc2V0SGVpZ2h0ICk7XG4gICAgICAgIGlmICggaCA+IDAgKSB7XG4gICAgICAgICAgICAkaiggb2JqICkuY3NzKCB7IGJhY2tncm91bmRQb3NpdGlvbjogJ2NlbnRlciB0b3AnIH0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRqKCBvYmogKS5jc3MoIHsgYmFja2dyb3VuZFBvc2l0aW9uOiAnY2VudGVyIGJvdHRvbScgfSApO1xuICAgICAgICB9O1xuICAgIH0gKTtcbn07XG5cbmZ1bmN0aW9uIGNsb3NlQ3BhbmVsKCB4ICkge1xuICAgICRqKCAnI20nICsgeCApLnNsaWRlVXAoKTtcbn07XG5cbi8vc3dpY2ggYmV0d2VlbiBwYW5lcyBvbiBwcm9maWxlXG5mdW5jdGlvbiB0b2dnbGVQcm9maWxlKCB3aGljaCApIHtcblxuICAgIC8vc2hvdyBhbGwgdGhlIHRhYnNcbiAgICAkaiggJ3VsLnByb2ZpbGVFZGl0IGxpJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuICAgICAgICAkaiggdGhpcyApLmNzcyggeyBkaXNwbGF5OiBcImlubGluZVwiIH0gKTtcbiAgICB9ICk7XG5cbiAgICAvL2hpZGUgdGhlIHNlbGVjdGVkIHRhYlxuICAgICRqKCAnI3Byb2ZpbGVMaW5rJyArIHdoaWNoICkuY3NzKCB7IGRpc3BsYXk6IFwibm9uZVwiIH0gKTtcblxuXG4gICAgLy9oaWRlIGFsbCBjb250ZW50IHRhYnNcbiAgICAkaiggJ2Rpdi5wcm9maWxlVGFiJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuICAgICAgICAkaiggdGhpcyApLmNzcyggeyBkaXNwbGF5OiBcIm5vbmVcIiB9ICk7XG4gICAgfSApO1xuXG4gICAgLy9zaG93IHRoZSByaWdodCBwcm9maWxlIHRhYlxuICAgICRqKCAnI3Byb2ZpbGUnICsgd2hpY2ggKS5jc3MoIHsgZGlzcGxheTogXCJibG9ja1wiIH0gKTtcblxufTtcblxuLy9zZW5kIGluIHVzZXIgcHJvZmlsZVxuZnVuY3Rpb24gc2VuZFByb2ZpbGUoKSB7XG4gICAgcXVlcnkgPSBwcmVwRm9yUXVlcnkoIGdldEZvcm1WYXJzKCAnY3BfcHJvZicgKSApO1xuXG4gICAgJGouYWpheCgge1xuICAgICAgICBkYXRhOiBxdWVyeSxcbiAgICAgICAgc3VjY2VzczogcmVjUHJvZixcbiAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICB1cmw6ICdwcm9maWxlL3VwZGF0ZSdcbiAgICB9ICk7XG59O1xuXG5mdW5jdGlvbiByZWNQcm9mKCBqc29uICkge1xuICAgIGV2YWwoICdyZXNwb25zZSA9ICcgKyBqc29uICk7XG5cbiAgICAkaiggJyNwcm9maWxlSFRNTCcgKS5odG1sKCByZXNwb25zZS5wcm9maWxlICk7XG5cbiAgICB0b2dnbGVQcm9maWxlKCAxICk7XG59O1xuXG4vL3NlbmQgaW4gZXh0ZXJuYWwgaW5mb1xuZnVuY3Rpb24gc2VuZEV4dCgpIHtcbiAgICBxdWVyeSA9IHByZXBGb3JRdWVyeSggZ2V0Rm9ybVZhcnMoICdjcF9leHQnICkgKTtcblxuICAgICRqLmFqYXgoIHtcbiAgICAgICAgdXJsOiAncHJvZmlsZS91cGRhdGUtZXh0JyxcbiAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICBkYXRhOiBxdWVyeSxcbiAgICAgICAgc3VjY2VzczogcmVjRXh0XG4gICAgfSApO1xuXG4gICAgcCA9ICRqKCAnI3Byb2ZpbGVOZXdMaW5rJyApLmdldCggMCApO1xuICAgIHBbIHAuc2VsZWN0ZWRJbmRleCBdLnNldEF0dHJpYnV0ZSggJ3VzZXJuYW1lJywgJGooICcjZXh0TGluaycgKS52YWwoKSApO1xuXG59O1xuXG5mdW5jdGlvbiByZWNFeHQoIGpzb24gKSB7XG4gICAgZXZhbCggJ3Jlc3BvbnNlID0gJyArIGpzb24gKTtcbiAgICAkaiggJyN1c2VyRXh0ZXJuYWwnICkuaHRtbCggcmVzcG9uc2UubGlua3MgKTtcbn07XG5cbi8vZm9yIGNoYW5naW5nIHZhbHVlcyBmb3IgZXhlcm5hbCBzaXRlc1xuZnVuY3Rpb24gdXBkYXRlRXh0KCkge1xuICAgIHMgPSAkaiggJyNwcm9maWxlTmV3TGluaycgKS5nZXQoIDAgKTtcblxuICAgIHYgPSBzLnNlbGVjdGVkSW5kZXg7XG5cbiAgICB1cmwgPSBzWyB2IF0uZ2V0QXR0cmlidXRlKCAndXJsJyApO1xuXG4gICAgaWYgKCAhdXJsICkge1xuICAgICAgICAkaiggJyNleHRMaW5rJyApLnZhbCggJycgKTtcbiAgICAgICAgJGooICcjeGxpbmtsYWJlbCcgKS5odG1sKCAnJm5ic3A7JyApO1xuICAgICAgICByZXR1cm47XG4gICAgfTtcblxuICAgIGIgPSB1cmwuc3Vic3RyKCAwLCB1cmwuaW5kZXhPZiggJyUnICkgKTtcbiAgICBsZW4gPSAoIHVybC5pbmRleE9mKCAnJScsIHVybC5pbmRleE9mKCAnJScgKSArIDEgKSAtIDIgKSAtIHVybC5pbmRleE9mKCAnJScgKSArIDE7XG5cbiAgICB1ID0gdXJsLnN1YnN0ciggdXJsLmluZGV4T2YoICclJyApICsgMSwgbGVuICk7XG4gICAgdiA9IHNbIHYgXS5nZXRBdHRyaWJ1dGUoIHUgKTtcblxuICAgIGlmICggdiA9PSAnbnVsbCcgKSB7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICAkaiggJyNleHRMaW5rJyApLnZhbCggdiApO1xuICAgIH07XG5cbiAgICAkaiggJyN4bGlua2xhYmVsJyApLmh0bWwoIGIgKTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vc2NyZWVuIGluZm9ybWF0aW9uXG5nbG9iYWwubXlTaXplID0ge1xuICAgIGhlaWdodDogMCwgLy9oZWlnaHQgb2Ygc2NyZWVuXG4gICAgd2lkdGg6IDAsIC8vd2lkdGggb2Ygc2NyZWVuXG4gICAgY3BhbmVseDogLTEwLCAvL3ggbG9jIG9mIGxlZnQgc2lkZSBvZiBjcGFuZWxcbiAgICBjcGFuZWx5OiAtNSwgLy8geSBsb2Mgb2YgdG9wIG9mIGNwYW5lbFxuICAgIG51bUNvbHM6IDAsIC8vIG51bWJlciBvZiBjb2x1bW5zIHRvIGRyYXcgYXQgb25jZVxuICAgIG51bVJvd3M6IDAsIC8vIG51bWJlciBvZiByb3dzIHRvIGRyYXcgYXQgb25jZVxuICAgIG15WDogMjI4MDk2MCwgLy94IGxvYyBvZiBzY3JlZW4gLy8gMjI4MDk2MFxuICAgIG15WTogMjI4MDk2MCwgLy95IGxvYyBvZiBzY3JlZW5cbiAgICBvZmZzZXRMZWZ0OiAwLFxuICAgIG9uZUZvb3Q6IDg2NCwgLy9waXhlbCB3aWR0aCBvZiBvbmUgZm9vdFxuICAgIHRvdGFsV2lkdGg6IDAsIC8vcGl4ZWwgd2lkdGggb2YgYWxsIGZlZXQgZHJhd25cbiAgICB0b3RhbEhlaWdodDogMCwgLy9waXhlbCBoZWlnaHQgb2YgYWxsIGZlZXQgZHJhd25cbiAgICB0cmF2ZWxsaW5nOiAwLCAvL3ZhbHVlIHJlcHJlc3RlbnRpbmcgYXV0b21hdGljIHRyYXZlbCBzdGF0dXMsIDAgPSBub3QgbW92aW5nLiAxIC0gbW92aW5nIGF1dG9tYXRpYyAoZ29Ub0xvYykuIDIgLSBkcmFnZ2luZyBzcXVhcmUgbWlsZVxuICAgIGhhc2g6IFwiXCIsIC8vIHRoZSBoYXNoICgjKSBrZWVwcyB0cmFjayBvZiBsb2NhdGlvblxuICAgIGhhc2h0cmFjazogMSwgLy8wIGZvciBzYWZhcmkgMlxuICAgIGludGVydmFsdGltZTogMzAwLCAvL2Ftb3VudCBvZiBtaWxsaXNlY29uZHMgdG8gY2hlY2sgdGhlIGhhc2hcbiAgICBzY2FsZTogMzYsIC8vcHBpXG4gICAgbWFnOiAxIC8vdG8gc2hvdyBtdWx0aXBsZSBmZWV0IGluc2lkZSAxIGRpdlxufTtcblxuLy92YXJpYWJsZXMgZm9yIHBpYyB3ZSBhcmUgYWRkaW5nIHRvIHRoZSBtaWxlXG5nbG9iYWwuYWRkUGljID0ge1xuICAgIHdpZHRoOiAwLCAvL3dpZHRoIGluIGluY2hlcyBcbiAgICBoZWlnaHQ6IDAsIC8vaGVpZ2h0IGluIGluY2hlcyBcbiAgICBzb3VyY2U6IFwiXCIsXG4gICAgaW5jaFg6IDAsIC8vaW5jaGVzIGZyb20gdG9wIGxlZnQsICgwLDApXG4gICAgaW5jaFk6IDAsIC8vXG4gICAgdHlwZUlkOiBcIlwiLFxuICAgIGFuaW1hdGU6IFwiXCIsIC8vIGhvbGRzIGEgbW90aW9ucGFjayBvYmplY3QsXG4gICAgbW92ZToge1xuICAgICAgICB4OiAwLFxuICAgICAgICB5OiAwLFxuICAgICAgICBpZDogMFxuICAgIH0gLy90aGUgZWxlbWVudCBpZiB3ZSBhcmUgbW92aW5nIGFuIGltYWdlIGFscmVhZHkgb24gdGhlIG1pbGVcbn07XG5cbi8va2VlcHMgdHJhY2sgb2Ygd2hpY2ggZWxlbWVudCBpcyBzZWxlY3RlZFxuZ2xvYmFsLnNlbGVjdGVkRWxlbWVudCA9IHtcbiAgICB0b1NlbGVjdDogbnVsbCwgLy90byBzZWxlY3Qgb25jZSB0cmF2ZWxpbmcgaXMgZG9uZSAsIGJ5IGlkXG4gICAgaXNTZWxlY3RlZDogbnVsbCAvL2N1cnJlbnRseSBzZWxlY3RlZFxufTsiLCIkaiggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgY29udGFpbmVySGVpZ2h0ID0gMDtcblxuICAgIC8vYWRkIGpzIHRvIHJlc2V0IHBhc3N3b3JkXG4gICAgJGooICdhI2xvZ2luSGVscCcgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgICRqKCAnI2xvZ2luRm9yZ290JyApLnNsaWRlVG9nZ2xlKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9ICk7XG5cbiAgICAkaiggJ2Zvcm0jbG9naW5Gb3Jnb3QnICkuc3VibWl0KCBmdW5jdGlvbigpIHtcblxuICAgICAgICBxdWVyeSA9IHByZXBBcnJheUZvckFqYXgoIGdldEZvcm1WYXJzKCAnbG9naW5Gb3Jnb3QnICkgKTtcblxuICAgICAgICAkai5hamF4KCB7XG4gICAgICAgICAgICB1cmw6IHRoaXMuYWN0aW9uLFxuICAgICAgICAgICAgc3VjY2Vzczogc2hvd0ZvcmdvdFJlc3BvbnNlLFxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgZGF0YTogcXVlcnlcbiAgICAgICAgfSApO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSApO1xuXG4gICAgLy9qcyBoZWxwZXIgaW4gc2lnbiB1cFxuICAgICRqKCAnZm9ybSNzaWdudXAgaW5wdXQnICkuZWFjaCggZnVuY3Rpb24oKSB7XG4gICAgICAgICRqKCB0aGlzICkuZm9jdXMoIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGooIHRoaXMgKS5wYXJlbnQoKS5uZXh0KCAncC5sb2dpbkhlbHBlclRleHQnICkuc2xpZGVEb3duKCk7XG4gICAgICAgIH0gKTtcblxuICAgICAgICAkaiggdGhpcyApLmJsdXIoIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGooIHRoaXMgKS5wYXJlbnQoKS5uZXh0KCAncC5sb2dpbkhlbHBlclRleHQnICkuc2xpZGVVcCgpO1xuICAgICAgICB9ICk7XG5cbiAgICB9ICk7XG5cbiAgICAvL2pzIHRvIGxvZ2luIGZvcm1cbiAgICAkaiggJ2Zvcm0jbG9naW5Gb3JtJyApLnN1Ym1pdCggZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbmRMb2dpbigpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSApO1xuXG4gICAgLy9qcyB0byBzaWdudXAgZm9ybVxuICAgICRqKCAnZm9ybSNzaWdudXAnICkuc3VibWl0KCBmdW5jdGlvbigpIHtcbiAgICAgICAgc2lnblVwKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9ICk7XG5cbiAgICAvL2NhbmNlbCBjbGlja3Mgb24gbWVudSBidXR0b25zXG4gICAgJGooICdkaXYubWVudUhlYWQgYScgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9ICk7XG5cbiAgICAvL2xvYWQgY29udHJvbCBwYW5lbFxuICAgIGFjdGl2YXRlQ3BhbmVsKCk7XG59ICk7XG5cbi8qKlxuICogIGFkZCBqcyB0byBjb250cm9sIHBhbmVsIFxuICogIEByZXR1cm4gYm9vbFxuICovXG5mdW5jdGlvbiBhY3RpdmF0ZUNwYW5lbCgpIHtcbiAgICAvL3ByaW1hcnkgaXRlbXNcbiAgICAkaiggJ3VsI2NvbnRyb2xQYW5lbCA+IGxpID4gYScgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgbGV0IHByaSA9ICRqKCB0aGlzICk7XG5cbiAgICAgICAgbGV0IGFjdGlvbiA9IHByaS5hdHRyKCAnYWN0aW9uJyApLFxuICAgICAgICAgICAgc3ViID0gcHJpLmF0dHIoICd0bycgKTtcblxuICAgICAgICBldmFsKCBhY3Rpb24gKTtcblxuICAgICAgICBpZiAoIHN1YiApIHtcbiAgICAgICAgICAgIC8vaGFuZGxlIHByaW1hcnkgc2VsZWN0ZWQgaXRlbXNcbiAgICAgICAgICAgICRqKCAnZGl2I2NvbnRyb2wxIHVsIGxpIGEnICkucmVtb3ZlQ2xhc3MoICdzZWxlY3RlZCcgKTtcbiAgICAgICAgICAgIHByaS5hZGRDbGFzcyggJ3NlbGVjdGVkJyApO1xuXG4gICAgICAgICAgICAkaiggJ2RpdiNjb250cm9sMiB1bC5zdWJtZW51JyApLmNzcyggeyBkaXNwbGF5OiAnbm9uZScgfSApO1xuXG4gICAgICAgICAgICAkaiggJyMnICsgc3ViICkuY3NzKCB7IGRpc3BsYXk6ICdibG9jaycgfSApO1xuXG4gICAgICAgICAgICAvL3NlY29uZGFyeSBpdGVtc1xuICAgICAgICAgICAgJGooICdkaXYjY29udHJvbDIgPiB1bCA+IGxpID4gYScgKS51bmJpbmQoKTtcblxuICAgICAgICAgICAgJGooICdkaXYjY29udHJvbDIgPiB1bCA+IGxpID4gYScgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbGV0ICRsaW5rID0gJGooIHRoaXMgKTtcblxuICAgICAgICAgICAgICAgIGxldCBhY3Rpb24gPSAkbGluay5hdHRyKCAnYWN0aW9uJyApO1xuXG4gICAgICAgICAgICAgICAgZXZhbCggYWN0aW9uICk7XG5cbiAgICAgICAgICAgICAgICAvL2hhbmRsZSBzZWxlY3Rpb25cbiAgICAgICAgICAgICAgICAkaiggJ2RpdiNjb250cm9sMiB1bCBsaSBhJyApLnJlbW92ZUNsYXNzKCAnc2VsZWN0ZWQnICk7XG4gICAgICAgICAgICAgICAgJGxpbmsuYWRkQ2xhc3MoICdzZWxlY3RlZCcgKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSApO1xufTtcblxuLy9zaG93IHJlc3BvbnNlIGZyb20gcmVzZXQgcGFzc3dvcmRcbmZ1bmN0aW9uIHNob3dGb3Jnb3RSZXNwb25zZSgganNvbiApIHtcbiAgICBldmFsKCAncmVzcG9uc2U9JyArIGpzb24gKTtcblxuICAgIGlmICggcmVzcG9uc2UubWVzc2FnZSApIHtcbiAgICAgICAgJGooICcjcmVzZXRNZXNzYWdlJyApLmh0bWwoIHJlc3BvbnNlLm1lc3NhZ2UgKS5zbGlkZURvd24oKTtcbiAgICB9O1xuXG4gICAgaWYgKCByZXNwb25zZS5zdWNjZXNzID09IHRydWUgKSB7XG4gICAgICAgICRqKCAnI2xvZ2luRm9yZ290JyApLnNsaWRlVXAoKTtcbiAgICB9O1xufTtcblxubGV0IGluaXQgPSBmYWxzZTsgLy9zZXQgdG8gdHJ1ZSBvbmNlIHNjcmVlbiBoYXMgbG9hZGVkXG5cbi8vc2FmYXJpIDwgMyBkb2VzIG5vdCBnZXQgaGFzaCB0cmFja2luZyFcbi8qXG5pZiAoQnJvd3NlckRldGVjdC5icm93c2VyID09ICdTYWZhcmknICYmIEJyb3dzZXJEZXRlY3QudmVyc2lvbiA8IDUwMCl7XG5cdG15U2l6ZS5oYXNodHJhY2sgPSAwO1xufSBlbHNlIHtcblx0Ly9zZWUgaWYgaGFzaCBoYXMgY2hhbmdlZFxuXHR2YXIgY2hlY2tJbnRlcnZhbCA9IHNldEludGVydmFsKGNoZWNrSGFzaCwgbXlTaXplLmludGVydmFsdGltZSk7XG59O1xuKi9cblxudmFyIGxvYWRQaWNzID0gbmV3IEFycmF5KCk7XG52YXIgbG9hZEFycmF5ID0gbmV3IEFycmF5KCk7XG5cbnZhciByZWd4ID0gJyc7XG52YXIgcmVneSA9ICcnO1xudmFyIHJlZ3MgPSAnJztcbnZhciBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2g7XG5cbnJlZ3ggKz0gaGFzaC5tYXRjaCggL3g9KlxcZCovICk7XG5yZWd5ICs9IGhhc2gubWF0Y2goIC95PSpcXGQqLyApO1xucmVncyArPSBoYXNoLm1hdGNoKCAvcz0qXFxkKi8gKTtcblxucmVneCA9IHBhcnNlSW50KCByZWd4LnN1YnN0ciggMiApICk7XG5yZWd5ID0gcGFyc2VJbnQoIHJlZ3kuc3Vic3RyKCAyICkgKTtcbnJlZ3MgPSBwYXJzZUludCggcmVncy5yZXBsYWNlKCAncz0nLCAnJyApICk7XG5cblxuaWYgKCAhaXNOYU4oIHJlZ3ggKSAmJiAhaXNOYU4oIHJlZ3kgKSApIHtcbiAgICBteVNpemUubXlYID0gcmVneDtcbiAgICBteVNpemUubXlZID0gcmVneTtcblxuICAgIGlmICggcmVncyApIHtcbiAgICAgICAgem9vbSggcmVncyApO1xuICAgIH07XG59O1xuXG4vL2NvbnRyb2wgcGFuZWwgZnVuY3Rpb25zXG52YXIgY3BhbmVsQ29udHJvbHMgPSB7XG4gICAgbmF2czogQXJyYXkoKSxcbiAgICBjb250ZW50OiBBcnJheSgpLFxuICAgIGZyaWVuZHM6IEFycmF5KCksXG4gICAgcHJlZnM6IEFycmF5KCksXG4gICAgaGVscDogQXJyYXkoKVxufTtcblxuLy90aGlzIGtlZXBzIHRyYWNrIG9mIHRoZSBvYmplY3QgdGhhdCBpcyBiZWluZyBkcmFnZ2VkXG52YXIgZHJhZ2dpbmcgPSB7XG4gICAgb2JqZWN0OiAnJywgLy9pZCBvZiBvYmplY3RcbiAgICBvcGFjaXR5OiAxMDAgLy90cmFuc3BhcmVuY3lcbn07XG5cbnZhciBkcmFnUGxhbmUgPSBmYWxzZTtcblxuLy8gY2FsbGVkIG9uY2UgdG8gaW5pdGlhbGl6ZSB2YXJpYWJsZXNcblxuaWYgKCBkb2N1bWVudC5kb21haW4gPT0gXCJsb2NhbGhvc3RcIiApIHtcbiAgICB2YXIgZGVidWdPbiA9IDE7XG59IGVsc2Uge1xuICAgIHZhciBkZWJ1Z09uID0gMDtcbn07XG5cbnZhciBnb3RvWCA9IDA7XG52YXIgZ290b1kgPSAwO1xudmFyIHRyYXZlbFggPSAwO1xudmFyIHRyYXZlbFkgPSAwO1xudmFyIGNvdW50ZXIgPSAwO1xudmFyIGFsaXZlO1xuXG5mdW5jdGlvbiBzdGFydFRyYWNraW5nKCkge1xuICAgIGFsaXZlID0gc2V0SW50ZXJ2YWwoICdrZWVwQWxpdmUoKScsIDYwMDAwICk7XG59O1xuXG4vL3BlcnNpc3RhbnQgc2Vzc2lvbiBhbmQgdHJhY2tpbmdcbmZ1bmN0aW9uIGtlZXBBbGl2ZSgpIHtcblxuICAgICRqLmFqYXgoIHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgeDogbXlTaXplLm15WCxcbiAgICAgICAgICAgIHk6IG15U2l6ZS5teVlcbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogY29uZmlybUFsaXZlLFxuICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgIHVybDogJy9wcm9maWxlL2tlZXBhbGl2ZScsXG4gICAgfSApO1xufTtcblxuXG4vL2NhbGxlZCBvbiByZWNpZXZpbmcga2VlcEFsaXZlIHNjcmlwdFxuZnVuY3Rpb24gY29uZmlybUFsaXZlKCBqc29uICkge1xuXG4gICAgZXZhbCggXCJyZXNwb25zZSA9IFwiICsganNvbiApO1xuXG4gICAgLy9ub3QgbG9nZ2VkIGluIGFueW1vcmVcbiAgICBpZiAoIHJlc3BvbnNlLnN1Y2Nlc3MgIT0gdHJ1ZSApIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCggYWxpdmUgKTtcbiAgICB9O1xufTtcblxuLy9rZWVwIHRyYWNrIGlmIHdlIGFyZSBtb3Zpbmcgb3Igbm90XG52YXIgdHJhdmVsbGluZyA9IGZhbHNlO1xuXG52YXIgbmV3ZGl2ID0gZmFsc2U7XG5cbnZhciBzdWNjZXNzID0gZmFsc2U7XG5cbnZhciByZWxhdGl2ZXN0YXJ0WCA9IDA7XG52YXIgcmVsYXRpdmVzdGFydFkgPSAwO1xudmFyIHJlbGF0aXZlZW5kWCA9IDA7XG52YXIgcmVsYXRpdmVlbmRZID0gMDtcblxuLy9zZXQgdXAgb3RoZXIgZWxlbWVudHMgZm9yIGdsb2JhbCBhY2Nlc3MgXG52YXIgaW50SW50ZXJ2YWwgPSBudWxsOyAvLz93dXRcblxuLy9kZXRlcm1pbmluZyBhbW91bnQgb2Ygc3F1YXJlIGZlZXQgb24gc2NyZWVuIGF0IG9uY2VcbnZhciBzY2FsZTtcbnZhciBzcXVhcmVYID0gMDtcbnZhciBzcXVhcmVZID0gMDtcblxudmFyIHNjcm9sbGJhckxlZnQgPSAwO1xudmFyIHNjcm9sbGJhclRvcCA9IDA7XG5cbnZhciByZWJ1aWxkID0gZmFsc2U7XG5cbnZhciByZWJ1aWxkSWQgPSBcIm5vdGhpbmdcIjtcblxudmFyIGxvYWRGaWxlID0gXCJub3RoaW5nXCI7XG5cbi8vZG9uZSBzZXR0aW5nIHVwIHdpZHRoIGFuZCBoZWlnaHRcblxuLyoqXG4gKiBcbiAqL1xuZnVuY3Rpb24gc2l6ZUxCKCkge1xuICAgIGxldCBjb250YWluZXJIZWlnaHQgPSAkaiggJyNsaWdodGJveGxpZ2h0JyApLmhlaWdodCgpO1xuXG4gICAgJGooICcjbGlnaHRib3hjb250ZW50JyApLmNzcygge1xuICAgICAgICBoZWlnaHQ6IGNvbnRhaW5lckhlaWdodCAtIDI1ICsgXCJweFwiXG4gICAgfSApO1xufTtcblxuLy9zZXQgdXAgd2luZG93IGRpbWVuc2lvbnMgLyBwcm9wZXJ0aWVzXG5mdW5jdGlvbiBzZXRTY3JlZW5DbGFzcygpIHtcblxuICAgIGlmICggd2luZG93LmlubmVyV2lkdGggKSB7XG4gICAgICAgIC8vIGdvb2QgYnJvd3NlcnNcbiAgICAgICAgbXlTaXplLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIG15U2l6ZS5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgfSBlbHNlIGlmICggZG9jdW1lbnQuYm9keS5vZmZzZXRXaWR0aCApIHtcbiAgICAgICAgLy8gSUVcbiAgICAgICAgbXlTaXplLndpZHRoID0gZG9jdW1lbnQuYm9keS5vZmZzZXRXaWR0aDtcbiAgICAgICAgbXlTaXplLmhlaWdodCA9IGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0O1xuICAgIH07XG5cbiAgICAkaiggJyNzcXVhcmVtaWxlJyApLmNzcygge1xuICAgICAgICB3aWR0aDogbXlTaXplLndpZHRoICsgXCJweFwiLFxuICAgICAgICBoZWlnaHQ6IG15U2l6ZS5oZWlnaHQgKyBcInB4XCIsXG4gICAgICAgIHRvcDogJzBweCcsXG4gICAgICAgIGxlZnQ6ICcwcHgnXG4gICAgfSApO1xuXG4gICAgLy8gaWYgdGhlIGxpZ2h0Ym94IGlzIHNob3dpbmcsIHRoZW4gcmVzaXplIHRoZSBjb250ZW50XG4gICAgc2l6ZUxCKCk7XG5cbiAgICAvLyBzZXQgY3BhbmVsIGxvY2F0aW9uXG4gICAgJGooICcjY3BhbmVsJyApLmNzcygge1xuICAgICAgICBsZWZ0OiBteVNpemUuY3BhbmVseCArIFwicHhcIixcbiAgICAgICAgdG9wOiBteVNpemUuY3BhbmVseSArIFwicHhcIlxuICAgIH0gKTtcblxuICAgIC8vIGZpZ3VyZSBvdXQgaG93IG1hbnkgcm93cyBhbmQgY29scyB0byBkcmF3IGF0IG9uY2UgXG4gICAgbXlTaXplLm9uZUZvb3QgPSAoIG15U2l6ZS5zY2FsZSAqIDEyICk7XG5cbiAgICAvLyBzZWUgaWYgd2UgbmVlZCB0byByZW1vdmUgYW55IGZvb3QgZGl2c1xuICAgIGlmICggbXlTaXplLm51bUNvbHMgKSB7XG4gICAgICAgIG15U2l6ZS5vbGRDb2xzID0gbXlTaXplLm51bUNvbHM7XG4gICAgICAgIG15U2l6ZS5vbGRSb3dzID0gbXlTaXplLm51bVJvd3M7XG4gICAgfTtcblxuICAgIG15U2l6ZS5udW1Db2xzID0gTWF0aC5jZWlsKCBteVNpemUud2lkdGggLyAoIG15U2l6ZS5vbmVGb290ICogbXlTaXplLm1hZyApICkgKyAzOyAvLyBudW1iZXIgb2YgY29sdW1ucyB0byBkcmF3IGF0IG9uY2VcbiAgICBteVNpemUubnVtUm93cyA9IE1hdGguY2VpbCggbXlTaXplLmhlaWdodCAvICggbXlTaXplLm9uZUZvb3QgKiBteVNpemUubWFnICkgKSArIDM7IC8vIG51bWJlciBvZiByb3dzIHRvIGRyYXcgYXQgb25jZVxuXG4gICAgbXlTaXplLm51bUNvbHMgKz0gKCBteVNpemUubnVtQ29scyAlIDIgKTtcbiAgICBteVNpemUubnVtUm93cyArPSAoIG15U2l6ZS5udW1Sb3dzICUgMiApO1xuXG4gICAgbXlTaXplLnRvdGFsV2lkdGggPSBteVNpemUubnVtQ29scyAqIG15U2l6ZS5vbmVGb290ICogbXlTaXplLm1hZztcbiAgICBteVNpemUudG90YWxIZWlnaHQgPSBteVNpemUubnVtUm93cyAqIG15U2l6ZS5vbmVGb290ICogbXlTaXplLm1hZztcblxuICAgIGJ1aWxkU2NyZWVuKCk7XG59O1xuXG53aW5kb3cub25sb2FkID0gc2V0U2NyZWVuQ2xhc3M7XG53aW5kb3cub25yZXNpemUgPSBzZXRTY3JlZW5DbGFzcztcblxuXG5cbmZ1bmN0aW9uIGNoZWNrSGFzaCgpIHtcbiAgICBpZiAoICggd2luZG93LmxvY2F0aW9uLmhhc2ggIT0gbXlTaXplLmhhc2ggKSAmJiBteVNpemUudHJhdmVsbGluZyA9PSAwICkge1xuXG4gICAgICAgIG15U2l6ZS5oYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2g7XG5cbiAgICAgICAgdmFyIHJlZ3ggPSAnJztcbiAgICAgICAgdmFyIHJlZ3kgPSAnJztcbiAgICAgICAgdmFyIHJlZ3NlbGVjdCA9ICcnO1xuXG4gICAgICAgIHJlZ3ggKz0gbXlTaXplLmhhc2gubWF0Y2goIC94PSpcXGQqLyApO1xuICAgICAgICByZWd5ICs9IG15U2l6ZS5oYXNoLm1hdGNoKCAveT0qXFxkKi8gKTtcbiAgICAgICAgcmVnc2VsZWN0ICs9IG15U2l6ZS5oYXNoLm1hdGNoKCAvc2VsZWN0PSpcXGQqLyApO1xuXG5cblxuICAgICAgICByZWd4ID0gcmVneC5zdWJzdHIoIDIgKTtcbiAgICAgICAgcmVneSA9IHJlZ3kuc3Vic3RyKCAyICk7XG4gICAgICAgIHJlZ3NlbGVjdCA9IHJlZ3NlbGVjdC5zdWJzdHIoIDcgKTtcblxuICAgICAgICBpZiAoICFpc05hTiggcmVneCApICYmICFpc05hTiggcmVneSApICkge1xuICAgICAgICAgICAgZ29Ub0xvYygge1xuICAgICAgICAgICAgICAgIHg6IHJlZ3gsXG4gICAgICAgICAgICAgICAgeTogcmVneSxcbiAgICAgICAgICAgICAgICBpZDogcmVnc2VsZWN0XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgIH07XG4gICAgfTtcbn07XG5cbi8vZnJvbSBhYm92ZVxudmFyIGNoZWNrSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCggY2hlY2tIYXNoLCBteVNpemUuaW50ZXJ2YWx0aW1lICk7XG5cbi8vdHVybiBhbiBhcnJheSBvZiB2YWx1ZXMgaW50byBhIHBvc3Qgc3RyaW5nIGZvciBhamF4XG5mdW5jdGlvbiBwcmVwQXJyYXlGb3JBamF4KCBhcnJheSApIHtcbiAgICBvdXRwdXQgPSBcIlwiO1xuICAgIGZvciAoIGkgaW4gYXJyYXkgKSB7XG4gICAgICAgIG91dHB1dCArPSBpICsgXCI9XCIgKyBhcnJheVsgaSBdICsgXCImXCI7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG5mdW5jdGlvbiBrZXlBY3Rpb24oIGUgKSB7XG5cbiAgICBrZXkgPSBlLndoaWNoO1xuXG4gICAgc3dpdGNoICgga2V5ICkge1xuICAgICAgICBjYXNlIDI3OlxuICAgICAgICAgICAgLy9lc2NhcGUga2V5XG4gICAgICAgICAgICAvL2Nsb3NlIGxpZ2h0Ym94P1xuICAgICAgICAgICAgaWYgKCAkaiggJyNjbG9zZUxCJyApICkge1xuICAgICAgICAgICAgICAgICRqKCAnI2xpZ2h0Ym94YmsnICkuZmFkZU91dCggJ25vcm1hbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkaiggJyNsaWdodGJveGJrJyApLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBicmVhaztcbiAgICB9O1xufTtcblxuLy9sb2cgaW4gZnJvbSB0aGUgbWlsZSBjb250cm9sIHBhbmVsXG5mdW5jdGlvbiBzZW5kTG9naW4oKSB7XG4gICAgLy9nZXQgbG9naW5mb3JtIHBhcm1zIFxuICAgIHZhciBwYXJhbXMgPSBwcmVwRm9yUXVlcnkoIGdldEZvcm1WYXJzKCAnbG9naW5Gb3JtJyApICk7XG5cbiAgICAkai5hamF4KCB7XG4gICAgICAgIHVybDogJy9wcm9maWxlL2xvZ2luJyxcbiAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICBkYXRhOiBwYXJhbXMsXG4gICAgICAgIHN1Y2Nlc3M6IHJlY2VpdmVMb2dpblxuICAgIH0gKTtcbn07XG5cbi8vY2FsbGVkIG9uIHJlY2VpdmluZyBsb2dpbiByZXN1bHRcbmZ1bmN0aW9uIHJlY2VpdmVMb2dpbigganNvbiApIHtcblxuICAgIGV2YWwoICdyZXN1bHQgPSAnICsganNvbiApO1xuXG4gICAgaWYgKCByZXN1bHQuc3VjY2VzcyA9PSB0cnVlICkge1xuICAgICAgICAvL3N1Y2Nlc3NmdWwgbG9naW5cblxuICAgICAgICAvL2hpZGUgZWxlbWVudHNcbiAgICAgICAgJGooICcjbG9naW5NZXNzYWdlJyApLmNzcyggeyBkaXNwbGF5OiAnbm9uZScgfSApO1xuICAgICAgICAkaiggJyNsb2dpbk1lc3NhZ2UnICkuaHRtbCggJycgKTtcbiAgICAgICAgJGooICcjbTUnICkuc2xpZGVVcCgpO1xuXG4gICAgICAgICRqKCAnZGl2I2NvbnRyb2wxJyApLmh0bWwoIHJlc3VsdC5wYW5lbExlZnQgKTtcbiAgICAgICAgJGooICdkaXYjY29udHJvbDInICkuaHRtbCggcmVzdWx0LnBhbmVsUmlnaHQgKTtcblxuICAgICAgICBhY3RpdmF0ZUNwYW5lbCgpO1xuXG4gICAgICAgIGNsb3NlQ3BhbmVsKCA2ICk7XG5cbiAgICAgICAgLy9zZXQgdXAgdGhlIHRyYWNraW5nIGludGVydmFsIGFuZCBkbyBpdCBvbmNlIGltbWVkaWF0ZWx5XG4gICAgICAgIHN0YXJ0VHJhY2tpbmcoKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vdW5zdWNjZXNzZnVsIGxvZ2luXG4gICAgICAgICRqKCAnI2xvZ2luTWVzc2FnZScgKS5odG1sKCByZXN1bHQubWVzc2FnZSApLmNzcyggeyBkaXNwbGF5OiAnYmxvY2snIH0gKTtcblxuICAgICAgICAkaiggJ2lucHV0I3Bhc3N3b3JkJyApLnZhbCggJycgKTtcblxuICAgICAgICAkaiggJyNtNScgKS5zbGlkZURvd24oKTtcbiAgICB9O1xufTtcblxuLy9ieWUgYnllXG5mdW5jdGlvbiBkb0xvZ291dCgpIHtcbiAgICAkaiggJyNsb2dpbk1lc3NhZ2UnICkuaHRtbCggJ0xvZ2dpbmcgb3V0Li4nICk7XG5cbiAgICBjbG9zZUNwYW5lbCggMiApO1xuXG4gICAgJGouYWpheCgge1xuICAgICAgICB1cmw6ICcvcHJvZmlsZS9sb2dvdXQnLFxuICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgIHN1Y2Nlc3M6IHJlY2VpdmVMb2dvdXRcbiAgICB9ICk7XG59O1xuXG5mdW5jdGlvbiBmaW5kVGFyZ2V0KCBlICkge1xuXG4gICAgdHJ5IHtcbiAgICAgICAgLy90ZWggZmFoeFxuICAgICAgICB0ID0gZS50YXJnZXQuaWQ7XG4gICAgfSBjYXRjaCAoIGVyciApIHtcbiAgICAgICAgLy90ZWggc3VjeFxuICAgICAgICB0ID0gZS5zcmNFbGVtZW50LmlkO1xuICAgIH07XG5cbiAgICBpZiAoIHQubWF0Y2goIC9waWMvICkgKSB7XG4gICAgICAgIGRvU2VsZWN0KCB0ICk7XG4gICAgfTtcbn07XG5cbi8vY2FsbGVkIHVwb24gcmVjZWl2aW5nIGxvZ291dCBwaHBcbmZ1bmN0aW9uIHJlY2VpdmVMb2dvdXQoIGpzb24gKSB7XG4gICAgZXZhbCggJ3Jlc3VsdD0nICsganNvbiApO1xuXG4gICAgJGooICdkaXYjY29udHJvbDEnICkuaHRtbCggcmVzdWx0LnBhbmVsTGVmdCApO1xuICAgICRqKCAnZGl2I2NvbnRyb2wyJyApLmh0bWwoIHJlc3VsdC5wYW5lbFJpZ2h0ICk7XG5cbiAgICBjbGVhckludGVydmFsKCBhbGl2ZSApO1xuICAgIGFjdGl2YXRlQ3BhbmVsKCk7XG59O1xuXG4vL2xpc3RlbiBmb3IgZG91YmxlIGNsaWNrc1xuJGooICcjc3F1YXJlbWlsZScgKS5kYmxjbGljayggZmluZFRhcmdldCApO1xuXG4vL2xpc3RlbiBmb3Iga2V5IHByZXNzXG4kaiggZG9jdW1lbnQgKS5rZXlkb3duKCBrZXlBY3Rpb24gKTtcblxuLy9wb3NNYXAgcG9zaXRpb25zIHRoZSBjdXJzb3IgdG8gdGhlIGFwcHJvcHJpYXRlIGxvY2F0aW9uIG9uIHRoZSBtYXBcbmZ1bmN0aW9uIHBvc01hcCgpIHtcbiAgICBzY2FsZSA9ICggbXlTaXplLnNjYWxlIC8gNzIgKTtcblxuICAgICRqKCAnI21hcmtlcicgKS5jc3MoIHsgbGVmdDogKCBteVNpemUubXlYIC8gMjQwMDAgKSArIFwicHhcIiB9ICk7XG4gICAgJGooICcjbWFya2VyJyApLmNzcyggeyB0b3A6ICggbXlTaXplLm15WSAvIDI0MDAwICkgKyBcInB4XCIgfSApO1xuXG5cbn07XG5cblxucG9zTWFwKCk7XG5zdGFydFRyYWNraW5nKCk7XG5cblxuXG4vL2ZpZ3VyZSBvdXQgem9vbSBhZnRlciBkcmFnZ2luZyBtYWdcbmZ1bmN0aW9uIGZpbmRTY2FsZSgpIHtcbiAgICBtYWdzID0gJGooICcjbWFncycgKTtcblxuICAgIGxlZnQgPSBwYXJzZUludCggbWFncy5jc3MoICdsZWZ0JyApICkgLSAoIHBhcnNlSW50KCBtYWdzLmNzcyggJ2xlZnQnICkgKSAlIDkgKTtcbiAgICBtYWdzLmNzcyggeyBsZWZ0OiBsZWZ0ICsgXCJweFwiIH0gKTtcblxuICAgIGxlZnQgPSAoIDEyNiAtIGxlZnQgKTtcbiAgICB6b29tWCA9IDcyIC8gKCBNYXRoLnBvdyggMiwgKCAoIGxlZnQgKSAvIDkgKSApICk7XG4gICAgem9vbSggem9vbVggKTtcbn07XG5cbi8vbWFrZSB0aGUgbWFwIG1hcmtlciBkcmFnZ2FibGVcbiRqKCAnI21hcmtlcicgKS5kcmFnZ2FibGUoIHtcbiAgICBkcmFnOiBtb3ZlVGFyZ2V0LFxuICAgIGNvbnRhaW5tZW50OiAkaiggJyNtYXAnICksXG4gICAgc3RvcDogbW92ZVRhcmdldERvbmVcbn0gKTtcblxuLy93ZSBhcmUgbW92aW5nIHRoZSB0YXJnZXQsIHBvc2l0aW9uIHRoZSBtaWxlXG5mdW5jdGlvbiBtb3ZlVGFyZ2V0KCkge1xuICAgIHggPSBwYXJzZUludCggJGooIHRoaXMgKS5jc3MoICdsZWZ0JyApICk7XG4gICAgeSA9IHBhcnNlSW50KCAkaiggdGhpcyApLmNzcyggJ3RvcCcgKSApO1xuICAgIG15U2l6ZS50cmF2ZWxsaW5nID0gMztcbiAgICBwb3NNaWxlKCB4LCB5ICk7XG59O1xuXG5mdW5jdGlvbiBtb3ZlVGFyZ2V0RG9uZSgpIHtcbiAgICBteVNpemUudHJhdmVsbGluZyA9IDA7XG4gICAgZW5kTWlsZSgpO1xuICAgIHNldEJyb3dzZXJIYXNoKCk7XG4gICAgbW92ZVNjcmVlbigpO1xuICAgIG1ha2VNYXBDYWxsKCk7XG59O1xuXG4vL21ha2UgdGhlIGNwYW5lbCBkcmFnZ2FibGVcblxuJGooICcjY3BhbmVsJyApLmRyYWdnYWJsZSgge1xuICAgIHN0b3A6IGdldENwYW5lbExvYyxcbiAgICBjb250YWlubWVudDogJGooICcjc3F1YXJlbWlsZScgKSxcbiAgICBjdXJzb3I6ICdtb3ZlJ1xufSApO1xuXG4vL21ha2UgdGhlIG1hZyBnbGFzcyBkcmFnZ2FibGVcbiRqKCAnI21hZ3MnICkuZHJhZ2dhYmxlKCB7XG4gICAgYXhpczogJ3gnLFxuICAgIGNvbnRhaW5tZW50OiAkaiggJyN6b29tc2NhbGUnICksXG4gICAgc3RvcDogZmluZFNjYWxlXG59ICk7XG5cbmZ1bmN0aW9uIHN0YXJ0TWlsZSggZSwgdWkgKSB7XG4gICAgcmVsYXRpdmVzdGFydFggPSBteVNpemUubXlYO1xuICAgIHJlbGF0aXZlc3RhcnRZID0gbXlTaXplLm15WTtcblxuICAgIG15U2l6ZS50cmF2ZWxsaW5nID0gMjtcbn07XG5cbmZ1bmN0aW9uIGVuZE1pbGUoKSB7XG5cbiAgICBteVNpemUudHJhdmVsbGluZyA9IDA7XG4gICAgc2V0QnJvd3Nlckhhc2goKTtcblxuICAgICRqKCAnZGl2LmZvb3RCbG9jaycgKS5lYWNoKCBmdW5jdGlvbigpIHtcbiAgICAgICAgZm9vdCA9ICRqKCB0aGlzICk7XG4gICAgICAgIGlmICggZm9vdC5hdHRyKCAnZm9yY2VyZWxvYWQnICkgPT0gMSApIHtcblxuICAgICAgICAgICAgbWlsZXggPSBmb290LmF0dHIoICdtaWxleCcgKTtcbiAgICAgICAgICAgIG1pbGV5ID0gZm9vdC5hdHRyKCAnbWlsZXknICk7XG5cbiAgICAgICAgICAgIGlmICggbWlsZXggPiAwICYmIG1pbGV5ID4gMCAmJiBtaWxleCA8IDUyODEgJiYgbWlsZXkgPCA1MjgxICkge1xuICAgICAgICAgICAgICAgIGluYm91bmRzID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGZvb3QuY3NzKCB7XG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRJbWFnZTogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCdcbiAgICAgICAgICAgICAgICB9ICk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBpbmJvdW5kcyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgZm9vdC5jc3MoIHtcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZEltYWdlOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNEMTZBMzgnXG4gICAgICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGlmICggbXlTaXplLnNjYWxlID4gOSAmJiBpbmJvdW5kcyApIHtcbiAgICAgICAgICAgICAgICAvL2xvYWQgdGhlIGNvbnRlbnQgaW4gb25lIGJ5IG9uZVxuXG4gICAgICAgICAgICAgICAgaWYgKCAoIHR5cGVvZiggbG9hZEFycmF5WyBtaWxleCBdICkgIT0gJ29iamVjdCcgKSApIHtcbiAgICAgICAgICAgICAgICAgICAgbG9hZEFycmF5WyBtaWxleCBdID0gbmV3IEFycmF5O1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBsb2FkQXJyYXlbIG1pbGV4IF0ucHVzaCggbWlsZXkgKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmICggbXlTaXplLnNjYWxlIDwgMTggJiYgaW5ib3VuZHMgKSB7XG4gICAgICAgICAgICAgICAgLy9zY2FsZSBpcyBsZXNzIHRoZW4gMTguIGxvYWQgYSByZW5kZXJlZCBpbWFnZS5cbiAgICAgICAgICAgICAgICBmb290Lmh0bWwoICcnICk7XG5cbiAgICAgICAgICAgICAgICBmb290LmNzcygge1xuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoc3RhdGljL2xvYWRpbmdfMjE2LnBuZyknLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJ1xuICAgICAgICAgICAgICAgIH0gKTtcblxuICAgICAgICAgICAgICAgIGxvYWRJbWFnZSggbWlsZXggKyBcIlwiICsgbWlsZXksICdpbWFnZS9taWxlWC8nICsgbWlsZXggKyAnL21pbGVZLycgKyBtaWxleSArICcvc2NhbGUvJyArICggNzIgLyBteVNpemUuc2NhbGUgKSArIFwiXFwvbWFnXFwvXCIgKyBteVNpemUubWFnICk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvL3Jlc2V0IHRoZSBtaWxlIGluZm9cbiAgICAgICAgICAgIGZvb3QuYXR0cigge1xuICAgICAgICAgICAgICAgIGZvcmNlcmVsb2FkOiAwXG4gICAgICAgICAgICB9ICk7XG4gICAgICAgIH07XG4gICAgfSApO1xuXG4gICAgaWYgKCBsb2FkQXJyYXkubGVuZ3RoID4gMCAmJiBteVNpemUuc2NhbGUgPiA5ICkge1xuICAgICAgICBtYWtlTWFwQ2FsbCgpO1xuXG4gICAgICAgIGxvYWRBcnJheSA9IG5ldyBBcnJheSgpO1xuICAgIH07XG59O1xuXG4kaiggJyNzcXVhcmVtaWxlJyApLmRyYWdnYWJsZSgge1xuICAgIHN0YXJ0OiBzdGFydE1pbGUsXG4gICAgZHJhZzogbW92ZU1pbGUsXG4gICAgc3RvcDogZW5kTWlsZVxufSApO1xuXG5mdW5jdGlvbiBtb3ZlTWlsZSggZSwgdWkgKSB7XG4gICAgZCA9ICggNzIgLyBteVNpemUuc2NhbGUgKSAqIDI7XG5cbiAgICBteVNpemUubXlYID0gKCByZWxhdGl2ZXN0YXJ0WCAtICggdWkucG9zaXRpb24ubGVmdCAqIGQgKSApO1xuICAgIG15U2l6ZS5teVkgPSAoIHJlbGF0aXZlc3RhcnRZIC0gKCB1aS5wb3NpdGlvbi50b3AgKiBkICkgKTtcblxuICAgIHVpLnBvc2l0aW9uLnRvcCA9IDA7XG4gICAgdWkucG9zaXRpb24ubGVmdCA9IDA7XG5cbiAgICBtb3ZlU2NyZWVuKCk7XG59O1xuXG5mdW5jdGlvbiBnZXRDcGFuZWxMb2MoKSB7XG4gICAgeCA9IHBhcnNlSW50KCAkaiggdGhpcyApLmNzcyggJ2xlZnQnICkgKTtcbiAgICB5ID0gcGFyc2VJbnQoICRqKCB0aGlzICkuY3NzKCAndG9wJyApICk7XG5cbiAgICBteVNpemUuY3BhbmVseCA9IHg7XG4gICAgbXlTaXplLmNwYW5lbHkgPSB5O1xufTsiLCIvKlxuICpcbiAqL1xuZnVuY3Rpb24gem9vbSggbnVtICkge1xuXG4gICAgaWYgKCBudW0gPT0gJ2luJyApIHtcbiAgICAgICAgbnVtID0gbXlTaXplLnNjYWxlICogMjtcbiAgICB9IGVsc2UgaWYgKCBudW0gPT0gJ291dCcgKSB7XG4gICAgICAgIG51bSA9IG15U2l6ZS5zY2FsZSAvIDI7XG4gICAgfTtcblxuICAgIGlmICggbnVtID4gNzIgKSB7XG4gICAgICAgIG51bSA9IDcyO1xuICAgIH0gZWxzZSBpZiAoIG51bSA8IC4wMDg3ICkge1xuICAgICAgICBudW0gPSAuMDA4Nzg5MDYyNTtcbiAgICB9O1xuXG4gICAgaWYgKCBudW0gPT0gbXlTaXplLnNjYWxlICkge1xuICAgICAgICByZXR1cm47XG4gICAgfTtcblxuICAgIGlmICggbSA9ICRqKCAnI21hZ3MnICkgKSB7XG5cbiAgICAgICAgcyA9ICggNzIgLyBudW0gKTtcbiAgICAgICAgbiA9IE1hdGgubG9nKCBzICkgLyBNYXRoLmxvZyggMiApO1xuXG4gICAgICAgIGxlZnQgPSAxMjYgLSAoIG4gKiA5ICk7XG5cbiAgICAgICAgbS5jc3MoIHsgbGVmdDogbGVmdCArIFwicHhcIiB9ICk7XG4gICAgfTtcblxuICAgIC8vZ2V0IHRoZSBjc3Mgc3R5bGUgc2hlZXQgXG4gICAgaWYgKCBkb2N1bWVudC5zdHlsZVNoZWV0c1sgMCBdLmNzc1J1bGVzICkge1xuICAgICAgICAvL2NvcnJlY3RcbiAgICAgICAgZm9vdEJsb2NrID0gZG9jdW1lbnQuc3R5bGVTaGVldHNbIDAgXS5jc3NSdWxlc1sgMCBdLnN0eWxlO1xuICAgIH0gZWxzZSBpZiAoIGRvY3VtZW50LnN0eWxlU2hlZXRzWyAwIF0ucnVsZXMgKSB7XG4gICAgICAgIC8vaWVcbiAgICAgICAgZm9vdEJsb2NrID0gZG9jdW1lbnQuc3R5bGVTaGVldHNbIDAgXS5ydWxlc1sgMCBdLnN0eWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vd2hvIGtub3dzXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgaWYgKCBudW0gPCAxOCApIHtcbiAgICAgICAgbXlTaXplLm1hZyA9ICggMTggLyBudW0gKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIG15U2l6ZS5tYWcgPSAxO1xuICAgIH07XG5cbiAgICBteVNpemUuc2NhbGUgPSBudW07XG5cbiAgICB3aWR0aCA9ICggbnVtICogMTIgKiBteVNpemUubWFnICkgKyBcInB4XCI7XG4gICAgZm9vdEJsb2NrLmhlaWdodCA9IHdpZHRoO1xuICAgIGZvb3RCbG9jay53aWR0aCA9IHdpZHRoO1xuXG4gICAgZm9yICggdmFyIHggPSAwOyB4IDwgbXlTaXplLm51bUNvbHM7IHgrKyApIHtcbiAgICAgICAgZm9yICggdmFyIHkgPSAwOyB5IDwgbXlTaXplLm51bVJvd3M7IHkrKyApIHtcblxuICAgICAgICAgICAgaWYgKCAkaiggXCIjY1wiICsgeCArIFwiclwiICsgeSApICkge1xuXG4gICAgICAgICAgICAgICAgJGooIFwiI2NcIiArIHggKyBcInJcIiArIHkgKS5hdHRyKCAnZm9yY2VyZWxvYWQnLCAxICkuaHRtbCggJycgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8vbmVlZCB0byByZXZlcnNlIHRoZSBlcXVhdGlvbiwgdG8gc2V0IHRoZSBtYWcgeCBiYXNlZCBvbiB0aGUgem9vbSBmYWNvdHJcbiAgICBsZWZ0WCA9ICggMSAvIG51bSApICogNzI7XG5cbiAgICBzZXRTY3JlZW5DbGFzcygpO1xufTtcblxuLy9pbml0aWFsaXplIGZlZXQgZGl2c1xuZnVuY3Rpb24gYnVpbGRTY3JlZW4oKSB7XG5cbiAgICAvL2dldCByaWQgb2YgYW55IGRpdnMgZHVlIHRvIHNjYWxlIG9yIHNjcmVlbiBzaXplIFxuICAgIGlmICggbXlTaXplLm9sZENvbHMgPiBteVNpemUubnVtQ29scyApIHtcbiAgICAgICAgZm9yICggdmFyIHggPSBteVNpemUub2xkQ29sczsgeCA+PSBteVNpemUubnVtQ29sczsgeC0tICkge1xuICAgICAgICAgICAgZm9yICggdmFyIHkgPSBteVNpemUub2xkUm93czsgeSA+PSAwOyB5LS0gKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHggPj0gbXlTaXplLm51bUNvbHMgfHwgeSA+PSBteVNpemUubnVtUm93cyApIHtcbiAgICAgICAgICAgICAgICAgICAgJGooIFwiI2NcIiArIHggKyBcInJcIiArIHkgKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBpZiAoIG15U2l6ZS5vbGRSb3dzID4gbXlTaXplLm51bVJvd3MgKSB7XG4gICAgICAgIGZvciAoIHZhciB5ID0gbXlTaXplLm9sZFJvd3M7IHkgPj0gbXlTaXplLm51bVJvd3M7IHktLSApIHtcbiAgICAgICAgICAgIGZvciAoIHZhciB4ID0gbXlTaXplLm9sZENvbHM7IHggPj0gMDsgeC0tICkge1xuICAgICAgICAgICAgICAgICRqKCBcIiNjXCIgKyB4ICsgXCJyXCIgKyB5ICkucmVtb3ZlKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBmb3IgKCB2YXIgeCA9IDA7IHggPCBteVNpemUubnVtQ29sczsgeCsrICkge1xuICAgICAgICBmb3IgKCB2YXIgeSA9IDA7IHkgPCBteVNpemUubnVtUm93czsgeSsrICkge1xuXG4gICAgICAgICAgICBpZiAoICRqKCBcIiNjXCIgKyB4ICsgXCJyXCIgKyB5ICkubGVuZ3RoID09IDAgKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgbmV3ZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblxuICAgICAgICAgICAgICAgIG5ld2Rpdi5zZXRBdHRyaWJ1dGUoICdpZCcsIFwiY1wiICsgeCArIFwiclwiICsgeSApO1xuICAgICAgICAgICAgICAgIG5ld2Rpdi5jbGFzc05hbWUgPSBcImZvb3RCbG9ja1wiO1xuXG4gICAgICAgICAgICAgICAgJGooICcjc3F1YXJlbWlsZScgKS5hcHBlbmQoIG5ld2RpdiApO1xuXG4gICAgICAgICAgICAgICAgJGooIFwiI2NcIiArIHggKyBcInJcIiArIHkgKS5hdHRyKCAnZm9yY2VyZWxvYWQnLCAxICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBtb3ZlU2NyZWVuKCk7XG5cbiAgICBlbmRNaWxlKCk7XG59O1xuXG4vL2RlbGF5IGxvYWRpbmcgaW1hZ2UgaW50byBtaWxlIGRpdlxuZnVuY3Rpb24gbG9hZEltYWdlKCBjbHMsIGltYWdlICkge1xuICAgIHggPSBcImRvTG9hZCgnXCIgKyBjbHMgKyBcIicsJ1wiICsgaW1hZ2UgKyBcIicpXCI7XG4gICAgc2V0VGltZW91dCggeCwgNTAwICk7XG59O1xuXG4vL2xvYWQgYSBzY2FsZWQgaW1hZ2UgaW50byB0aGUgZm9vdFxuZnVuY3Rpb24gZG9Mb2FkKCBjbHMsIGltYWdlICkge1xuXG4gICAgdmFyIG9iajtcblxuICAgIGlmICggb2JqID0gJGooICcuJyArIGNscyApICkge1xuXG4gICAgICAgIHBpYyA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICAgIHBpYy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG9iai5odG1sKCAnPGltZyBzcmM9XCInICsgaW1hZ2UgKyAnXCIvPicgKTtcbiAgICAgICAgICAgIG9iai5jc3MoIHtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kSW1hZ2U6ICdub25lJyxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjRDE2QTM4J1xuICAgICAgICAgICAgfSApO1xuICAgICAgICB9O1xuXG4gICAgICAgIHBpYy5vYmogPSBvYmo7XG4gICAgICAgIHBpYy5zcmMgPSBpbWFnZTtcblxuICAgIH07XG59O1xuXG4vL2hhbmRsZXMgcG9zaXRpb25pbmcgdGhlIGZvb3QgZGl2c1xuZnVuY3Rpb24gbW92ZVNjcmVlbigpIHtcbiAgICBzY2FsZSA9IG15U2l6ZS5zY2FsZSAvIDcyO1xuXG4gICAgeGRpZmYgPSBNYXRoLmZsb29yKCAoICggbXlTaXplLm15WCApIC8gbXlTaXplLnRvdGFsV2lkdGggKSAqIHNjYWxlICkgKiBteVNpemUubnVtQ29scyAqIG15U2l6ZS5tYWc7XG4gICAgeGRpZmYgPSB4ZGlmZiA8IDAgPyAwIDogeGRpZmY7XG5cbiAgICB5ZGlmZiA9IE1hdGguZmxvb3IoICggKCBteVNpemUubXlZICkgLyBteVNpemUudG90YWxIZWlnaHQgKSAqIHNjYWxlICkgKiBteVNpemUubnVtUm93cyAqIG15U2l6ZS5tYWc7XG4gICAgeWRpZmYgPSB5ZGlmZiA8IDAgPyAwIDogeWRpZmY7XG5cbiAgICBhZGpYID0gbXlTaXplLm15WCAvICggc2NhbGUgKTtcblxuICAgIC8vcG9zaXRpb24gdGFyZ2V0IG9uIG1hcFxuICAgIHBvc01hcCgpO1xuXG4gICAgd2lkdGhEaWZmID0gKCBteVNpemUudG90YWxXaWR0aCAtIG15U2l6ZS53aWR0aCApIC8gMjtcbiAgICBoZWlnaHREaWZmID0gKCBteVNpemUudG90YWxIZWlnaHQgLSBteVNpemUuaGVpZ2h0ICkgLyAyO1xuXG4gICAgdmFyIG9mZnNldExlZnRweCA9IE1hdGguZmxvb3IoICggKCBteVNpemUubXlYICogc2NhbGUgKSAqIC0xICkgJSAoIG15U2l6ZS50b3RhbFdpZHRoICkgKSArICggbXlTaXplLndpZHRoIC8gMiApO1xuICAgIHZhciBvZmZzZXRUb3BweCA9IE1hdGguZmxvb3IoICggKCBteVNpemUubXlZICogc2NhbGUgKSAqIC0xICkgJSAoIG15U2l6ZS50b3RhbEhlaWdodCApICkgKyAoIG15U2l6ZS5oZWlnaHQgLyAyICk7XG4gICAgLy9vZmZzZXQgTGVmdCBnb2VzIGZyb20gaGFsZiB0aGUgc2NyZWVuIHdpZHRoKDcyMCkgZG93biB0byB0aGlzIG1pbnVzIHdpZHRoIG9mIGFsbCBmZWV0IGRyYXduIH4gKC0yNzM1KSBcblxuICAgIGlmICggbXlTaXplLm15WCA8IC0xICkge1xuICAgICAgICB2YXIgb2Zmc2V0TGVmdHB4ID0gKCAoIG15U2l6ZS5teVggKiAtMSApICogc2NhbGUgKSArICggbXlTaXplLndpZHRoIC8gMiApO1xuICAgIH07XG5cbiAgICBpZiAoIG15U2l6ZS5teVkgPCAtMSApIHtcbiAgICAgICAgdmFyIG9mZnNldFRvcHB4ID0gKCAoIG15U2l6ZS5teVkgKiAtMSApICogc2NhbGUgKSArICggbXlTaXplLmhlaWdodCAvIDIgKTtcbiAgICB9O1xuXG4gICAgb2Zmc2V0TGVmdHB4ID0gaXNOYU4oIG9mZnNldExlZnRweCApID8gMCA6IG9mZnNldExlZnRweDtcbiAgICBvZmZzZXRUb3BweCA9IGlzTmFOKCBvZmZzZXRUb3BweCApID8gMCA6IG9mZnNldFRvcHB4O1xuXG4gICAgJGooICcjb2Zmc2V0TGVmdCcgKS5jc3MoIHsgbGVmdDogb2Zmc2V0TGVmdHB4ICsgXCJweFwiIH0gKTtcbiAgICAkaiggJyNvZmZzZXRUb3AnICkuY3NzKCB7IHRvcDogb2Zmc2V0VG9wcHggKyBcInB4XCIgfSApO1xuXG4gICAgbXlTaXplLm9mZnNldExlZnQgPSBvZmZzZXRMZWZ0cHg7XG4gICAgbXlTaXplLm9mZnNldFRvcCA9IG9mZnNldFRvcHB4O1xuXG4gICAgLy90aGUgbGltaXRzIG9mIGxlZnQgYW5kIHRvcCB2YWx1ZSBvbiBzY3JlZW4gYmVmb3JlIHNoaWZ0aW5nXG4gICAgbWluTCA9ICggMCAtICggd2lkdGhEaWZmICkgKTtcbiAgICBtYXhMID0gKCBteVNpemUud2lkdGggKyAoIHdpZHRoRGlmZiAvIDIgKSApO1xuXG4gICAgbWluVCA9ICggMCAtICggaGVpZ2h0RGlmZiAvIDIgKSApO1xuICAgIG1heFQgPSAoIG15U2l6ZS5oZWlnaHQgKyAoIGhlaWdodERpZmYgLyAyICkgKTtcblxuICAgIC8vJGooJ3NxdWFyZW1pbGUnKS5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBvZmZzZXRMZWZ0cHgrXCJweCBcIitvZmZzZXRUb3BweCtcInB4XCI7XG5cbiAgICBmb3IgKCB2YXIgeCA9IDA7IHggPCBteVNpemUubnVtQ29sczsgeCsrICkge1xuICAgICAgICBmb3IgKCB2YXIgeSA9IDA7IHkgPCBteVNpemUubnVtUm93czsgeSsrICkge1xuXG4gICAgICAgICAgICAvL25ldyBsZWZ0IGlzIHRoZSBvZmZzZXQgKyBwaXhlbCBmZWV0ICogY29sdW1uIHdlIGFyZSBvblxuICAgICAgICAgICAgbmV3TGVmdCA9ICggKCBvZmZzZXRMZWZ0cHggKSArICggeCAqIG15U2l6ZS5vbmVGb290ICogbXlTaXplLm1hZyApICk7XG4gICAgICAgICAgICBuZXdUb3AgPSAoICggb2Zmc2V0VG9wcHggKSArICggeSAqIG15U2l6ZS5vbmVGb290ICogbXlTaXplLm1hZyApICk7XG5cbiAgICAgICAgICAgIC8vdGhpcyBsb2dpYyB0YWtlcyBjYXJlIG9mIG1vdmluZyBkaXZzIGZyb20gbGVmdCB0byByaWdodCwgdXAgdG8gZG93biwgZXRjXG5cbiAgICAgICAgICAgIGlmICggbmV3TGVmdCA+IG1heEwgKSB7XG4gICAgICAgICAgICAgICAgbmV3TGVmdCAtPSAoIG15U2l6ZS50b3RhbFdpZHRoICk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBuZXdMZWZ0IDwgbWluTCApIHtcbiAgICAgICAgICAgICAgICBuZXdMZWZ0ICs9ICggbXlTaXplLnRvdGFsV2lkdGggKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICggbmV3VG9wID4gbWF4VCApIHtcbiAgICAgICAgICAgICAgICBuZXdUb3AgLT0gKCBteVNpemUudG90YWxIZWlnaHQgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIG5ld1RvcCA8ICggMCAtIGhlaWdodERpZmYgKSAqIG15U2l6ZS5tYWcgKSB7XG4gICAgICAgICAgICAgICAgbmV3VG9wICs9ICggbXlTaXplLnRvdGFsSGVpZ2h0ICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy9lbmQgdGhhdCBsb2dpYyBibG9ja1xuXG4gICAgICAgICAgICAvL2ZpZ3VyZSBvdXQgd2hpY2ggZm9vdCB3ZSBhcmUgYWN0dWFsbHkgbG9va2luZyBhdFx0XG4gICAgICAgICAgICB2YXIgbWlsZVggPSAoICggbmV3TGVmdCAtIG9mZnNldExlZnRweCApIC8gKCAoIHNjYWxlICkgKiA4NjQgKSApICsgMSArIHhkaWZmO1xuICAgICAgICAgICAgdmFyIG1pbGVZID0gKCAoIG5ld1RvcCAtIG9mZnNldFRvcHB4ICkgLyAoICggc2NhbGUgKSAqIDg2NCApICkgKyAxICsgeWRpZmY7XG5cbiAgICAgICAgICAgIHZhciBvYmplY3QgPSAkaiggXCIjY1wiICsgeCArIFwiclwiICsgeSApO1xuXG5cbiAgICAgICAgICAgIG9iamVjdC5jc3MoIHtcbiAgICAgICAgICAgICAgICBsZWZ0OiBuZXdMZWZ0ICsgXCJweFwiLFxuICAgICAgICAgICAgICAgIHRvcDogbmV3VG9wICsgXCJweFwiXG4gICAgICAgICAgICB9ICk7XG5cbiAgICAgICAgICAgIC8vcmVzZXQgeiBpbmRleCBpZiBub3Qgc2VsZWN0ZWRcbiAgICAgICAgICAgIGlmICggb2JqZWN0LmF0dHIoICdzZWxlY3RlZCcgKSAhPSAndHJ1ZScgKSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0LmNzcygge1xuICAgICAgICAgICAgICAgICAgICAvL3pJbmRleDogKDUyODAtKG1pbGVZKSkrKDUyODAtKG1pbGVYKSlcbiAgICAgICAgICAgICAgICAgICAgekluZGV4OiBkZWZhdWx0WkluZGV4KCBtaWxlWSwgbWlsZVggKVxuICAgICAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIG9iamVjdC5nZXQoIDAgKS5jbGFzc05hbWUgPSBcImZvb3RCbG9jayBcIiArIG1pbGVYICsgXCJcIiArIG1pbGVZO1xuXG4gICAgICAgICAgICBpZiAoIGNvdW50ZXIgPT0gOSAmJiBvYmplY3QuaHRtbCgpID09IFwiXCIgKSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0LmF0dHIoIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yY2VyZWxvYWQ6IDFcbiAgICAgICAgICAgICAgICB9ICk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoICggb2JqZWN0LmF0dHIoICdtaWxleCcgKSAhPSBtaWxlWCApIHx8ICggb2JqZWN0LmF0dHIoICdtaWxleScgKSAhPSBtaWxlWSApIHx8IG15U2l6ZS50cmF2ZWxsaW5nID09IDk5ICkge1xuICAgICAgICAgICAgICAgIG9iamVjdC5hdHRyKCB7XG4gICAgICAgICAgICAgICAgICAgIGZvcmNlcmVsb2FkOiAxLFxuICAgICAgICAgICAgICAgICAgICBtaWxleDogbWlsZVgsXG4gICAgICAgICAgICAgICAgICAgIG1pbGV5OiBtaWxlWVxuICAgICAgICAgICAgICAgIH0gKTtcblxuICAgICAgICAgICAgICAgIG9iamVjdC5odG1sKCAnJyApO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICB9O1xuICAgIH07XG5cbn07XG5cbi8vZG8gdGhlIGFqYXggY2FsbCB0byBsb2FkIG1pbGUgY29udGVudFxuZnVuY3Rpb24gbWFrZU1hcENhbGwoIGxvYyApIHtcbiAgICBpZiAoIG15U2l6ZS5zY2FsZSA+IDkgKSB7XG4gICAgICAgIHZhciBhcnIgPSBsb2MgPyBsb2MgOiBsb2FkQXJyYXk7XG5cbiAgICAgICAgaWYgKCBhcnIubGVuZ3RoID4gMCB8fCBsb2MgKSB7XG4gICAgICAgICAgICBwb3N0QXJyYXkgPSBqc19hcnJheV90b19waHBfYXJyYXkoIGFyciApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuXG4gICAgICAgIGxvYWRGaWxlID0gXCJhcnJheT1cIiArIGVzY2FwZSggcG9zdEFycmF5ICk7XG4gICAgICAgIGxvYWRGaWxlICs9IFwiJnNjYWxlPVwiICsgbXlTaXplLnNjYWxlO1xuXG4gICAgICAgICRqLmFqYXgoIHtcbiAgICAgICAgICAgIHVybDogJy9tYXAvZ2V0JyxcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgIGRhdGE6IGxvYWRGaWxlLFxuICAgICAgICAgICAgc3VjY2VzczogaW5zZXJ0SW50b0Zvb3RcbiAgICAgICAgfSApO1xuXG4gICAgfTtcbn07XG5cbmZ1bmN0aW9uIGluc2VydEludG9Gb290KCBqc29uICkge1xuXG4gICAgaWYgKCBpbml0ID09IGZhbHNlICkge1xuICAgICAgICBpbml0ID0gdHJ1ZTtcblxuICAgICAgICAkaiggJyNzcXVhcmVtaWxlJyApLmNzcygge1xuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZidcbiAgICAgICAgfSApO1xuICAgIH07XG5cbiAgICBldmFsKCAncmVzdWx0ID0gJyArIGpzb24gKTtcblxuICAgIGZvciAoIHZhciBpIGluIHJlc3VsdC5mZWV0ICkge1xuXG4gICAgICAgIGZvb3QgPSAkaiggJy4nICsgaSApO1xuXG4gICAgICAgIGlmICggZm9vdC5nZXQoIDAgKSApIHtcblxuICAgICAgICAgICAgY29udGVudCA9IHJlc3VsdC5mZWV0WyBpIF07XG4gICAgICAgICAgICBmb290Lmh0bWwoIGNvbnRlbnQgKTtcbiAgICAgICAgICAgIGxvYWRJbWFnZXMoIGkgKTtcblxuICAgICAgICAgICAgZm9vdC5jc3MoIHsgYmFja2dyb3VuZEltYWdlOiAnbm9uZScgfSApO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIGZvciAoIHZhciBpIGluIHJlc3VsdC5lbXB0eSApIHtcblxuICAgICAgICBmb290ID0gJGooICcuJyArIGkgKTtcbiAgICAgICAgaWYgKCBmb290ICkge1xuICAgICAgICAgICAgZm9vdC5odG1sKCAnPCEtLSAtLT4nICk7IC8vYmxhbmsgd2lsbCBjYXVzZSByZWxvYWRcbiAgICAgICAgICAgIC8vZm9vdC5jc3MoeyBiYWNrZ3JvdW5kSW1hZ2U6J3VybChzdGF0aWMvd2hpdGUuanBnKScgfSk7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIGlmICggc2VsZWN0ZWRFbGVtZW50LnRvU2VsZWN0ICkge1xuICAgICAgICBkb1NlbGVjdCggc2VsZWN0ZWRFbGVtZW50LnRvU2VsZWN0ICk7XG4gICAgfTtcbn07XG5cbi8vY2FsbGVkIHRvIGxvYWQgaW1hZ2VzIGZyb20gbWFwXG5mdW5jdGlvbiBsb2FkSW1hZ2VzKCBmb290Q2xhc3MgKSB7XG5cbiAgICAvL2NvbnNvbGUubG9nKGZvb3RDbGFzcywgJ2Zvb3RDbGFzcycgKTsgLy8xMTQzXG4gICAgLy8gYWxsIHRoZSBpbWFnZXMgaW5zaWRlIG9mIGZvb3RcbiAgICBpbWFnZXMgPSAkaiggJ2Rpdi4nICsgZm9vdENsYXNzICsgJyBhIGltZycgKTtcblxuICAgIC8vcmVwbGFjZSB0aGUgbG93IHJlcyB2ZXJzaW9uIHcgZnVsbFxuICAgIC8vZml4IHRoaXMgLSBub3QgcHJlbG9hZGluZ1xuICAgIGltYWdlcy5lYWNoKCBmdW5jdGlvbigpIHtcbiAgICAgICAgc3JjID0gdGhpcy5zcmMucmVwbGFjZSggXCIvdGh1bWJzXCIsIFwiL29yaWdpbmFsXCIgKTtcbiAgICAgICAgdGhpcy5zcmMgPSBzcmM7XG4gICAgfSApO1xuXG4gICAgLy9wcmV2ZW50IHRpbnkgZWFybFxuICAgIGZvb3QuY2xpY2soIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSApO1xuXG59O1xuXG5mdW5jdGlvbiBqc19hcnJheV90b19waHBfYXJyYXkoIGEgKSB7XG4gICAgdmFyIGFfcGhwID0gXCJcIjtcbiAgICB2YXIgdG90YWwgPSAwO1xuICAgIGZvciAoIHZhciBrZXkgaW4gYSApIHtcbiAgICAgICAgdG90YWwrKztcbiAgICAgICAgYV9waHAgPSBhX3BocCArIFwiczpcIiArXG4gICAgICAgICAgICBTdHJpbmcoIGtleSApLmxlbmd0aCArIFwiOlxcXCJcIiArIFN0cmluZygga2V5ICkgKyBcIlxcXCI7czpcIiArXG4gICAgICAgICAgICBTdHJpbmcoIGFbIGtleSBdICkubGVuZ3RoICsgXCI6XFxcIlwiICsgU3RyaW5nKCBhWyBrZXkgXSApICsgXCJcXFwiO1wiO1xuICAgIH07XG4gICAgYV9waHAgPSBcImE6XCIgKyB0b3RhbCArIFwiOntcIiArIGFfcGhwICsgXCJ9XCI7XG4gICAgcmV0dXJuIGFfcGhwO1xufTtcblxuLy9tYWtlIGEgc2hhZG93IC0gZWxlbG1lbnQgaXMgb24gc2NyZWVuXG5mdW5jdGlvbiBtYWtlc2hhZG93KCBwaWNJRCApIHtcblxuICAgIHNlbGVjdGVkRWxlbWVudC5pc1NlbGVjdGVkID0gcGljSUQ7XG4gICAgc2VsZWN0ZWRFbGVtZW50LnRvU2VsZWN0ID0gbnVsbDtcblxuICAgIC8vaW1hZ2Ugc2VsZWN0ZWRcbiAgICBvYmogPSAkaiggJyMnICsgcGljSUQgKTtcbiAgICBvYmouY3NzKCB7IHpJbmRleDogNTAgfSApO1xuXG4gICAgLy90aGUgZm9vdCBpbWFnZSBpcyBpblxuICAgIHAgPSBvYmoucGFyZW50cyggJ2Rpdi5mb290QmxvY2snICk7XG4gICAgcC5jc3MoIHtcbiAgICAgICAgekluZGV4OiA1MDAwMCxcbiAgICAgICAgLy9iYWNrZ3JvdW5kQ29sb3I6ICcjZjAwJyBcbiAgICB9ICkuYXR0ciggeyBzZWxlY3RlZDogJ3RydWUnIH0gKTtcblxuICAgIC8vY3JlYXRlIGluIERPTVxuICAgIHNoYWRvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdpbWcnICk7XG5cbiAgICAkaiggc2hhZG93ICkuYXR0cigge1xuICAgICAgICBzcmM6ICcvc3RhdGljL3NoYWRvdy5wbmcnLFxuICAgICAgICB3aWR0aDogKCBvYmoud2lkdGgoKSAqIDEuMjUgKSxcbiAgICAgICAgaGVpZ2h0OiAoIG9iai5oZWlnaHQoKSAqIDEuMjUgKSxcbiAgICAgICAgaWQ6ICdjb250ZW50U2hhZG93J1xuICAgIH0gKS5jc3MoIHtcbiAgICAgICAgbGVmdDogKCBwYXJzZUZsb2F0KCBvYmouY3NzKCAnbGVmdCcgKSApIC0gKCAoIG9iai53aWR0aCgpICogMS4yNSApIC0gb2JqLndpZHRoKCkgKSAvIDIgKSArICdweCcsXG4gICAgICAgIHRvcDogKCBwYXJzZUZsb2F0KCBvYmouY3NzKCAndG9wJyApICkgLSAoICggb2JqLmhlaWdodCgpICogMS4yNSApIC0gb2JqLmhlaWdodCgpICkgLyAyICkgKyAncHgnLFxuICAgICAgICB6SW5kZXg6IDQ5XG4gICAgfSApO1xuXG4gICAgb2JqLmFmdGVyKCBzaGFkb3cgKTtcblxuICAgIC8vdGhlIHNjYWxlIGFzIHJlbGF0aXZlIHRvIDcyZHBpXG4gICAgc2NhbGUgPSAoIG15U2l6ZS5zY2FsZSAvIDcyICk7XG4gICAgcGl4ZWxGb290ID0gc2NhbGUgKiA4NjQ7XG5cbiAgICAvL29mZnNldCBsZWZ0ICYgdG9wXG4gICAgbGZ0ID0gKCAoIHBhcnNlSW50KCBvYmouY3NzKCAnbGVmdCcgKSApICkgKyAoIHBhcnNlSW50KCBvYmoud2lkdGgoKSApIC8gMiApICkgLyBzY2FsZTtcbiAgICB0cCA9ICggKCBwYXJzZUludCggb2JqLmNzcyggJ3RvcCcgKSApICkgKyAoIHBhcnNlSW50KCBvYmouaGVpZ2h0KCkgKSAvIDIgKSApIC8gc2NhbGU7XG5cbiAgICB2YXIgZ29Ub0Nvb3JkcyA9IHtcbiAgICAgICAgeDogbXlTaXplLm15WCxcbiAgICAgICAgeTogbXlTaXplLm15WSxcbiAgICAgICAgbW92ZTogZmFsc2VcbiAgICB9O1xuXG4gICAgaW1ncG9zID0gb2JqLm9mZnNldCgpO1xuICAgIGltZ3dpZCA9IHBhcnNlSW50KCBvYmoud2lkdGgoKSApO1xuICAgIGltZ2hlaSA9IHBhcnNlSW50KCBvYmouaGVpZ2h0KCkgKTtcblxuICAgIGlmICggaW1ncG9zICkge1xuICAgICAgICBpZiAoIGltZ3Bvcy5sZWZ0IDwgMCB8fCAoIGltZ3Bvcy5sZWZ0ICsgaW1nd2lkICkgPiBteVNpemUud2lkdGggKSB7XG4gICAgICAgICAgICBnb1RvQ29vcmRzLnggPSAoICggcC5hdHRyKCAnbWlsZVgnICkgLSAxICkgKiA4NjQgKSArIGxmdDtcbiAgICAgICAgICAgIGdvVG9Db29yZHMubW92ZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIGltZ3Bvcy50b3AgPCAwIHx8ICggaW1ncG9zLnRvcCArIGltZ2hlaSApID4gbXlTaXplLmhlaWdodCApIHtcbiAgICAgICAgICAgIGdvVG9Db29yZHMueSA9ICggKCBwLmF0dHIoICdtaWxlWScgKSAtIDEgKSAqIDg2NCApICsgdHA7XG4gICAgICAgICAgICBnb1RvQ29vcmRzLm1vdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vZml4IGlmIG9mZiBib3R0b20gb2Ygc2NyZWVuXG4gICAgb2Zmc2V0WSA9IHBhcnNlSW50KCBvYmouaGVpZ2h0KCkgKTtcbiAgICBvZmZzZXRYID0gcGFyc2VJbnQoIG9iai53aWR0aCgpICk7XG5cbiAgICAvL2FkanN0IGZvciBtYXAgb3ZlcmxhcFxuICAgIGlmICggb2Zmc2V0WSA+IG15U2l6ZS5oZWlnaHQgKSB7XG4gICAgICAgIGRpZmZZID0gKCBvZmZzZXRZIC0gbXlTaXplLmhlaWdodCApIC8gMjtcbiAgICAgICAgZ29Ub0Nvb3Jkc1sgJ3knIF0gKz0gZGlmZlk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZGlmZlkgPSAwO1xuICAgIH07XG5cbiAgICBmaWcgPSAoIG15U2l6ZS53aWR0aCAtIG9mZnNldFggKSAvIDI7XG5cbiAgICBpZiAoIGZpZyA8IDYwMCApIHtcbiAgICAgICAgZGlmZlggPSAoIDUwMCAtIGZpZyApO1xuICAgICAgICBnb1RvQ29vcmRzWyAneCcgXSArPSBkaWZmWDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBkaWZmWCA9IDA7XG4gICAgfTtcblxuICAgIGlmICggZ29Ub0Nvb3Jkcy5tb3ZlID09IHRydWUgKSB7XG4gICAgICAgIC8vbW92ZSB0byBwcmV2ZW50IG92ZXJsYXAgdyBtYXBcbiAgICAgICAgZ29Ub0xvYyggZ29Ub0Nvb3JkcyApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vaW4gdGhlIHJpZ2h0IHNwb3RcbiAgICB9O1xuXG4gICAgLy9zaG93IHRoZSB3b3JkIGJhbGxvb25cbiAgICB2YXIgY29tbWVudHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXG4gICAgJGooIGNvbW1lbnRzICkuY3NzKCB7XG4gICAgICAgIGxlZnQ6IHBhcnNlSW50KCBvYmouY3NzKCAnbGVmdCcgKSApICsgcGFyc2VJbnQoIG9iai53aWR0aCgpICkgLSAoIDQwICogc2NhbGUgKSArIFwicHhcIixcbiAgICAgICAgdG9wOiBwYXJzZUludCggb2JqLmNzcyggJ3RvcCcgKSApICsgcGFyc2VJbnQoIG9iai5oZWlnaHQoKSApIC0gMzIyICsgXCJweFwiXG4gICAgfSApLmF0dHIoIHtcbiAgICAgICAgaWQ6ICd3b3JkQmFsbG9vbidcbiAgICB9ICkuaHRtbChcbiAgICAgICAgJzxkaXYgaWQ9XCJjbG9zZUJhbGxvb25cIiBvbmNsaWNrPVwiZG9TZWxlY3QoXFwnJyArIHBpY0lEICsgJ1xcJyApO1wiPjwvZGl2PjxkaXYgaWQ9XCJiYWxsb29uQ29udGVudFwiPjwvZGl2PidcbiAgICApO1xuXG4gICAgcC5hcHBlbmQoIGNvbW1lbnRzICk7XG5cbiAgICBnZXRDb21tZW50cyggcGljSUQgKTtcblxuICAgIHJldHVybiB0cnVlO1xufTtcblxuZnVuY3Rpb24gZGVmYXVsdFpJbmRleCggcm93LCBjb2wgKSB7XG4gICAgcmV0dXJuICggNTI4MCAtIHJvdyApICsgKCA1MjgwIC0gY29sICk7XG59O1xuXG4vL2RvdWJsZWNsaWNrIG9uIGNvbnRlbnQgZnVuY3Rpb25cbmZ1bmN0aW9uIGRvU2VsZWN0KCBwaWNJRCApIHtcblxuICAgIHNlbGVjdGVkRWxlbWVudC50b1NlbGVjdCA9IG51bGw7XG5cbiAgICAvL3NvbWV0aGluZyBpcyBzZWxlY3RlZD8gZGVzZWxjdCBpdFxuICAgIGlmICggbyA9IHNlbGVjdGVkRWxlbWVudC5pc1NlbGVjdGVkICkge1xuXG4gICAgICAgIC8vdGhlIHNlbGVjdGVkIGltYWdlXG4gICAgICAgICRqKCAnIycgKyBvICkuY3NzKCB7XG4gICAgICAgICAgICB6SW5kZXg6ICcxJ1xuICAgICAgICB9ICk7XG5cbiAgICAgICAgJGooICcjY29udGVudFNoYWRvdycgKS5yZW1vdmUoKTtcbiAgICAgICAgJGooICcjd29yZEJhbGxvb24nICkucmVtb3ZlKCk7XG5cbiAgICAgICAgLy90aGUgZm9vdCB0aGUgaW1hZ2UgaXMgaW5cbiAgICAgICAgcCA9ICRqKCAnIycgKyBvICkucGFyZW50cyggJ2Rpdi5mb290QmxvY2snICk7XG4gICAgICAgIHAuY3NzKCB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICB6SW5kZXg6IGRlZmF1bHRaSW5kZXgoIHAuYXR0ciggJ21pbGVZJyApLCBwLmF0dHIoICdtaWxlWCcgKSApXG4gICAgICAgIH0gKTtcblxuICAgICAgICBpZiAoIHNlbGVjdGVkRWxlbWVudC5pc1NlbGVjdGVkID09IHBpY0lEICkge1xuICAgICAgICAgICAgc2VsZWN0ZWRFbGVtZW50LmlzU2VsZWN0ZWQgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBzZWxlY3RlZEVsZW1lbnQuaXNTZWxlY3RlZCA9IHBpY0lEO1xuXG4gICAgaWYgKCAkaiggJyMnICsgcGljSUQgKSApIHtcbiAgICAgICAgbWFrZXNoYWRvdyggcGljSUQgKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG4vL2F1dG9tYXRpYyB0cmF2ZWxsaW5nIC0gZ29lcyBpbiAxMCBzdGVwc1xuLy9jYWxsZWQgb24gbWFwIGRvdWJsZSBjbGlja1xuZnVuY3Rpb24gZ29Ub0xvYyggY29vcmRzICkge1xuICAgIC8vY29vcmRzIC0gYXJyYXkgLSByZXF1aXJlZDpcbiAgICAvL3g6IHggbG9jIGluIDcyIGRwaSBwaXhlbHNcbiAgICAvL3k6IHkgbG9jIGluIDcyIGRwaSBwaXhlbHNcblxuICAgIC8vY29vcmRzIG9wdGlvbmFsXG4gICAgLy9pZDogZWxlbWVudCB0byBzZWxlY3Qgb25jZSB0cmF2ZWwgaXMgY29tcGxldGVcblxuICAgIC8vY2FuY2VsIGFueSBleGlzdGluZyB0cmF2ZWxzXG4gICAgaWYgKCBpbnRJbnRlcnZhbCApIHtcbiAgICAgICAgaW50SW50ZXJ2YWwgPSB3aW5kb3cuY2xlYXJJbnRlcnZhbCggaW50SW50ZXJ2YWwgKTtcbiAgICB9O1xuXG4gICAgLy9zZWxlY3Qgc29tZXRoaW5nIG9uY2Ugd2UgZ2V0IHRoZXJlXG4gICAgaWYgKCBjb29yZHNbICdpZCcgXSApIHtcbiAgICAgICAgaWYgKCBjb29yZHNbICdpZCcgXS5pbmRleE9mKCAncGljJyApID09IC0xICkge1xuICAgICAgICAgICAgY29vcmRzWyAnaWQnIF0gPSAncGljJyArIGNvb3Jkc1sgJ2lkJyBdO1xuICAgICAgICB9O1xuICAgICAgICBzZWxlY3RlZEVsZW1lbnQudG9TZWxlY3QgPSBjb29yZHNbICdpZCcgXTtcbiAgICB9O1xuXG4gICAgbXlTaXplLnRyYXZlbGxpbmcgPSAxO1xuXG4gICAgLy81NSBpcyAxMCs5KzguLmV0Y1xuICAgIHRyYXZlbFggPSBNYXRoLmZsb29yKCBteVNpemUubXlYIC0gY29vcmRzWyAneCcgXSApIC8gNTU7XG4gICAgdHJhdmVsWSA9IE1hdGguZmxvb3IoIG15U2l6ZS5teVkgLSBjb29yZHNbICd5JyBdICkgLyA1NTtcblxuICAgIGlmICggIWlzTmFOKCB0cmF2ZWxYICkgJiYgIWlzTmFOKCB0cmF2ZWxZICkgKSB7XG4gICAgICAgIGludEludGVydmFsID0gd2luZG93LnNldEludGVydmFsKCBcImRvVHJhdmVsKHRyYXZlbFgsIHRyYXZlbFksIDEwKVwiLCA1MCApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vZGJ1ZygnZXJyb3IgaW4gZ29Ub0xvYycgKTtcbiAgICB9O1xuXG59O1xuXG4vLyBhdXRvbWF0aWNhbGx5IHBvc3RpdGlvbnMgdGhlIG1hcCwgd2l0aCBwYXJhbWV0ZXJzIHNldCBpbiBnb1RvTG9jKClcbmZ1bmN0aW9uIGRvVHJhdmVsKCB0cmF2ZWxYLCB0cmF2ZWxZLCBjb3VudCApIHtcblxuICAgIGNvdW50ZXIrKztcblxuICAgIG15U2l6ZS5teVggLT0gKCB0cmF2ZWxYICogY291bnRlciApO1xuICAgIG15U2l6ZS5teVkgLT0gKCB0cmF2ZWxZICogY291bnRlciApO1xuXG4gICAgbW92ZVNjcmVlbigpO1xuXG4gICAgaWYgKCBjb3VudGVyID49IGNvdW50ICkge1xuICAgICAgICBpbnRJbnRlcnZhbCA9IHdpbmRvdy5jbGVhckludGVydmFsKCBpbnRJbnRlcnZhbCApO1xuICAgICAgICBjb3VudGVyID0gMDtcbiAgICAgICAgbXlTaXplLnRyYXZlbGxpbmcgPSAwO1xuXG4gICAgICAgIGVuZE1pbGUoKTtcbiAgICB9O1xufTtcblxuLy9nZXQgYWxsIGNvbW1lbnRzIGZvciBhIHNlbGVjdGVkIGlkXG5mdW5jdGlvbiBnZXRDb21tZW50cyggZGl2ICkge1xuXG4gICAgJGooICcjYmFsbG9vbkNvbnRlbnQnICkuaHRtbCggJzxpbWcgc3JjPVwiL3N0YXRpYy9hamF4LWxvYWRlci5naWZcIiBjbGFzcz1cImJhbGxvb25Mb2FkZXJcIi8+JyApO1xuXG4gICAgaWQgPSBkaXYucmVwbGFjZSggL3BpYy8sICcnICk7XG5cbiAgICAkai5hamF4KCB7XG4gICAgICAgIHVybDogJy9tYXAvZ2V0LWNvbW1lbnRzJyxcbiAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBpZDogaWRcbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogcmV0dXJuQ29tbWVudHNcbiAgICB9ICk7XG5cbn07XG5cbmZ1bmN0aW9uIHJldHVybkNvbW1lbnRzKCBodG1sICkge1xuICAgICRqKCAnI2JhbGxvb25Db250ZW50JyApLmh0bWwoIGh0bWwgKTtcblxuICAgIC8vYWN0aXZhdGUgY29tbWVudCBzdWJtaXRcbiAgICAkaiggJ2Zvcm0jY29tbWVudEZvcm0nICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuICAgICAgICBzdWJtaXRDb21tZW50KCk7XG4gICAgfSApO1xuXG4gICAgYWN0aXZlVm90ZSgpO1xufTtcblxuZnVuY3Rpb24gc2hvd0NvbW1lbnQoIGlkICkge1xuICAgICRqKCAnZGl2LmNvbW1lbnRTZWN0aW9uJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuICAgICAgICAkaiggdGhpcyApLmNzcyggeyBkaXNwbGF5OiAnbm9uZScgfSApO1xuICAgIH0gKTtcblxuICAgICRqKCAnI2NvbW1lbnRTZWN0aW9uJyArIGlkICkuY3NzKCB7IGRpc3BsYXk6ICdibG9jaycgfSApO1xuXG4gICAgJGooICdkaXYjY29tbWVudFRhYnMgZGl2LmNvbW1lbnRUYWInICkuZWFjaCggZnVuY3Rpb24oKSB7XG4gICAgICAgICRqKCB0aGlzICkuYWRkQ2xhc3MoICdkZVNlbGVjdGVkJyApO1xuICAgIH0gKTtcblxuICAgICRqKCAnI2NvbW1lbnRUYWInICsgaWQgKS5yZW1vdmVDbGFzcyggJ2RlU2VsZWN0ZWQnICk7XG59O1xuXG4vL2FjdGl2YXRlIHRoZSB2b3RpbmcgYmxvY2tcbmZ1bmN0aW9uIGFjdGl2ZVZvdGUoKSB7XG4gICAgLy9hdHRhY2ggbGlzdGVuZXJzIHRvIHZvdGluZyBibG9ja1xuICAgICRqKCAnI3RoRG93bicgKS5jbGljayggcGFyc2VWb3RlICk7XG4gICAgJGooICcjdGhVcCcgKS5jbGljayggcGFyc2VWb3RlICk7XG59O1xuXG4vL2dldCBhIHZvdGVcbmZ1bmN0aW9uIHBhcnNlVm90ZSgpIHtcblxuICAgIG9iamlkID0gdGhpcy5nZXRBdHRyaWJ1dGUoICdmb3InICk7XG4gICAgdmFsID0gdGhpcy5nZXRBdHRyaWJ1dGUoICd2YWx1ZScgKTtcblxuICAgIC8vZG9udCBkbyBhamF4IGlmIHRoZSBpcyBjdXJyZW50IHZvdGVcbiAgICBpZiAoICEkaiggdGhpcyApLmhhc0NsYXNzKCAndXAnICkgKSB7XG4gICAgICAgIHZvdGUoIG9iamlkLCB2YWwgKTtcbiAgICB9O1xufTtcblxuLy9zZW5kIGEgdm90ZSBpblxuZnVuY3Rpb24gdm90ZSggb2JqZWN0aWQsIGRpcmVjdGlvbiApIHtcbiAgICAvL2RpcmVjdGlvbiAtMT0gZG93biwgMSA9IHVwXG5cbiAgICAkaiggJyN2b3RlQmxvY2snICkuaHRtbCggJzxpbWcgc3JjPVwiL3N0YXRpYy90aHVtYnMtbG9hZGluZy5wbmdcIiB0aXRsZT1cImxvYWRpbmcuLi5cIi8+JyApO1xuXG4gICAgJGouYWpheCgge1xuICAgICAgICB1cmw6ICcvY29udGVudC92b3RlJyxcbiAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBvYmplY3RpZDogb2JqZWN0aWQsXG4gICAgICAgICAgICBkaXJlY3Rpb246IGRpcmVjdGlvblxuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiByZWNlaXZlVm90ZVxuICAgIH0gKTtcbn07XG5cbmZ1bmN0aW9uIHJlY2VpdmVWb3RlKCBqc29uICkge1xuXG4gICAgZXZhbCggJ3Jlc3VsdCA9ICcgKyBqc29uICk7XG5cbiAgICBpZiAoIHJlc3VsdC5zdWNjZXNzID09IHRydWUgKSB7XG4gICAgICAgICRqKCAnI3ZvdGVCbG9jaycgKS5odG1sKCByZXN1bHQudm90ZSApO1xuICAgICAgICBhY3RpdmVWb3RlKCk7XG4gICAgfSBlbHNlIHtcblxuICAgIH07XG59O1xuXG5cblxuXG5mdW5jdGlvbiBnZXRUaHVtYiggdm90ZSwgaWQgKSB7XG4gICAgdmFyIHZvdGVCbG9jayA9IFwiXCI7XG5cbiAgICBpZiAoIHZvdGUgPT0gMSApIHtcbiAgICAgICAgdm90ZUJsb2NrICs9ICc8aW1nIHNyYz1cIi9zdGF0aWMvdHVwLmdpZlwiIG9uY2xpY2s9XCJ2b3RlKCcgKyBpZCArICcsLTEpXCIvPic7XG4gICAgfSBlbHNlIGlmICggdm90ZSA9PSAtMSApIHtcbiAgICAgICAgdm90ZUJsb2NrICs9ICc8aW1nIHNyYz1cIi9zdGF0aWMvdGRvd24uZ2lmXCIgb25jbGljaz1cInZvdGUoJyArIGlkICsgJywxKVwiLz4nO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZvdGVCbG9jayArPSAnPGltZyBzcmM9XCIvc3RhdGljL3Rkb3duLmdpZlwiIG9uY2xpY2s9XCJ2b3RlKCcgKyBpZCArICcsLTEpXCIvPic7XG4gICAgICAgIHZvdGVCbG9jayArPSAnPGltZyBzcmM9XCIvc3RhdGljL3R1cC5naWZcIiBvbmNsaWNrPVwidm90ZSgnICsgaWQgKyAnLDEpXCIvPic7XG4gICAgfTtcblxuICAgIHJldHVybiB2b3RlQmxvY2s7XG59O1xuXG4vL2FkZCBhIGNvbW1lbnQgdG8gYSBhIHNlY3Rpb25cbmZ1bmN0aW9uIGFkZENvbW1lbnQoKSB7XG4gICAgc2hvd0NvbW1lbnQoICczJyApO1xuICAgICRqKCAnI3NxdWFyZUNvbW1lbnQnICkuZm9jdXMoKTtcbn07XG5cbmZ1bmN0aW9uIGFkZFRhZygpIHtcbiAgICBzaG93Q29tbWVudCggJzQnICk7XG4gICAgJGooICcjc3F1YXJlVGFnJyApLmZvY3VzKCk7XG59O1xuXG4vL3N1Ym1pdCBhIGNvbW1lbnQsIHB1dCBpbnRvIGNvbW1lbnQgcmVjb3JkXG5mdW5jdGlvbiBzdWJtaXRDb21tZW50KCkge1xuXG4gICAgdmFyIGlkID0gJGooICcjc3F1YXJlSUQnICkudmFsKCk7XG4gICAgdmFyIGNvbW1lbnQgPSAkaiggJyNzcXVhcmVDb21tZW50JyApLnZhbCgpO1xuXG4gICAgJGooICcjY29tbWVudEJsb2NrJyApLmh0bWwoICc8aW1nIHNyYz1cIi9zdGF0aWMvYWpheC1sb2FkZXIuZ2lmXCIvPicgKTtcblxuICAgICRqLmFqYXgoIHtcbiAgICAgICAgdXJsOiAnL21hcC9jb21tZW50JyxcbiAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBhY3Rpb246ICdhZGQnLFxuICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgY29tbWVudDogY29tbWVudFxuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiByZXR1cm5Db21tZW50c1xuICAgIH0gKTtcblxufTtcblxuLy9zdWJtaXQgYSB0YWcsIHB1dCBpbnRvIGNvbW1lbnQgcmVjb3JkXG5mdW5jdGlvbiBzdWJtaXRUYWcoKSB7XG5cbiAgICB2YXIgaWQgPSAkaiggJyNzcXVhcmVJRCcgKS52YWwoKTtcbiAgICB2YXIgdGFnID0gJGooICcjc3F1YXJlVGFnJyApLnZhbCgpO1xuXG4gICAgc2hvd0NvbW1lbnQoICcyJyApO1xuXG4gICAgJGouYWpheCgge1xuICAgICAgICB1cmw6ICcvbWFwL3RhZycsXG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgdGFnOiB0YWdcbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogcmV0dXJuQ29tbWVudHNcbiAgICB9ICk7XG5cbn07XG5cbi8vZmxhZyBjb250ZW50IGFzIGlubmFwcnJvcHJpYXRlXG5mdW5jdGlvbiBkb0ZsYWcoIGlkLCByZWFzb24gKSB7XG4gICAgJGouYWpheCgge1xuICAgICAgICB1cmw6ICcvbWFwL2ZsYWcnLFxuICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIG9iamVjdGlkOiBpZCxcbiAgICAgICAgICAgIHJlYXNvbjogcmVhc29uXG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6IHJlY2VpdmVGbGFnXG4gICAgfSApO1xufTtcblxuZnVuY3Rpb24gcmVjZWl2ZUZsYWcoIGpzb24gKSB7XG4gICAgZXZhbCggJ3Jlc3VsdCA9ICcgKyBqc29uICk7XG5cbiAgICBpZiAoIHJlc3VsdC5tc2cgKSB7XG4gICAgICAgICRqKCAnI2xpZ2h0Ym94Y29udGVudCcgKS5odG1sKCByZXN1bHQubXNnICk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2xvc2VMQigpO1xuICAgIH07XG59O1xuXG4vL2RvIHRoaXMgd2hlbiBwaWMgaXMgbWlzc2luZ1xuZnVuY3Rpb24gYXV0b0ZsYWcoIGlkICkge1xuICAgICRqLmFqYXgoIHtcbiAgICAgICAgdXJsOiAnL21hcC9mbGFnJyxcbiAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBvYmplY3RpZDogaWQsXG4gICAgICAgICAgICByZWFzb246ICdtaXNzaW5nJ1xuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiByZWNlaXZlRmxhZ1xuICAgIH0gKTtcbn07XG5cbmZ1bmN0aW9uIHJlY2VpdmVhdXRvRmxhZygganNvbiApIHtcblxufTtcblxuXG5cblxuXG4vL3JhbmRvbSBudW1iZXIgZm9yIGdvVG9Mb2NcbmZ1bmN0aW9uIGdvVG9SYW5kb20oKSB7XG5cbiAgICBjb29yZHMgPSB7XG4gICAgICAgIHg6IE1hdGgucmFuZG9tKCkgKiA0NTYxOTIwLFxuICAgICAgICB5OiBNYXRoLnJhbmRvbSgpICogNDU2MTkyMFxuICAgIH07XG5cbiAgICBnb1RvTG9jKCBjb29yZHMgKTtcbn07XG5cbi8vbW92ZXMgdGhlIG1pbGUgd2hlbiB0aGUgbWFwIHRhcmdldCBpcyBkcmFnZ2VkXG5mdW5jdGlvbiBwb3NNaWxlKCBvYmplY3RYLCBvYmplY3RZICkge1xuICAgIHNjYWxlID0gKCBteVNpemUuc2NhbGUgLyA3MiApO1xuXG4gICAgbXlTaXplLm15WCA9IE1hdGguZmxvb3IoIG9iamVjdFggKiAyNDAxMC4xMDUgKTtcbiAgICBteVNpemUubXlZID0gTWF0aC5mbG9vciggb2JqZWN0WSAqIDI0MDEwLjEwNSApO1xuXG4gICAgbW92ZVNjcmVlbigpO1xufTtcblxuXG5cblxuZnVuY3Rpb24gZ2V0Q29vcmRpbmF0ZXMoIGUgKSB7XG5cbiAgICAvL2dldCBtb3VzZSBwcm9wZXJ0aWVzXG4gICAgdmFyIGUgPSBuZXcgTW91c2VFdmVudCggZSApO1xuXG4gICAgLy9yZWxYPShlLngtMTIpLW15WC0obXlTaXplLndpZHRoLzIpO1xuICAgIC8vcmVsWT0oZS55LTEyKS1teVktKG15U2l6ZS5oZWlnaHQvMik7XG5cbiAgICAvL3RoZSBsb2NhdGlvbiBvZiB0aGUgbW91c2UgcmVsYXRpdmUgdG8gdGhlIHRvcCBsZWZ0IGNvcm5lclxuICAgIC8vdG9wIGxlZnQgKDAsMClcbiAgICAvL2JvdHRvbSByaWdodCAoNDU2MTkxOSw0NTYxOTE5KVxuICAgIHJlbFggPSAoIG15U2l6ZS5teVggKSArICggZS5jbGllbnRYICkgLSAoIG15U2l6ZS53aWR0aCAvIDIgKTtcbiAgICByZWxZID0gKCBteVNpemUubXlZICkgKyAoIGUuY2xpZW50WSApIC0gKCBteVNpemUuaGVpZ2h0IC8gMiApO1xuXG4gICAgLy90aGUgaW5jaCB0aGF0IHRoZSBtb3VzZSBpcyBpbi5cbiAgICAvL3RvcCBsZWZ0KDEsMSlcbiAgICAvL2JvdHRvbSByaWdodCg2MzM2MCw2MzM2MClcbiAgICBzcXVhcmVYID0gTWF0aC5jZWlsKCByZWxYIC8gNzIgKTtcbiAgICBzcXVhcmVZID0gTWF0aC5jZWlsKCByZWxZIC8gNzIgKTtcblxuICAgIC8vZm9vdFggYW5kIGZvb3RZIHJlZmVyIHRvIHNxdWFyZSBmb290IHNpemVkIGFyZWFzIC0gMSB0aHJ1IDUyODAgXG4gICAgZm9vdFggPSBNYXRoLmNlaWwoIHNxdWFyZVggLyAxMiApO1xuICAgIGZvb3RZID0gTWF0aC5jZWlsKCBzcXVhcmVZIC8gMTIgKTtcblxuICAgIC8vdGhlIGMwcjAgZGl2IHR5cGVcbiAgICBjb2xUeXBlID0gKCAoIGZvb3RYIC0gMSApICUgKCBteVNpemUubnVtQ29scyApICk7XG4gICAgcm93VHlwZSA9ICggKCBmb290WSAtIDEgKSAlICggbXlTaXplLm51bVJvd3MgKSApO1xuXG4gICAgbXNnVGV4dCA9IFwicmVsWDogXCIgKyByZWxYICsgXCJcXG5cIjtcbiAgICBtc2dUZXh0ICs9IFwicmVsWTogXCIgKyByZWxZICsgXCJcXG5cIjtcbiAgICBtc2dUZXh0ICs9IFwic3F1YXJlWDogXCIgKyBzcXVhcmVYICsgXCJcXG5cIjtcbiAgICBtc2dUZXh0ICs9IFwic3F1YXJlWTogXCIgKyBzcXVhcmVZICsgXCJcXG5cIjtcbiAgICBtc2dUZXh0ICs9IFwiZm9vdFg6IFwiICsgZm9vdFggKyBcIlxcblwiO1xuICAgIG1zZ1RleHQgKz0gXCJmb290WTogXCIgKyBmb290WSArIFwiXFxuXCI7XG4gICAgbXNnVGV4dCArPSBcImNvbFR5cGU6IFwiICsgY29sVHlwZSArIFwiXFxuXCI7XG4gICAgbXNnVGV4dCArPSBcInJvd1R5cGU6IFwiICsgcm93VHlwZSArIFwiXFxuXCI7XG5cbn07XG5cbi8vYWN0aXZhdGUgdGhlIGFkZCBwaWN0dXJlLCBsaW5rIG9yIHVwbG9hZCAtIG5vdCB3YWl0aW5nIGxpc3RcbmZ1bmN0aW9uIGRyYWdBY3RpdmF0ZSgpIHtcbiAgICAkaiggJyNzbWFsbEFkZCcgKS5kcmFnZ2FibGUoIHtcbiAgICAgICAgc3RhcnQ6IGFjdGl2YXRlU21hbGxBZGQsXG4gICAgICAgIGRyYWc6IHNtYWxsQWRkRHJhZyxcbiAgICAgICAgc3RvcDogY2hlY2tTbWFsbEFkZFxuICAgIH0gKTtcbn07XG5cbmZ1bmN0aW9uIGFjdGl2YXRlU21hbGxBZGQoKSB7XG5cbiAgICAvL3JlbW92ZSB0aGUgYmFzZSB1cmxcbiAgICB0aHVtYnNyYyA9ICggYWRkUGljLnNvdXJjZSApO1xuXG4gICAgcG9zSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2ltZycgKTtcblxuICAgICRqKCBwb3NJbWcgKS5hdHRyKCB7XG4gICAgICAgIGlkOiAncG9zSW1nJyxcbiAgICAgICAgc3JjOiB0aHVtYnNyYyxcbiAgICAgICAgd2lkdGg6ICggYWRkUGljLndpZHRoICogbXlTaXplLnNjYWxlICksXG4gICAgICAgIGhlaWdodDogKCBhZGRQaWMuaGVpZ2h0ICogbXlTaXplLnNjYWxlIClcbiAgICB9ICkuY3NzKCB7XG4gICAgICAgIGxlZnQ6ICcxMDBweCcsXG4gICAgICAgIHRvcDogJzEwMHB4J1xuICAgIH0gKTtcblxuICAgICRqKCAnI3NxdWFyZW1pbGUnICkuYXBwZW5kKCBwb3NJbWcgKTtcblxuICAgICRqKCBcIiNwb3NJbWdcIiApLmFuaW1hdGUoIHtcbiAgICAgICAgb3BhY2l0eTogLjVcbiAgICB9ICk7XG5cbn07XG5cbmZ1bmN0aW9uIHNtYWxsQWRkRHJhZyggZSApIHtcbiAgICBwb3NJbWcgPSAkaiggJyNwb3NJbWcnICk7XG5cbiAgICBwaWNXaWR0aCA9IGFkZFBpYy53aWR0aCAqIG15U2l6ZS5zY2FsZTtcbiAgICBwaWNIZWlnaHQgPSBhZGRQaWMuaGVpZ2h0ICogbXlTaXplLnNjYWxlO1xuXG4gICAgc21YID0gZS5jbGllbnRYIC0gKCBwaWNXaWR0aCAvIDIgKTtcbiAgICBzbVkgPSBlLmNsaWVudFkgLSAoIHBpY0hlaWdodCAvIDIgKTtcblxuICAgIC8vdGhlIGFjdHVhbCB4IGFuZCB5IGNvb3JpbmF0ZXMsIGluIGluY2hlcywgZnJvbSB0aGUgdG9wIGxlZnRcbiAgICBtTGVmdCA9IE1hdGguZmxvb3IoICggKCBteVNpemUubXlYICsgKCAoIGUuY2xpZW50WCAtICggbXlTaXplLndpZHRoIC8gMiApICkgKiAoIDcyIC8gbXlTaXplLnNjYWxlICkgKSApIC8gNzIgKSAtICggYWRkUGljLndpZHRoIC8gMiApICk7XG4gICAgbVRvcCA9IE1hdGguZmxvb3IoICggKCBteVNpemUubXlZICsgKCAoIGUuY2xpZW50WSAtICggbXlTaXplLmhlaWdodCAvIDIgKSApICogKCA3MiAvIG15U2l6ZS5zY2FsZSApICkgKSAvIDcyICkgLSAoIGFkZFBpYy5oZWlnaHQgLyAyICkgKTtcblxuICAgIGFkZFBpYy5pbmNoWCA9IG1MZWZ0O1xuICAgIGFkZFBpYy5pbmNoWSA9IG1Ub3A7XG5cbiAgICAvL3NuYXAgdG8gZ3JpZCAvIHNjYWxlXG4gICAgYWRqWCA9ICggKCAoIG15U2l6ZS5teVggKiAoIG15U2l6ZS5zY2FsZSAvIDcyICkgKSArIGUuY2xpZW50WCAtICggbXlTaXplLndpZHRoIC8gMiApIC0gKCBwaWNXaWR0aCAvIDIgKSApICUgbXlTaXplLnNjYWxlICk7XG4gICAgYWRqWSA9ICggKCBteVNpemUubXlZICogKCBteVNpemUuc2NhbGUgLyA3MiApICkgKyBlLmNsaWVudFkgLSAoIG15U2l6ZS5oZWlnaHQgLyAyICkgLSAoIHBpY0hlaWdodCAvIDIgKSApICUgbXlTaXplLnNjYWxlO1xuXG4gICAgaWYgKCBhZGpYIDwgMCApIHtcbiAgICAgICAgYWRqWCArPSBteVNpemUuc2NhbGU7XG4gICAgfTtcblxuICAgIGlmICggYWRqWSA8IDAgKSB7XG4gICAgICAgIGFkalkgKz0gbXlTaXplLnNjYWxlO1xuICAgIH07XG5cbiAgICBzbVggLT0gKCBhZGpYICk7XG4gICAgc21ZIC09ICggYWRqWSApO1xuXG4gICAgcG9zSW1nLmNzcyggeyBsZWZ0OiBzbVggKyBcInB4XCIsIHRvcDogc21ZICsgXCJweFwiIH0gKTtcbn07XG5cbi8vY2hlY2sgdG8gc2VlIGlmIGRyYWdnZWQgcGljdHVyZSBvdmVybGFwcyBvdGhlcnMgb24gbW91c2UgdXBcbmZ1bmN0aW9uIGNoZWNrU21hbGxBZGQoKSB7XG5cbiAgICBwb3N0VmFycyA9IGFjdGl2YXRlQ3BhbmVsUGxhY2VyKCk7XG5cbiAgICAkai5hamF4KCB7XG4gICAgICAgIGRhdGE6IHBvc3RWYXJzLFxuICAgICAgICBzdWNjZXNzOiBjaGVja092ZXJsYXAsXG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgdXJsOiAnL21pbGUvYWRkLycsXG4gICAgfSApO1xufTtcblxuLy9yZXNwb25zZSBmcm9tIGFqYXgsIHRvIHNlZSBpZiBwaWMgd2FzIGluc2VydGVkIG9yIG92ZXJsYXBzXG5mdW5jdGlvbiBjaGVja092ZXJsYXAoIGpzb24gKSB7XG4gICAgLy9ub3QgZnJvbSB3YWl0aW5nIGxpc3RcbiAgICBldmFsKCAncmVzdWx0ID0gJyArIGpzb24gKTtcblxuICAgIGlmICggcmVzdWx0LnN1Y2Nlc3MgPT0gdHJ1ZSApIHtcblxuICAgICAgICBwID0gJGooICcjJyArIHNlbGVjdGVkRWxlbWVudC5pc1NlbGVjdGVkICkucGFyZW50KCk7XG5cbiAgICAgICAgcC5jc3MoIHtcbiAgICAgICAgICAgIC8vekluZGV4OiBkZWZhdWx0WkluZGV4KDUyODAtKHAuYXR0cignbWlsZVknKSkpKyg1MjgwLShwLmF0dHIoJ21pbGVYJykpKVxuICAgICAgICAgICAgekluZGV4OiBkZWZhdWx0WkluZGV4KCBwLmF0dHIoICdtaWxlWScgKSwgcC5hdHRyKCAnbWlsZVgnICkgKVxuICAgICAgICB9ICk7XG5cbiAgICAgICAgaW1hZ2VBZGRlZCgpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmVtb3ZlUGxhY2VyKCk7XG4gICAgfTtcbn07XG5cblxuLy9tb3ZlIGFuIGltYWdlIHRoYXQgaXMgYWxyZWFkeSBwbGFjZWQgb24gdGhlIG1pbGVcbmZ1bmN0aW9uIG1vdmUoIGlkICkge1xuXG4gICAgLy9yZW1vdmUgdGhlIHNoYWRvd1xuICAgICRqKCAnI2NvbnRlbnRTaGFkb3cnICkucmVtb3ZlKCk7XG5cbiAgICAvL3JlbW92ZSB0aGUgd29yZCBiYWxsb29uXG4gICAgJGooICcjd29yZEJhbGxvb24nICkucmVtb3ZlKCk7XG5cbiAgICAvL3NldCB1cCB0aGUgcG9zaXRpb25pbmcgZGl2XHRcdFxuICAgIGlkID0gJ3BpYycgKyBpZDtcbiAgICBtaWxlcGljID0gJGooICcjJyArIGlkICk7XG5cbiAgICBtaWxlcGljLmNzcygge1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjRDE2QTM4JyxcbiAgICAgICAgYm9yZGVyOiBcIjJweCBzb2xpZCAjRDE2QTM4XCIsXG4gICAgICAgIG9wYWNpdHk6IC41LFxuICAgICAgICBwYWRkaW5nQm90dG9tOiBcIjIwcHhcIlxuICAgIH0gKTtcblxuICAgIC8vc2V0IHVwIHRoZSBzY2FsZWQgdGh1bWJcbiAgICAkaiggJyNzbWFsbEFkZCcgKS5yZW1vdmUoKTtcblxuICAgIC8vc2V0IHVwIHZhcmlhbGJlcyBpbiBnbG9iYWwgaWRlbnRpZmllclxuICAgIGFkZFBpYyA9IHtcbiAgICAgICAgaGVpZ2h0OiBNYXRoLmNlaWwoIG1pbGVwaWMuYXR0ciggJ2hlaWdodCcgKSAvIG15U2l6ZS5zY2FsZSApLFxuICAgICAgICB3aWR0aDogTWF0aC5jZWlsKCBtaWxlcGljLmF0dHIoICd3aWR0aCcgKSAvIG15U2l6ZS5zY2FsZSApLFxuICAgICAgICBzb3VyY2U6IG1pbGVwaWMuYXR0ciggJ3NyYycgKSxcbiAgICAgICAgbW92ZToge1xuICAgICAgICAgICAgeDogbWlsZXBpYy5jc3MoICdsZWZ0JyApLFxuICAgICAgICAgICAgeTogbWlsZXBpYy5jc3MoICd0b3AnICksXG4gICAgICAgICAgICBpZDogaWRcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgc21hbGxBZGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnaW1nJyApO1xuXG4gICAgc3JjID0gbWlsZXBpYy5hdHRyKCAnc3JjJyApO1xuXG4gICAgJGooIHNtYWxsQWRkICkuYXR0cigge1xuICAgICAgICBpZDogJ3NtYWxsQWRkJyxcbiAgICAgICAgc3JjOiBzcmMsXG4gICAgICAgIHdpZHRoOiAoIGFkZFBpYy53aWR0aCAqIG15U2l6ZS5zY2FsZSApLFxuICAgICAgICBoZWlnaHQ6ICggYWRkUGljLmhlaWdodCAqIG15U2l6ZS5zY2FsZSApXG4gICAgfSApLmNzcygge1xuICAgICAgICBsZWZ0OiBtaWxlcGljLmNzcyggJ2xlZnQnICksXG4gICAgICAgIHRvcDogbWlsZXBpYy5jc3MoICd0b3AnICksXG4gICAgICAgIHpJbmRleDogNTAwMFxuICAgIH0gKTtcblxuICAgIG1pbGVwaWMucGFyZW50KCkuYXBwZW5kKCBzbWFsbEFkZCApO1xuXG4gICAgLy9hY3RpdmF0ZSB0aGUgYWRkIHBpY3R1cmVcbiAgICBkcmFnQWN0aXZhdGUoKTtcbn07XG5cbi8vc2V0IGJyb3dzZXIgaGFzaCB0byBjdXJyZW50IGxvY2F0aW9uXG5mdW5jdGlvbiBzZXRCcm93c2VySGFzaCgpIHtcblxuICAgIHNjYWxlID0gbXlTaXplLnNjYWxlIC8gNzI7XG5cbiAgICBuZXdIYXNoID0gXCJ4PVwiICsgTWF0aC5mbG9vciggbXlTaXplLm15WCApICsgXCImeT1cIiArIE1hdGguZmxvb3IoIG15U2l6ZS5teVkgKTtcbiAgICBuZXdIYXNoICs9IFwiJnM9XCIgKyBteVNpemUuc2NhbGU7XG5cbiAgICBvbGRIYXNoID0gbXlTaXplLmhhc2g7XG5cbiAgICBpZiAoICggbmV3SGFzaCAhPSBvbGRIYXNoICkgJiYgKCAhaXNOYU4oIE1hdGguZmxvb3IoIG15U2l6ZS5teVggKSApICkgKSB7XG4gICAgICAgIG15U2l6ZS5oYXNoID0gXCIjXCIgKyBuZXdIYXNoO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IG5ld0hhc2g7XG4gICAgfTtcbn07XG5cbi8vZmxhZyBhbiBvZmZlbnNpdmUsIGNvcHlpZ2h0IGltYWdlIGV0Y1xuZnVuY3Rpb24gc3RhcnRSZXBvcnQoIGlkICkge1xuICAgIGNvbnRlbnQgPSBcIjxoMj5XaGF0IGRvIHlvdSB3YW50IHRvIHJlcG9ydD88aDI+XCI7XG5cbiAgICBpbWFnZSA9ICRqKCAnI3BpYycgKyBpZCApLmF0dHIoICdzcmMnICk7XG5cbiAgICB2YXIgcGljID0gbmV3IEltYWdlKCk7XG4gICAgcGljLnNyYyA9IGltYWdlO1xuICAgIHdpZHRoID0gcGljLndpZHRoO1xuICAgIGhlaWdodCA9IHBpYy5oZWlnaHQ7XG5cbiAgICBpZiAoIGFkZFBpYy5oZWlnaHQgPiBhZGRQaWMud2lkdGggKSB7XG4gICAgICAgIHZhciBzbWFsbEggPSAyMDA7XG4gICAgICAgIHZhciBzbWFsbFcgPSAoIHdpZHRoIC8gaGVpZ2h0ICkgKiAyMDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHNtYWxsVyA9IDIwMDtcbiAgICAgICAgdmFyIHNtYWxsSCA9ICggaGVpZ2h0IC8gd2lkdGggKSAqIDIwMDtcbiAgICB9O1xuXG4gICAgY29udGVudCArPSAnPGltZyBzcmM9XCInICsgaW1hZ2UgKyAnXCIgc3R5bGU9XCJmbG9hdDpyaWdodFwiIHdpZHRoPVwiJyArIHNtYWxsVyArICdcIiBoZWlnaHQ9XCInICsgc21hbGxIICsgJ1wiLz4nO1xuXG4gICAgY29udGVudCArPSAnPGxpPjxhIG9uY2xpY2s9XCJkb0ZsYWcoJyArIGlkICsgJyxcXCdjb3B5cmlnaHRcXCcgKTtcIj5Db3B5cmlnaHRlZCBJbWFnZTwvYT48L2xpPic7XG4gICAgY29udGVudCArPSAnPGxpPjxhIG9uY2xpY2s9XCJkb0ZsYWcoJyArIGlkICsgJyxcXCdpbWFnZVxcJyApO1wiPkluYXBwcm9wcmlhdGUgSW1hZ2U8L2E+PC9saT4nO1xuICAgIGNvbnRlbnQgKz0gJzxsaT48YSBvbmNsaWNrPVwiZG9GbGFnKCcgKyBpZCArICcsXFwnY29tbWVudFxcJyApO1wiPk9mZmVuc2l2ZSBDb21tZW50IC8gU3BhbTwvYT48L2xpPic7XG5cbiAgICBjb250ZW50ICs9ICc8bGk+PGEgb25jbGljaz1cImNsb3NlTEIoKTtcIj5OZXZlciBNaW5kPC9hPjwvbGk+JztcblxuICAgIC8vbmV3IExpZ2h0Ym94KGNvbnRlbnQsIHRydWUpO1xuICAgIG5ldyBMaWdodGJveCgge1xuICAgICAgICBjbG9zZTogdHJ1ZSxcbiAgICAgICAgY29udGVudDogY29udGVudCxcbiAgICAgICAgdGl0bGU6ICdSZXBvcnQgYmFkIGNvbnRlbnQnXG4gICAgfSApO1xufTtcblxuXG4vLy9jcGFuZWwgYmVsb3dcblxuLy9pdGVtIGZyb20gY29udHJvbDEgaXMgY2xpY2tlZCwgbG9hZCBzdWJtZW51XG5mdW5jdGlvbiBnZXRDb250cm9sKCB3aGljaCApIHtcblxuICAgIC8vcmVtb3ZlIHNlbGVjdGVkIGZyb20gb3RoZXJzIFxuICAgICRqKCAnI2NvbnRyb2wxIGEnICkuZWFjaCggZnVuY3Rpb24oIGluZGV4ICkge1xuICAgICAgICAkaiggdGhpcyApLnJlbW92ZUNsYXNzKCAnc2VsZWN0ZWQnICk7XG4gICAgICAgIGlmICggdGhpcy5pZCA9PSAnbWVudV8nICsgd2hpY2ggKSB7XG4gICAgICAgICAgICBhcnJvd0luZGV4ID0gaW5kZXg7XG4gICAgICAgIH07XG4gICAgfSApO1xuXG4gICAgLy9hZGQgc2VsZWN0ZWQgc3RhdGUgXG4gICAgJGooICcjbWVudV8nICsgd2hpY2ggKS5hZGRDbGFzcyggJ3NlbGVjdGVkJyApO1xuXG4gICAgdmFyIG1zZ1RleHQgPSAnPHVsPic7XG5cbiAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBjcGFuZWxDb250cm9sc1sgd2hpY2ggXS5sZW5ndGg7IGkgKz0gMiApIHtcbiAgICAgICAgbXNnVGV4dCArPSAnPGxpPic7XG4gICAgICAgIG1zZ1RleHQgKz0gJzxhIGNsYXNzPVwiJyArICggYXJyb3dJbmRleCA9PSAoIGkgLyAyICkgPyAnc3BlY2lhbCcgOiAnJyApICsgJ1wiICcgKyBjcGFuZWxDb250cm9sc1sgd2hpY2ggXVsgaSArIDEgXSArICc+JyArIGNwYW5lbENvbnRyb2xzWyB3aGljaCBdWyBpIF07XG4gICAgICAgIG1zZ1RleHQgKz0gJzwvYT48L2xpPic7XG4gICAgfTtcblxuICAgICRqKCAnI2NvbnRyb2wyJyApLmh0bWwoIG1zZ1RleHQgKyAnPC91bD4nICk7XG59O1xuXG4vL2dldCBpbmZvcm1hdGlvbiBhYm91dCBhIGZyaWVuZFxuZnVuY3Rpb24gZ2V0RnJpZW5kSW5mbyggaWQsIG9iaiApIHtcblxuICAgICRqKCAnI2ZyaWVuZFByb2ZpbGVtYWluJyApLmh0bWwoICdMb2FkaW5nLi4uJyApO1xuICAgICRqKCAnI2ZyaWVuZEFkZG1haW4nICkuaHRtbCggJ0xvYWRpbmcuLi4nICk7XG4gICAgJGooICcjZnJpZW5kQ29tbWVudG1haW4nICkuaHRtbCggJ0xvYWRpbmcuLi4nICk7XG4gICAgJGooICcjbTQnICkuc2xpZGVEb3duKCk7XG5cbiAgICBzZXRUaXRsZSggJ200Jywgb2JqLmdldEF0dHJpYnV0ZSggJ3VzZXInICkgKTtcbiAgICBzZXROYXYoICdtNCcsICdvZmYnICk7XG5cbiAgICAkai5hamF4KCB7XG4gICAgICAgIHVybDogJy9wcm9maWxlL3B1YmxpYycsXG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgdXNlcmlkOiBpZFxuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiggZGF0YSApIHtcbiAgICAgICAgICAgIHJlY2VpdmVGcmllbmRQcm9maWxlKCBkYXRhLCBpZCApO1xuICAgICAgICB9XG4gICAgfSApO1xufTtcblxuZnVuY3Rpb24gcmVjZWl2ZUZyaWVuZFByb2ZpbGUoIGpzb24sIGlkICkge1xuXG4gICAgZXZhbCggJ3Jlc3VsdCA9ICcgKyBqc29uICk7XG4gICAgcHJvZmlsZSA9IHJlc3VsdC5wcm9maWxlO1xuXG4gICAgJGooICcjZnJpZW5kUHJvZmlsZW1haW4nICkuaHRtbCggcHJvZmlsZSApO1xuXG4gICAgLy9zZXQgdXAgdGh1bWJzIG1lbnUgZm9yIGZyaWVuZCByZWNlbnQgYWRkc1xuICAgIGZyaWVuZFJlY2VudCA9IG5ldyB0aHVtYnNNZW51KCB7XG4gICAgICAgIGFjdGlvbjogJy90aHVtYnMvcmVjZW50QWRkcycsXG4gICAgICAgIHRpdGxlOiAnUmVjZW50bHkgQWRkZWQnLFxuICAgICAgICBjb250YWluZXI6ICdmcmllbmRBZGQnLFxuICAgICAgICBsaW1pdDogNCxcbiAgICAgICAgbGlzdFRodW1iczogcmVzdWx0LmFkZHMsXG4gICAgICAgIHJzczogJy9yc3MnLFxuICAgICAgICB2YXJzOiB7IHVzZXJpZDogaWQgfVxuICAgIH0gKTtcblxuICAgIC8vc2V0IHVwIHRodW1icyBtZW51IGZvciBmcmllbmQgcmVjZW50IGNvbW1lbnRzXG4gICAgZnJpZW5kQ29tZW50cyA9IG5ldyB0aHVtYnNNZW51KCB7XG4gICAgICAgIGFjdGlvbjogJy90aHVtYnMvcmVjZW50Q29tbWVudHMnLFxuICAgICAgICB0aXRsZTogJ1JlY2VudCBDb21tZW50cycsXG4gICAgICAgIGNvbnRhaW5lcjogJ2ZyaWVuZENvbW1lbnQnLFxuICAgICAgICBsaW1pdDogNCxcbiAgICAgICAgbGlzdFRodW1iczogcmVzdWx0LmNvbW1lbnRzLFxuICAgICAgICB2YXJzOiB7IHVzZXJpZDogaWQgfVxuICAgIH0gKTtcblxuICAgICRqKCAnI200JyApLnNsaWRlRG93bigpO1xufTtcblxuLy9nZXQgZnJpZW5kcyBvZiBsb2dnZWQgaW4gdXNlclxuZnVuY3Rpb24gZ2V0RnJpZW5kcygpIHtcbiAgICB1c2VyRnJpZW5kcyA9IG5ldyB0aHVtYnNNZW51KCB7XG4gICAgICAgIGFjdGlvbjogJy90aHVtYnMvZnJpZW5kcycsXG4gICAgICAgIHRpdGxlOiAnWW91ciBGcmllbmRzJyxcbiAgICAgICAgY29udGFpbmVyOiAnbTInLFxuICAgICAgICByc3M6ICcvcnNzL2ZyaWVuZHMvdXNlcmlkLzkzJ1xuICAgIH0gKTtcblxuICAgICRqKCAnI20yJyApLnNsaWRlRG93bigpO1xufTtcblxuLy9nZXQgZmF2b3JpdGVzIG9mIGxvZ2dlZCBpbiB1c2VyXG5mdW5jdGlvbiBnZXRGYXZlcygpIHtcbiAgICB1c2VyRmF2ZXMgPSBuZXcgdGh1bWJzTWVudSgge1xuICAgICAgICBhY3Rpb246ICcvdGh1bWJzL2Zhdm9yaXRlcycsXG4gICAgICAgIHRpdGxlOiAnWW91ciBGYXZvcml0ZXMnLFxuICAgICAgICBjb250YWluZXI6ICdtMidcbiAgICB9ICk7XG5cbiAgICAkaiggJyNtMicgKS5zbGlkZURvd24oKTtcbn07XG5cblxuLy9yZXRyaWV2ZSB1c2VyIGluZm9ybWF0aW9uXG5mdW5jdGlvbiBnZXRBY2NvdW50KCkge1xuXG4gICAgJGooICcjbTJtYWluJyApLmh0bWwoICdMb2FkaW5nIFlvdXIgQWNjb3VudCBJbmZvLi4uPGJyLz48aW1nIHNyYz1cIi9zdGF0aWMvYWpheC1sb2FkZXIuZ2lmXCIvPicgKTtcbiAgICAkaiggJyNtMmVycicgKS5odG1sKCAnJyApO1xuXG4gICAgc2V0VGl0bGUoICdtMicsICdZb3VyIEFjY291bnQgSW5mbycgKTtcbiAgICBzZXROYXYoICdtMicsICdvZmYnICk7XG5cbiAgICAkaiggJyNtMicgKS5zbGlkZURvd24oKTtcblxuICAgICRqLmFqYXgoIHtcbiAgICAgICAgdXJsOiAnL3Byb2ZpbGUvYWNjb3VudCcsXG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgc3VjY2VzczogcmVjZWl2ZUFjY291bnRcbiAgICB9ICk7XG59O1xuXG4vL3JlY2VpdmVkIHVzZXIgcHJvZmlsZSBpbmZvXG5mdW5jdGlvbiByZWNlaXZlQWNjb3VudCggaHRtbCApIHtcblxuICAgIC8vb3V0cHV0IHRvIHNjcmVlblxuICAgICRqKCAnI20ybWFpbicgKS5odG1sKCBodG1sICk7XG4gICAgJGooICcjbTInICkuc2xpZGVEb3duKCk7XG59O1xuXG4vL3Rha2VzIG5ldyBwcm9maWxlIGluZm8gYW5kIHNlbmRzIGJhY2sgdG8gc2VydmVyXG5mdW5jdGlvbiBVcGRhdGVQcm9maWxlKCkge1xuICAgIHF1ZXJ5ID0gcHJlcEFycmF5Rm9yQWpheCggZ2V0Rm9ybVZhcnMoICd1c2VyQWNjb3VudCcgKSApO1xuXG4gICAgJGouYWpheCgge1xuICAgICAgICB1cmw6ICcvcHJvZmlsZS91cGRhdGUtYWNjb3VudCcsXG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgZGF0YTogcXVlcnksXG4gICAgICAgIHN1Y2Nlc3M6IHByb2ZpbGVTdWNjZXNzXG4gICAgfSApO1xuXG59O1xuXG4vL2NhbGxlZCBhZnRlciB1c2VyIHVwZGF0ZXMgYWNjb3VudCBpbmZvcm1hdGlvblxuZnVuY3Rpb24gcHJvZmlsZVN1Y2Nlc3MoIGpzb24gKSB7XG5cbiAgICBldmFsKCAncmVzdWx0ID0gJyArIGpzb24gKTtcblxuICAgIGZvcm1hdCA9ICcnO1xuXG4gICAgaWYgKCByZXN1bHQuc3VjY2Vzcy5sZW5ndGggPiAwICkge1xuICAgICAgICBmb3IgKCBpIGluIHJlc3VsdC5zdWNjZXNzICkge1xuICAgICAgICAgICAgZm9ybWF0ICs9ICc8bGk+JyArIHJlc3VsdC5zdWNjZXNzWyBpIF0gKyAnPC9saT4nO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBpZiAoIHJlc3VsdC5lcnJvcnMubGVuZ3RoID4gMCApIHtcbiAgICAgICAgZm9yICggaSBpbiByZXN1bHQuc3VjY2VzcyApIHtcbiAgICAgICAgICAgIGZvcm1hdCArPSAnPGxpPicgKyByZXN1bHQuZXJyb3JzWyBpIF0gKyAnPC9saT4nO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgICRqKCAnI20ybWFpbicgKS5odG1sKCBmb3JtYXQgKTtcbiAgICAkaiggJyNtMicgKS5zbGlkZURvd24oKTtcbn07XG5cblxuXG5cbi8vaG90bGluayB0byBhbiBpbWFnZSwgc3RlcCAxXG5mdW5jdGlvbiBhZGRJbWFnZSgpIHtcblxuICAgIHZhciBtc2dUZXh0ID0gJ1x0PGg0PkVudGVyIFVSTCBvZiBpbWFnZTo8L2g0Pic7XG5cbiAgICBtc2dUZXh0ICs9ICdcdDxmb3JtIGFjdGlvbj1cImphdmFzY3JpcHQ6YWRkSW1hZ2UyKCk7XCIgbmFtZSA9XCJhZGRGb3JtXCI+JztcbiAgICBtc2dUZXh0ICs9ICdcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJzdGRJbnB1dFwiIGlkPVwiaW1nTG9jXCIgLz4nO1xuICAgIG1zZ1RleHQgKz0gJ1x0XHQ8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiTGluayBJdCFcIiBjbGFzcz1cInN0ZEJ1dHRvbiBsZWZ0TWFyZ2luXCIgLz4nO1xuICAgIG1zZ1RleHQgKz0gJ1x0PC9mb3JtPic7XG5cbiAgICBtc2dUZXh0ICs9ICdcdDxzcGFuIGNsYXNzPVwiaGVscGVyVGV4dFwiPkVudGVyIGZ1bGwgcGF0aCB0byB0aGUgaW1hZ2UsIDxici8+ZWcgaHR0cDovL3d3dy5zZXJ2ZXIuY29tL3BpYy5qcGc8L3NwYW4+JztcblxuICAgIHNldFRpdGxlKCAnbTEnLCAnSG90bGluayB0byBhbiBpbWFnZSBvbiB0aGUgd2ViJyApO1xuICAgIHNldE5hdiggJ20xJywgJ29mZicgKTtcblxuICAgICRqKCAnI20xbWFpbicgKS5odG1sKCBtc2dUZXh0ICk7XG4gICAgJGooICcjbTFlcnInICkuaHRtbCgpO1xuICAgICRqKCAnI20xJyApLnNsaWRlRG93bigpO1xufTtcblxuLy9ob3RsaW5rIHRvIGFuIGltYWdlLCBzdGVwIDJcbmZ1bmN0aW9uIGFkZEltYWdlMigpIHtcbiAgICBjb250ZW50SW5zZXJ0ID0gJGooICcjaW1nTG9jJyApLnZhbCgpO1xuICAgIGlmICggY29udGVudEluc2VydCApIHtcbiAgICAgICAgJGooICcjaW1nTG9jJyApLnZhbCggJycgKTtcbiAgICAgICAgJGouYWpheCgge1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGNvbnRlbnRJbnNlcnRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiB1cGxvYWRDb21wbGV0ZSxcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgIHVybDogJy9jb250ZW50L2FkZCcsXG4gICAgICAgIH0gKTtcblxuICAgICAgICAkaiggJyNtMW1haW4nICkuaHRtbCggJ1BsZWFzZSBXYWl0JyApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICRqKCAnI20xZXJyJyApLmh0bWwoICdUcnkgbGlua2luZyB0byBhbiBpbWFnZSBmaWxlJyApO1xuICAgIH07XG59O1xuXG5mdW5jdGlvbiB1cGxvYWRDb21wbGV0ZSgganNvbiApIHtcbiAgICBldmFsKCAncmVzdWx0ID0gJyArIGpzb24gKTtcblxuICAgIGlmICggcmVzdWx0LnN1Y2Nlc3MgPT0gdHJ1ZSApIHtcbiAgICAgICAgcmVhZHlUb0FkZCggJy9jb250ZW50L29yaWdpbmFsLycgKyByZXN1bHQubmFtZSwgcmVzdWx0LmRpbXMud2lkdGgsIHJlc3VsdC5kaW1zLmhlaWdodCApO1xuXG4gICAgICAgIC8vYWN0aXZhdGUgdGhlIGFkZCBwaWN0dXJlXG4gICAgICAgIGRyYWdBY3RpdmF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICRqKCAnI20xbWFpbicgKS5odG1sKCAnVGhlcmUgd2FzIGFuIGVycm9yIGxvYWRpbmcgdGhlIGZpbGUuICBQbGVhc2UgY2hlY2sgdGhlIGFkZHJlc3MgYW5kIHRyeSBhZ2Fpbi4nICk7XG4gICAgfTtcbn07XG5cbi8vdXBsb2FkIGZyb20geW91ciBjcHVcbmZ1bmN0aW9uIHN0YXJ0VXBsb2FkKCkge1xuXG4gICAgc2V0VGl0bGUoICdtMScsICdVcGxvYWQgYW4gaW1hZ2UgZnJvbSB5b3VyIGNvbXB1dGVyJyApO1xuICAgIHNldE5hdiggJ20xJywgJ29mZicgKTtcblxuICAgIG1zZ1RleHQgPSBcIlRoZSB1cGxvYWRlciBpcyBub3QgcXVpdGUgd29ya2luZyB5ZXQhICBZb3UgY2FuIGxpbmsgYW4gaW1hZ2Ugb24gdGhlIHdlYiBmb3Igbm93LlwiO1xuXG4gICAgJGooICcjbTFtYWluJyApLmh0bWwoIG1zZ1RleHQgKTtcbiAgICAkaiggJyNtMWVycicgKS5odG1sKCAnJyApO1xuXG4gICAgJGooICcjbTEnICkuc2xpZGVEb3duKCk7XG59O1xuXG4vL2dldCB0aGUgbGlzdCBvZiBpbWFnZXMgdGhhdCBhcmUgd2FpdGluZyBmb3IgdGhpcyB1c2VyIFxuLy9mcm9tIHBsdWdpbiBvciBlbWFpbFxudmFyIGdldFdhaXRpbmc7XG5cbmZ1bmN0aW9uIGdldFdhaXRpbmdMaXN0KCBzdGFydCApIHtcbiAgICBnZXRXYWl0aW5nID0gbmV3IHRodW1ic01lbnUoIHtcbiAgICAgICAgYWN0aW9uOiAnL3RodW1icy93YWl0aW5nJyxcbiAgICAgICAgdGl0bGU6ICdZb3VyIFdhaXRpbmcgTGlzdCcsXG4gICAgICAgIGNvbnRhaW5lcjogJ20yJ1xuICAgIH0gKTtcblxuICAgICRqKCAnI20yJyApLnNsaWRlRG93bigpO1xufTtcblxuZnVuY3Rpb24gZ2V0UG9wdWxhciggc3RhcnQgKSB7XG5cbiAgICAkaiggJyNtMm1haW4nICkuaHRtbCggJ0xvYWRpbmcgcG9wdWxhci4uLicgKTtcbiAgICAkaiggJyNtMicgKS5zbGlkZURvd24oKTtcblxuICAgIHBvcHVsYXJUaHVtYnMgPSBuZXcgdGh1bWJzTWVudSgge1xuICAgICAgICBhY3Rpb246ICcvdGh1bWJzL3BvcHVsYXInLFxuICAgICAgICB0aXRsZTogJ01vc3QgUG9wdWxhcicsXG4gICAgICAgIGNvbnRhaW5lcjogJ20yJ1xuICAgIH0gKTtcbn07XG5cblxuZnVuY3Rpb24gZ2V0UmVjZW50KCBzdGFydCApIHtcbiAgICByZWNlbnRUaHVtYnMgPSBuZXcgdGh1bWJzTWVudSgge1xuICAgICAgICBhY3Rpb246ICcvdGh1bWJzL3JlY2VudCcsXG4gICAgICAgIHRpdGxlOiAnUmVjZW50bHkgQWRkZWQnLFxuICAgICAgICBjb250YWluZXI6ICdtMidcbiAgICB9ICk7XG5cbiAgICAkaiggJyNtMicgKS5zbGlkZURvd24oKTtcbn07XG5cbi8vZ2V0IHRoZSBjb29yZGluYXRlcyBmcm9tIHRoZSBjb29yZHM9XCJcIiBhdHRyaWJ1dGUgb2YgYW4gZWxlbW50LCBnbyB0aGVyZVxuZnVuY3Rpb24gZmluZENvb3JkcygpIHtcbiAgICB0ZXh0ID0gXCJjb29yZHMgPSBcIiArICRqKCB0aGlzICkuYXR0ciggJ2Nvb3JkcycgKTtcbiAgICBldmFsKCB0ZXh0ICk7XG5cbiAgICBnb1RvTG9jKCBjb29yZHMgKTtcbn07XG5cblxuZnVuY3Rpb24gcmVjRGVsKCBqc29uICkge1xuXG59O1xuXG4vL29iamVjdCB0byBoYW5kbGUgYnVpbGRpbmcgbmV4dCAvIHByZXYgbWVudSBpdGVtc1xuZnVuY3Rpb24gdGh1bWJzTWVudSggdmFycywgY3VzdG9tUXVlcnkgKSB7XG5cbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgYWN0aW9uOiAnZ2V0UmVjZW50JywgLy90aGUgZnVuY3Rpb24gdGhhdCBkb2VzIHRoZSBhamF4IGNhbGxcbiAgICAgICAgY29udGFpbmVyOiAnbTInLCAvL3doZXJlIGl0IGdvZXNcbiAgICAgICAgaW5kZXg6IDAsIC8vd2hlcmUgd2UgYXJlIGluIG91ciBsaXN0XG4gICAgICAgIGxpbWl0OiA4LCAvL2hvdyBtYW55IHRodW1icyBkbyB3ZSBzaG93IGF0IG9uY2VcbiAgICAgICAgbGlzdFRodW1iczogbmV3IEFycmF5KCAwICksIC8vaG9sZHMgdGhlIGFyYXkgb2YgdGh1bWJzIC9jb29yZGluYXRlc1xuICAgICAgICByc3M6ICcnLCAvLyB1cmwgdG8gUlNTIGZlZWRcbiAgICAgICAgc2VsZWN0ZWQ6IDAsIC8vd2hpY2ggb25lIHdlIGhhdmUgY2xpY2tlZCBvblxuICAgICAgICB0aXRsZTogJ1RodW1icyBNZW51JywgLy90aGUgdGV4dCB0byBkaXNwbGF5IGluIG1lbnUgaGVhZGVyXG4gICAgICAgIHZhcnM6IHt9IC8vYW55IGV4dHJhIHBvc3QgdmFyYWlibGVzIHRoYXQgZG8gbm90IGNoYW5nZSwgbGlrZSB7dXNlcmlkOiA5fVxuICAgIH07XG5cbiAgICAvL3NldCB2YXJpYWJsZXMgcGFzc2VzIGluIGludG8gdGhlIG9wdGlvblxuICAgIGZvciAoIGkgaW4gdmFycyApIHtcbiAgICAgICAgb3B0aW9uc1sgaSBdID0gdmFyc1sgaSBdO1xuICAgIH07XG5cbiAgICAvL2RlZmluZSBvdGhlciBwYXJ0cyBvZiB0aGUgbWVudVxuICAgIG9wdGlvbnMudGl0bGVJZCA9ICRqKCAnIycgKyBvcHRpb25zLmNvbnRhaW5lciArIFwiIC5jVGl0bGVcIiApLmdldCggMCApO1xuICAgIG9wdGlvbnMubmV4dElkID0gb3B0aW9ucy5jb250YWluZXIgKyBcIm5leHRcIjtcbiAgICBvcHRpb25zLnByZXZJZCA9IG9wdGlvbnMuY29udGFpbmVyICsgXCJwcmV2XCI7XG4gICAgb3B0aW9ucy5tYWluSWQgPSBvcHRpb25zLmNvbnRhaW5lciArIFwibWFpblwiO1xuXG4gICAgJGooICcjJyArIG9wdGlvbnMucHJldklkICkuY3NzKCB7IGRpc3BsYXk6ICdub25lJyB9ICk7XG4gICAgJGooICcjJyArIG9wdGlvbnMubmV4dElkICkuY3NzKCB7IGRpc3BsYXk6ICdub25lJyB9ICk7XG5cbiAgICAvL3RvZ2dsZSByc3MgZmVlZFxuICAgIGlmICggb3B0aW9ucy5yc3MgKSB7XG4gICAgICAgIGRpc3AgPSAnYmxvY2snO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGRpc3AgPSAnbm9uZSc7XG4gICAgfTtcblxuICAgIHJzc2ZlZWQgPSAkaiggJyMnICsgb3B0aW9ucy5jb250YWluZXIgKyAnIGEuYnRuUlNTJyApLmNzcyggeyBkaXNwbGF5OiBkaXNwIH0gKTtcblxuICAgIHJzc2ZlZWQuYXR0ciggJ2hyZWYnLCBvcHRpb25zLnJzcyApO1xuXG4gICAgdmFyIGFqYXhDYWxsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vc2V0IHRoZSBtZXNzYWdlIHRpdGxlXG5cbiAgICAgICAgb3B0aW9ucy50aXRsZUlkLmlubmVySFRNTCA9IFwiTG9hZGluZyBcIiArIG9wdGlvbnMudGl0bGUgKyBcIi4uLlwiO1xuICAgICAgICAkaiggJyMnICsgb3B0aW9ucy5tYWluSWQgKS5odG1sKCAnPGltZyBzcmM9XCIvc3RhdGljL2FqYXgtbG9hZGVyLmdpZlwiLz4nICk7XG5cbiAgICAgICAgdmFyIHF1ZXJ5ID0gXCJzdGFydD1cIiArICggb3B0aW9ucy5saXN0VGh1bWJzLmxlbmd0aCApICsgXCImXCIgKyBwcmVwRm9yUXVlcnkoIG9wdGlvbnMudmFycyApO1xuXG4gICAgICAgICRqLmFqYXgoIHtcbiAgICAgICAgICAgIGRhdGE6IHF1ZXJ5LFxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oIGpzb24gKSB7XG4gICAgICAgICAgICAgICAgZXZhbCggJ3Jlc3VsdCA9ICcgKyBqc29uICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHJlc3VsdC5zdWNjZXNzID09ICdmYWxzZScgKSB7XG4gICAgICAgICAgICAgICAgICAgICRqKCAnIycgKyBvcHRpb25zLmNvbnRhaW5lciArICdtYWluJyApLmh0bWwoIHJlc3VsdC5odG1sICk7XG5cbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy50aXRsZUlkLmlubmVySFRNTCA9IG9wdGlvbnMudGl0bGU7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25jYXRUbyggcmVzdWx0ICk7XG5cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVybDogb3B0aW9ucy5hY3Rpb25cbiAgICAgICAgfSApO1xuICAgIH07XG5cblxuICAgIC8vYWRkIHRoZSBuZXcgcmVjb3JkcyB3ZSByZWNlaXZlZCB2aWEgYWpheCB0byB0aGUgYXJyYXlcdFxuICAgIHZhciBjb25jYXRUbyA9IGZ1bmN0aW9uKCBuZXdUaHVtYnMgKSB7XG4gICAgICAgIGlmICggbmV3VGh1bWJzLnRodW1icyApIHtcbiAgICAgICAgICAgIG9sZFRodW1icyA9IG9wdGlvbnMubGlzdFRodW1icztcblxuICAgICAgICAgICAgeCA9IG9sZFRodW1icy5jb25jYXQoIG5ld1RodW1icy50aHVtYnMgKTtcblxuICAgICAgICAgICAgb3B0aW9ucy5saXN0VGh1bWJzID0geDtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICggbmV3VGh1bWJzLnN0YW1wICkge1xuICAgICAgICAgICAgb3B0aW9ucy52YXJzLnN0YW1wID0gbmV3VGh1bWJzLnN0YW1wO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNldE5hdigpO1xuICAgICAgICBmb3JtYXROYXYoKTtcbiAgICAgICAgZm9ybWF0VGh1bWJzKCk7XG4gICAgICAgIGZvcm1hdFRpdGxlKCk7XG4gICAgfTtcblxuICAgIHZhciBmb3JtYXRUaXRsZSA9IGZ1bmN0aW9uKCB0aXRsZSApIHtcblxuICAgICAgICBpZiAoIHRpdGxlICkge1xuICAgICAgICAgICAgb3B0aW9ucy50aXRsZSA9IHRpdGxlO1xuICAgICAgICB9O1xuXG4gICAgICAgIGxlbiA9ICggb3B0aW9ucy5pbmRleCArIG9wdGlvbnMubGltaXQgKSA8IG9wdGlvbnMubGlzdFRodW1icy5sZW5ndGggPyAoIG9wdGlvbnMuaW5kZXggKyBvcHRpb25zLmxpbWl0ICkgOiBvcHRpb25zLmxpc3RUaHVtYnMubGVuZ3RoO1xuXG4gICAgICAgIG5ld3RpdGxlID0gb3B0aW9ucy50aXRsZSArIFwiICggXCIgKyAoIG9wdGlvbnMuaW5kZXggKyAxICkgKyBcIiAtIFwiICsgbGVuICsgXCIgKVwiO1xuXG4gICAgICAgIG9wdGlvbnMudGl0bGVJZC5pbm5lckhUTUwgPSBuZXd0aXRsZTtcbiAgICB9O1xuXG4gICAgLy9kZWNpZGUgaWYgbmV4dCBhbmQgcHJldiBidXR0b25zIGFyZSB0byBzaG93XG4gICAgdmFyIHNldE5hdiA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGlmICggb3B0aW9ucy5saXN0VGh1bWJzLmxlbmd0aCA+ICggb3B0aW9ucy5pbmRleCArIG9wdGlvbnMubGltaXQgKSApIHtcbiAgICAgICAgICAgICRqKCAnIycgKyBvcHRpb25zLm5leHRJZCApLmNzcyggeyB2aXNpYmlsaXR5OiAndmlzaWJsZScgfSApO1xuICAgICAgICAgICAgJGooICcjJyArIG9wdGlvbnMubmV4dElkICkuY3NzKCB7IGRpc3BsYXk6ICdpbmxpbmUnIH0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRqKCAnIycgKyBvcHRpb25zLm5leHRJZCApLmNzcyggeyB2aXNpYmlsaXR5OiAnaGlkZGVuJyB9ICk7XG4gICAgICAgICAgICAkaiggJyMnICsgb3B0aW9ucy5uZXh0SWQgKS5jc3MoIHsgZGlzcGxheTogJ2lubGluZScgfSApO1xuICAgICAgICB9O1xuXG4gICAgfTtcblxuICAgIC8vc2V0IGFjdGlvbiBmb3IgdGhlIHByZXZpb3VzIGFuZCBuZXh0IGJ1dHRvbnNcbiAgICB2YXIgZm9ybWF0TmF2ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLy9zZXQgdGhlIG5leHQgYnV0dG9uIHRvIGdvIHRvIHRoZSBuZXh0IHNldCBvZiB0aHVtYnNcbiAgICAgICAgJGooICcjJyArIG9wdGlvbnMubmV4dElkICkudW5iaW5kKCAnY2xpY2snICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGooICcjJyArIG9wdGlvbnMucHJldklkICkuY3NzKCB7IHZpc2liaWxpdHk6ICd2aXNpYmxlJyB9ICk7XG4gICAgICAgICAgICAkaiggJyMnICsgb3B0aW9ucy5wcmV2SWQgKS5jc3MoIHsgZGlzcGxheTogJ2lubGluZScgfSApO1xuXG4gICAgICAgICAgICBvcHRpb25zLmluZGV4ICs9IG9wdGlvbnMubGltaXQ7XG4gICAgICAgICAgICBmb3JtYXRUaXRsZSgpO1xuICAgICAgICAgICAgc2V0TmF2KCk7XG4gICAgICAgICAgICAvL2lmIHdlIGFyZSBwYXN0IHRoZSBsaW1pdCwgZG8gYW5vdGhlciBhamF4IGNhbGxcbiAgICAgICAgICAgIGlmICggb3B0aW9ucy5pbmRleCArIG9wdGlvbnMubGltaXQgPj0gKCBvcHRpb25zLmxpc3RUaHVtYnMubGVuZ3RoICkgKSB7XG4gICAgICAgICAgICAgICAgLy9kaXNhYmxlIHRoZSBuZXh0IGJ1dHRvblxuICAgICAgICAgICAgICAgICRqKCAnIycgKyBvcHRpb25zLm5leHRJZCApLmNzcyggeyB2aXNpYmlsaXR5OiAnaGlkZGVuJyB9ICk7XG4gICAgICAgICAgICAgICAgYWpheENhbGwoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9ybWF0VGh1bWJzKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gKTtcblxuXG4gICAgICAgIC8vc2V0IHRoZSBwcmV2IGJ1dHRvblxuICAgICAgICAkaiggJyMnICsgb3B0aW9ucy5wcmV2SWQgKS51bmJpbmQoICdjbGljaycgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBvcHRpb25zLmluZGV4IC09IG9wdGlvbnMubGltaXQ7XG5cbiAgICAgICAgICAgIGZvcm1hdFRpdGxlKCk7XG4gICAgICAgICAgICBzZXROYXYoKTtcblxuICAgICAgICAgICAgaWYgKCBvcHRpb25zLmluZGV4ID49IDAgKSB7XG4gICAgICAgICAgICAgICAgZm9ybWF0VGh1bWJzKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuaW5kZXggPSAwO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKCBvcHRpb25zLmluZGV4ID09IDAgKSB7XG4gICAgICAgICAgICAgICAgJGooICcjJyArIG9wdGlvbnMucHJldklkICkuY3NzKCB7IHZpc2liaWxpdHk6ICdoaWRkZW4nIH0gKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gKTtcbiAgICB9O1xuXG4gICAgLy9idWlsZCB0aGUgaHRtbCB0aGF0IGdvZXMgaW50byB3aGF0ZXZlciBkaXZcbiAgICB2YXIgZm9ybWF0VGh1bWJzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLy93aGVyZSB3ZSBhcmUgaW4gdGhlIGluZGV4LCBwbHVzIHRoZSBudW1iZXIgb2YgaG93IG1hbnkgd2Ugd2FudCB0byBzZWVcbiAgICAgICAgZW5kID0gKCBvcHRpb25zLmluZGV4ICsgb3B0aW9ucy5saW1pdCApIDwgb3B0aW9ucy5saXN0VGh1bWJzLmxlbmd0aCA/ICggb3B0aW9ucy5pbmRleCArIG9wdGlvbnMubGltaXQgKSA6IG9wdGlvbnMubGlzdFRodW1icy5sZW5ndGg7XG5cbiAgICAgICAgLy90aGUgaHRtbCB3ZSBpbnNlcnQgaW50byB0aGUgYXBwcm9wcmlhdGUgbWVudVxuICAgICAgICBvdXRwdXQgPSAnPGRpdj4nO1xuXG4gICAgICAgIC8vYW55IHNjcmlwdHMgdG8gZXZhbCBhZnRlcndhcmRzXG4gICAgICAgIGFmdGVySSA9IFwiXCI7XG5cblxuXG4gICAgICAgIGZvciAoIGkgPSBvcHRpb25zLmluZGV4OyBpIDwgZW5kOyBpKysgKSB7XG4gICAgICAgICAgICBpZiAoIG9wdGlvbnMubGlzdFRodW1ic1sgaSBdICkge1xuXG4gICAgICAgICAgICAgICAgaWQgPSBvcHRpb25zLm1haW5JZCArICdUaHVtYicgKyBvcHRpb25zLmxpc3RUaHVtYnNbIGkgXVsgJ2lkJyBdO1xuXG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9ICc8ZGl2IGNsYXNzPVwicGFuZWxUaHVtYnNcIiBpZD1cIicgKyBpZCArICdcIiAnO1xuICAgICAgICAgICAgICAgIC8vYWRkIGxvY2F0aW9uIGlmIGlzIGluIHRoZXJlIC0gd2FudCB0byBnbyB0b1xuICAgICAgICAgICAgICAgIGlmICggb3B0aW9ucy5saXN0VGh1bWJzWyBpIF1bICdsb2NYJyBdICkge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IG9wdGlvbnMubGlzdFRodW1ic1sgaSBdWyAnbG9jWCcgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IG9wdGlvbnMubGlzdFRodW1ic1sgaSBdWyAnbG9jWScgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBvcHRpb25zLmxpc3RUaHVtYnNbIGkgXVsgJ2lkJyBdXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9ICdjb29yZHM9XFwnJyArIHNlcmlhbCggY29vcmRzICkgKyAnXFwnICc7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9hdHRhY2ggbGlzdGVuZXIgdG8gZm9yIGdvIHRvIGxvY1xuICAgICAgICAgICAgICAgICAgICBhZnRlckkgKz0gXCIkaignI1wiICsgaWQgKyBcIicpLmNsaWNrKGZpbmRDb29yZHMpO1wiO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggb3B0aW9ucy5saXN0VGh1bWJzWyBpIF1bICdsb2MnIF0gKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vaWYgdGhpcyBpcyB0aGVpciB3YWl0aW5nIGxpc3RcbiAgICAgICAgICAgICAgICAgICAgYWZ0ZXJJICs9IFwiJGooJyNcIiArIGlkICsgXCInKS5jbGljayhmdW5jdGlvbihlKXt3YWl0aW5nTGlzdChlLCBvcHRpb25zLmxpc3RUaHVtYnNbXCIgKyBpICsgXCJdLCBcIiArIGkgKyBcIil9KTtcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBvcHRpb25zLmxpc3RUaHVtYnNbIGkgXVsgJ3VzZXJpZCcgXSApIHtcbiAgICAgICAgICAgICAgICAgICAgLy90aGlzIGlzIHRoZWlyIGZyaWVuZHMgbGlzdFxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJ29uY2xpY2s9XCJnZXRGcmllbmRJbmZvKFxcJycgKyBvcHRpb25zLmxpc3RUaHVtYnNbIGkgXVsgJ3VzZXJpZCcgXSArICdcXCcsIHRoaXMpXCIgdXNlcj1cXCcnICsgb3B0aW9ucy5saXN0VGh1bWJzWyBpIF1bICd1c2VyJyBdICsgJ1xcJyAnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vb3RoZXI/XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSAnICc7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIC8vY2xvc2UgdGhlIDxkaXYgY2xhc3M9XCJwYW5lbFRodW1ic1wiXG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9ICc+JztcblxuICAgICAgICAgICAgICAgIC8vdGhlIGFjdHVhbCB0aHVtYm5haWwgaW1hZ2VcbiAgICAgICAgICAgICAgICBpZiAoIG9wdGlvbnMubGlzdFRodW1ic1sgaSBdWyAndXNlcmlkJyBdICkge1xuICAgICAgICAgICAgICAgICAgICAvL3VzZXIgcGljXG4gICAgICAgICAgICAgICAgICAgIGRpciA9ICcvcHJvZmlsZSc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9hbnl0aGluZyBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGRpciA9ICcvdGh1bWJzJztcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9ICdcdDxpbWcgY2xhc3M9XCJwYW5lbFRodW1iXCIgc3JjPVwiL3N0YXRpYy83MnNwYWNlci5naWZcIiBzdHlsZT1cImJhY2tncm91bmQtaW1hZ2U6dXJsKC9jb250ZW50LycgKyBkaXIgKyAnLycgKyBvcHRpb25zLmxpc3RUaHVtYnNbIGkgXVsgJ3RodW1iJyBdICsgJylcIi8+JztcblxuICAgICAgICAgICAgICAgIC8vYWRkIGluIHZvdGUgY291bnQgaWYgdGhlcmVcbiAgICAgICAgICAgICAgICBpZiAoIG9wdGlvbnMubGlzdFRodW1ic1sgaSBdWyAndm90ZXMnIF0gKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSAnXHQ8c3BhbiBjbGFzcz1cImFkZGVkRGF0ZVwiPicgKyBwbHVyYWwoIG9wdGlvbnMubGlzdFRodW1ic1sgaSBdWyAndm90ZXMnIF0sICd2b3RlJyApICsgJzwvc3Bhbj4nO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvL2FkZCB1c2VyIG5hbWUgaWYgdGhlcmVcbiAgICAgICAgICAgICAgICBpZiAoIG9wdGlvbnMubGlzdFRodW1ic1sgaSBdWyAndXNlcicgXSApIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9ICdcdDxzcGFuIGNsYXNzPVwiYWRkZWREYXRlXCI+JyArIG9wdGlvbnMubGlzdFRodW1ic1sgaSBdWyAndXNlcicgXSArICc8L3NwYW4+JztcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLy9hZGQgaW4gZGF0ZSBhZGRlZCBpZiB0aGVyZVxuICAgICAgICAgICAgICAgIGlmICggb3B0aW9ucy5saXN0VGh1bWJzWyBpIF1bICdkYXRlJyBdICkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJ1x0PHNwYW4gY2xhc3M9XCJhZGRlZERhdGVcIj4nICsgb3B0aW9ucy5saXN0VGh1bWJzWyBpIF1bICdkYXRlJyBdICsgJzwvc3Bhbj4nO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vYWRkIG9wdGlvbiB0byBkZWxldGUgaWYgdGhpcyBpcyB3YWl0aW5nIGxpc3QgXG4gICAgICAgICAgICAgICAgaWYgKCBvcHRpb25zLmxpc3RUaHVtYnNbIGkgXVsgJ2xvYycgXSApIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9ICdcdDxpbWcgY2xhc3M9XCJkZWxldGVQaWNcIiBpbmR4PVwiJyArIGkgKyAnXCIgZGVsPVwiJyArIG9wdGlvbnMubGlzdFRodW1ic1sgaSBdWyAnbG9jJyBdICsgJ1wiIHNyYz1cIi9zdGF0aWMvZGVsZXRlUGljLnBuZ1wiIGlkPVwiZGVsJyArIG9wdGlvbnMubGlzdFRodW1ic1sgaSBdWyAnaWQnIF0gKyAnXCI+JztcbiAgICAgICAgICAgICAgICAgICAgYWZ0ZXJJICs9IFwiJGooJyNkZWxcIiArIG9wdGlvbnMubGlzdFRodW1ic1sgaSBdWyAnaWQnIF0gKyBcIicpLmNsaWNrKGZ1bmN0aW9uKGUpe2NvbmZpcm1EZWxldGUoZSwgb3B0aW9ucy5saXN0VGh1bWJzKX0pO1wiO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJzwvZGl2Pic7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVuZC0tO1xuXG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIG91dHB1dCArPSAnPGJyIHN0eWxlPVwiY2xlYXI6Ym90aFwiLz48L2Rpdj4nO1xuXG4gICAgICAgICRqKCAnIycgKyBvcHRpb25zLm1haW5JZCApLmh0bWwoIG91dHB1dCApO1xuXG4gICAgICAgIGV2YWwoIGFmdGVySSApO1xuICAgIH07XG5cbiAgICB2YXIgd2FpdGluZ0xpc3QgPSBmdW5jdGlvbiggZSwgb2JqLCBpICkge1xuXG4gICAgICAgICRqKCAnI20xbWFpbicgKS5odG1sKCAnUGxlYXNlIFdhaXQuLi4nICk7XG4gICAgICAgICRqKCAnI20xZXJyJyApLmh0bWwoICcnICk7XG4gICAgICAgIHNldFRpdGxlKCAnbTEnLCAnQWRkIFlvdXIgUGljdHVyZScgKTtcbiAgICAgICAgc2V0TmF2KCAnbTEnLCAnb2ZmJyApO1xuXG4gICAgICAgIG9wdGlvbnMuc2VsZWN0ZWQgPSBpO1xuXG4gICAgICAgIGltZ2xvYyA9ICcvY29udGVudC9vcmlnaW5hbC8nICsgb2JqLmxvYztcbiAgICAgICAgaGVpZ2h0ID0gb2JqLmhlaWdodDtcbiAgICAgICAgd2lkdGggPSBvYmoud2lkdGg7XG5cbiAgICAgICAgdmFyIHBpYyA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICAgIHBpYy5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBhbGVydCggJ3RoZXJlIHdhcyBhbiBlcnJvciEgc29ycnkhXFxuJyArIGltZ2xvYyApO1xuICAgICAgICB9O1xuXG4gICAgICAgIHBpYy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgJGooICcjc21hbGxBZGQnICkucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIGlmICggYWRkUGljLm1vdmUuaWQgKSB7XG4gICAgICAgICAgICAgICAgJGooICcjJyArIGFkZFBpYy5tb3ZlLmlkICkuY3NzKCB7XG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcldpZHRoOiAnMHB4JyxcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzBweCdcbiAgICAgICAgICAgICAgICB9ICk7XG5cbiAgICAgICAgICAgICAgICBhZGRQaWMubW92ZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgICAgICAgICAgeTogMCxcbiAgICAgICAgICAgICAgICAgICAgaWQ6IDBcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmVhZHlUb0FkZCggaW1nbG9jLCB3aWR0aCwgaGVpZ2h0ICk7XG4gICAgICAgICAgICBkQWN0aXZhdGUoKTtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIHBpYy5zcmMgPSBpbWdsb2M7XG5cbiAgICB9O1xuXG4gICAgdmFyIGRBY3RpdmF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvL2FjdGl2YXRlIHRoZSBhZGQgcGljdHVyZSBmb3Igd2lhdGluZyBsaXN0IC0gbm90IHVwbG9hZCAvIGxpbmtcbiAgICAgICAgJGooICcjc21hbGxBZGQnICkuZHJhZ2dhYmxlKCB7XG4gICAgICAgICAgICBzdGFydDogYWN0aXZhdGVTbWFsbEFkZCxcbiAgICAgICAgICAgIGRyYWc6IHNtYWxsQWRkRHJhZyxcbiAgICAgICAgICAgIHN0b3A6IGNTbWFsbEFkZFxuICAgICAgICB9ICk7XG4gICAgfTtcblxuICAgIC8vY2hlY2sgdG8gc2VlIGlmIGRyYWdnZWQgcGljdHVyZSBvdmVybGFwcyBvdGhlcnMgb24gbW91c2UgdXBcbiAgICB2YXIgY1NtYWxsQWRkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vd2FpdGluZyBsaXN0IGFkZFxuICAgICAgICBwb3N0VmFycyA9IGFjdGl2YXRlQ3BhbmVsUGxhY2VyKCk7XG5cbiAgICAgICAgJGouYWpheCgge1xuICAgICAgICAgICAgZGF0YTogcG9zdFZhcnMsXG4gICAgICAgICAgICBzdWNjZXNzOiBjT3ZlcmxhcCxcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgIHVybDogJy9taWxlL2FkZC8nXG4gICAgICAgIH0gKTtcblxuICAgIH07XG5cbiAgICB2YXIgY092ZXJsYXAgPSBmdW5jdGlvbigganNvbiApIHtcbiAgICAgICAgLy9jaGVjayBvdmVybGFwcyBvbiB3aWF0aW5nIGxpc3QgYWRkXG4gICAgICAgIGV2YWwoICdyZXN1bHQgPSAnICsganNvbiApO1xuXG4gICAgICAgIGlmICggcmVzdWx0LnN1Y2Nlc3MgPT0gdHJ1ZSApIHtcbiAgICAgICAgICAgIC8vcmVtb3ZlIGZyb20gd2FpdGluZyBsaXN0XG4gICAgICAgICAgICBpID0gb3B0aW9ucy5zZWxlY3RlZDtcbiAgICAgICAgICAgIG9wdGlvbnMubGlzdFRodW1icy5zcGxpY2UoIGksIDEgKTtcblxuICAgICAgICAgICAgZm9ybWF0VGh1bWJzKCk7XG4gICAgICAgICAgICBpbWFnZUFkZGVkKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZW1vdmVQbGFjZXIoKTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgdmFyIGNvbmZpcm1EZWxldGUgPSBmdW5jdGlvbiggZSwgb2JqICkge1xuICAgICAgICBpZiAoIGUgKSB7XG4gICAgICAgICAgICAvL21velxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vSUVcbiAgICAgICAgICAgIGUgPSB3aW5kb3cuZXZlbnQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgZGVsID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCAnZGVsJyApO1xuICAgICAgICBpbmR4ID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCAnaW5keCcgKTtcblxuICAgICAgICB1cGxvYWRUZXh0ID0gJzxpbWcgc3JjPVwiL2NvbnRlbnQvb3JpZ2luYWwvJyArIGRlbCArICdcIiBoZWlnaHQ9XCIxMDBcIiB3aWR0aD1cIjEwMFwiIHN0eWxlPVwiZmxvYXQ6bGVmdDttYXJnaW46MTBweFwiPiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgcGljdHVyZSBmcm9tIHlvdXIgd2FpdGluZyBsaXN0Pzxici8+JztcblxuICAgICAgICB1cGxvYWRUZXh0ICs9ICc8YSBjbGFzcz1cImZha2VCdXR0b25cIiBpZD1cImNvbmZpcm1EZWxldGVcIj5ZZXM8L2E+IDxhIGNsYXNzPVwiZmFrZUJ1dHRvblwiPk5vPC9hPic7XG4gICAgICAgICRqKCAnI20xbWFpbicgKS5odG1sKCB1cGxvYWRUZXh0ICk7XG5cbiAgICAgICAgJGooICcjY29uZmlybURlbGV0ZScgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkb0RlbGV0ZSggZGVsLCBvYmosIGluZHggKTtcbiAgICAgICAgfSApO1xuXG4gICAgICAgIHNldFRpdGxlKCAnbTEnLCAnQ29uZmlybSBEZWxldGUnICk7XG4gICAgICAgIHNldE5hdiggJ20xJywgJ29mZicgKTtcblxuICAgICAgICAkaiggJyNtMScgKS5zbGlkZURvd24oKTtcbiAgICB9O1xuXG4gICAgdmFyIGRvRGVsZXRlID0gZnVuY3Rpb24oIHNyYywgb2JqLCBpbmR4ICkge1xuICAgICAgICAkai5hamF4KCB7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgc3JjOiBzcmNcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiByZWNEZWwsXG4gICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICB1cmw6ICcvdGh1bWJzL2RlbGV0ZSdcbiAgICAgICAgfSApO1xuXG4gICAgICAgIG9iai5zcGxpY2UoIGluZHgsIDEgKTtcbiAgICAgICAgZm9ybWF0VGh1bWJzKCk7XG5cbiAgICAgICAgaWYgKCBvcHRpb25zLmxpc3RUaHVtYnMubGVuZ3RoIDwgKCBvcHRpb25zLmluZGV4ICsgOCApICkge1xuICAgICAgICAgICAgYWpheENhbGwoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkaiggJyNtMW1haW4nICkuaHRtbCggJycgKTtcbiAgICAgICAgY2xvc2VDcGFuZWwoIDEgKTtcbiAgICB9O1xuXG4gICAgLy9sb2FkIGluaXRpYWwgY29udGVudFxuICAgIGlmICggIW9wdGlvbnMubGlzdFRodW1icy5sZW5ndGggKSB7XG4gICAgICAgIGFqYXhDYWxsKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc2V0TmF2KCk7XG4gICAgICAgIGZvcm1hdFRpdGxlKCk7XG4gICAgICAgIGZvcm1hdE5hdigpO1xuICAgICAgICBmb3JtYXRUaHVtYnMoKTtcbiAgICB9O1xufTtcblxuLy9zaWduIHVwIGZvcm0sIHZhbGlkYXRlIGFsbCBmb3JtIGluZm9cbmZ1bmN0aW9uIHNpZ25VcCgpIHtcblxuICAgIHYgPSBnZXRGb3JtVmFycyggJ3NpZ251cCcgKTtcblxuICAgIHZhciBlcnJtc2cgPSBbXTtcblxuICAgIGlmICggIXYudXNlciB8fCB2LnVzZXIubGVuZ3RoIDwgMiApIHtcbiAgICAgICAgZXJybXNnLnB1c2goIFwiWW91ciB1c2VyIG5hbWUgbXVzdCBiZSBhdCBsZWFzdCAyIGNoYXJhY3RlcnMuXCIgKTtcbiAgICB9O1xuXG4gICAgaWYgKCB2LmVtYWlsICYmICFlbWFpbFZhbGlkYXRlKCB2LmVtYWlsICkgKSB7XG4gICAgICAgIGVycm1zZy5wdXNoKCBcIllvdXIgZW1haWwgYWRkcmVzcyBkb2VzIG5vdCBhcHBlYXIgdG8gYmUgdmFsaWQuXCIgKTtcbiAgICB9O1xuXG4gICAgaWYgKCBlcnJtc2cubGVuZ3RoIDwgMSApIHtcbiAgICAgICAgJGooICcjc2lnbnVwTXNnJyApLmh0bWwoICdQcm9jZXNzaW5nLi5wbGVhc2Ugd2FpdC4uLicgKTtcbiAgICAgICAgJGooICcjc2lnbnVwYnV0dG9uJyApLmhpZGUoKTtcblxuICAgICAgICB2ID0gcHJlcEZvclF1ZXJ5KCB2ICk7XG5cbiAgICAgICAgJGouYWpheCgge1xuICAgICAgICAgICAgdXJsOiAnL3Byb2ZpbGUvc2lnbnVwJyxcbiAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgIGRhdGE6IHYsXG4gICAgICAgICAgICBzdWNjZXNzOiByZWNlaXZlU2lnbnVwXG4gICAgICAgIH0gKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dCA9IFwiUGxlYXNlIGZpeCB0aGUgZm9sbG93aW5nIGVycm9yczogPGJyLz5cIjtcblxuICAgICAgICBmb3IgKCBpID0gMDsgaSA8IGVycm1zZy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgIG91dHB1dCArPSBlcnJtc2dbIGkgXSArIFwiPGJyLz5cIjtcbiAgICAgICAgfTtcblxuICAgICAgICAkaiggJyNzaWdudXBNc2cnICkuaHRtbCggb3V0cHV0ICk7XG4gICAgfTtcblxufTtcblxuZnVuY3Rpb24gcmVjZWl2ZVNpZ251cCgganNvbiApIHtcbiAgICBldmFsKCAncmVzdWx0ID0gJyArIGpzb24gKTtcblxuICAgIGlmICggcmVzdWx0LmVycm9ycy5sZW5ndGggPiAwICkge1xuICAgICAgICAkaiggJyNzaWdudXBidXR0b24nICkuc2hvdygpO1xuXG4gICAgICAgIG91dHB1dCA9IFwiUGxlYXNlIGZpeCB0aGUgZm9sbG93aW5nIGVycm9yczogPGJyLz5cIjtcblxuICAgICAgICBmb3IgKCBpID0gMDsgaSA8IHJlc3VsdC5lcnJvcnMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICBvdXRwdXQgKz0gcmVzdWx0LmVycm9yc1sgaSBdICsgXCI8YnIvPlwiO1xuICAgICAgICB9O1xuXG4gICAgICAgICRqKCAnI3NpZ251cE1zZycgKS5odG1sKCBvdXRwdXQgKTtcblxuICAgIH0gZWxzZSBpZiAoIHJlc3VsdC5zdWNjZXNzID09IHRydWUgKSB7XG5cbiAgICAgICAgJGooICdkaXYjY29udHJvbDEnICkuaHRtbCggcmVzdWx0LnBhbmVsTGVmdCApO1xuICAgICAgICAkaiggJ2RpdiNjb250cm9sMicgKS5odG1sKCByZXN1bHQucGFuZWxSaWdodCApO1xuXG4gICAgICAgIGNsb3NlQ3BhbmVsKCA2ICk7XG4gICAgICAgIGNsb3NlQ3BhbmVsKCA1ICk7XG5cbiAgICAgICAgYWN0aXZhdGVDcGFuZWwoKTtcblxuICAgICAgICAvL3NldCB1cCB0aGUgdHJhY2tpbmcgaW50ZXJ2YWwgYW5kIGRvIGl0IG9uY2UgaW1tZWRpYXRlbHlcbiAgICAgICAgc3RhcnRUcmFja2luZygpO1xuICAgIH07XG59O1xuXG4vL2dldCB0aGUgdXNlcnMgcHJvZmlsZVxuZnVuY3Rpb24gZ2V0UHJvZmlsZSgpIHtcblxuICAgICRqKCAnI20ybWFpbicgKS5odG1sKCAnTG9hZGluZyBZb3VyIFByb2ZpbGUuLi4nICk7XG4gICAgJGooICcjbTInICkuc2xpZGVEb3duKCAnbm9ybWFsJyApO1xuXG4gICAgc2V0VGl0bGUoICdtMicsICdMb2FkaW5nIFlvdXIgUHJvZmlsZS4uLicgKTtcbiAgICBzZXROYXYoICdtMicsICdvZmYnICk7XG5cbiAgICAkai5hamF4KCB7XG4gICAgICAgIHVybDogJy9wcm9maWxlL2dldCcsXG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgc3VjY2VzczogcmVjZWl2ZVByb2ZpbGVcbiAgICB9ICk7XG59O1xuXG5mdW5jdGlvbiByZWNlaXZlUHJvZmlsZSggaHRtbCApIHtcblxuICAgICRqKCAnI20ybWFpbicgKS5odG1sKCBodG1sICk7XG5cbiAgICBzZXRUaXRsZSggJ20yJywgJ1lvdXIgUHJvZmlsZScgKTtcbiAgICBzZXROYXYoICdtMicsICdvZmYnICk7XG5cbiAgICAkaiggJyNtMicgKS5zbGlkZURvd24oKTtcbn07XG5cbmZ1bmN0aW9uIG9wZW5TZWFyY2goKSB7XG5cbiAgICBzZXRUaXRsZSggJ20yJywgJ1NlYXJjaCBGb3IgYW4gSW1hZ2UnICk7XG4gICAgc2V0TmF2KCAnbTInLCAnb2ZmJyApO1xuXG4gICAgdmFyIG1zZ1RleHQgPSAnPGZvcm0gbmFtZT1cInNlYXJjaFBhcmFtc1wiIGlkPVwic2VhcmNoUGFyYW1zXCIgYWN0aW9uPVwiL3NlYXJjaFwiIG1ldGhvZD1cInBvc3RcIj4nO1xuICAgIG1zZ1RleHQgKz0gJzxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwic3RkSW5wdXRcIiBuYW1lPVwic2VhcmNoVGVybVwiIGlkPVwic2VhcmNoVGVybVwiIC8+JztcbiAgICBtc2dUZXh0ICs9ICc8aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiU2VhcmNoXCIgY2xhc3M9XCJzdGRCdXR0b25cIiBvbmNsaWNrPVwic2VuZFNlYXJjaFBhcm1zKCk7XCIgLz4nO1xuICAgIG1zZ1RleHQgKz0gJzwvZm9ybT4nO1xuXG4gICAgJGooICcjbTJtYWluJyApLmh0bWwoIG1zZ1RleHQgKTtcbiAgICAkaiggJyNtMicgKS5zbGlkZURvd24oKTtcblxuICAgICRqKCAnZm9ybSNzZWFyY2hQYXJhbXMnICkuc3VibWl0KCBmdW5jdGlvbigpIHtcbiAgICAgICAgc2VuZFNlYXJjaFBhcm1zKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9ICk7XG59O1xuXG5cblxuZnVuY3Rpb24gc2VuZFNlYXJjaFBhcm1zKCB0ZXJtICkge1xuXG4gICAgc2VhcmNoID0gdGVybSA/IHRlcm0gOiAkaiggJyNzZWFyY2hUZXJtJyApLnZhbCgpO1xuICAgIHNlYXJjaCA9IGVuY29kZVVSSUNvbXBvbmVudCggc2VhcmNoICk7XG5cbiAgICBzZWFyY2hUaHVtYnMgPSBuZXcgdGh1bWJzTWVudSgge1xuICAgICAgICBhY3Rpb246ICcvdGh1bWJzL3NlYXJjaC9xdWVyeS8nICsgc2VhcmNoLFxuICAgICAgICB0aXRsZTogJ1NlYXJjaCBSZXN1bHRzJyxcbiAgICAgICAgY29udGFpbmVyOiAnbTInLFxuICAgICAgICBsaW1pdDogNFxuICAgIH0gKTtcblxuICAgICRqKCAnI20ybWFpbicgKS5odG1sKCAnJyApO1xuXG4gICAgc2V0VGl0bGUoICdtMicsICdTZWFyY2hpbmcuLi4gUGxlYXNlIFdhaXQnICk7XG5cbiAgICAkaiggJyNtMicgKS5zbGlkZURvd24oKTtcbn07XG5cbmZ1bmN0aW9uIHJlY2VpdmVTZWFyY2goIHhtbCApIHtcbiAgICAkaiggJyNtM3RpdGxlJyApLmh0bWwoICdTZWFyY2ggUmVzdWx0cycgKTtcbiAgICAkaiggJyNtM21haW4nICkuaHRtbCggeG1sLnJlc3BvbnNlVGV4dCApO1xuXG4gICAgJGooICcjbTMnICkuc2xpZGVEb3duKCk7XG59O1xuXG4vL2dldCB0aGUgaG93IHRvIHNjcmVlbnNcbmZ1bmN0aW9uIGdldEhlbHAoKSB7XG4gICAgbmV3IExpZ2h0Ym94KCB7XG4gICAgICAgIGNsb3NlOiB0cnVlLFxuICAgICAgICB1cmw6ICcvaGVscC9tYWluJyxcbiAgICAgICAgdGl0bGU6ICdIZWxwISdcbiAgICB9ICk7XG59O1xuXG4vL2dldCBmb3JtIHRvIHNlbmQgaW4gdXNlciBmZWVkYmFja1xuZnVuY3Rpb24gc3RhcnRGZWVkYmFjaygpIHtcbiAgICBuZXcgTGlnaHRib3goIHtcbiAgICAgICAgY2xvc2U6IHRydWUsXG4gICAgICAgIHVybDogJy9oZWxwL2ZlZWRiYWNrJyxcbiAgICAgICAgdGl0bGU6ICdTZW5kIEZlZWRiYWNrJ1xuICAgIH0gKTtcbn07XG5cbmZ1bmN0aW9uIHNlbmRGZWVkYmFjaygpIHtcbiAgICB2YXJzID0gcHJlcEZvclF1ZXJ5KCBnZXRGb3JtVmFycyggJ2Zvcm1GZWVkYmFjaycgKSApXG5cbiAgICB2YXIgc2VuZEZlZWRiYWNrID0gbmV3IFhIQ29ubigpO1xuICAgIHNlbmRGZWVkYmFjay5jb25uZWN0KCBcImhlbHAvZmVlZGJhY2tcIiwgXCJQT1NUXCIsIHZhcnMsIHJldHVybkZlZWRiYWNrICk7XG5cbiAgICAkaiggJyNmb3JtRmVlZGJhY2snICkuaHRtbCggJ1BsZWFzZSBXYWl0Li4uJyApO1xufTtcblxuZnVuY3Rpb24gcmV0dXJuRmVlZGJhY2soIGpzb24gKSB7XG4gICAgZXZhbCggJ3Jlc3VsdCA9ICcgKyBqc29uLnJlc3BvbnNlVGV4dCApO1xuICAgICRqKCAnI2xpZ2h0Ym94Y29udGVudCcgKS5odG1sKCByZXN1bHQuaHRtbCApO1xufTtcblxuZnVuY3Rpb24gZ2V0VGVybXMoKSB7XG4gICAgbmV3IExpZ2h0Ym94KCB7XG4gICAgICAgIGNsb3NlOiB0cnVlLFxuICAgICAgICB1cmw6ICcvaGVscC90ZXJtcycsXG4gICAgICAgIHRpdGxlOiAnVGVybXMgYW5kIENvbmRpdGlvbnMgLyBQcml2YWN5IFBvbGljeSdcbiAgICB9ICk7XG59O1xuXG5mdW5jdGlvbiBnZXRBYm91dCgpIHtcbiAgICBuZXcgTGlnaHRib3goIHtcbiAgICAgICAgY2xvc2U6IHRydWUsXG4gICAgICAgIHVybDogJy9oZWxwL2Fib3V0JyxcbiAgICAgICAgdGl0bGU6ICdBYm91dCB0aGUgbWlsZSdcbiAgICB9ICk7XG59O1xuXG5mdW5jdGlvbiBnZXRBUEkoKSB7XG4gICAgbmV3IExpZ2h0Ym94KCB7XG4gICAgICAgIGNsb3NlOiB0cnVlLFxuICAgICAgICB1cmw6ICdoZWxwL2FwaScsXG4gICAgICAgIHRpdGxlOiAnQVBJIEZvciBEZXZlbG9wZXJzJ1xuICAgIH0gKTtcbn07XG5cbmZ1bmN0aW9uIGV4cGFuZE1ldGhvZCggd2hpY2ggKSB7XG4gICAgbmV4dCA9IGdldE5leHQoIHdoaWNoICk7XG4gICAgaWYgKCBuZXh0LnN0eWxlLmRpc3BsYXkgPT0gXCJibG9ja1wiICkge1xuICAgICAgICBuZXh0LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBuZXh0LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgfTtcbn07XG5cbi8vbGlua2VkIGFuIGltYWdlLCBvciBmcm9tIHdhaXRpbmcgbGlzdC5cbmZ1bmN0aW9uIHJlYWR5VG9BZGQoIGltZ2xvYywgd2lkdGgsIGhlaWdodCApIHtcbiAgICAvL3NldCB1cCB2YXJpYWxiZXMgaW4gZ2xvYmFsIGlkZW50aWZpZXJcbiAgICBhZGRQaWMuaGVpZ2h0ID0gTWF0aC5jZWlsKCBoZWlnaHQgLyA3MiApO1xuICAgIGFkZFBpYy53aWR0aCA9IE1hdGguY2VpbCggd2lkdGggLyA3MiApO1xuICAgIGFkZFBpYy5zb3VyY2UgPSBpbWdsb2M7XG5cbiAgICAvL3NjYWxlIHBpY3R1cmUgcHJvcG9ydGlvbmFsbHkgZm9yIHRodW1ibmFpbFxuICAgIGlmICggaGVpZ2h0ID4gd2lkdGggKSB7XG4gICAgICAgIHNtYWxsSCA9IDEwMDtcbiAgICAgICAgc21hbGxXID0gKCB3aWR0aCAvIGhlaWdodCApICogMTAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNtYWxsVyA9IDEwMDtcbiAgICAgICAgc21hbGxIID0gKCBoZWlnaHQgLyB3aWR0aCApICogMTAwO1xuICAgIH07XG5cbiAgICAvL2Zvcm1hdCBodG1sIFxuICAgIHVwbG9hZFRleHQgPSAnPGRpdiBjbGFzcz1cImRyYWdIZWxwXCI+JztcbiAgICB1cGxvYWRUZXh0ICs9ICdcdDxpbWcgc3JjPVwiJyArIGltZ2xvYyArICdcIiBpZD1cInNtYWxsQWRkXCIgc3R5bGU9XCJ3aWR0aDonICsgc21hbGxXICsgJ3B4OyBoZWlnaHQ6JyArIHNtYWxsSCArICdweDtcIiAvPic7XG4gICAgdXBsb2FkVGV4dCArPSAnXHQ8aW1nIHNyYz1cIi9zdGF0aWMvbW92ZWljb24ucG5nXCIvPjxici8+JztcbiAgICB1cGxvYWRUZXh0ICs9ICdcdERyYWcgaXQgb250byBhbiBlbXB0eSBzcGFjZSBvbiB0aGUgbWlsZSEnO1xuICAgIHVwbG9hZFRleHQgKz0gJzwvZGl2Pic7XG5cblxuXG4gICAgJGooICcjbTFtYWluJyApLmh0bWwoIHVwbG9hZFRleHQgKTtcbiAgICAkaiggJyNtMScgKS5zbGlkZURvd24oICdub3JtYWwnICk7XG5cbn07XG5cbi8vYWRkaW5nIHRoZSBpbWFnZSB3YXMgdW5zdWNjZXNzZnVsLlxuZnVuY3Rpb24gcmVtb3ZlUGxhY2VyKCkge1xuICAgICRqKCAnI3Bvc0ltZycgKS5yZW1vdmUoKTtcblxuICAgIGlmICggYWRkUGljLm1vdmUuaWQgKSB7XG4gICAgICAgICRqKCAnI3NtYWxsQWRkJyApLmNzcygge1xuICAgICAgICAgICAgbGVmdDogYWRkUGljLm1vdmUueCxcbiAgICAgICAgICAgIHRvcDogYWRkUGljLm1vdmUueVxuICAgICAgICB9ICk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gb3Igc2hvb3QgYmFjayBwbGFjZXIgdG8gY3BhbmVsXG4gICAgICAgICRqKCAnI3NtYWxsQWRkJyApLmFuaW1hdGUoIHtcbiAgICAgICAgICAgIGxlZnQ6ICcxOTBweCcsXG4gICAgICAgICAgICB0b3A6ICcxMHB4J1xuICAgICAgICB9LCAxMDAwICk7XG4gICAgfTtcblxuICAgIC8vdGhlcmUgd2VyZSBvdmVybGFwcy4gZmlndXJlIG91dCB3aGVyZSB0aGV5IGFyZSBcbiAgICBudW0gPSByZXN1bHQub3ZlcmxhcC5sZW5ndGg7XG5cbiAgICBvdmVybGFwQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcbiAgICBvdmVybGFwQ29udGFpbmVyLnNldEF0dHJpYnV0ZSggJ2lkJywgJ292ZXJsYXBDb250YWluZXInICk7XG5cbiAgICBvdmVybGFwQ29udGFpbmVyVG9wID0gbXlTaXplLmhlaWdodDtcbiAgICBvdmVybGFwQ29udGFpbmVyTGVmdCA9IG15U2l6ZS53aWR0aDtcbiAgICBvdmVybGFwQ29udGFpbmVyV2lkdGggPSAwO1xuICAgIG92ZXJsYXBDb250YWluZXJIZWlnaHQgPSAwO1xuXG4gICAgJGooICcjc3F1YXJlbWlsZScgKS5hcHBlbmQoIG92ZXJsYXBDb250YWluZXIgKTtcblxuICAgIG92ZXJsYXBDb250YWluZXJXaWR0aCAtPSAoIG92ZXJsYXBDb250YWluZXJMZWZ0IC0gbXlTaXplLnNjYWxlICk7XG4gICAgb3ZlcmxhcENvbnRhaW5lckhlaWdodCAtPSAoIG92ZXJsYXBDb250YWluZXJUb3AgLSBteVNpemUuc2NhbGUgKTtcblxuICAgIGZvciAoIG8gaW4gcmVzdWx0Lm92ZXJsYXAgKSB7XG4gICAgICAgIHggPSByZXN1bHQub3ZlcmxhcFsgbyBdWyAneCcgXTtcbiAgICAgICAgeSA9IHJlc3VsdC5vdmVybGFwWyBvIF1bICd5JyBdO1xuXG4gICAgICAgIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cbiAgICAgICAgbGVmdCA9ICggKCB4ICogNzIgKSAtIG15U2l6ZS5teVggKSAqICggbXlTaXplLnNjYWxlIC8gNzIgKSAtIG15U2l6ZS5zY2FsZSArICggbXlTaXplLndpZHRoIC8gMiApO1xuICAgICAgICB0b3AgPSAoICggeSAqIDcyICkgLSBteVNpemUubXlZICkgKiAoIG15U2l6ZS5zY2FsZSAvIDcyICkgLSBteVNpemUuc2NhbGUgKyAoIG15U2l6ZS5oZWlnaHQgLyAyICk7XG5cbiAgICAgICAgb3ZlcmxhcENvbnRhaW5lckxlZnQgPSBsZWZ0IDwgb3ZlcmxhcENvbnRhaW5lckxlZnQgPyBsZWZ0IDogb3ZlcmxhcENvbnRhaW5lckxlZnQ7XG4gICAgICAgIG92ZXJsYXBDb250YWluZXJUb3AgPSB0b3AgPCBvdmVybGFwQ29udGFpbmVyVG9wID8gdG9wIDogb3ZlcmxhcENvbnRhaW5lclRvcDtcbiAgICAgICAgb3ZlcmxhcENvbnRhaW5lcldpZHRoID0gbGVmdCA+IG92ZXJsYXBDb250YWluZXJXaWR0aCA/IGxlZnQgOiBvdmVybGFwQ29udGFpbmVyV2lkdGg7XG4gICAgICAgIG92ZXJsYXBDb250YWluZXJIZWlnaHQgPSB0b3AgPiBvdmVybGFwQ29udGFpbmVySGVpZ2h0ID8gdG9wIDogb3ZlcmxhcENvbnRhaW5lckhlaWdodDtcblxuICAgICAgICBsZWZ0IC09IG92ZXJsYXBDb250YWluZXJMZWZ0O1xuICAgICAgICB0b3AgLT0gb3ZlcmxhcENvbnRhaW5lclRvcDtcblxuICAgICAgICAkaiggZGl2ICkuY3NzKCB7XG4gICAgICAgICAgICBsZWZ0OiBsZWZ0ICsgJ3B4JyxcbiAgICAgICAgICAgIHRvcDogdG9wICsgJ3B4JyxcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNEMTZBMzgnLFxuICAgICAgICAgICAgd2lkdGg6ICggbXlTaXplLnNjYWxlICkgKyAncHgnLFxuICAgICAgICAgICAgaGVpZ2h0OiAoIG15U2l6ZS5zY2FsZSApICsgJ3B4JyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gICAgICAgIH0gKTtcblxuICAgICAgICAkaiggJyNvdmVybGFwQ29udGFpbmVyJyApLmFwcGVuZCggZGl2ICk7XG5cbiAgICB9O1xuXG4gICAgJGooICcjb3ZlcmxhcENvbnRhaW5lcicgKS5jc3MoIHtcbiAgICAgICAgbGVmdDogb3ZlcmxhcENvbnRhaW5lckxlZnQgKyBcInB4XCIsXG4gICAgICAgIHRvcDogb3ZlcmxhcENvbnRhaW5lclRvcCArIFwicHhcIixcbiAgICAgICAgaGVpZ2h0OiBvdmVybGFwQ29udGFpbmVySGVpZ2h0ICsgXCJweFwiLFxuICAgICAgICB3aWR0aDogb3ZlcmxhcENvbnRhaW5lcldpZHRoICsgXCJweFwiXG4gICAgfSApO1xuXG4gICAgc2V0VGltZW91dCggXCIkaignI292ZXJsYXBDb250YWluZXInKS5mYWRlT3V0KCdub3JtYWwnLCBmdW5jdGlvbigpeyRqKCcjb3ZlcmxhcENvbnRhaW5lcicpLnJlbW92ZSgpfSlcIiwgNTAwICk7XG5cbn07XG5cbmZ1bmN0aW9uIGltYWdlQWRkZWQoKSB7XG5cbiAgICAkaiggJyNwb3NJbWcnICkucmVtb3ZlKCk7XG4gICAgJGooICcjc21hbGxBZGQnICkucmVtb3ZlKCk7XG5cbiAgICBjbG9zZUNwYW5lbCggMSApO1xuICAgICRqKCAnI20xbWFpbicgKS5odG1sKCAnJyApO1xuXG4gICAgLy9kYnVnKHJlc3VsdC5mb290KTtcbiAgICAvL3doeSBkbyBpIGhhdmUgdG8gZXZhbCB0aGlzPyAgaXQgZG9lc250IGxpa2UgdGhlIHJlc3VsdC5mb290LnggcGFydCBvdGhlcndpc2UuXG4gICAgZXZhbCggJ21ha2VNYXBDYWxsKHsgJyArIHJlc3VsdC5mb290LnggKyAnOicgKyByZXN1bHQuZm9vdC55ICsgJyB9KScgKTtcblxuICAgIGlmICggYWRkUGljLm1vdmUuaWQgKSB7XG4gICAgICAgIC8vbW92ZWQgYW4gaW1hZ2Ugc3VjY2Vzc2Z1bGx5XG4gICAgICAgICRqKCAnIycgKyBhZGRQaWMubW92ZS5pZCApLnJlbW92ZSgpO1xuXG4gICAgICAgIGFkZFBpYy5tb3ZlID0geyB4OiAwLCB5OiAwLCBpZDogMCB9O1xuICAgIH07XG59O1xuXG5mdW5jdGlvbiBhY3RpdmF0ZUNwYW5lbFBsYWNlcigpIHtcblxuICAgICRqKCBcIiNwb3NJbWdcIiApLmFuaW1hdGUoIHtcbiAgICAgICAgb3BhY2l0eTogMVxuICAgIH0gKTtcblxuICAgIHBvc3RWYXJzID0gXCJ3aWR0aD1cIiArICggYWRkUGljLndpZHRoICk7XG4gICAgcG9zdFZhcnMgKz0gXCImaGVpZ2h0PVwiICsgKCBhZGRQaWMuaGVpZ2h0ICk7XG4gICAgcG9zdFZhcnMgKz0gXCImaW5jaFg9XCIgKyAoIGFkZFBpYy5pbmNoWCApO1xuICAgIHBvc3RWYXJzICs9IFwiJmluY2hZPVwiICsgKCBhZGRQaWMuaW5jaFkgKTtcbiAgICBwb3N0VmFycyArPSBcIiZmaWxlTG9jPVwiICsgKCBhZGRQaWMuc291cmNlICk7XG5cbiAgICBpZiAoIGFkZFBpYy5tb3ZlLmlkICkge1xuICAgICAgICBwb3N0VmFycyArPSBcIiZpZD1cIiArICggYWRkUGljLm1vdmUuaWQgKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHBvc3RWYXJzO1xufTtcblxuLy9jbG9zZSBsaWdodGJveFxuZnVuY3Rpb24gY2xvc2VMQigpIHtcbiAgICAkaiggJyNsaWdodGJveGJrJyApLmZhZGVPdXQoICdub3JtYWwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgJGooICcjbGlnaHRib3hiaycgKS5yZW1vdmUoKTtcbiAgICB9ICk7XG59O1xuXG5mdW5jdGlvbiBMaWdodGJveCggb3B0aW9ucyApIHtcbiAgICB2YXIgbmV3ZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblxuICAgIG5ld2Rpdi5zZXRBdHRyaWJ1dGUoICdpZCcsICdsaWdodGJveGJrJyApO1xuXG4gICAgbGlnaHRib3hIdG1sID0gJzxpbWcgY2xhc3M9XCJsYnNoYWRvd1wiIHNyYz1cIi9zdGF0aWMvc2hhZG93LnBuZ1wiLz48ZGl2IGlkPVwibGlnaHRib3hsaWdodFwiPjxzcGFuIGNsYXNzPVwibGlnaHRib3hUaXRsZVwiPicgKyBvcHRpb25zLnRpdGxlICsgJzwvc3Bhbj4nO1xuXG4gICAgLy9hZGQgaW5pdGlhbCBjb250ZW50IFxuICAgIGlmICggIW9wdGlvbnMuY29udGVudCApIHtcbiAgICAgICAgb3B0aW9ucy5jb250ZW50ID0gJ0xvYWRpbmcuLi4nO1xuXG4gICAgICAgICRqLmFqYXgoIHtcbiAgICAgICAgICAgIHVybDogb3B0aW9ucy51cmwsXG4gICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICBzdWNjZXNzOiByZWNlaXZlTGJQb3N0XG4gICAgICAgIH0gKTtcblxuICAgIH07XG5cbiAgICBsaWdodGJveEh0bWwgKz0gJzxkaXYgaWQ9XCJsaWdodGJveGNvbnRlbnRcIj4nICsgb3B0aW9ucy5jb250ZW50ICsgJzwvZGl2Pic7XG4gICAgbGlnaHRib3hIdG1sICs9ICc8L2Rpdj4nO1xuXG4gICAgbmV3ZGl2LmlubmVySFRNTCA9IGxpZ2h0Ym94SHRtbDtcblxuICAgICRqKCAnI2JvZHknICkuYXBwZW5kKCBuZXdkaXYgKTtcblxuICAgIC8vYWRkIHRoZSBjbG9zZSB4IFxuICAgIGlmICggb3B0aW9ucy5jbG9zZSApIHtcbiAgICAgICAgJGooICcjbGlnaHRib3hsaWdodCcgKS5hZnRlciggJzxkaXYgaWQ9XCJjbG9zZUxCXCIgb25jbGljaz1cImNsb3NlTEIoKTtcIj48L2Rpdj4nICk7XG4gICAgfTtcblxuICAgIC8vc2V0IHRoZSBzaXplIG9mIHRoZSBsaWdodGJveCBjb250ZW50IHRvIG1hdGNoIHRoZSBjb250YWluZXJcbiAgICBzaXplTEIoKTtcbn07XG5cbmZ1bmN0aW9uIHJlY2VpdmVMYlBvc3QoIGpzb24gKSB7XG4gICAgZXZhbCggXCJyZXN1bHQgPSBcIiArIGpzb24gKTtcblxuICAgICRqKCAnI2xpZ2h0Ym94Y29udGVudCcgKS5odG1sKCByZXN1bHQuaHRtbCApO1xufTtcblxuXG5cbi8vbWFwQ29vcmQgaXMgY2FsbGVkIHdoZW4gZG91YmxlIGNsaWNrIG9uIHNjYWxlZCBtYXAgLSB0cmF2ZWxzIHRvIHRoYXQgbG9jYXRpb24uXG5mdW5jdGlvbiBtYXBDb29yZCggZSApIHtcbiAgICAvL3ZhciBlPW5ldyBNb3VzZUV2ZW50KGUpO1xuXG4gICAgbWFwWCA9ICggZS5jbGllbnRYICkgLSAoIG15U2l6ZS53aWR0aCAtIDE5MCApO1xuICAgIG1hcFkgPSAoIGUuY2xpZW50WSApIC0gKCBteVNpemUuaGVpZ2h0IC0gMTkwICk7XG5cbiAgICBpZiAoIG1hcFggPCAwICkgeyBtYXBYID0gMDsgfTtcbiAgICBpZiAoIG1hcFggPiAxOTAgKSB7IG1hcFggPSAxOTA7IH07XG4gICAgaWYgKCBtYXBZID4gMTkwICkgeyBtYXBZID0gMTkwOyB9O1xuXG4gICAgLy9nb3RvIHZhcmlhYmxlcyB0byByZWZsZWN0IGNoYW5nZXMgaW4gc2NhbGVcbiAgICBnb3RvWCA9IG1hcFggKiAyNDAwMDtcbiAgICBnb3RvWSA9IG1hcFkgKiAyNDAwMDtcbiAgICAvL2dvIHRvIHRoaXMgbG9jYXRpb25cbiAgICBnb1RvTG9jKCBnb3RvWCwgZ290b1kgKTtcbiAgICByZXR1cm4gZmFsc2U7XG59OyJdfQ==
