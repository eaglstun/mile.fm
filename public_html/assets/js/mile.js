(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

//posMap positions the cursor to the appropriate location on the map
function posMap() {
    scale = mySize.scale / 72;

    $j('#marker').css({ left: mySize.myX / 24000 + "px" });
    $j('#marker').css({ top: mySize.myY / 24000 + "px" });
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

function sizeLB() {
    containerHeight = $j('#lightboxlight').height();
    $j('#lightboxcontent').css({ height: containerHeight - 25 + "px" });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvbWlsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7OztBQUdBLFNBQVMsSUFBVCxDQUFjLEdBQWQsRUFBbUI7O0FBRWYsUUFBSSxPQUFPLElBQVgsRUFBaUI7QUFDYixjQUFNLE9BQU8sS0FBUCxHQUFlLENBQXJCO0FBQ0gsS0FGRCxNQUVPLElBQUksT0FBTyxLQUFYLEVBQWtCO0FBQ3JCLGNBQU0sT0FBTyxLQUFQLEdBQWUsQ0FBckI7QUFDSDs7QUFFRCxRQUFJLE1BQU0sRUFBVixFQUFjO0FBQ1YsY0FBTSxFQUFOO0FBQ0gsS0FGRCxNQUVPLElBQUksTUFBTSxLQUFWLEVBQWlCO0FBQ3BCLGNBQU0sV0FBTjtBQUNIOztBQUVELFFBQUksT0FBTyxPQUFPLEtBQWxCLEVBQXlCO0FBQ3JCO0FBQ0g7O0FBRUQsUUFBSSxJQUFJLEdBQUcsT0FBSCxDQUFSLEVBQXFCOztBQUVqQixZQUFLLEtBQUssR0FBVjtBQUNBLFlBQUksS0FBSyxHQUFMLENBQVMsQ0FBVCxJQUFjLEtBQUssR0FBTCxDQUFTLENBQVQsQ0FBbEI7O0FBRUEsZUFBTyxNQUFPLElBQUksQ0FBbEI7O0FBRUEsVUFBRSxHQUFGLENBQU0sRUFBRSxNQUFNLE9BQU8sSUFBZixFQUFOO0FBQ0g7O0FBRUQ7QUFDQSxRQUFJLFNBQVMsV0FBVCxDQUFxQixDQUFyQixFQUF3QixRQUE1QixFQUFzQztBQUNsQztBQUNBLG9CQUFZLFNBQVMsV0FBVCxDQUFxQixDQUFyQixFQUF3QixRQUF4QixDQUFpQyxDQUFqQyxFQUFvQyxLQUFoRDtBQUNILEtBSEQsTUFHTyxJQUFJLFNBQVMsV0FBVCxDQUFxQixDQUFyQixFQUF3QixLQUE1QixFQUFtQztBQUN0QztBQUNBLG9CQUFZLFNBQVMsV0FBVCxDQUFxQixDQUFyQixFQUF3QixLQUF4QixDQUE4QixDQUE5QixFQUFpQyxLQUE3QztBQUNILEtBSE0s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QUFaLENBQW1CLE1BQW5COztBQUVBO0FBQ0EsUUFBSSxRQUFRLEtBQVosRUFBbUI7QUFDZixXQUFHLGdCQUFILEVBQXFCLEtBQXJCLENBQTJCLCtDQUEzQjtBQUNIOztBQUVEO0FBQ0E7QUFDSDs7QUFFRCxTQUFTLGFBQVQsQ0FBdUIsSUFBdkIsRUFBNkI7QUFDekIsU0FBSyxjQUFjLElBQW5COztBQUVBLE9BQUcsa0JBQUgsRUFBdUIsSUFBdkIsQ0FBNEIsT0FBTyxJQUFuQztBQUNIOztBQUVELFNBQVMsTUFBVCxHQUFrQjtBQUNkLHNCQUFrQixHQUFHLGdCQUFILEVBQXFCLE1BQXJCLEVBQWxCO0FBQ0EsT0FBRyxrQkFBSCxFQUF1QixHQUF2QixDQUEyQixFQUFFLFFBQVEsa0JBQWtCLEVBQWxCLEdBQXVCLElBQWpDLEVBQTNCO0FBQ0g7O0FBRUQ7QUFDQSxTQUFTLFFBQVQsQ0FBa0IsQ0FBbEIsRUFBcUI7QUFDakI7O0FBRUEsV0FBUSxFQUFFLE9BQUgsSUFBZSxPQUFPLEtBQVAsR0FBZSxHQUE5QixDQUFQO0FBQ0EsV0FBUSxFQUFFLE9BQUgsSUFBZSxPQUFPLE1BQVAsR0FBZ0IsR0FBL0IsQ0FBUDs7QUFFQSxRQUFJLE9BQU8sQ0FBWCxFQUFjO0FBQUUsZUFBTyxDQUFQO0FBQVc7QUFDM0IsUUFBSSxPQUFPLEdBQVgsRUFBZ0I7QUFBRSxlQUFPLEdBQVA7QUFBYTtBQUMvQixRQUFJLE9BQU8sR0FBWCxFQUFnQjtBQUFFLGVBQU8sR0FBUDtBQUFhOztBQUUvQjtBQUNBLFlBQVEsT0FBTyxLQUFmO0FBQ0EsWUFBUSxPQUFPLEtBQWY7QUFDQTtBQUNBLFlBQVEsS0FBUixFQUFlLEtBQWY7QUFDQSxXQUFPLEtBQVA7QUFDSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuKlxuKi9cbmZ1bmN0aW9uIHpvb20obnVtKSB7XG5cbiAgICBpZiAobnVtID09ICdpbicpIHtcbiAgICAgICAgbnVtID0gbXlTaXplLnNjYWxlICogMjtcbiAgICB9IGVsc2UgaWYgKG51bSA9PSAnb3V0Jykge1xuICAgICAgICBudW0gPSBteVNpemUuc2NhbGUgLyAyO1xuICAgIH07XG5cbiAgICBpZiAobnVtID4gNzIpIHtcbiAgICAgICAgbnVtID0gNzI7XG4gICAgfSBlbHNlIGlmIChudW0gPCAuMDA4Nykge1xuICAgICAgICBudW0gPSAuMDA4Nzg5MDYyNTtcbiAgICB9O1xuXG4gICAgaWYgKG51bSA9PSBteVNpemUuc2NhbGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH07XG5cbiAgICBpZiAobSA9ICRqKCcjbWFncycpKSB7XG5cbiAgICAgICAgcyA9ICg3MiAvIG51bSk7XG4gICAgICAgIG4gPSBNYXRoLmxvZyhzKSAvIE1hdGgubG9nKDIpO1xuXG4gICAgICAgIGxlZnQgPSAxMjYgLSAobiAqIDkpO1xuXG4gICAgICAgIG0uY3NzKHsgbGVmdDogbGVmdCArIFwicHhcIiB9KTtcbiAgICB9O1xuXG4gICAgLy9nZXQgdGhlIGNzcyBzdHlsZSBzaGVldCBcbiAgICBpZiAoZG9jdW1lbnQuc3R5bGVTaGVldHNbMF0uY3NzUnVsZXMpIHtcbiAgICAgICAgLy9jb3JyZWN0XG4gICAgICAgIGZvb3RCbG9jayA9IGRvY3VtZW50LnN0eWxlU2hlZXRzWzBdLmNzc1J1bGVzWzBdLnN0eWxlO1xuICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQuc3R5bGVTaGVldHNbMF0ucnVsZXMpIHtcbiAgICAgICAgLy9pZVxuICAgICAgICBmb290QmxvY2sgPSBkb2N1bWVudC5zdHlsZVNoZWV0c1swXS5ydWxlc1swXS5zdHlsZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvL3dobyBrbm93c1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIGlmIChudW0gPCAxOCkge1xuICAgICAgICBteVNpemUubWFnID0gKDE4IC8gbnVtKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIG15U2l6ZS5tYWcgPSAxO1xuICAgIH07XG5cbiAgICBteVNpemUuc2NhbGUgPSBudW07XG5cbiAgICB3aWR0aCA9IChudW0gKiAxMiAqIG15U2l6ZS5tYWcpICsgXCJweFwiO1xuICAgIGZvb3RCbG9jay5oZWlnaHQgPSB3aWR0aDtcbiAgICBmb290QmxvY2sud2lkdGggPSB3aWR0aDtcblxuICAgIGZvciAodmFyIHggPSAwOyB4IDwgbXlTaXplLm51bUNvbHM7IHgrKykge1xuICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IG15U2l6ZS5udW1Sb3dzOyB5KyspIHtcblxuICAgICAgICAgICAgaWYgKCRqKFwiI2NcIiArIHggKyBcInJcIiArIHkpKSB7XG5cbiAgICAgICAgICAgICAgICAkaihcIiNjXCIgKyB4ICsgXCJyXCIgKyB5KS5hdHRyKCdmb3JjZXJlbG9hZCcsIDEpLmh0bWwoJycpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLy9uZWVkIHRvIHJldmVyc2UgdGhlIGVxdWF0aW9uLCB0byBzZXQgdGhlIG1hZyB4IGJhc2VkIG9uIHRoZSB6b29tIGZhY290clxuICAgIGxlZnRYID0gKDEgLyBudW0pICogNzI7XG5cbiAgICBzZXRTY3JlZW5DbGFzcygpO1xufTtcblxuZnVuY3Rpb24gZmluZFRhcmdldChlKSB7XG5cbiAgICB0cnkge1xuICAgICAgICAvL3RlaCBmYWh4XG4gICAgICAgIHQgPSBlLnRhcmdldC5pZDtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgLy90ZWggc3VjeFxuICAgICAgICB0ID0gZS5zcmNFbGVtZW50LmlkO1xuICAgIH07XG5cbiAgICBpZiAodC5tYXRjaCgvcGljLykpIHtcbiAgICAgICAgZG9TZWxlY3QodCk7XG4gICAgfTtcbn07XG5cbi8vaW5pdGlhbGl6ZSBmZWV0IGRpdnNcbmZ1bmN0aW9uIGJ1aWxkU2NyZWVuKCkge1xuXG4gICAgLy9nZXQgcmlkIG9mIGFueSBkaXZzIGR1ZSB0byBzY2FsZSBvciBzY3JlZW4gc2l6ZSBcbiAgICBpZiAobXlTaXplLm9sZENvbHMgPiBteVNpemUubnVtQ29scykge1xuICAgICAgICBmb3IgKHZhciB4ID0gbXlTaXplLm9sZENvbHM7IHggPj0gbXlTaXplLm51bUNvbHM7IHgtLSkge1xuICAgICAgICAgICAgZm9yICh2YXIgeSA9IG15U2l6ZS5vbGRSb3dzOyB5ID49IDA7IHktLSkge1xuXG4gICAgICAgICAgICAgICAgaWYgKHggPj0gbXlTaXplLm51bUNvbHMgfHwgeSA+PSBteVNpemUubnVtUm93cykge1xuICAgICAgICAgICAgICAgICAgICAkaihcIiNjXCIgKyB4ICsgXCJyXCIgKyB5KS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBpZiAobXlTaXplLm9sZFJvd3MgPiBteVNpemUubnVtUm93cykge1xuICAgICAgICBmb3IgKHZhciB5ID0gbXlTaXplLm9sZFJvd3M7IHkgPj0gbXlTaXplLm51bVJvd3M7IHktLSkge1xuICAgICAgICAgICAgZm9yICh2YXIgeCA9IG15U2l6ZS5vbGRDb2xzOyB4ID49IDA7IHgtLSkge1xuICAgICAgICAgICAgICAgICRqKFwiI2NcIiArIHggKyBcInJcIiArIHkpLnJlbW92ZSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCBteVNpemUubnVtQ29sczsgeCsrKSB7XG4gICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgbXlTaXplLm51bVJvd3M7IHkrKykge1xuXG4gICAgICAgICAgICBpZiAoJGooXCIjY1wiICsgeCArIFwiclwiICsgeSkubGVuZ3RoID09IDApIHtcblxuICAgICAgICAgICAgICAgIHZhciBuZXdkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgICAgICAgICAgIG5ld2Rpdi5zZXRBdHRyaWJ1dGUoJ2lkJywgXCJjXCIgKyB4ICsgXCJyXCIgKyB5KTtcbiAgICAgICAgICAgICAgICBuZXdkaXYuY2xhc3NOYW1lID0gXCJmb290QmxvY2tcIjtcblxuICAgICAgICAgICAgICAgICRqKCcjc3F1YXJlbWlsZScpLmFwcGVuZChuZXdkaXYpO1xuXG4gICAgICAgICAgICAgICAgJGooXCIjY1wiICsgeCArIFwiclwiICsgeSkuYXR0cignZm9yY2VyZWxvYWQnLCAxKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIG1vdmVTY3JlZW4oKTtcblxuICAgIGVuZE1pbGUoKTtcbn07XG5cbi8vZGVsYXkgbG9hZGluZyBpbWFnZSBpbnRvIG1pbGUgZGl2XG5mdW5jdGlvbiBsb2FkSW1hZ2UoY2xzLCBpbWFnZSkge1xuICAgIHggPSBcImRvTG9hZCgnXCIgKyBjbHMgKyBcIicsJ1wiICsgaW1hZ2UgKyBcIicpXCI7XG4gICAgc2V0VGltZW91dCh4LCA1MDApO1xufTtcblxuLy9sb2FkIGEgc2NhbGVkIGltYWdlIGludG8gdGhlIGZvb3RcbmZ1bmN0aW9uIGRvTG9hZChjbHMsIGltYWdlKSB7XG5cbiAgICB2YXIgb2JqO1xuXG4gICAgaWYgKG9iaiA9ICRqKCcuJyArIGNscykpIHtcblxuICAgICAgICBwaWMgPSBuZXcgSW1hZ2UoKTtcblxuICAgICAgICBwaWMub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgb2JqLmh0bWwoJzxpbWcgc3JjPVwiJyArIGltYWdlICsgJ1wiLz4nKTtcbiAgICAgICAgICAgIG9iai5jc3Moe1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmRJbWFnZTogJ25vbmUnLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNEMTZBMzgnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBwaWMub2JqID0gb2JqO1xuICAgICAgICBwaWMuc3JjID0gaW1hZ2U7XG5cbiAgICB9O1xufTtcblxuLy9oYW5kbGVzIHBvc2l0aW9uaW5nIHRoZSBmb290IGRpdnNcbmZ1bmN0aW9uIG1vdmVTY3JlZW4oKSB7XG4gICAgc2NhbGUgPSBteVNpemUuc2NhbGUgLyA3MjtcblxuICAgIHhkaWZmID0gTWF0aC5mbG9vcigoKG15U2l6ZS5teVgpIC8gbXlTaXplLnRvdGFsV2lkdGgpICogc2NhbGUpICogbXlTaXplLm51bUNvbHMgKiBteVNpemUubWFnO1xuICAgIHhkaWZmID0geGRpZmYgPCAwID8gMCA6IHhkaWZmO1xuXG4gICAgeWRpZmYgPSBNYXRoLmZsb29yKCgobXlTaXplLm15WSkgLyBteVNpemUudG90YWxIZWlnaHQpICogc2NhbGUpICogbXlTaXplLm51bVJvd3MgKiBteVNpemUubWFnO1xuICAgIHlkaWZmID0geWRpZmYgPCAwID8gMCA6IHlkaWZmO1xuXG4gICAgYWRqWCA9IG15U2l6ZS5teVggLyAoc2NhbGUpO1xuXG4gICAgLy9wb3NpdGlvbiB0YXJnZXQgb24gbWFwXG4gICAgcG9zTWFwKCk7XG5cbiAgICB3aWR0aERpZmYgPSAobXlTaXplLnRvdGFsV2lkdGggLSBteVNpemUud2lkdGgpIC8gMjtcbiAgICBoZWlnaHREaWZmID0gKG15U2l6ZS50b3RhbEhlaWdodCAtIG15U2l6ZS5oZWlnaHQpIC8gMjtcblxuICAgIHZhciBvZmZzZXRMZWZ0cHggPSBNYXRoLmZsb29yKCgobXlTaXplLm15WCAqIHNjYWxlKSAqIC0xKSAlIChteVNpemUudG90YWxXaWR0aCkpICsgKG15U2l6ZS53aWR0aCAvIDIpO1xuICAgIHZhciBvZmZzZXRUb3BweCA9IE1hdGguZmxvb3IoKChteVNpemUubXlZICogc2NhbGUpICogLTEpICUgKG15U2l6ZS50b3RhbEhlaWdodCkpICsgKG15U2l6ZS5oZWlnaHQgLyAyKTtcbiAgICAvL29mZnNldCBMZWZ0IGdvZXMgZnJvbSBoYWxmIHRoZSBzY3JlZW4gd2lkdGgoNzIwKSBkb3duIHRvIHRoaXMgbWludXMgd2lkdGggb2YgYWxsIGZlZXQgZHJhd24gfiAoLTI3MzUpIFxuXG4gICAgaWYgKG15U2l6ZS5teVggPCAtMSkge1xuICAgICAgICB2YXIgb2Zmc2V0TGVmdHB4ID0gKChteVNpemUubXlYICogLTEpICogc2NhbGUpICsgKG15U2l6ZS53aWR0aCAvIDIpO1xuICAgIH07XG5cbiAgICBpZiAobXlTaXplLm15WSA8IC0xKSB7XG4gICAgICAgIHZhciBvZmZzZXRUb3BweCA9ICgobXlTaXplLm15WSAqIC0xKSAqIHNjYWxlKSArIChteVNpemUuaGVpZ2h0IC8gMik7XG4gICAgfTtcblxuICAgIG9mZnNldExlZnRweCA9IGlzTmFOKG9mZnNldExlZnRweCkgPyAwIDogb2Zmc2V0TGVmdHB4O1xuICAgIG9mZnNldFRvcHB4ID0gaXNOYU4ob2Zmc2V0VG9wcHgpID8gMCA6IG9mZnNldFRvcHB4O1xuXG4gICAgJGooJyNvZmZzZXRMZWZ0JykuY3NzKHsgbGVmdDogb2Zmc2V0TGVmdHB4ICsgXCJweFwiIH0pO1xuICAgICRqKCcjb2Zmc2V0VG9wJykuY3NzKHsgdG9wOiBvZmZzZXRUb3BweCArIFwicHhcIiB9KTtcblxuICAgIG15U2l6ZS5vZmZzZXRMZWZ0ID0gb2Zmc2V0TGVmdHB4O1xuICAgIG15U2l6ZS5vZmZzZXRUb3AgPSBvZmZzZXRUb3BweDtcblxuICAgIC8vdGhlIGxpbWl0cyBvZiBsZWZ0IGFuZCB0b3AgdmFsdWUgb24gc2NyZWVuIGJlZm9yZSBzaGlmdGluZ1xuICAgIG1pbkwgPSAoMCAtICh3aWR0aERpZmYpKTtcbiAgICBtYXhMID0gKG15U2l6ZS53aWR0aCArICh3aWR0aERpZmYgLyAyKSk7XG5cbiAgICBtaW5UID0gKDAgLSAoaGVpZ2h0RGlmZiAvIDIpKTtcbiAgICBtYXhUID0gKG15U2l6ZS5oZWlnaHQgKyAoaGVpZ2h0RGlmZiAvIDIpKTtcblxuICAgIC8vJGooJ3NxdWFyZW1pbGUnKS5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBvZmZzZXRMZWZ0cHgrXCJweCBcIitvZmZzZXRUb3BweCtcInB4XCI7XG5cbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IG15U2l6ZS5udW1Db2xzOyB4KyspIHtcbiAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBteVNpemUubnVtUm93czsgeSsrKSB7XG5cbiAgICAgICAgICAgIC8vbmV3IGxlZnQgaXMgdGhlIG9mZnNldCArIHBpeGVsIGZlZXQgKiBjb2x1bW4gd2UgYXJlIG9uXG4gICAgICAgICAgICBuZXdMZWZ0ID0gKChvZmZzZXRMZWZ0cHgpICsgKHggKiBteVNpemUub25lRm9vdCAqIG15U2l6ZS5tYWcpKTtcbiAgICAgICAgICAgIG5ld1RvcCA9ICgob2Zmc2V0VG9wcHgpICsgKHkgKiBteVNpemUub25lRm9vdCAqIG15U2l6ZS5tYWcpKTtcblxuICAgICAgICAgICAgLy90aGlzIGxvZ2ljIHRha2VzIGNhcmUgb2YgbW92aW5nIGRpdnMgZnJvbSBsZWZ0IHRvIHJpZ2h0LCB1cCB0byBkb3duLCBldGNcblxuICAgICAgICAgICAgaWYgKG5ld0xlZnQgPiBtYXhMKSB7XG4gICAgICAgICAgICAgICAgbmV3TGVmdCAtPSAobXlTaXplLnRvdGFsV2lkdGgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuZXdMZWZ0IDwgbWluTCkge1xuICAgICAgICAgICAgICAgIG5ld0xlZnQgKz0gKG15U2l6ZS50b3RhbFdpZHRoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChuZXdUb3AgPiBtYXhUKSB7XG4gICAgICAgICAgICAgICAgbmV3VG9wIC09IChteVNpemUudG90YWxIZWlnaHQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuZXdUb3AgPCAoMCAtIGhlaWdodERpZmYpICogbXlTaXplLm1hZykge1xuICAgICAgICAgICAgICAgIG5ld1RvcCArPSAobXlTaXplLnRvdGFsSGVpZ2h0KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvL2VuZCB0aGF0IGxvZ2ljIGJsb2NrXG5cbiAgICAgICAgICAgIC8vZmlndXJlIG91dCB3aGljaCBmb290IHdlIGFyZSBhY3R1YWxseSBsb29raW5nIGF0XHRcbiAgICAgICAgICAgIHZhciBtaWxlWCA9ICgobmV3TGVmdCAtIG9mZnNldExlZnRweCkgLyAoKHNjYWxlKSAqIDg2NCkpICsgMSArIHhkaWZmO1xuICAgICAgICAgICAgdmFyIG1pbGVZID0gKChuZXdUb3AgLSBvZmZzZXRUb3BweCkgLyAoKHNjYWxlKSAqIDg2NCkpICsgMSArIHlkaWZmO1xuXG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0gJGooXCIjY1wiICsgeCArIFwiclwiICsgeSk7XG5cblxuICAgICAgICAgICAgb2JqZWN0LmNzcyh7XG4gICAgICAgICAgICAgICAgbGVmdDogbmV3TGVmdCArIFwicHhcIixcbiAgICAgICAgICAgICAgICB0b3A6IG5ld1RvcCArIFwicHhcIlxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vcmVzZXQgeiBpbmRleCBpZiBub3Qgc2VsZWN0ZWRcbiAgICAgICAgICAgIGlmIChvYmplY3QuYXR0cignc2VsZWN0ZWQnKSAhPSAndHJ1ZScpIHtcbiAgICAgICAgICAgICAgICBvYmplY3QuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgLy96SW5kZXg6ICg1MjgwLShtaWxlWSkpKyg1MjgwLShtaWxlWCkpXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogZGVmYXVsdFpJbmRleChtaWxlWSwgbWlsZVgpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBvYmplY3QuZ2V0KDApLmNsYXNzTmFtZSA9IFwiZm9vdEJsb2NrIFwiICsgbWlsZVggKyBcIlwiICsgbWlsZVk7XG5cbiAgICAgICAgICAgIGlmIChjb3VudGVyID09IDkgJiYgb2JqZWN0Lmh0bWwoKSA9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0LmF0dHIoe1xuICAgICAgICAgICAgICAgICAgICBmb3JjZXJlbG9hZDogMVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKChvYmplY3QuYXR0cignbWlsZXgnKSAhPSBtaWxlWCkgfHwgKG9iamVjdC5hdHRyKCdtaWxleScpICE9IG1pbGVZKSB8fCBteVNpemUudHJhdmVsbGluZyA9PSA5OSkge1xuICAgICAgICAgICAgICAgIG9iamVjdC5hdHRyKHtcbiAgICAgICAgICAgICAgICAgICAgZm9yY2VyZWxvYWQ6IDEsXG4gICAgICAgICAgICAgICAgICAgIG1pbGV4OiBtaWxlWCxcbiAgICAgICAgICAgICAgICAgICAgbWlsZXk6IG1pbGVZXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBvYmplY3QuaHRtbCgnJyk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH07XG4gICAgfTtcblxufTtcblxuLy9kbyB0aGUgYWpheCBjYWxsIHRvIGxvYWQgbWlsZSBjb250ZW50XG5mdW5jdGlvbiBtYWtlTWFwQ2FsbChsb2MpIHtcbiAgICBpZiAobXlTaXplLnNjYWxlID4gOSkge1xuICAgICAgICB2YXIgYXJyID0gbG9jID8gbG9jIDogbG9hZEFycmF5O1xuXG4gICAgICAgIGlmIChhcnIubGVuZ3RoID4gMCB8fCBsb2MpIHtcbiAgICAgICAgICAgIHBvc3RBcnJheSA9IGpzX2FycmF5X3RvX3BocF9hcnJheShhcnIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuXG4gICAgICAgIGxvYWRGaWxlID0gXCJhcnJheT1cIiArIGVzY2FwZShwb3N0QXJyYXkpO1xuICAgICAgICBsb2FkRmlsZSArPSBcIiZzY2FsZT1cIiArIG15U2l6ZS5zY2FsZTtcblxuICAgICAgICAkai5hamF4KHtcbiAgICAgICAgICAgIHVybDogJy9tYXAvZ2V0JyxcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgIGRhdGE6IGxvYWRGaWxlLFxuICAgICAgICAgICAgc3VjY2VzczogaW5zZXJ0SW50b0Zvb3RcbiAgICAgICAgfSk7XG5cbiAgICB9O1xufTtcblxuZnVuY3Rpb24gaW5zZXJ0SW50b0Zvb3QoanNvbikge1xuXG4gICAgaWYgKGluaXQgPT0gZmFsc2UpIHtcbiAgICAgICAgaW5pdCA9IHRydWU7XG5cbiAgICAgICAgJGooJyNzcXVhcmVtaWxlJykuY3NzKHtcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmZmYnXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBldmFsKCdyZXN1bHQgPSAnICsganNvbik7XG5cbiAgICBmb3IgKHZhciBpIGluIHJlc3VsdC5mZWV0KSB7XG5cbiAgICAgICAgZm9vdCA9ICRqKCcuJyArIGkpO1xuXG4gICAgICAgIGlmIChmb290LmdldCgwKSkge1xuXG4gICAgICAgICAgICBjb250ZW50ID0gcmVzdWx0LmZlZXRbaV07XG4gICAgICAgICAgICBmb290Lmh0bWwoY29udGVudCk7XG4gICAgICAgICAgICBsb2FkSW1hZ2VzKGkpO1xuXG4gICAgICAgICAgICBmb290LmNzcyh7IGJhY2tncm91bmRJbWFnZTogJ25vbmUnIH0pO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIGZvciAodmFyIGkgaW4gcmVzdWx0LmVtcHR5KSB7XG5cbiAgICAgICAgZm9vdCA9ICRqKCcuJyArIGkpO1xuICAgICAgICBpZiAoZm9vdCkge1xuICAgICAgICAgICAgZm9vdC5odG1sKCc8IS0tIC0tPicpOyAvL2JsYW5rIHdpbGwgY2F1c2UgcmVsb2FkXG4gICAgICAgICAgICAvL2Zvb3QuY3NzKHsgYmFja2dyb3VuZEltYWdlOid1cmwoc3RhdGljL3doaXRlLmpwZyknIH0pO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBpZiAoc2VsZWN0ZWRFbGVtZW50LnRvU2VsZWN0KSB7XG4gICAgICAgIGRvU2VsZWN0KHNlbGVjdGVkRWxlbWVudC50b1NlbGVjdCk7XG4gICAgfTtcbn07XG5cbi8vY2FsbGVkIHRvIGxvYWQgaW1hZ2VzIGZyb20gbWFwXG5mdW5jdGlvbiBsb2FkSW1hZ2VzKGZvb3RDbGFzcykge1xuXG4gICAgLy9jb25zb2xlLmxvZyhmb290Q2xhc3MsICdmb290Q2xhc3MnICk7IC8vMTE0M1xuICAgIC8vIGFsbCB0aGUgaW1hZ2VzIGluc2lkZSBvZiBmb290XG4gICAgaW1hZ2VzID0gJGooJ2Rpdi4nICsgZm9vdENsYXNzICsgJyBhIGltZycpO1xuXG4gICAgLy9yZXBsYWNlIHRoZSBsb3cgcmVzIHZlcnNpb24gdyBmdWxsXG4gICAgLy9maXggdGhpcyAtIG5vdCBwcmVsb2FkaW5nXG4gICAgaW1hZ2VzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBzcmMgPSB0aGlzLnNyYy5yZXBsYWNlKFwiL3RodW1ic1wiLCBcIi9vcmlnaW5hbFwiKTtcbiAgICAgICAgdGhpcy5zcmMgPSBzcmM7XG4gICAgfSk7XG5cbiAgICAvL3ByZXZlbnQgdGlueSBlYXJsXG4gICAgZm9vdC5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcblxufTtcblxuZnVuY3Rpb24ganNfYXJyYXlfdG9fcGhwX2FycmF5KGEpIHtcbiAgICB2YXIgYV9waHAgPSBcIlwiO1xuICAgIHZhciB0b3RhbCA9IDA7XG4gICAgZm9yICh2YXIga2V5IGluIGEpIHtcbiAgICAgICAgdG90YWwrKztcbiAgICAgICAgYV9waHAgPSBhX3BocCArIFwiczpcIiArXG4gICAgICAgICAgICBTdHJpbmcoa2V5KS5sZW5ndGggKyBcIjpcXFwiXCIgKyBTdHJpbmcoa2V5KSArIFwiXFxcIjtzOlwiICtcbiAgICAgICAgICAgIFN0cmluZyhhW2tleV0pLmxlbmd0aCArIFwiOlxcXCJcIiArIFN0cmluZyhhW2tleV0pICsgXCJcXFwiO1wiO1xuICAgIH07XG4gICAgYV9waHAgPSBcImE6XCIgKyB0b3RhbCArIFwiOntcIiArIGFfcGhwICsgXCJ9XCI7XG4gICAgcmV0dXJuIGFfcGhwO1xufTtcblxuLy9tYWtlIGEgc2hhZG93IC0gZWxlbG1lbnQgaXMgb24gc2NyZWVuXG5mdW5jdGlvbiBtYWtlc2hhZG93KHBpY0lEKSB7XG5cbiAgICBzZWxlY3RlZEVsZW1lbnQuaXNTZWxlY3RlZCA9IHBpY0lEO1xuICAgIHNlbGVjdGVkRWxlbWVudC50b1NlbGVjdCA9IG51bGw7XG5cbiAgICAvL2ltYWdlIHNlbGVjdGVkXG4gICAgb2JqID0gJGooJyMnICsgcGljSUQpO1xuICAgIG9iai5jc3MoeyB6SW5kZXg6IDUwIH0pO1xuXG4gICAgLy90aGUgZm9vdCBpbWFnZSBpcyBpblxuICAgIHAgPSBvYmoucGFyZW50cygnZGl2LmZvb3RCbG9jaycpO1xuICAgIHAuY3NzKHtcbiAgICAgICAgekluZGV4OiA1MDAwMCxcbiAgICAgICAgLy9iYWNrZ3JvdW5kQ29sb3I6ICcjZjAwJyBcbiAgICB9KS5hdHRyKHsgc2VsZWN0ZWQ6ICd0cnVlJyB9KTtcblxuICAgIC8vY3JlYXRlIGluIERPTVxuICAgIHNoYWRvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXG4gICAgJGooc2hhZG93KS5hdHRyKHtcbiAgICAgICAgc3JjOiAnL3N0YXRpYy9zaGFkb3cucG5nJyxcbiAgICAgICAgd2lkdGg6IChvYmoud2lkdGgoKSAqIDEuMjUpLFxuICAgICAgICBoZWlnaHQ6IChvYmouaGVpZ2h0KCkgKiAxLjI1KSxcbiAgICAgICAgaWQ6ICdjb250ZW50U2hhZG93J1xuICAgIH0pLmNzcyh7XG4gICAgICAgIGxlZnQ6IChwYXJzZUZsb2F0KG9iai5jc3MoJ2xlZnQnKSkgLSAoKG9iai53aWR0aCgpICogMS4yNSkgLSBvYmoud2lkdGgoKSkgLyAyKSArICdweCcsXG4gICAgICAgIHRvcDogKHBhcnNlRmxvYXQob2JqLmNzcygndG9wJykpIC0gKChvYmouaGVpZ2h0KCkgKiAxLjI1KSAtIG9iai5oZWlnaHQoKSkgLyAyKSArICdweCcsXG4gICAgICAgIHpJbmRleDogNDlcbiAgICB9KTtcblxuICAgIG9iai5hZnRlcihzaGFkb3cpO1xuXG4gICAgLy90aGUgc2NhbGUgYXMgcmVsYXRpdmUgdG8gNzJkcGlcbiAgICBzY2FsZSA9IChteVNpemUuc2NhbGUgLyA3Mik7XG4gICAgcGl4ZWxGb290ID0gc2NhbGUgKiA4NjQ7XG5cbiAgICAvL29mZnNldCBsZWZ0ICYgdG9wXG4gICAgbGZ0ID0gKChwYXJzZUludChvYmouY3NzKCdsZWZ0JykpKSArIChwYXJzZUludChvYmoud2lkdGgoKSkgLyAyKSkgLyBzY2FsZTtcbiAgICB0cCA9ICgocGFyc2VJbnQob2JqLmNzcygndG9wJykpKSArIChwYXJzZUludChvYmouaGVpZ2h0KCkpIC8gMikpIC8gc2NhbGU7XG5cbiAgICB2YXIgZ29Ub0Nvb3JkcyA9IHtcbiAgICAgICAgeDogbXlTaXplLm15WCxcbiAgICAgICAgeTogbXlTaXplLm15WSxcbiAgICAgICAgbW92ZTogZmFsc2VcbiAgICB9O1xuXG4gICAgaW1ncG9zID0gb2JqLm9mZnNldCgpO1xuICAgIGltZ3dpZCA9IHBhcnNlSW50KG9iai53aWR0aCgpKTtcbiAgICBpbWdoZWkgPSBwYXJzZUludChvYmouaGVpZ2h0KCkpO1xuXG4gICAgaWYgKGltZ3Bvcykge1xuICAgICAgICBpZiAoaW1ncG9zLmxlZnQgPCAwIHx8IChpbWdwb3MubGVmdCArIGltZ3dpZCkgPiBteVNpemUud2lkdGgpIHtcbiAgICAgICAgICAgIGdvVG9Db29yZHMueCA9ICgocC5hdHRyKCdtaWxlWCcpIC0gMSkgKiA4NjQpICsgbGZ0O1xuICAgICAgICAgICAgZ29Ub0Nvb3Jkcy5tb3ZlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbWdwb3MudG9wIDwgMCB8fCAoaW1ncG9zLnRvcCArIGltZ2hlaSkgPiBteVNpemUuaGVpZ2h0KSB7XG4gICAgICAgICAgICBnb1RvQ29vcmRzLnkgPSAoKHAuYXR0cignbWlsZVknKSAtIDEpICogODY0KSArIHRwO1xuICAgICAgICAgICAgZ29Ub0Nvb3Jkcy5tb3ZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvL2ZpeCBpZiBvZmYgYm90dG9tIG9mIHNjcmVlblxuICAgIG9mZnNldFkgPSBwYXJzZUludChvYmouaGVpZ2h0KCkpO1xuICAgIG9mZnNldFggPSBwYXJzZUludChvYmoud2lkdGgoKSk7XG5cbiAgICAvL2FkanN0IGZvciBtYXAgb3ZlcmxhcFxuICAgIGlmIChvZmZzZXRZID4gbXlTaXplLmhlaWdodCkge1xuICAgICAgICBkaWZmWSA9IChvZmZzZXRZIC0gbXlTaXplLmhlaWdodCkgLyAyO1xuICAgICAgICBnb1RvQ29vcmRzWyd5J10gKz0gZGlmZlk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZGlmZlkgPSAwO1xuICAgIH07XG5cbiAgICBmaWcgPSAobXlTaXplLndpZHRoIC0gb2Zmc2V0WCkgLyAyO1xuXG4gICAgaWYgKGZpZyA8IDYwMCkge1xuICAgICAgICBkaWZmWCA9ICg1MDAgLSBmaWcpO1xuICAgICAgICBnb1RvQ29vcmRzWyd4J10gKz0gZGlmZlg7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZGlmZlggPSAwO1xuICAgIH07XG5cbiAgICBpZiAoZ29Ub0Nvb3Jkcy5tb3ZlID09IHRydWUpIHtcbiAgICAgICAgLy9tb3ZlIHRvIHByZXZlbnQgb3ZlcmxhcCB3IG1hcFxuICAgICAgICBnb1RvTG9jKGdvVG9Db29yZHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vaW4gdGhlIHJpZ2h0IHNwb3RcbiAgICB9O1xuXG4gICAgLy9zaG93IHRoZSB3b3JkIGJhbGxvb25cbiAgICB2YXIgY29tbWVudHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICRqKGNvbW1lbnRzKS5jc3Moe1xuICAgICAgICBsZWZ0OiBwYXJzZUludChvYmouY3NzKCdsZWZ0JykpICsgcGFyc2VJbnQob2JqLndpZHRoKCkpIC0gKDQwICogc2NhbGUpICsgXCJweFwiLFxuICAgICAgICB0b3A6IHBhcnNlSW50KG9iai5jc3MoJ3RvcCcpKSArIHBhcnNlSW50KG9iai5oZWlnaHQoKSkgLSAzMjIgKyBcInB4XCJcbiAgICB9KS5hdHRyKHtcbiAgICAgICAgaWQ6ICd3b3JkQmFsbG9vbidcbiAgICB9KS5odG1sKFxuICAgICAgICAnPGRpdiBpZD1cImNsb3NlQmFsbG9vblwiIG9uY2xpY2s9XCJkb1NlbGVjdChcXCcnICsgcGljSUQgKyAnXFwnICk7XCI+PC9kaXY+PGRpdiBpZD1cImJhbGxvb25Db250ZW50XCI+PC9kaXY+J1xuICAgICAgICApO1xuXG4gICAgcC5hcHBlbmQoY29tbWVudHMpO1xuXG4gICAgZ2V0Q29tbWVudHMocGljSUQpO1xuXG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG5mdW5jdGlvbiBkZWZhdWx0WkluZGV4KHJvdywgY29sKSB7XG4gICAgcmV0dXJuICg1MjgwIC0gcm93KSArICg1MjgwIC0gY29sKTtcbn07XG5cbi8vZG91YmxlY2xpY2sgb24gY29udGVudCBmdW5jdGlvblxuZnVuY3Rpb24gZG9TZWxlY3QocGljSUQpIHtcblxuICAgIHNlbGVjdGVkRWxlbWVudC50b1NlbGVjdCA9IG51bGw7XG5cbiAgICAvL3NvbWV0aGluZyBpcyBzZWxlY3RlZD8gZGVzZWxjdCBpdFxuICAgIGlmIChvID0gc2VsZWN0ZWRFbGVtZW50LmlzU2VsZWN0ZWQpIHtcblxuICAgICAgICAvL3RoZSBzZWxlY3RlZCBpbWFnZVxuICAgICAgICAkaignIycgKyBvKS5jc3Moe1xuICAgICAgICAgICAgekluZGV4OiAnMSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJGooJyNjb250ZW50U2hhZG93JykucmVtb3ZlKCk7XG4gICAgICAgICRqKCcjd29yZEJhbGxvb24nKS5yZW1vdmUoKTtcblxuICAgICAgICAvL3RoZSBmb290IHRoZSBpbWFnZSBpcyBpblxuICAgICAgICBwID0gJGooJyMnICsgbykucGFyZW50cygnZGl2LmZvb3RCbG9jaycpO1xuICAgICAgICBwLmNzcyh7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICB6SW5kZXg6IGRlZmF1bHRaSW5kZXgocC5hdHRyKCdtaWxlWScpLCBwLmF0dHIoJ21pbGVYJykpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChzZWxlY3RlZEVsZW1lbnQuaXNTZWxlY3RlZCA9PSBwaWNJRCkge1xuICAgICAgICAgICAgc2VsZWN0ZWRFbGVtZW50LmlzU2VsZWN0ZWQgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBzZWxlY3RlZEVsZW1lbnQuaXNTZWxlY3RlZCA9IHBpY0lEO1xuXG4gICAgaWYgKCRqKCcjJyArIHBpY0lEKSkge1xuICAgICAgICBtYWtlc2hhZG93KHBpY0lEKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG4vL2F1dG9tYXRpYyB0cmF2ZWxsaW5nIC0gZ29lcyBpbiAxMCBzdGVwc1xuLy9jYWxsZWQgb24gbWFwIGRvdWJsZSBjbGlja1xuZnVuY3Rpb24gZ29Ub0xvYyhjb29yZHMpIHtcbiAgICAvL2Nvb3JkcyAtIGFycmF5IC0gcmVxdWlyZWQ6XG4gICAgLy94OiB4IGxvYyBpbiA3MiBkcGkgcGl4ZWxzXG4gICAgLy95OiB5IGxvYyBpbiA3MiBkcGkgcGl4ZWxzXG5cbiAgICAvL2Nvb3JkcyBvcHRpb25hbFxuICAgIC8vaWQ6IGVsZW1lbnQgdG8gc2VsZWN0IG9uY2UgdHJhdmVsIGlzIGNvbXBsZXRlXG5cbiAgICAvL2NhbmNlbCBhbnkgZXhpc3RpbmcgdHJhdmVsc1xuICAgIGlmIChpbnRJbnRlcnZhbCkge1xuICAgICAgICBpbnRJbnRlcnZhbCA9IHdpbmRvdy5jbGVhckludGVydmFsKGludEludGVydmFsKTtcbiAgICB9O1xuXG4gICAgLy9zZWxlY3Qgc29tZXRoaW5nIG9uY2Ugd2UgZ2V0IHRoZXJlXG4gICAgaWYgKGNvb3Jkc1snaWQnXSkge1xuICAgICAgICBpZiAoY29vcmRzWydpZCddLmluZGV4T2YoJ3BpYycpID09IC0xKSB7XG4gICAgICAgICAgICBjb29yZHNbJ2lkJ10gPSAncGljJyArIGNvb3Jkc1snaWQnXTtcbiAgICAgICAgfTtcbiAgICAgICAgc2VsZWN0ZWRFbGVtZW50LnRvU2VsZWN0ID0gY29vcmRzWydpZCddO1xuICAgIH07XG5cbiAgICBteVNpemUudHJhdmVsbGluZyA9IDE7XG5cbiAgICAvLzU1IGlzIDEwKzkrOC4uZXRjXG4gICAgdHJhdmVsWCA9IE1hdGguZmxvb3IobXlTaXplLm15WCAtIGNvb3Jkc1sneCddKSAvIDU1O1xuICAgIHRyYXZlbFkgPSBNYXRoLmZsb29yKG15U2l6ZS5teVkgLSBjb29yZHNbJ3knXSkgLyA1NTtcblxuICAgIGlmICghaXNOYU4odHJhdmVsWCkgJiYgIWlzTmFOKHRyYXZlbFkpKSB7XG4gICAgICAgIGludEludGVydmFsID0gd2luZG93LnNldEludGVydmFsKFwiZG9UcmF2ZWwodHJhdmVsWCwgdHJhdmVsWSwgMTApXCIsIDUwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvL2RidWcoJ2Vycm9yIGluIGdvVG9Mb2MnICk7XG4gICAgfTtcblxufTtcblxuLy8gYXV0b21hdGljYWxseSBwb3N0aXRpb25zIHRoZSBtYXAsIHdpdGggcGFyYW1ldGVycyBzZXQgaW4gZ29Ub0xvYygpXG5mdW5jdGlvbiBkb1RyYXZlbCh0cmF2ZWxYLCB0cmF2ZWxZLCBjb3VudCkge1xuXG4gICAgY291bnRlcisrO1xuXG4gICAgbXlTaXplLm15WCAtPSAodHJhdmVsWCAqIGNvdW50ZXIpO1xuICAgIG15U2l6ZS5teVkgLT0gKHRyYXZlbFkgKiBjb3VudGVyKTtcblxuICAgIG1vdmVTY3JlZW4oKTtcblxuICAgIGlmIChjb3VudGVyID49IGNvdW50KSB7XG4gICAgICAgIGludEludGVydmFsID0gd2luZG93LmNsZWFySW50ZXJ2YWwoaW50SW50ZXJ2YWwpO1xuICAgICAgICBjb3VudGVyID0gMDtcbiAgICAgICAgbXlTaXplLnRyYXZlbGxpbmcgPSAwO1xuXG4gICAgICAgIGVuZE1pbGUoKTtcbiAgICB9O1xufTtcblxuLy9nZXQgYWxsIGNvbW1lbnRzIGZvciBhIHNlbGVjdGVkIGlkXG5mdW5jdGlvbiBnZXRDb21tZW50cyhkaXYpIHtcblxuICAgICRqKCcjYmFsbG9vbkNvbnRlbnQnKS5odG1sKCc8aW1nIHNyYz1cIi9zdGF0aWMvYWpheC1sb2FkZXIuZ2lmXCIgY2xhc3M9XCJiYWxsb29uTG9hZGVyXCIvPicpO1xuXG4gICAgaWQgPSBkaXYucmVwbGFjZSgvcGljLywgJycpO1xuXG4gICAgJGouYWpheCh7XG4gICAgICAgIHVybDogJy9tYXAvZ2V0LWNvbW1lbnRzJyxcbiAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBpZDogaWRcbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogcmV0dXJuQ29tbWVudHNcbiAgICB9KTtcblxufTtcblxuZnVuY3Rpb24gcmV0dXJuQ29tbWVudHMoaHRtbCkge1xuICAgICRqKCcjYmFsbG9vbkNvbnRlbnQnKS5odG1sKGh0bWwpO1xuXG4gICAgLy9hY3RpdmF0ZSBjb21tZW50IHN1Ym1pdFxuICAgICRqKCdmb3JtI2NvbW1lbnRGb3JtJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBzdWJtaXRDb21tZW50KCk7XG4gICAgfSk7XG5cbiAgICBhY3RpdmVWb3RlKCk7XG59O1xuXG5mdW5jdGlvbiBzaG93Q29tbWVudChpZCkge1xuICAgICRqKCdkaXYuY29tbWVudFNlY3Rpb24nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJGoodGhpcykuY3NzKHsgZGlzcGxheTogJ25vbmUnIH0pO1xuICAgIH0pO1xuXG4gICAgJGooJyNjb21tZW50U2VjdGlvbicgKyBpZCkuY3NzKHsgZGlzcGxheTogJ2Jsb2NrJyB9KTtcblxuICAgICRqKCdkaXYjY29tbWVudFRhYnMgZGl2LmNvbW1lbnRUYWInKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJGoodGhpcykuYWRkQ2xhc3MoJ2RlU2VsZWN0ZWQnKTtcbiAgICB9KTtcblxuICAgICRqKCcjY29tbWVudFRhYicgKyBpZCkucmVtb3ZlQ2xhc3MoJ2RlU2VsZWN0ZWQnKTtcbn07XG5cbi8vYWN0aXZhdGUgdGhlIHZvdGluZyBibG9ja1xuZnVuY3Rpb24gYWN0aXZlVm90ZSgpIHtcbiAgICAvL2F0dGFjaCBsaXN0ZW5lcnMgdG8gdm90aW5nIGJsb2NrXG4gICAgJGooJyN0aERvd24nKS5jbGljayhwYXJzZVZvdGUpO1xuICAgICRqKCcjdGhVcCcpLmNsaWNrKHBhcnNlVm90ZSk7XG59O1xuXG4vL2dldCBhIHZvdGVcbmZ1bmN0aW9uIHBhcnNlVm90ZSgpIHtcblxuICAgIG9iamlkID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2ZvcicpO1xuICAgIHZhbCA9IHRoaXMuZ2V0QXR0cmlidXRlKCd2YWx1ZScpO1xuXG4gICAgLy9kb250IGRvIGFqYXggaWYgdGhlIGlzIGN1cnJlbnQgdm90ZVxuICAgIGlmICghJGoodGhpcykuaGFzQ2xhc3MoJ3VwJykpIHtcbiAgICAgICAgdm90ZShvYmppZCwgdmFsKTtcbiAgICB9O1xufTtcblxuLy9zZW5kIGEgdm90ZSBpblxuZnVuY3Rpb24gdm90ZShvYmplY3RpZCwgZGlyZWN0aW9uKSB7XG4gICAgLy9kaXJlY3Rpb24gLTE9IGRvd24sIDEgPSB1cFxuXG4gICAgJGooJyN2b3RlQmxvY2snKS5odG1sKCc8aW1nIHNyYz1cIi9zdGF0aWMvdGh1bWJzLWxvYWRpbmcucG5nXCIgdGl0bGU9XCJsb2FkaW5nLi4uXCIvPicpO1xuXG4gICAgJGouYWpheCh7XG4gICAgICAgIHVybDogJy9jb250ZW50L3ZvdGUnLFxuICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIG9iamVjdGlkOiBvYmplY3RpZCxcbiAgICAgICAgICAgIGRpcmVjdGlvbjogZGlyZWN0aW9uXG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6IHJlY2VpdmVWb3RlXG4gICAgfSk7XG59O1xuXG5mdW5jdGlvbiByZWNlaXZlVm90ZShqc29uKSB7XG5cbiAgICBldmFsKCdyZXN1bHQgPSAnICsganNvbik7XG5cbiAgICBpZiAocmVzdWx0LnN1Y2Nlc3MgPT0gdHJ1ZSkge1xuICAgICAgICAkaignI3ZvdGVCbG9jaycpLmh0bWwocmVzdWx0LnZvdGUpO1xuICAgICAgICBhY3RpdmVWb3RlKCk7XG4gICAgfSBlbHNlIHtcblxuICAgIH07XG59O1xuXG5cblxuXG5mdW5jdGlvbiBnZXRUaHVtYih2b3RlLCBpZCkge1xuICAgIHZhciB2b3RlQmxvY2sgPSBcIlwiO1xuXG4gICAgaWYgKHZvdGUgPT0gMSkge1xuICAgICAgICB2b3RlQmxvY2sgKz0gJzxpbWcgc3JjPVwiL3N0YXRpYy90dXAuZ2lmXCIgb25jbGljaz1cInZvdGUoJyArIGlkICsgJywtMSlcIi8+JztcbiAgICB9IGVsc2UgaWYgKHZvdGUgPT0gLTEpIHtcbiAgICAgICAgdm90ZUJsb2NrICs9ICc8aW1nIHNyYz1cIi9zdGF0aWMvdGRvd24uZ2lmXCIgb25jbGljaz1cInZvdGUoJyArIGlkICsgJywxKVwiLz4nO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZvdGVCbG9jayArPSAnPGltZyBzcmM9XCIvc3RhdGljL3Rkb3duLmdpZlwiIG9uY2xpY2s9XCJ2b3RlKCcgKyBpZCArICcsLTEpXCIvPic7XG4gICAgICAgIHZvdGVCbG9jayArPSAnPGltZyBzcmM9XCIvc3RhdGljL3R1cC5naWZcIiBvbmNsaWNrPVwidm90ZSgnICsgaWQgKyAnLDEpXCIvPic7XG4gICAgfTtcblxuICAgIHJldHVybiB2b3RlQmxvY2s7XG59O1xuXG4vL2FkZCBhIGNvbW1lbnQgdG8gYSBhIHNlY3Rpb25cbmZ1bmN0aW9uIGFkZENvbW1lbnQoKSB7XG4gICAgc2hvd0NvbW1lbnQoJzMnKTtcbiAgICAkaignI3NxdWFyZUNvbW1lbnQnKS5mb2N1cygpO1xufTtcblxuZnVuY3Rpb24gYWRkVGFnKCkge1xuICAgIHNob3dDb21tZW50KCc0Jyk7XG4gICAgJGooJyNzcXVhcmVUYWcnKS5mb2N1cygpO1xufTtcblxuLy9zdWJtaXQgYSBjb21tZW50LCBwdXQgaW50byBjb21tZW50IHJlY29yZFxuZnVuY3Rpb24gc3VibWl0Q29tbWVudCgpIHtcblxuICAgIHZhciBpZCA9ICRqKCcjc3F1YXJlSUQnKS52YWwoKTtcbiAgICB2YXIgY29tbWVudCA9ICRqKCcjc3F1YXJlQ29tbWVudCcpLnZhbCgpO1xuXG4gICAgJGooJyNjb21tZW50QmxvY2snKS5odG1sKCc8aW1nIHNyYz1cIi9zdGF0aWMvYWpheC1sb2FkZXIuZ2lmXCIvPicpO1xuXG4gICAgJGouYWpheCh7XG4gICAgICAgIHVybDogJy9tYXAvY29tbWVudCcsXG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgYWN0aW9uOiAnYWRkJyxcbiAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgIGNvbW1lbnQ6IGNvbW1lbnRcbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogcmV0dXJuQ29tbWVudHNcbiAgICB9KTtcblxufTtcblxuLy9zdWJtaXQgYSB0YWcsIHB1dCBpbnRvIGNvbW1lbnQgcmVjb3JkXG5mdW5jdGlvbiBzdWJtaXRUYWcoKSB7XG5cbiAgICB2YXIgaWQgPSAkaignI3NxdWFyZUlEJykudmFsKCk7XG4gICAgdmFyIHRhZyA9ICRqKCcjc3F1YXJlVGFnJykudmFsKCk7XG5cbiAgICBzaG93Q29tbWVudCgnMicpO1xuXG4gICAgJGouYWpheCh7XG4gICAgICAgIHVybDogJy9tYXAvdGFnJyxcbiAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICB0YWc6IHRhZ1xuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiByZXR1cm5Db21tZW50c1xuICAgIH0pO1xuXG59O1xuXG4vL2ZsYWcgY29udGVudCBhcyBpbm5hcHJyb3ByaWF0ZVxuZnVuY3Rpb24gZG9GbGFnKGlkLCByZWFzb24pIHtcbiAgICAkai5hamF4KHtcbiAgICAgICAgdXJsOiAnL21hcC9mbGFnJyxcbiAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBvYmplY3RpZDogaWQsXG4gICAgICAgICAgICByZWFzb246IHJlYXNvblxuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiByZWNlaXZlRmxhZ1xuICAgIH0pO1xufTtcblxuZnVuY3Rpb24gcmVjZWl2ZUZsYWcoanNvbikge1xuICAgIGV2YWwoJ3Jlc3VsdCA9ICcgKyBqc29uKTtcblxuICAgIGlmIChyZXN1bHQubXNnKSB7XG4gICAgICAgICRqKCcjbGlnaHRib3hjb250ZW50JykuaHRtbChyZXN1bHQubXNnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjbG9zZUxCKCk7XG4gICAgfTtcbn07XG5cbi8vZG8gdGhpcyB3aGVuIHBpYyBpcyBtaXNzaW5nXG5mdW5jdGlvbiBhdXRvRmxhZyhpZCkge1xuICAgICRqLmFqYXgoe1xuICAgICAgICB1cmw6ICcvbWFwL2ZsYWcnLFxuICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIG9iamVjdGlkOiBpZCxcbiAgICAgICAgICAgIHJlYXNvbjogJ21pc3NpbmcnXG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6IHJlY2VpdmVGbGFnXG4gICAgfSk7XG59O1xuXG5mdW5jdGlvbiByZWNlaXZlYXV0b0ZsYWcoanNvbikge1xuXG59O1xuXG5cblxuXG5cbi8vcmFuZG9tIG51bWJlciBmb3IgZ29Ub0xvY1xuZnVuY3Rpb24gZ29Ub1JhbmRvbSgpIHtcblxuICAgIGNvb3JkcyA9IHtcbiAgICAgICAgeDogTWF0aC5yYW5kb20oKSAqIDQ1NjE5MjAsXG4gICAgICAgIHk6IE1hdGgucmFuZG9tKCkgKiA0NTYxOTIwXG4gICAgfTtcblxuICAgIGdvVG9Mb2MoY29vcmRzKTtcbn07XG5cbi8vcG9zTWFwIHBvc2l0aW9ucyB0aGUgY3Vyc29yIHRvIHRoZSBhcHByb3ByaWF0ZSBsb2NhdGlvbiBvbiB0aGUgbWFwXG5mdW5jdGlvbiBwb3NNYXAoKSB7XG4gICAgc2NhbGUgPSAobXlTaXplLnNjYWxlIC8gNzIpO1xuXG4gICAgJGooJyNtYXJrZXInKS5jc3MoeyBsZWZ0OiAobXlTaXplLm15WCAvIDI0MDAwKSArIFwicHhcIiB9KTtcbiAgICAkaignI21hcmtlcicpLmNzcyh7IHRvcDogKG15U2l6ZS5teVkgLyAyNDAwMCkgKyBcInB4XCIgfSk7XG5cblxufTtcblxuLy9tb3ZlcyB0aGUgbWlsZSB3aGVuIHRoZSBtYXAgdGFyZ2V0IGlzIGRyYWdnZWRcbmZ1bmN0aW9uIHBvc01pbGUob2JqZWN0WCwgb2JqZWN0WSkge1xuICAgIHNjYWxlID0gKG15U2l6ZS5zY2FsZSAvIDcyKTtcblxuICAgIG15U2l6ZS5teVggPSBNYXRoLmZsb29yKG9iamVjdFggKiAyNDAxMC4xMDUpO1xuICAgIG15U2l6ZS5teVkgPSBNYXRoLmZsb29yKG9iamVjdFkgKiAyNDAxMC4xMDUpO1xuXG4gICAgbW92ZVNjcmVlbigpO1xufTtcblxuXG5cblxuZnVuY3Rpb24gZ2V0Q29vcmRpbmF0ZXMoZSkge1xuXG4gICAgLy9nZXQgbW91c2UgcHJvcGVydGllc1xuICAgIHZhciBlID0gbmV3IE1vdXNlRXZlbnQoZSk7XG5cbiAgICAvL3JlbFg9KGUueC0xMiktbXlYLShteVNpemUud2lkdGgvMik7XG4gICAgLy9yZWxZPShlLnktMTIpLW15WS0obXlTaXplLmhlaWdodC8yKTtcblxuICAgIC8vdGhlIGxvY2F0aW9uIG9mIHRoZSBtb3VzZSByZWxhdGl2ZSB0byB0aGUgdG9wIGxlZnQgY29ybmVyXG4gICAgLy90b3AgbGVmdCAoMCwwKVxuICAgIC8vYm90dG9tIHJpZ2h0ICg0NTYxOTE5LDQ1NjE5MTkpXG4gICAgcmVsWCA9IChteVNpemUubXlYKSArIChlLmNsaWVudFgpIC0gKG15U2l6ZS53aWR0aCAvIDIpO1xuICAgIHJlbFkgPSAobXlTaXplLm15WSkgKyAoZS5jbGllbnRZKSAtIChteVNpemUuaGVpZ2h0IC8gMik7XG5cbiAgICAvL3RoZSBpbmNoIHRoYXQgdGhlIG1vdXNlIGlzIGluLlxuICAgIC8vdG9wIGxlZnQoMSwxKVxuICAgIC8vYm90dG9tIHJpZ2h0KDYzMzYwLDYzMzYwKVxuICAgIHNxdWFyZVggPSBNYXRoLmNlaWwocmVsWCAvIDcyKTtcbiAgICBzcXVhcmVZID0gTWF0aC5jZWlsKHJlbFkgLyA3Mik7XG5cbiAgICAvL2Zvb3RYIGFuZCBmb290WSByZWZlciB0byBzcXVhcmUgZm9vdCBzaXplZCBhcmVhcyAtIDEgdGhydSA1MjgwIFxuICAgIGZvb3RYID0gTWF0aC5jZWlsKHNxdWFyZVggLyAxMik7XG4gICAgZm9vdFkgPSBNYXRoLmNlaWwoc3F1YXJlWSAvIDEyKTtcblxuICAgIC8vdGhlIGMwcjAgZGl2IHR5cGVcbiAgICBjb2xUeXBlID0gKChmb290WCAtIDEpICUgKG15U2l6ZS5udW1Db2xzKSk7XG4gICAgcm93VHlwZSA9ICgoZm9vdFkgLSAxKSAlIChteVNpemUubnVtUm93cykpO1xuXG4gICAgbXNnVGV4dCA9IFwicmVsWDogXCIgKyByZWxYICsgXCJcXG5cIjtcbiAgICBtc2dUZXh0ICs9IFwicmVsWTogXCIgKyByZWxZICsgXCJcXG5cIjtcbiAgICBtc2dUZXh0ICs9IFwic3F1YXJlWDogXCIgKyBzcXVhcmVYICsgXCJcXG5cIjtcbiAgICBtc2dUZXh0ICs9IFwic3F1YXJlWTogXCIgKyBzcXVhcmVZICsgXCJcXG5cIjtcbiAgICBtc2dUZXh0ICs9IFwiZm9vdFg6IFwiICsgZm9vdFggKyBcIlxcblwiO1xuICAgIG1zZ1RleHQgKz0gXCJmb290WTogXCIgKyBmb290WSArIFwiXFxuXCI7XG4gICAgbXNnVGV4dCArPSBcImNvbFR5cGU6IFwiICsgY29sVHlwZSArIFwiXFxuXCI7XG4gICAgbXNnVGV4dCArPSBcInJvd1R5cGU6IFwiICsgcm93VHlwZSArIFwiXFxuXCI7XG5cbn07XG5cbi8vYWN0aXZhdGUgdGhlIGFkZCBwaWN0dXJlLCBsaW5rIG9yIHVwbG9hZCAtIG5vdCB3YWl0aW5nIGxpc3RcbmZ1bmN0aW9uIGRyYWdBY3RpdmF0ZSgpIHtcbiAgICAkaignI3NtYWxsQWRkJykuZHJhZ2dhYmxlKHtcbiAgICAgICAgc3RhcnQ6IGFjdGl2YXRlU21hbGxBZGQsXG4gICAgICAgIGRyYWc6IHNtYWxsQWRkRHJhZyxcbiAgICAgICAgc3RvcDogY2hlY2tTbWFsbEFkZFxuICAgIH0pO1xufTtcblxuZnVuY3Rpb24gYWN0aXZhdGVTbWFsbEFkZCgpIHtcblxuICAgIC8vcmVtb3ZlIHRoZSBiYXNlIHVybFxuICAgIHRodW1ic3JjID0gKGFkZFBpYy5zb3VyY2UpO1xuXG4gICAgcG9zSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cbiAgICAkaihwb3NJbWcpLmF0dHIoe1xuICAgICAgICBpZDogJ3Bvc0ltZycsXG4gICAgICAgIHNyYzogdGh1bWJzcmMsXG4gICAgICAgIHdpZHRoOiAoYWRkUGljLndpZHRoICogbXlTaXplLnNjYWxlKSxcbiAgICAgICAgaGVpZ2h0OiAoYWRkUGljLmhlaWdodCAqIG15U2l6ZS5zY2FsZSlcbiAgICB9KS5jc3Moe1xuICAgICAgICBsZWZ0OiAnMTAwcHgnLFxuICAgICAgICB0b3A6ICcxMDBweCdcbiAgICB9KTtcblxuICAgICRqKCcjc3F1YXJlbWlsZScpLmFwcGVuZChwb3NJbWcpO1xuXG4gICAgJGooXCIjcG9zSW1nXCIpLmFuaW1hdGUoe1xuICAgICAgICBvcGFjaXR5OiAuNVxuICAgIH0pO1xuXG59O1xuXG5mdW5jdGlvbiBzbWFsbEFkZERyYWcoZSkge1xuICAgIHBvc0ltZyA9ICRqKCcjcG9zSW1nJyk7XG5cbiAgICBwaWNXaWR0aCA9IGFkZFBpYy53aWR0aCAqIG15U2l6ZS5zY2FsZTtcbiAgICBwaWNIZWlnaHQgPSBhZGRQaWMuaGVpZ2h0ICogbXlTaXplLnNjYWxlO1xuXG4gICAgc21YID0gZS5jbGllbnRYIC0gKHBpY1dpZHRoIC8gMik7XG4gICAgc21ZID0gZS5jbGllbnRZIC0gKHBpY0hlaWdodCAvIDIpO1xuXG4gICAgLy90aGUgYWN0dWFsIHggYW5kIHkgY29vcmluYXRlcywgaW4gaW5jaGVzLCBmcm9tIHRoZSB0b3AgbGVmdFxuICAgIG1MZWZ0ID0gTWF0aC5mbG9vcigoKG15U2l6ZS5teVggKyAoKGUuY2xpZW50WCAtIChteVNpemUud2lkdGggLyAyKSkgKiAoNzIgLyBteVNpemUuc2NhbGUpKSkgLyA3MikgLSAoYWRkUGljLndpZHRoIC8gMikpO1xuICAgIG1Ub3AgPSBNYXRoLmZsb29yKCgobXlTaXplLm15WSArICgoZS5jbGllbnRZIC0gKG15U2l6ZS5oZWlnaHQgLyAyKSkgKiAoNzIgLyBteVNpemUuc2NhbGUpKSkgLyA3MikgLSAoYWRkUGljLmhlaWdodCAvIDIpKTtcblxuICAgIGFkZFBpYy5pbmNoWCA9IG1MZWZ0O1xuICAgIGFkZFBpYy5pbmNoWSA9IG1Ub3A7XG5cbiAgICAvL3NuYXAgdG8gZ3JpZCAvIHNjYWxlXG4gICAgYWRqWCA9ICgoKG15U2l6ZS5teVggKiAobXlTaXplLnNjYWxlIC8gNzIpKSArIGUuY2xpZW50WCAtIChteVNpemUud2lkdGggLyAyKSAtIChwaWNXaWR0aCAvIDIpKSAlIG15U2l6ZS5zY2FsZSk7XG4gICAgYWRqWSA9ICgobXlTaXplLm15WSAqIChteVNpemUuc2NhbGUgLyA3MikpICsgZS5jbGllbnRZIC0gKG15U2l6ZS5oZWlnaHQgLyAyKSAtIChwaWNIZWlnaHQgLyAyKSkgJSBteVNpemUuc2NhbGU7XG5cbiAgICBpZiAoYWRqWCA8IDApIHtcbiAgICAgICAgYWRqWCArPSBteVNpemUuc2NhbGU7XG4gICAgfTtcblxuICAgIGlmIChhZGpZIDwgMCkge1xuICAgICAgICBhZGpZICs9IG15U2l6ZS5zY2FsZTtcbiAgICB9O1xuXG4gICAgc21YIC09IChhZGpYKTtcbiAgICBzbVkgLT0gKGFkalkpO1xuXG4gICAgcG9zSW1nLmNzcyh7IGxlZnQ6IHNtWCArIFwicHhcIiwgdG9wOiBzbVkgKyBcInB4XCIgfSk7XG59O1xuXG4vL2NoZWNrIHRvIHNlZSBpZiBkcmFnZ2VkIHBpY3R1cmUgb3ZlcmxhcHMgb3RoZXJzIG9uIG1vdXNlIHVwXG5mdW5jdGlvbiBjaGVja1NtYWxsQWRkKCkge1xuXG4gICAgcG9zdFZhcnMgPSBhY3RpdmF0ZUNwYW5lbFBsYWNlcigpO1xuXG4gICAgJGouYWpheCh7XG4gICAgICAgIGRhdGE6IHBvc3RWYXJzLFxuICAgICAgICBzdWNjZXNzOiBjaGVja092ZXJsYXAsXG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgdXJsOiAnL21pbGUvYWRkLycsXG4gICAgfSk7XG59O1xuXG4vL3Jlc3BvbnNlIGZyb20gYWpheCwgdG8gc2VlIGlmIHBpYyB3YXMgaW5zZXJ0ZWQgb3Igb3ZlcmxhcHNcbmZ1bmN0aW9uIGNoZWNrT3ZlcmxhcChqc29uKSB7XG4gICAgLy9ub3QgZnJvbSB3YWl0aW5nIGxpc3RcbiAgICBldmFsKCdyZXN1bHQgPSAnICsganNvbik7XG5cbiAgICBpZiAocmVzdWx0LnN1Y2Nlc3MgPT0gdHJ1ZSkge1xuXG4gICAgICAgIHAgPSAkaignIycgKyBzZWxlY3RlZEVsZW1lbnQuaXNTZWxlY3RlZCkucGFyZW50KCk7XG5cbiAgICAgICAgcC5jc3Moe1xuICAgICAgICAgICAgLy96SW5kZXg6IGRlZmF1bHRaSW5kZXgoNTI4MC0ocC5hdHRyKCdtaWxlWScpKSkrKDUyODAtKHAuYXR0cignbWlsZVgnKSkpXG4gICAgICAgICAgICB6SW5kZXg6IGRlZmF1bHRaSW5kZXgocC5hdHRyKCdtaWxlWScpLCBwLmF0dHIoJ21pbGVYJykpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGltYWdlQWRkZWQoKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbW92ZVBsYWNlcigpO1xuICAgIH07XG59O1xuXG5cbi8vbW92ZSBhbiBpbWFnZSB0aGF0IGlzIGFscmVhZHkgcGxhY2VkIG9uIHRoZSBtaWxlXG5mdW5jdGlvbiBtb3ZlKGlkKSB7XG5cbiAgICAvL3JlbW92ZSB0aGUgc2hhZG93XG4gICAgJGooJyNjb250ZW50U2hhZG93JykucmVtb3ZlKCk7XG5cbiAgICAvL3JlbW92ZSB0aGUgd29yZCBiYWxsb29uXG4gICAgJGooJyN3b3JkQmFsbG9vbicpLnJlbW92ZSgpO1xuXG4gICAgLy9zZXQgdXAgdGhlIHBvc2l0aW9uaW5nIGRpdlx0XHRcbiAgICBpZCA9ICdwaWMnICsgaWQ7XG4gICAgbWlsZXBpYyA9ICRqKCcjJyArIGlkKTtcblxuICAgIG1pbGVwaWMuY3NzKHtcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI0QxNkEzOCcsXG4gICAgICAgIGJvcmRlcjogXCIycHggc29saWQgI0QxNkEzOFwiLFxuICAgICAgICBvcGFjaXR5OiAuNSxcbiAgICAgICAgcGFkZGluZ0JvdHRvbTogXCIyMHB4XCJcbiAgICB9KTtcblxuICAgIC8vc2V0IHVwIHRoZSBzY2FsZWQgdGh1bWJcbiAgICAkaignI3NtYWxsQWRkJykucmVtb3ZlKCk7XG5cbiAgICAvL3NldCB1cCB2YXJpYWxiZXMgaW4gZ2xvYmFsIGlkZW50aWZpZXJcbiAgICBhZGRQaWMgPSB7XG4gICAgICAgIGhlaWdodDogTWF0aC5jZWlsKG1pbGVwaWMuYXR0cignaGVpZ2h0JykgLyBteVNpemUuc2NhbGUpLFxuICAgICAgICB3aWR0aDogTWF0aC5jZWlsKG1pbGVwaWMuYXR0cignd2lkdGgnKSAvIG15U2l6ZS5zY2FsZSksXG4gICAgICAgIHNvdXJjZTogbWlsZXBpYy5hdHRyKCdzcmMnKSxcbiAgICAgICAgbW92ZToge1xuICAgICAgICAgICAgeDogbWlsZXBpYy5jc3MoJ2xlZnQnKSxcbiAgICAgICAgICAgIHk6IG1pbGVwaWMuY3NzKCd0b3AnKSxcbiAgICAgICAgICAgIGlkOiBpZFxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBzbWFsbEFkZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXG4gICAgc3JjID0gbWlsZXBpYy5hdHRyKCdzcmMnKTtcblxuICAgICRqKHNtYWxsQWRkKS5hdHRyKHtcbiAgICAgICAgaWQ6ICdzbWFsbEFkZCcsXG4gICAgICAgIHNyYzogc3JjLFxuICAgICAgICB3aWR0aDogKGFkZFBpYy53aWR0aCAqIG15U2l6ZS5zY2FsZSksXG4gICAgICAgIGhlaWdodDogKGFkZFBpYy5oZWlnaHQgKiBteVNpemUuc2NhbGUpXG4gICAgfSkuY3NzKHtcbiAgICAgICAgbGVmdDogbWlsZXBpYy5jc3MoJ2xlZnQnKSxcbiAgICAgICAgdG9wOiBtaWxlcGljLmNzcygndG9wJyksXG4gICAgICAgIHpJbmRleDogNTAwMFxuICAgIH0pO1xuXG4gICAgbWlsZXBpYy5wYXJlbnQoKS5hcHBlbmQoc21hbGxBZGQpO1xuXG4gICAgLy9hY3RpdmF0ZSB0aGUgYWRkIHBpY3R1cmVcbiAgICBkcmFnQWN0aXZhdGUoKTtcbn07XG5cbi8vc2V0IGJyb3dzZXIgaGFzaCB0byBjdXJyZW50IGxvY2F0aW9uXG5mdW5jdGlvbiBzZXRCcm93c2VySGFzaCgpIHtcblxuICAgIHNjYWxlID0gbXlTaXplLnNjYWxlIC8gNzI7XG5cbiAgICBuZXdIYXNoID0gXCJ4PVwiICsgTWF0aC5mbG9vcihteVNpemUubXlYKSArIFwiJnk9XCIgKyBNYXRoLmZsb29yKG15U2l6ZS5teVkpO1xuICAgIG5ld0hhc2ggKz0gXCImcz1cIiArIG15U2l6ZS5zY2FsZTtcblxuICAgIG9sZEhhc2ggPSBteVNpemUuaGFzaDtcblxuICAgIGlmICgobmV3SGFzaCAhPSBvbGRIYXNoKSAmJiAoIWlzTmFOKE1hdGguZmxvb3IobXlTaXplLm15WCkpKSkge1xuICAgICAgICBteVNpemUuaGFzaCA9IFwiI1wiICsgbmV3SGFzaDtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBuZXdIYXNoO1xuICAgIH07XG59O1xuXG4vL2ZsYWcgYW4gb2ZmZW5zaXZlLCBjb3B5aWdodCBpbWFnZSBldGNcbmZ1bmN0aW9uIHN0YXJ0UmVwb3J0KGlkKSB7XG4gICAgY29udGVudCA9IFwiPGgyPldoYXQgZG8geW91IHdhbnQgdG8gcmVwb3J0PzxoMj5cIjtcblxuICAgIGltYWdlID0gJGooJyNwaWMnICsgaWQpLmF0dHIoJ3NyYycpO1xuXG4gICAgdmFyIHBpYyA9IG5ldyBJbWFnZSgpO1xuICAgIHBpYy5zcmMgPSBpbWFnZTtcbiAgICB3aWR0aCA9IHBpYy53aWR0aDtcbiAgICBoZWlnaHQgPSBwaWMuaGVpZ2h0O1xuXG4gICAgaWYgKGFkZFBpYy5oZWlnaHQgPiBhZGRQaWMud2lkdGgpIHtcbiAgICAgICAgdmFyIHNtYWxsSCA9IDIwMDtcbiAgICAgICAgdmFyIHNtYWxsVyA9ICh3aWR0aCAvIGhlaWdodCkgKiAyMDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHNtYWxsVyA9IDIwMDtcbiAgICAgICAgdmFyIHNtYWxsSCA9IChoZWlnaHQgLyB3aWR0aCkgKiAyMDA7XG4gICAgfTtcblxuICAgIGNvbnRlbnQgKz0gJzxpbWcgc3JjPVwiJyArIGltYWdlICsgJ1wiIHN0eWxlPVwiZmxvYXQ6cmlnaHRcIiB3aWR0aD1cIicgKyBzbWFsbFcgKyAnXCIgaGVpZ2h0PVwiJyArIHNtYWxsSCArICdcIi8+JztcblxuICAgIGNvbnRlbnQgKz0gJzxsaT48YSBvbmNsaWNrPVwiZG9GbGFnKCcgKyBpZCArICcsXFwnY29weXJpZ2h0XFwnICk7XCI+Q29weXJpZ2h0ZWQgSW1hZ2U8L2E+PC9saT4nO1xuICAgIGNvbnRlbnQgKz0gJzxsaT48YSBvbmNsaWNrPVwiZG9GbGFnKCcgKyBpZCArICcsXFwnaW1hZ2VcXCcgKTtcIj5JbmFwcHJvcHJpYXRlIEltYWdlPC9hPjwvbGk+JztcbiAgICBjb250ZW50ICs9ICc8bGk+PGEgb25jbGljaz1cImRvRmxhZygnICsgaWQgKyAnLFxcJ2NvbW1lbnRcXCcgKTtcIj5PZmZlbnNpdmUgQ29tbWVudCAvIFNwYW08L2E+PC9saT4nO1xuXG4gICAgY29udGVudCArPSAnPGxpPjxhIG9uY2xpY2s9XCJjbG9zZUxCKCk7XCI+TmV2ZXIgTWluZDwvYT48L2xpPic7XG5cbiAgICAvL25ldyBMaWdodGJveChjb250ZW50LCB0cnVlKTtcbiAgICBuZXcgTGlnaHRib3goe1xuICAgICAgICBjbG9zZTogdHJ1ZSxcbiAgICAgICAgY29udGVudDogY29udGVudCxcbiAgICAgICAgdGl0bGU6ICdSZXBvcnQgYmFkIGNvbnRlbnQnXG4gICAgfSk7XG59O1xuXG5cbi8vL2NwYW5lbCBiZWxvd1xuXG4vL2l0ZW0gZnJvbSBjb250cm9sMSBpcyBjbGlja2VkLCBsb2FkIHN1Ym1lbnVcbmZ1bmN0aW9uIGdldENvbnRyb2wod2hpY2gpIHtcblxuICAgIC8vcmVtb3ZlIHNlbGVjdGVkIGZyb20gb3RoZXJzIFxuICAgICRqKCcjY29udHJvbDEgYScpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgICRqKHRoaXMpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICBpZiAodGhpcy5pZCA9PSAnbWVudV8nICsgd2hpY2gpIHtcbiAgICAgICAgICAgIGFycm93SW5kZXggPSBpbmRleDtcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIC8vYWRkIHNlbGVjdGVkIHN0YXRlIFxuICAgICRqKCcjbWVudV8nICsgd2hpY2gpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuXG4gICAgdmFyIG1zZ1RleHQgPSAnPHVsPic7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNwYW5lbENvbnRyb2xzW3doaWNoXS5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICBtc2dUZXh0ICs9ICc8bGk+JztcbiAgICAgICAgbXNnVGV4dCArPSAnPGEgY2xhc3M9XCInICsgKGFycm93SW5kZXggPT0gKGkgLyAyKSA/ICdzcGVjaWFsJyA6ICcnKSArICdcIiAnICsgY3BhbmVsQ29udHJvbHNbd2hpY2hdW2kgKyAxXSArICc+JyArIGNwYW5lbENvbnRyb2xzW3doaWNoXVtpXTtcbiAgICAgICAgbXNnVGV4dCArPSAnPC9hPjwvbGk+JztcbiAgICB9O1xuXG4gICAgJGooJyNjb250cm9sMicpLmh0bWwobXNnVGV4dCArICc8L3VsPicpO1xufTtcblxuLy9nZXQgaW5mb3JtYXRpb24gYWJvdXQgYSBmcmllbmRcbmZ1bmN0aW9uIGdldEZyaWVuZEluZm8oaWQsIG9iaikge1xuXG4gICAgJGooJyNmcmllbmRQcm9maWxlbWFpbicpLmh0bWwoJ0xvYWRpbmcuLi4nKTtcbiAgICAkaignI2ZyaWVuZEFkZG1haW4nKS5odG1sKCdMb2FkaW5nLi4uJyk7XG4gICAgJGooJyNmcmllbmRDb21tZW50bWFpbicpLmh0bWwoJ0xvYWRpbmcuLi4nKTtcbiAgICAkaignI200Jykuc2xpZGVEb3duKCk7XG5cbiAgICBzZXRUaXRsZSgnbTQnLCBvYmouZ2V0QXR0cmlidXRlKCd1c2VyJykpO1xuICAgIHNldE5hdignbTQnLCAnb2ZmJyk7XG5cbiAgICAkai5hamF4KHtcbiAgICAgICAgdXJsOiAnL3Byb2ZpbGUvcHVibGljJyxcbiAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB1c2VyaWQ6IGlkXG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICByZWNlaXZlRnJpZW5kUHJvZmlsZShkYXRhLCBpZCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbmZ1bmN0aW9uIHJlY2VpdmVGcmllbmRQcm9maWxlKGpzb24sIGlkKSB7XG5cbiAgICBldmFsKCdyZXN1bHQgPSAnICsganNvbik7XG4gICAgcHJvZmlsZSA9IHJlc3VsdC5wcm9maWxlO1xuXG4gICAgJGooJyNmcmllbmRQcm9maWxlbWFpbicpLmh0bWwocHJvZmlsZSk7XG5cbiAgICAvL3NldCB1cCB0aHVtYnMgbWVudSBmb3IgZnJpZW5kIHJlY2VudCBhZGRzXG4gICAgZnJpZW5kUmVjZW50ID0gbmV3IHRodW1ic01lbnUoe1xuICAgICAgICBhY3Rpb246ICcvdGh1bWJzL3JlY2VudEFkZHMnLFxuICAgICAgICB0aXRsZTogJ1JlY2VudGx5IEFkZGVkJyxcbiAgICAgICAgY29udGFpbmVyOiAnZnJpZW5kQWRkJyxcbiAgICAgICAgbGltaXQ6IDQsXG4gICAgICAgIGxpc3RUaHVtYnM6IHJlc3VsdC5hZGRzLFxuICAgICAgICByc3M6ICcvcnNzJyxcbiAgICAgICAgdmFyczogeyB1c2VyaWQ6IGlkIH1cbiAgICB9KTtcblxuICAgIC8vc2V0IHVwIHRodW1icyBtZW51IGZvciBmcmllbmQgcmVjZW50IGNvbW1lbnRzXG4gICAgZnJpZW5kQ29tZW50cyA9IG5ldyB0aHVtYnNNZW51KHtcbiAgICAgICAgYWN0aW9uOiAnL3RodW1icy9yZWNlbnRDb21tZW50cycsXG4gICAgICAgIHRpdGxlOiAnUmVjZW50IENvbW1lbnRzJyxcbiAgICAgICAgY29udGFpbmVyOiAnZnJpZW5kQ29tbWVudCcsXG4gICAgICAgIGxpbWl0OiA0LFxuICAgICAgICBsaXN0VGh1bWJzOiByZXN1bHQuY29tbWVudHMsXG4gICAgICAgIHZhcnM6IHsgdXNlcmlkOiBpZCB9XG4gICAgfSk7XG5cbiAgICAkaignI200Jykuc2xpZGVEb3duKCk7XG59O1xuXG4vL2dldCBmcmllbmRzIG9mIGxvZ2dlZCBpbiB1c2VyXG5mdW5jdGlvbiBnZXRGcmllbmRzKCkge1xuICAgIHVzZXJGcmllbmRzID0gbmV3IHRodW1ic01lbnUoe1xuICAgICAgICBhY3Rpb246ICcvdGh1bWJzL2ZyaWVuZHMnLFxuICAgICAgICB0aXRsZTogJ1lvdXIgRnJpZW5kcycsXG4gICAgICAgIGNvbnRhaW5lcjogJ20yJyxcbiAgICAgICAgcnNzOiAnL3Jzcy9mcmllbmRzL3VzZXJpZC85MydcbiAgICB9KTtcblxuICAgICRqKCcjbTInKS5zbGlkZURvd24oKTtcbn07XG5cbi8vZ2V0IGZhdm9yaXRlcyBvZiBsb2dnZWQgaW4gdXNlclxuZnVuY3Rpb24gZ2V0RmF2ZXMoKSB7XG4gICAgdXNlckZhdmVzID0gbmV3IHRodW1ic01lbnUoe1xuICAgICAgICBhY3Rpb246ICcvdGh1bWJzL2Zhdm9yaXRlcycsXG4gICAgICAgIHRpdGxlOiAnWW91ciBGYXZvcml0ZXMnLFxuICAgICAgICBjb250YWluZXI6ICdtMidcbiAgICB9KTtcblxuICAgICRqKCcjbTInKS5zbGlkZURvd24oKTtcbn07XG5cblxuLy9yZXRyaWV2ZSB1c2VyIGluZm9ybWF0aW9uXG5mdW5jdGlvbiBnZXRBY2NvdW50KCkge1xuXG4gICAgJGooJyNtMm1haW4nKS5odG1sKCdMb2FkaW5nIFlvdXIgQWNjb3VudCBJbmZvLi4uPGJyLz48aW1nIHNyYz1cIi9zdGF0aWMvYWpheC1sb2FkZXIuZ2lmXCIvPicpO1xuICAgICRqKCcjbTJlcnInKS5odG1sKCcnKTtcblxuICAgIHNldFRpdGxlKCdtMicsICdZb3VyIEFjY291bnQgSW5mbycpO1xuICAgIHNldE5hdignbTInLCAnb2ZmJyk7XG5cbiAgICAkaignI20yJykuc2xpZGVEb3duKCk7XG5cbiAgICAkai5hamF4KHtcbiAgICAgICAgdXJsOiAnL3Byb2ZpbGUvYWNjb3VudCcsXG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgc3VjY2VzczogcmVjZWl2ZUFjY291bnRcbiAgICB9KTtcbn07XG5cbi8vcmVjZWl2ZWQgdXNlciBwcm9maWxlIGluZm9cbmZ1bmN0aW9uIHJlY2VpdmVBY2NvdW50KGh0bWwpIHtcblxuICAgIC8vb3V0cHV0IHRvIHNjcmVlblxuICAgICRqKCcjbTJtYWluJykuaHRtbChodG1sKTtcbiAgICAkaignI20yJykuc2xpZGVEb3duKCk7XG59O1xuXG4vL3Rha2VzIG5ldyBwcm9maWxlIGluZm8gYW5kIHNlbmRzIGJhY2sgdG8gc2VydmVyXG5mdW5jdGlvbiBVcGRhdGVQcm9maWxlKCkge1xuICAgIHF1ZXJ5ID0gcHJlcEFycmF5Rm9yQWpheChnZXRGb3JtVmFycygndXNlckFjY291bnQnKSk7XG5cbiAgICAkai5hamF4KHtcbiAgICAgICAgdXJsOiAnL3Byb2ZpbGUvdXBkYXRlLWFjY291bnQnLFxuICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgIGRhdGE6IHF1ZXJ5LFxuICAgICAgICBzdWNjZXNzOiBwcm9maWxlU3VjY2Vzc1xuICAgIH0pO1xuXG59O1xuXG4vL2NhbGxlZCBhZnRlciB1c2VyIHVwZGF0ZXMgYWNjb3VudCBpbmZvcm1hdGlvblxuZnVuY3Rpb24gcHJvZmlsZVN1Y2Nlc3MoanNvbikge1xuXG4gICAgZXZhbCgncmVzdWx0ID0gJyArIGpzb24pO1xuXG4gICAgZm9ybWF0ID0gJyc7XG5cbiAgICBpZiAocmVzdWx0LnN1Y2Nlc3MubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKGkgaW4gcmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIGZvcm1hdCArPSAnPGxpPicgKyByZXN1bHQuc3VjY2Vzc1tpXSArICc8L2xpPic7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIGlmIChyZXN1bHQuZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZm9yIChpIGluIHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICBmb3JtYXQgKz0gJzxsaT4nICsgcmVzdWx0LmVycm9yc1tpXSArICc8L2xpPic7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgJGooJyNtMm1haW4nKS5odG1sKGZvcm1hdCk7XG4gICAgJGooJyNtMicpLnNsaWRlRG93bigpO1xufTtcblxuXG5cblxuLy9ob3RsaW5rIHRvIGFuIGltYWdlLCBzdGVwIDFcbmZ1bmN0aW9uIGFkZEltYWdlKCkge1xuXG4gICAgdmFyIG1zZ1RleHQgPSAnXHQ8aDQ+RW50ZXIgVVJMIG9mIGltYWdlOjwvaDQ+JztcblxuICAgIG1zZ1RleHQgKz0gJ1x0PGZvcm0gYWN0aW9uPVwiamF2YXNjcmlwdDphZGRJbWFnZTIoKTtcIiBuYW1lID1cImFkZEZvcm1cIj4nO1xuICAgIG1zZ1RleHQgKz0gJ1x0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cInN0ZElucHV0XCIgaWQ9XCJpbWdMb2NcIiAvPic7XG4gICAgbXNnVGV4dCArPSAnXHRcdDxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJMaW5rIEl0IVwiIGNsYXNzPVwic3RkQnV0dG9uIGxlZnRNYXJnaW5cIiAvPic7XG4gICAgbXNnVGV4dCArPSAnXHQ8L2Zvcm0+JztcblxuICAgIG1zZ1RleHQgKz0gJ1x0PHNwYW4gY2xhc3M9XCJoZWxwZXJUZXh0XCI+RW50ZXIgZnVsbCBwYXRoIHRvIHRoZSBpbWFnZSwgPGJyLz5lZyBodHRwOi8vd3d3LnNlcnZlci5jb20vcGljLmpwZzwvc3Bhbj4nO1xuXG4gICAgc2V0VGl0bGUoJ20xJywgJ0hvdGxpbmsgdG8gYW4gaW1hZ2Ugb24gdGhlIHdlYicpO1xuICAgIHNldE5hdignbTEnLCAnb2ZmJyk7XG5cbiAgICAkaignI20xbWFpbicpLmh0bWwobXNnVGV4dCk7XG4gICAgJGooJyNtMWVycicpLmh0bWwoKTtcbiAgICAkaignI20xJykuc2xpZGVEb3duKCk7XG59O1xuXG4vL2hvdGxpbmsgdG8gYW4gaW1hZ2UsIHN0ZXAgMlxuZnVuY3Rpb24gYWRkSW1hZ2UyKCkge1xuICAgIGNvbnRlbnRJbnNlcnQgPSAkaignI2ltZ0xvYycpLnZhbCgpO1xuICAgIGlmIChjb250ZW50SW5zZXJ0KSB7XG4gICAgICAgICRqKCcjaW1nTG9jJykudmFsKCcnKTtcbiAgICAgICAgJGouYWpheCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgY29udGVudDogY29udGVudEluc2VydFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHVwbG9hZENvbXBsZXRlLFxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiAnL2NvbnRlbnQvYWRkJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJGooJyNtMW1haW4nKS5odG1sKCdQbGVhc2UgV2FpdCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICRqKCcjbTFlcnInKS5odG1sKCdUcnkgbGlua2luZyB0byBhbiBpbWFnZSBmaWxlJyk7XG4gICAgfTtcbn07XG5cbmZ1bmN0aW9uIHVwbG9hZENvbXBsZXRlKGpzb24pIHtcbiAgICBldmFsKCdyZXN1bHQgPSAnICsganNvbik7XG5cbiAgICBpZiAocmVzdWx0LnN1Y2Nlc3MgPT0gdHJ1ZSkge1xuICAgICAgICByZWFkeVRvQWRkKCcvY29udGVudC9vcmlnaW5hbC8nICsgcmVzdWx0Lm5hbWUsIHJlc3VsdC5kaW1zLndpZHRoLCByZXN1bHQuZGltcy5oZWlnaHQpO1xuXG4gICAgICAgIC8vYWN0aXZhdGUgdGhlIGFkZCBwaWN0dXJlXG4gICAgICAgIGRyYWdBY3RpdmF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICRqKCcjbTFtYWluJykuaHRtbCgnVGhlcmUgd2FzIGFuIGVycm9yIGxvYWRpbmcgdGhlIGZpbGUuICBQbGVhc2UgY2hlY2sgdGhlIGFkZHJlc3MgYW5kIHRyeSBhZ2Fpbi4nKTtcbiAgICB9O1xufTtcblxuLy91cGxvYWQgZnJvbSB5b3VyIGNwdVxuZnVuY3Rpb24gc3RhcnRVcGxvYWQoKSB7XG5cbiAgICBzZXRUaXRsZSgnbTEnLCAnVXBsb2FkIGFuIGltYWdlIGZyb20geW91ciBjb21wdXRlcicpO1xuICAgIHNldE5hdignbTEnLCAnb2ZmJyk7XG5cbiAgICBtc2dUZXh0ID0gXCJUaGUgdXBsb2FkZXIgaXMgbm90IHF1aXRlIHdvcmtpbmcgeWV0ISAgWW91IGNhbiBsaW5rIGFuIGltYWdlIG9uIHRoZSB3ZWIgZm9yIG5vdy5cIjtcblxuICAgICRqKCcjbTFtYWluJykuaHRtbChtc2dUZXh0KTtcbiAgICAkaignI20xZXJyJykuaHRtbCgnJyk7XG5cbiAgICAkaignI20xJykuc2xpZGVEb3duKCk7XG59O1xuXG4vL2dldCB0aGUgbGlzdCBvZiBpbWFnZXMgdGhhdCBhcmUgd2FpdGluZyBmb3IgdGhpcyB1c2VyIFxuLy9mcm9tIHBsdWdpbiBvciBlbWFpbFxudmFyIGdldFdhaXRpbmc7XG5cbmZ1bmN0aW9uIGdldFdhaXRpbmdMaXN0KHN0YXJ0KSB7XG4gICAgZ2V0V2FpdGluZyA9IG5ldyB0aHVtYnNNZW51KHtcbiAgICAgICAgYWN0aW9uOiAnL3RodW1icy93YWl0aW5nJyxcbiAgICAgICAgdGl0bGU6ICdZb3VyIFdhaXRpbmcgTGlzdCcsXG4gICAgICAgIGNvbnRhaW5lcjogJ20yJ1xuICAgIH0pO1xuXG4gICAgJGooJyNtMicpLnNsaWRlRG93bigpO1xufTtcblxuZnVuY3Rpb24gZ2V0UG9wdWxhcihzdGFydCkge1xuXG4gICAgJGooJyNtMm1haW4nKS5odG1sKCdMb2FkaW5nIHBvcHVsYXIuLi4nKTtcbiAgICAkaignI20yJykuc2xpZGVEb3duKCk7XG5cbiAgICBwb3B1bGFyVGh1bWJzID0gbmV3IHRodW1ic01lbnUoe1xuICAgICAgICBhY3Rpb246ICcvdGh1bWJzL3BvcHVsYXInLFxuICAgICAgICB0aXRsZTogJ01vc3QgUG9wdWxhcicsXG4gICAgICAgIGNvbnRhaW5lcjogJ20yJ1xuICAgIH0pO1xufTtcblxuXG5mdW5jdGlvbiBnZXRSZWNlbnQoc3RhcnQpIHtcbiAgICByZWNlbnRUaHVtYnMgPSBuZXcgdGh1bWJzTWVudSh7XG4gICAgICAgIGFjdGlvbjogJy90aHVtYnMvcmVjZW50JyxcbiAgICAgICAgdGl0bGU6ICdSZWNlbnRseSBBZGRlZCcsXG4gICAgICAgIGNvbnRhaW5lcjogJ20yJ1xuICAgIH0pO1xuXG4gICAgJGooJyNtMicpLnNsaWRlRG93bigpO1xufTtcblxuLy9nZXQgdGhlIGNvb3JkaW5hdGVzIGZyb20gdGhlIGNvb3Jkcz1cIlwiIGF0dHJpYnV0ZSBvZiBhbiBlbGVtbnQsIGdvIHRoZXJlXG5mdW5jdGlvbiBmaW5kQ29vcmRzKCkge1xuICAgIHRleHQgPSBcImNvb3JkcyA9IFwiICsgJGoodGhpcykuYXR0cignY29vcmRzJyk7XG4gICAgZXZhbCh0ZXh0KTtcblxuICAgIGdvVG9Mb2MoY29vcmRzKTtcbn07XG5cblxuZnVuY3Rpb24gcmVjRGVsKGpzb24pIHtcblxufTtcblxuLy9vYmplY3QgdG8gaGFuZGxlIGJ1aWxkaW5nIG5leHQgLyBwcmV2IG1lbnUgaXRlbXNcbmZ1bmN0aW9uIHRodW1ic01lbnUodmFycywgY3VzdG9tUXVlcnkpIHtcblxuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICBhY3Rpb246ICdnZXRSZWNlbnQnLCAvL3RoZSBmdW5jdGlvbiB0aGF0IGRvZXMgdGhlIGFqYXggY2FsbFxuICAgICAgICBjb250YWluZXI6ICdtMicsIC8vd2hlcmUgaXQgZ29lc1xuICAgICAgICBpbmRleDogMCwgLy93aGVyZSB3ZSBhcmUgaW4gb3VyIGxpc3RcbiAgICAgICAgbGltaXQ6IDgsIC8vaG93IG1hbnkgdGh1bWJzIGRvIHdlIHNob3cgYXQgb25jZVxuICAgICAgICBsaXN0VGh1bWJzOiBuZXcgQXJyYXkoMCksIC8vaG9sZHMgdGhlIGFyYXkgb2YgdGh1bWJzIC9jb29yZGluYXRlc1xuICAgICAgICByc3M6ICcnLCAvLyB1cmwgdG8gUlNTIGZlZWRcbiAgICAgICAgc2VsZWN0ZWQ6IDAsIC8vd2hpY2ggb25lIHdlIGhhdmUgY2xpY2tlZCBvblxuICAgICAgICB0aXRsZTogJ1RodW1icyBNZW51JywgLy90aGUgdGV4dCB0byBkaXNwbGF5IGluIG1lbnUgaGVhZGVyXG4gICAgICAgIHZhcnM6IHt9IC8vYW55IGV4dHJhIHBvc3QgdmFyYWlibGVzIHRoYXQgZG8gbm90IGNoYW5nZSwgbGlrZSB7dXNlcmlkOiA5fVxuICAgIH07XG5cbiAgICAvL3NldCB2YXJpYWJsZXMgcGFzc2VzIGluIGludG8gdGhlIG9wdGlvblxuICAgIGZvciAoaSBpbiB2YXJzKSB7XG4gICAgICAgIG9wdGlvbnNbaV0gPSB2YXJzW2ldO1xuICAgIH07XG5cbiAgICAvL2RlZmluZSBvdGhlciBwYXJ0cyBvZiB0aGUgbWVudVxuICAgIG9wdGlvbnMudGl0bGVJZCA9ICRqKCcjJyArIG9wdGlvbnMuY29udGFpbmVyICsgXCIgLmNUaXRsZVwiKS5nZXQoMCk7XG4gICAgb3B0aW9ucy5uZXh0SWQgPSBvcHRpb25zLmNvbnRhaW5lciArIFwibmV4dFwiO1xuICAgIG9wdGlvbnMucHJldklkID0gb3B0aW9ucy5jb250YWluZXIgKyBcInByZXZcIjtcbiAgICBvcHRpb25zLm1haW5JZCA9IG9wdGlvbnMuY29udGFpbmVyICsgXCJtYWluXCI7XG5cbiAgICAkaignIycgKyBvcHRpb25zLnByZXZJZCkuY3NzKHsgZGlzcGxheTogJ25vbmUnIH0pO1xuICAgICRqKCcjJyArIG9wdGlvbnMubmV4dElkKS5jc3MoeyBkaXNwbGF5OiAnbm9uZScgfSk7XG5cbiAgICAvL3RvZ2dsZSByc3MgZmVlZFxuICAgIGlmIChvcHRpb25zLnJzcykge1xuICAgICAgICBkaXNwID0gJ2Jsb2NrJztcbiAgICB9IGVsc2Uge1xuICAgICAgICBkaXNwID0gJ25vbmUnO1xuICAgIH07XG5cbiAgICByc3NmZWVkID0gJGooJyMnICsgb3B0aW9ucy5jb250YWluZXIgKyAnIGEuYnRuUlNTJykuY3NzKHsgZGlzcGxheTogZGlzcCB9KTtcblxuICAgIHJzc2ZlZWQuYXR0cignaHJlZicsIG9wdGlvbnMucnNzKTtcblxuICAgIHZhciBhamF4Q2FsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy9zZXQgdGhlIG1lc3NhZ2UgdGl0bGVcblxuICAgICAgICBvcHRpb25zLnRpdGxlSWQuaW5uZXJIVE1MID0gXCJMb2FkaW5nIFwiICsgb3B0aW9ucy50aXRsZSArIFwiLi4uXCI7XG4gICAgICAgICRqKCcjJyArIG9wdGlvbnMubWFpbklkKS5odG1sKCc8aW1nIHNyYz1cIi9zdGF0aWMvYWpheC1sb2FkZXIuZ2lmXCIvPicpO1xuXG4gICAgICAgIHZhciBxdWVyeSA9IFwic3RhcnQ9XCIgKyAob3B0aW9ucy5saXN0VGh1bWJzLmxlbmd0aCkgKyBcIiZcIiArIHByZXBGb3JRdWVyeShvcHRpb25zLnZhcnMpO1xuXG4gICAgICAgICRqLmFqYXgoe1xuICAgICAgICAgICAgZGF0YTogcXVlcnksXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoanNvbikge1xuICAgICAgICAgICAgICAgIGV2YWwoJ3Jlc3VsdCA9ICcgKyBqc29uKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2VzcyA9PSAnZmFsc2UnKSB7XG4gICAgICAgICAgICAgICAgICAgICRqKCcjJyArIG9wdGlvbnMuY29udGFpbmVyICsgJ21haW4nKS5odG1sKHJlc3VsdC5odG1sKTtcblxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnRpdGxlSWQuaW5uZXJIVE1MID0gb3B0aW9ucy50aXRsZTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmNhdFRvKHJlc3VsdCk7XG5cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVybDogb3B0aW9ucy5hY3Rpb25cbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgLy9hZGQgdGhlIG5ldyByZWNvcmRzIHdlIHJlY2VpdmVkIHZpYSBhamF4IHRvIHRoZSBhcnJheVx0XG4gICAgdmFyIGNvbmNhdFRvID0gZnVuY3Rpb24gKG5ld1RodW1icykge1xuICAgICAgICBpZiAobmV3VGh1bWJzLnRodW1icykge1xuICAgICAgICAgICAgb2xkVGh1bWJzID0gb3B0aW9ucy5saXN0VGh1bWJzO1xuXG4gICAgICAgICAgICB4ID0gb2xkVGh1bWJzLmNvbmNhdChuZXdUaHVtYnMudGh1bWJzKTtcblxuICAgICAgICAgICAgb3B0aW9ucy5saXN0VGh1bWJzID0geDtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChuZXdUaHVtYnMuc3RhbXApIHtcbiAgICAgICAgICAgIG9wdGlvbnMudmFycy5zdGFtcCA9IG5ld1RodW1icy5zdGFtcDtcbiAgICAgICAgfTtcblxuICAgICAgICBzZXROYXYoKTtcbiAgICAgICAgZm9ybWF0TmF2KCk7XG4gICAgICAgIGZvcm1hdFRodW1icygpO1xuICAgICAgICBmb3JtYXRUaXRsZSgpO1xuICAgIH07XG5cbiAgICB2YXIgZm9ybWF0VGl0bGUgPSBmdW5jdGlvbiAodGl0bGUpIHtcblxuICAgICAgICBpZiAodGl0bGUpIHtcbiAgICAgICAgICAgIG9wdGlvbnMudGl0bGUgPSB0aXRsZTtcbiAgICAgICAgfTtcblxuICAgICAgICBsZW4gPSAob3B0aW9ucy5pbmRleCArIG9wdGlvbnMubGltaXQpIDwgb3B0aW9ucy5saXN0VGh1bWJzLmxlbmd0aCA/IChvcHRpb25zLmluZGV4ICsgb3B0aW9ucy5saW1pdCkgOiBvcHRpb25zLmxpc3RUaHVtYnMubGVuZ3RoO1xuXG4gICAgICAgIG5ld3RpdGxlID0gb3B0aW9ucy50aXRsZSArIFwiICggXCIgKyAob3B0aW9ucy5pbmRleCArIDEpICsgXCIgLSBcIiArIGxlbiArIFwiIClcIjtcblxuICAgICAgICBvcHRpb25zLnRpdGxlSWQuaW5uZXJIVE1MID0gbmV3dGl0bGU7XG4gICAgfTtcblxuICAgIC8vZGVjaWRlIGlmIG5leHQgYW5kIHByZXYgYnV0dG9ucyBhcmUgdG8gc2hvd1xuICAgIHZhciBzZXROYXYgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgaWYgKG9wdGlvbnMubGlzdFRodW1icy5sZW5ndGggPiAob3B0aW9ucy5pbmRleCArIG9wdGlvbnMubGltaXQpKSB7XG4gICAgICAgICAgICAkaignIycgKyBvcHRpb25zLm5leHRJZCkuY3NzKHsgdmlzaWJpbGl0eTogJ3Zpc2libGUnIH0pO1xuICAgICAgICAgICAgJGooJyMnICsgb3B0aW9ucy5uZXh0SWQpLmNzcyh7IGRpc3BsYXk6ICdpbmxpbmUnIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJGooJyMnICsgb3B0aW9ucy5uZXh0SWQpLmNzcyh7IHZpc2liaWxpdHk6ICdoaWRkZW4nIH0pO1xuICAgICAgICAgICAgJGooJyMnICsgb3B0aW9ucy5uZXh0SWQpLmNzcyh7IGRpc3BsYXk6ICdpbmxpbmUnIH0pO1xuICAgICAgICB9O1xuXG4gICAgfTtcblxuICAgIC8vc2V0IGFjdGlvbiBmb3IgdGhlIHByZXZpb3VzIGFuZCBuZXh0IGJ1dHRvbnNcbiAgICB2YXIgZm9ybWF0TmF2ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIC8vc2V0IHRoZSBuZXh0IGJ1dHRvbiB0byBnbyB0byB0aGUgbmV4dCBzZXQgb2YgdGh1bWJzXG4gICAgICAgICRqKCcjJyArIG9wdGlvbnMubmV4dElkKS51bmJpbmQoJ2NsaWNrJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJGooJyMnICsgb3B0aW9ucy5wcmV2SWQpLmNzcyh7IHZpc2liaWxpdHk6ICd2aXNpYmxlJyB9KTtcbiAgICAgICAgICAgICRqKCcjJyArIG9wdGlvbnMucHJldklkKS5jc3MoeyBkaXNwbGF5OiAnaW5saW5lJyB9KTtcblxuICAgICAgICAgICAgb3B0aW9ucy5pbmRleCArPSBvcHRpb25zLmxpbWl0O1xuICAgICAgICAgICAgZm9ybWF0VGl0bGUoKTtcbiAgICAgICAgICAgIHNldE5hdigpO1xuICAgICAgICAgICAgLy9pZiB3ZSBhcmUgcGFzdCB0aGUgbGltaXQsIGRvIGFub3RoZXIgYWpheCBjYWxsXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5pbmRleCArIG9wdGlvbnMubGltaXQgPj0gKG9wdGlvbnMubGlzdFRodW1icy5sZW5ndGgpKSB7XG4gICAgICAgICAgICAgICAgLy9kaXNhYmxlIHRoZSBuZXh0IGJ1dHRvblxuICAgICAgICAgICAgICAgICRqKCcjJyArIG9wdGlvbnMubmV4dElkKS5jc3MoeyB2aXNpYmlsaXR5OiAnaGlkZGVuJyB9KTtcbiAgICAgICAgICAgICAgICBhamF4Q2FsbCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3JtYXRUaHVtYnMoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG5cblxuICAgICAgICAvL3NldCB0aGUgcHJldiBidXR0b25cbiAgICAgICAgJGooJyMnICsgb3B0aW9ucy5wcmV2SWQpLnVuYmluZCgnY2xpY2snKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBvcHRpb25zLmluZGV4IC09IG9wdGlvbnMubGltaXQ7XG5cbiAgICAgICAgICAgIGZvcm1hdFRpdGxlKCk7XG4gICAgICAgICAgICBzZXROYXYoKTtcblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuaW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgIGZvcm1hdFRodW1icygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmluZGV4ID0gMDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmluZGV4ID09IDApIHtcbiAgICAgICAgICAgICAgICAkaignIycgKyBvcHRpb25zLnByZXZJZCkuY3NzKHsgdmlzaWJpbGl0eTogJ2hpZGRlbicgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy9idWlsZCB0aGUgaHRtbCB0aGF0IGdvZXMgaW50byB3aGF0ZXZlciBkaXZcbiAgICB2YXIgZm9ybWF0VGh1bWJzID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIC8vd2hlcmUgd2UgYXJlIGluIHRoZSBpbmRleCwgcGx1cyB0aGUgbnVtYmVyIG9mIGhvdyBtYW55IHdlIHdhbnQgdG8gc2VlXG4gICAgICAgIGVuZCA9IChvcHRpb25zLmluZGV4ICsgb3B0aW9ucy5saW1pdCkgPCBvcHRpb25zLmxpc3RUaHVtYnMubGVuZ3RoID8gKG9wdGlvbnMuaW5kZXggKyBvcHRpb25zLmxpbWl0KSA6IG9wdGlvbnMubGlzdFRodW1icy5sZW5ndGg7XG5cbiAgICAgICAgLy90aGUgaHRtbCB3ZSBpbnNlcnQgaW50byB0aGUgYXBwcm9wcmlhdGUgbWVudVxuICAgICAgICBvdXRwdXQgPSAnPGRpdj4nO1xuXG4gICAgICAgIC8vYW55IHNjcmlwdHMgdG8gZXZhbCBhZnRlcndhcmRzXG4gICAgICAgIGFmdGVySSA9IFwiXCI7XG5cblxuXG4gICAgICAgIGZvciAoaSA9IG9wdGlvbnMuaW5kZXg7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMubGlzdFRodW1ic1tpXSkge1xuXG4gICAgICAgICAgICAgICAgaWQgPSBvcHRpb25zLm1haW5JZCArICdUaHVtYicgKyBvcHRpb25zLmxpc3RUaHVtYnNbaV1bJ2lkJ107XG5cbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJzxkaXYgY2xhc3M9XCJwYW5lbFRodW1ic1wiIGlkPVwiJyArIGlkICsgJ1wiICc7XG4gICAgICAgICAgICAgICAgLy9hZGQgbG9jYXRpb24gaWYgaXMgaW4gdGhlcmUgLSB3YW50IHRvIGdvIHRvXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMubGlzdFRodW1ic1tpXVsnbG9jWCddKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29vcmRzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgeDogb3B0aW9ucy5saXN0VGh1bWJzW2ldWydsb2NYJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiBvcHRpb25zLmxpc3RUaHVtYnNbaV1bJ2xvY1knXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBvcHRpb25zLmxpc3RUaHVtYnNbaV1bJ2lkJ11cbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJ2Nvb3Jkcz1cXCcnICsgc2VyaWFsKGNvb3JkcykgKyAnXFwnICc7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9hdHRhY2ggbGlzdGVuZXIgdG8gZm9yIGdvIHRvIGxvY1xuICAgICAgICAgICAgICAgICAgICBhZnRlckkgKz0gXCIkaignI1wiICsgaWQgKyBcIicpLmNsaWNrKGZpbmRDb29yZHMpO1wiO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmxpc3RUaHVtYnNbaV1bJ2xvYyddKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vaWYgdGhpcyBpcyB0aGVpciB3YWl0aW5nIGxpc3RcbiAgICAgICAgICAgICAgICAgICAgYWZ0ZXJJICs9IFwiJGooJyNcIiArIGlkICsgXCInKS5jbGljayhmdW5jdGlvbihlKXt3YWl0aW5nTGlzdChlLCBvcHRpb25zLmxpc3RUaHVtYnNbXCIgKyBpICsgXCJdLCBcIiArIGkgKyBcIil9KTtcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMubGlzdFRodW1ic1tpXVsndXNlcmlkJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgLy90aGlzIGlzIHRoZWlyIGZyaWVuZHMgbGlzdFxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJ29uY2xpY2s9XCJnZXRGcmllbmRJbmZvKFxcJycgKyBvcHRpb25zLmxpc3RUaHVtYnNbaV1bJ3VzZXJpZCddICsgJ1xcJywgdGhpcylcIiB1c2VyPVxcJycgKyBvcHRpb25zLmxpc3RUaHVtYnNbaV1bJ3VzZXInXSArICdcXCcgJztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL290aGVyP1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJyAnO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvL2Nsb3NlIHRoZSA8ZGl2IGNsYXNzPVwicGFuZWxUaHVtYnNcIlxuICAgICAgICAgICAgICAgIG91dHB1dCArPSAnPic7XG5cbiAgICAgICAgICAgICAgICAvL3RoZSBhY3R1YWwgdGh1bWJuYWlsIGltYWdlXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMubGlzdFRodW1ic1tpXVsndXNlcmlkJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgLy91c2VyIHBpY1xuICAgICAgICAgICAgICAgICAgICBkaXIgPSAnL3Byb2ZpbGUnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vYW55dGhpbmcgZWxzZVxuICAgICAgICAgICAgICAgICAgICBkaXIgPSAnL3RodW1icyc7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIG91dHB1dCArPSAnXHQ8aW1nIGNsYXNzPVwicGFuZWxUaHVtYlwiIHNyYz1cIi9zdGF0aWMvNzJzcGFjZXIuZ2lmXCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWltYWdlOnVybCgvY29udGVudC8nICsgZGlyICsgJy8nICsgb3B0aW9ucy5saXN0VGh1bWJzW2ldWyd0aHVtYiddICsgJylcIi8+JztcblxuICAgICAgICAgICAgICAgIC8vYWRkIGluIHZvdGUgY291bnQgaWYgdGhlcmVcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5saXN0VGh1bWJzW2ldWyd2b3RlcyddKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSAnXHQ8c3BhbiBjbGFzcz1cImFkZGVkRGF0ZVwiPicgKyBwbHVyYWwob3B0aW9ucy5saXN0VGh1bWJzW2ldWyd2b3RlcyddLCAndm90ZScpICsgJzwvc3Bhbj4nO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvL2FkZCB1c2VyIG5hbWUgaWYgdGhlcmVcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5saXN0VGh1bWJzW2ldWyd1c2VyJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9ICdcdDxzcGFuIGNsYXNzPVwiYWRkZWREYXRlXCI+JyArIG9wdGlvbnMubGlzdFRodW1ic1tpXVsndXNlciddICsgJzwvc3Bhbj4nO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvL2FkZCBpbiBkYXRlIGFkZGVkIGlmIHRoZXJlXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMubGlzdFRodW1ic1tpXVsnZGF0ZSddKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSAnXHQ8c3BhbiBjbGFzcz1cImFkZGVkRGF0ZVwiPicgKyBvcHRpb25zLmxpc3RUaHVtYnNbaV1bJ2RhdGUnXSArICc8L3NwYW4+JztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL2FkZCBvcHRpb24gdG8gZGVsZXRlIGlmIHRoaXMgaXMgd2FpdGluZyBsaXN0IFxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmxpc3RUaHVtYnNbaV1bJ2xvYyddKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSAnXHQ8aW1nIGNsYXNzPVwiZGVsZXRlUGljXCIgaW5keD1cIicgKyBpICsgJ1wiIGRlbD1cIicgKyBvcHRpb25zLmxpc3RUaHVtYnNbaV1bJ2xvYyddICsgJ1wiIHNyYz1cIi9zdGF0aWMvZGVsZXRlUGljLnBuZ1wiIGlkPVwiZGVsJyArIG9wdGlvbnMubGlzdFRodW1ic1tpXVsnaWQnXSArICdcIj4nO1xuICAgICAgICAgICAgICAgICAgICBhZnRlckkgKz0gXCIkaignI2RlbFwiICsgb3B0aW9ucy5saXN0VGh1bWJzW2ldWydpZCddICsgXCInKS5jbGljayhmdW5jdGlvbihlKXtjb25maXJtRGVsZXRlKGUsIG9wdGlvbnMubGlzdFRodW1icyl9KTtcIjtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9ICc8L2Rpdj4nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbmQtLTtcblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcblxuICAgICAgICBvdXRwdXQgKz0gJzxiciBzdHlsZT1cImNsZWFyOmJvdGhcIi8+PC9kaXY+JztcblxuICAgICAgICAkaignIycgKyBvcHRpb25zLm1haW5JZCkuaHRtbChvdXRwdXQpO1xuXG4gICAgICAgIGV2YWwoYWZ0ZXJJKTtcbiAgICB9O1xuXG4gICAgdmFyIHdhaXRpbmdMaXN0ID0gZnVuY3Rpb24gKGUsIG9iaiwgaSkge1xuXG4gICAgICAgICRqKCcjbTFtYWluJykuaHRtbCgnUGxlYXNlIFdhaXQuLi4nKTtcbiAgICAgICAgJGooJyNtMWVycicpLmh0bWwoJycpO1xuICAgICAgICBzZXRUaXRsZSgnbTEnLCAnQWRkIFlvdXIgUGljdHVyZScpO1xuICAgICAgICBzZXROYXYoJ20xJywgJ29mZicpO1xuXG4gICAgICAgIG9wdGlvbnMuc2VsZWN0ZWQgPSBpO1xuXG4gICAgICAgIGltZ2xvYyA9ICcvY29udGVudC9vcmlnaW5hbC8nICsgb2JqLmxvYztcbiAgICAgICAgaGVpZ2h0ID0gb2JqLmhlaWdodDtcbiAgICAgICAgd2lkdGggPSBvYmoud2lkdGg7XG5cbiAgICAgICAgdmFyIHBpYyA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICAgIHBpYy5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYWxlcnQoJ3RoZXJlIHdhcyBhbiBlcnJvciEgc29ycnkhXFxuJyArIGltZ2xvYyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcGljLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgJGooJyNzbWFsbEFkZCcpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICBpZiAoYWRkUGljLm1vdmUuaWQpIHtcbiAgICAgICAgICAgICAgICAkaignIycgKyBhZGRQaWMubW92ZS5pZCkuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyV2lkdGg6ICcwcHgnLFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMHB4J1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgYWRkUGljLm1vdmUgPSB7XG4gICAgICAgICAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICAgICAgICAgIHk6IDAsXG4gICAgICAgICAgICAgICAgICAgIGlkOiAwXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJlYWR5VG9BZGQoaW1nbG9jLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICAgIGRBY3RpdmF0ZSgpO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgcGljLnNyYyA9IGltZ2xvYztcblxuICAgIH07XG5cbiAgICB2YXIgZEFjdGl2YXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvL2FjdGl2YXRlIHRoZSBhZGQgcGljdHVyZSBmb3Igd2lhdGluZyBsaXN0IC0gbm90IHVwbG9hZCAvIGxpbmtcbiAgICAgICAgJGooJyNzbWFsbEFkZCcpLmRyYWdnYWJsZSh7XG4gICAgICAgICAgICBzdGFydDogYWN0aXZhdGVTbWFsbEFkZCxcbiAgICAgICAgICAgIGRyYWc6IHNtYWxsQWRkRHJhZyxcbiAgICAgICAgICAgIHN0b3A6IGNTbWFsbEFkZFxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy9jaGVjayB0byBzZWUgaWYgZHJhZ2dlZCBwaWN0dXJlIG92ZXJsYXBzIG90aGVycyBvbiBtb3VzZSB1cFxuICAgIHZhciBjU21hbGxBZGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vd2FpdGluZyBsaXN0IGFkZFxuICAgICAgICBwb3N0VmFycyA9IGFjdGl2YXRlQ3BhbmVsUGxhY2VyKCk7XG5cbiAgICAgICAgJGouYWpheCh7XG4gICAgICAgICAgICBkYXRhOiBwb3N0VmFycyxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGNPdmVybGFwLFxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiAnL21pbGUvYWRkLydcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgdmFyIGNPdmVybGFwID0gZnVuY3Rpb24gKGpzb24pIHtcbiAgICAgICAgLy9jaGVjayBvdmVybGFwcyBvbiB3aWF0aW5nIGxpc3QgYWRkXG4gICAgICAgIGV2YWwoJ3Jlc3VsdCA9ICcgKyBqc29uKTtcblxuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgLy9yZW1vdmUgZnJvbSB3YWl0aW5nIGxpc3RcbiAgICAgICAgICAgIGkgPSBvcHRpb25zLnNlbGVjdGVkO1xuICAgICAgICAgICAgb3B0aW9ucy5saXN0VGh1bWJzLnNwbGljZShpLCAxKTtcblxuICAgICAgICAgICAgZm9ybWF0VGh1bWJzKCk7XG4gICAgICAgICAgICBpbWFnZUFkZGVkKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZW1vdmVQbGFjZXIoKTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgdmFyIGNvbmZpcm1EZWxldGUgPSBmdW5jdGlvbiAoZSwgb2JqKSB7XG4gICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICAvL21velxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vSUVcbiAgICAgICAgICAgIGUgPSB3aW5kb3cuZXZlbnQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgZGVsID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkZWwnKTtcbiAgICAgICAgaW5keCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnaW5keCcpO1xuXG4gICAgICAgIHVwbG9hZFRleHQgPSAnPGltZyBzcmM9XCIvY29udGVudC9vcmlnaW5hbC8nICsgZGVsICsgJ1wiIGhlaWdodD1cIjEwMFwiIHdpZHRoPVwiMTAwXCIgc3R5bGU9XCJmbG9hdDpsZWZ0O21hcmdpbjoxMHB4XCI+IEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBwaWN0dXJlIGZyb20geW91ciB3YWl0aW5nIGxpc3Q/PGJyLz4nO1xuXG4gICAgICAgIHVwbG9hZFRleHQgKz0gJzxhIGNsYXNzPVwiZmFrZUJ1dHRvblwiIGlkPVwiY29uZmlybURlbGV0ZVwiPlllczwvYT4gPGEgY2xhc3M9XCJmYWtlQnV0dG9uXCI+Tm88L2E+JztcbiAgICAgICAgJGooJyNtMW1haW4nKS5odG1sKHVwbG9hZFRleHQpO1xuXG4gICAgICAgICRqKCcjY29uZmlybURlbGV0ZScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRvRGVsZXRlKGRlbCwgb2JqLCBpbmR4KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2V0VGl0bGUoJ20xJywgJ0NvbmZpcm0gRGVsZXRlJyk7XG4gICAgICAgIHNldE5hdignbTEnLCAnb2ZmJyk7XG5cbiAgICAgICAgJGooJyNtMScpLnNsaWRlRG93bigpO1xuICAgIH07XG5cbiAgICB2YXIgZG9EZWxldGUgPSBmdW5jdGlvbiAoc3JjLCBvYmosIGluZHgpIHtcbiAgICAgICAgJGouYWpheCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgc3JjOiBzcmNcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiByZWNEZWwsXG4gICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICB1cmw6ICcvdGh1bWJzL2RlbGV0ZSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgb2JqLnNwbGljZShpbmR4LCAxKTtcbiAgICAgICAgZm9ybWF0VGh1bWJzKCk7XG5cbiAgICAgICAgaWYgKG9wdGlvbnMubGlzdFRodW1icy5sZW5ndGggPCAob3B0aW9ucy5pbmRleCArIDgpKSB7XG4gICAgICAgICAgICBhamF4Q2FsbCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRqKCcjbTFtYWluJykuaHRtbCgnJyk7XG4gICAgICAgIGNsb3NlQ3BhbmVsKDEpO1xuICAgIH07XG5cbiAgICAvL2xvYWQgaW5pdGlhbCBjb250ZW50XG4gICAgaWYgKCFvcHRpb25zLmxpc3RUaHVtYnMubGVuZ3RoKSB7XG4gICAgICAgIGFqYXhDYWxsKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc2V0TmF2KCk7XG4gICAgICAgIGZvcm1hdFRpdGxlKCk7XG4gICAgICAgIGZvcm1hdE5hdigpO1xuICAgICAgICBmb3JtYXRUaHVtYnMoKTtcbiAgICB9O1xufTtcblxuLy9zaWduIHVwIGZvcm0sIHZhbGlkYXRlIGFsbCBmb3JtIGluZm9cbmZ1bmN0aW9uIHNpZ25VcCgpIHtcblxuICAgIHYgPSBnZXRGb3JtVmFycygnc2lnbnVwJyk7XG5cbiAgICB2YXIgZXJybXNnID0gW107XG5cbiAgICBpZiAoIXYudXNlciB8fCB2LnVzZXIubGVuZ3RoIDwgMikge1xuICAgICAgICBlcnJtc2cucHVzaChcIllvdXIgdXNlciBuYW1lIG11c3QgYmUgYXQgbGVhc3QgMiBjaGFyYWN0ZXJzLlwiKTtcbiAgICB9O1xuXG4gICAgaWYgKHYuZW1haWwgJiYgIWVtYWlsVmFsaWRhdGUodi5lbWFpbCkpIHtcbiAgICAgICAgZXJybXNnLnB1c2goXCJZb3VyIGVtYWlsIGFkZHJlc3MgZG9lcyBub3QgYXBwZWFyIHRvIGJlIHZhbGlkLlwiKTtcbiAgICB9O1xuXG4gICAgaWYgKGVycm1zZy5sZW5ndGggPCAxKSB7XG4gICAgICAgICRqKCcjc2lnbnVwTXNnJykuaHRtbCgnUHJvY2Vzc2luZy4ucGxlYXNlIHdhaXQuLi4nKTtcbiAgICAgICAgJGooJyNzaWdudXBidXR0b24nKS5oaWRlKCk7XG5cbiAgICAgICAgdiA9IHByZXBGb3JRdWVyeSh2KTtcblxuICAgICAgICAkai5hamF4KHtcbiAgICAgICAgICAgIHVybDogJy9wcm9maWxlL3NpZ251cCcsXG4gICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICBkYXRhOiB2LFxuICAgICAgICAgICAgc3VjY2VzczogcmVjZWl2ZVNpZ251cFxuICAgICAgICB9KTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dCA9IFwiUGxlYXNlIGZpeCB0aGUgZm9sbG93aW5nIGVycm9yczogPGJyLz5cIjtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZXJybXNnLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBvdXRwdXQgKz0gZXJybXNnW2ldICsgXCI8YnIvPlwiO1xuICAgICAgICB9O1xuXG4gICAgICAgICRqKCcjc2lnbnVwTXNnJykuaHRtbChvdXRwdXQpO1xuICAgIH07XG5cbn07XG5cbmZ1bmN0aW9uIHJlY2VpdmVTaWdudXAoanNvbikge1xuICAgIGV2YWwoJ3Jlc3VsdCA9ICcgKyBqc29uKTtcblxuICAgIGlmIChyZXN1bHQuZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJGooJyNzaWdudXBidXR0b24nKS5zaG93KCk7XG5cbiAgICAgICAgb3V0cHV0ID0gXCJQbGVhc2UgZml4IHRoZSBmb2xsb3dpbmcgZXJyb3JzOiA8YnIvPlwiO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCByZXN1bHQuZXJyb3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBvdXRwdXQgKz0gcmVzdWx0LmVycm9yc1tpXSArIFwiPGJyLz5cIjtcbiAgICAgICAgfTtcblxuICAgICAgICAkaignI3NpZ251cE1zZycpLmh0bWwob3V0cHV0KTtcblxuICAgIH0gZWxzZSBpZiAocmVzdWx0LnN1Y2Nlc3MgPT0gdHJ1ZSkge1xuXG4gICAgICAgICRqKCdkaXYjY29udHJvbDEnKS5odG1sKHJlc3VsdC5wYW5lbExlZnQpO1xuICAgICAgICAkaignZGl2I2NvbnRyb2wyJykuaHRtbChyZXN1bHQucGFuZWxSaWdodCk7XG5cbiAgICAgICAgY2xvc2VDcGFuZWwoNik7XG4gICAgICAgIGNsb3NlQ3BhbmVsKDUpO1xuXG4gICAgICAgIGFjdGl2YXRlQ3BhbmVsKCk7XG5cbiAgICAgICAgLy9zZXQgdXAgdGhlIHRyYWNraW5nIGludGVydmFsIGFuZCBkbyBpdCBvbmNlIGltbWVkaWF0ZWx5XG4gICAgICAgIHN0YXJ0VHJhY2tpbmcoKTtcbiAgICB9O1xufTtcblxuLy9nZXQgdGhlIHVzZXJzIHByb2ZpbGVcbmZ1bmN0aW9uIGdldFByb2ZpbGUoKSB7XG5cbiAgICAkaignI20ybWFpbicpLmh0bWwoJ0xvYWRpbmcgWW91ciBQcm9maWxlLi4uJyk7XG4gICAgJGooJyNtMicpLnNsaWRlRG93bignbm9ybWFsJyk7XG5cbiAgICBzZXRUaXRsZSgnbTInLCAnTG9hZGluZyBZb3VyIFByb2ZpbGUuLi4nKTtcbiAgICBzZXROYXYoJ20yJywgJ29mZicpO1xuXG4gICAgJGouYWpheCh7XG4gICAgICAgIHVybDogJy9wcm9maWxlL2dldCcsXG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgc3VjY2VzczogcmVjZWl2ZVByb2ZpbGVcbiAgICB9KTtcbn07XG5cbmZ1bmN0aW9uIHJlY2VpdmVQcm9maWxlKGh0bWwpIHtcblxuICAgICRqKCcjbTJtYWluJykuaHRtbChodG1sKTtcblxuICAgIHNldFRpdGxlKCdtMicsICdZb3VyIFByb2ZpbGUnKTtcbiAgICBzZXROYXYoJ20yJywgJ29mZicpO1xuXG4gICAgJGooJyNtMicpLnNsaWRlRG93bigpO1xufTtcblxuZnVuY3Rpb24gb3BlblNlYXJjaCgpIHtcblxuICAgIHNldFRpdGxlKCdtMicsICdTZWFyY2ggRm9yIGFuIEltYWdlJyk7XG4gICAgc2V0TmF2KCdtMicsICdvZmYnKTtcblxuICAgIHZhciBtc2dUZXh0ID0gJzxmb3JtIG5hbWU9XCJzZWFyY2hQYXJhbXNcIiBpZD1cInNlYXJjaFBhcmFtc1wiIGFjdGlvbj1cIi9zZWFyY2hcIiBtZXRob2Q9XCJwb3N0XCI+JztcbiAgICBtc2dUZXh0ICs9ICc8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cInN0ZElucHV0XCIgbmFtZT1cInNlYXJjaFRlcm1cIiBpZD1cInNlYXJjaFRlcm1cIiAvPic7XG4gICAgbXNnVGV4dCArPSAnPGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIlNlYXJjaFwiIGNsYXNzPVwic3RkQnV0dG9uXCIgb25jbGljaz1cInNlbmRTZWFyY2hQYXJtcygpO1wiIC8+JztcbiAgICBtc2dUZXh0ICs9ICc8L2Zvcm0+JztcblxuICAgICRqKCcjbTJtYWluJykuaHRtbChtc2dUZXh0KTtcbiAgICAkaignI20yJykuc2xpZGVEb3duKCk7XG5cbiAgICAkaignZm9ybSNzZWFyY2hQYXJhbXMnKS5zdWJtaXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBzZW5kU2VhcmNoUGFybXMoKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xufTtcblxuXG5cbmZ1bmN0aW9uIHNlbmRTZWFyY2hQYXJtcyh0ZXJtKSB7XG5cbiAgICBzZWFyY2ggPSB0ZXJtID8gdGVybSA6ICRqKCcjc2VhcmNoVGVybScpLnZhbCgpO1xuICAgIHNlYXJjaCA9IGVuY29kZVVSSUNvbXBvbmVudChzZWFyY2gpO1xuXG4gICAgc2VhcmNoVGh1bWJzID0gbmV3IHRodW1ic01lbnUoe1xuICAgICAgICBhY3Rpb246ICcvdGh1bWJzL3NlYXJjaC9xdWVyeS8nICsgc2VhcmNoLFxuICAgICAgICB0aXRsZTogJ1NlYXJjaCBSZXN1bHRzJyxcbiAgICAgICAgY29udGFpbmVyOiAnbTInLFxuICAgICAgICBsaW1pdDogNFxuICAgIH0pO1xuXG4gICAgJGooJyNtMm1haW4nKS5odG1sKCcnKTtcblxuICAgIHNldFRpdGxlKCdtMicsICdTZWFyY2hpbmcuLi4gUGxlYXNlIFdhaXQnKTtcblxuICAgICRqKCcjbTInKS5zbGlkZURvd24oKTtcbn07XG5cbmZ1bmN0aW9uIHJlY2VpdmVTZWFyY2goeG1sKSB7XG4gICAgJGooJyNtM3RpdGxlJykuaHRtbCgnU2VhcmNoIFJlc3VsdHMnKTtcbiAgICAkaignI20zbWFpbicpLmh0bWwoeG1sLnJlc3BvbnNlVGV4dCk7XG5cbiAgICAkaignI20zJykuc2xpZGVEb3duKCk7XG59O1xuXG4vL2dldCB0aGUgaG93IHRvIHNjcmVlbnNcbmZ1bmN0aW9uIGdldEhlbHAoKSB7XG4gICAgbmV3IExpZ2h0Ym94KHtcbiAgICAgICAgY2xvc2U6IHRydWUsXG4gICAgICAgIHVybDogJy9oZWxwL21haW4nLFxuICAgICAgICB0aXRsZTogJ0hlbHAhJ1xuICAgIH0pO1xufTtcblxuLy9nZXQgZm9ybSB0byBzZW5kIGluIHVzZXIgZmVlZGJhY2tcbmZ1bmN0aW9uIHN0YXJ0RmVlZGJhY2soKSB7XG4gICAgbmV3IExpZ2h0Ym94KHtcbiAgICAgICAgY2xvc2U6IHRydWUsXG4gICAgICAgIHVybDogJy9oZWxwL2ZlZWRiYWNrJyxcbiAgICAgICAgdGl0bGU6ICdTZW5kIEZlZWRiYWNrJ1xuICAgIH0pO1xufTtcblxuZnVuY3Rpb24gc2VuZEZlZWRiYWNrKCkge1xuICAgIHZhcnMgPSBwcmVwRm9yUXVlcnkoZ2V0Rm9ybVZhcnMoJ2Zvcm1GZWVkYmFjaycpKVxuXG4gICAgdmFyIHNlbmRGZWVkYmFjayA9IG5ldyBYSENvbm4oKTtcbiAgICBzZW5kRmVlZGJhY2suY29ubmVjdChcImhlbHAvZmVlZGJhY2tcIiwgXCJQT1NUXCIsIHZhcnMsIHJldHVybkZlZWRiYWNrKTtcblxuICAgICRqKCcjZm9ybUZlZWRiYWNrJykuaHRtbCgnUGxlYXNlIFdhaXQuLi4nKTtcbn07XG5cbmZ1bmN0aW9uIHJldHVybkZlZWRiYWNrKGpzb24pIHtcbiAgICBldmFsKCdyZXN1bHQgPSAnICsganNvbi5yZXNwb25zZVRleHQpO1xuICAgICRqKCcjbGlnaHRib3hjb250ZW50JykuaHRtbChyZXN1bHQuaHRtbCk7XG59O1xuXG5mdW5jdGlvbiBnZXRUZXJtcygpIHtcbiAgICBuZXcgTGlnaHRib3goe1xuICAgICAgICBjbG9zZTogdHJ1ZSxcbiAgICAgICAgdXJsOiAnL2hlbHAvdGVybXMnLFxuICAgICAgICB0aXRsZTogJ1Rlcm1zIGFuZCBDb25kaXRpb25zIC8gUHJpdmFjeSBQb2xpY3knXG4gICAgfSk7XG59O1xuXG5mdW5jdGlvbiBnZXRBYm91dCgpIHtcbiAgICBuZXcgTGlnaHRib3goe1xuICAgICAgICBjbG9zZTogdHJ1ZSxcbiAgICAgICAgdXJsOiAnL2hlbHAvYWJvdXQnLFxuICAgICAgICB0aXRsZTogJ0Fib3V0IHRoZSBtaWxlJ1xuICAgIH0pO1xufTtcblxuZnVuY3Rpb24gZ2V0QVBJKCkge1xuICAgIG5ldyBMaWdodGJveCh7XG4gICAgICAgIGNsb3NlOiB0cnVlLFxuICAgICAgICB1cmw6ICdoZWxwL2FwaScsXG4gICAgICAgIHRpdGxlOiAnQVBJIEZvciBEZXZlbG9wZXJzJ1xuICAgIH0pO1xufTtcblxuZnVuY3Rpb24gZXhwYW5kTWV0aG9kKHdoaWNoKSB7XG4gICAgbmV4dCA9IGdldE5leHQod2hpY2gpO1xuICAgIGlmIChuZXh0LnN0eWxlLmRpc3BsYXkgPT0gXCJibG9ja1wiKSB7XG4gICAgICAgIG5leHQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG5leHQuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICB9O1xufTtcblxuLy9saW5rZWQgYW4gaW1hZ2UsIG9yIGZyb20gd2FpdGluZyBsaXN0LlxuZnVuY3Rpb24gcmVhZHlUb0FkZChpbWdsb2MsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAvL3NldCB1cCB2YXJpYWxiZXMgaW4gZ2xvYmFsIGlkZW50aWZpZXJcbiAgICBhZGRQaWMuaGVpZ2h0ID0gTWF0aC5jZWlsKGhlaWdodCAvIDcyKTtcbiAgICBhZGRQaWMud2lkdGggPSBNYXRoLmNlaWwod2lkdGggLyA3Mik7XG4gICAgYWRkUGljLnNvdXJjZSA9IGltZ2xvYztcblxuICAgIC8vc2NhbGUgcGljdHVyZSBwcm9wb3J0aW9uYWxseSBmb3IgdGh1bWJuYWlsXG4gICAgaWYgKGhlaWdodCA+IHdpZHRoKSB7XG4gICAgICAgIHNtYWxsSCA9IDEwMDtcbiAgICAgICAgc21hbGxXID0gKHdpZHRoIC8gaGVpZ2h0KSAqIDEwMDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzbWFsbFcgPSAxMDA7XG4gICAgICAgIHNtYWxsSCA9IChoZWlnaHQgLyB3aWR0aCkgKiAxMDA7XG4gICAgfTtcblxuICAgIC8vZm9ybWF0IGh0bWwgXG4gICAgdXBsb2FkVGV4dCA9ICc8ZGl2IGNsYXNzPVwiZHJhZ0hlbHBcIj4nO1xuICAgIHVwbG9hZFRleHQgKz0gJ1x0PGltZyBzcmM9XCInICsgaW1nbG9jICsgJ1wiIGlkPVwic21hbGxBZGRcIiBzdHlsZT1cIndpZHRoOicgKyBzbWFsbFcgKyAncHg7IGhlaWdodDonICsgc21hbGxIICsgJ3B4O1wiIC8+JztcbiAgICB1cGxvYWRUZXh0ICs9ICdcdDxpbWcgc3JjPVwiL3N0YXRpYy9tb3ZlaWNvbi5wbmdcIi8+PGJyLz4nO1xuICAgIHVwbG9hZFRleHQgKz0gJ1x0RHJhZyBpdCBvbnRvIGFuIGVtcHR5IHNwYWNlIG9uIHRoZSBtaWxlISc7XG4gICAgdXBsb2FkVGV4dCArPSAnPC9kaXY+JztcblxuXG5cbiAgICAkaignI20xbWFpbicpLmh0bWwodXBsb2FkVGV4dCk7XG4gICAgJGooJyNtMScpLnNsaWRlRG93bignbm9ybWFsJyk7XG5cbn07XG5cbi8vYWRkaW5nIHRoZSBpbWFnZSB3YXMgdW5zdWNjZXNzZnVsLlxuZnVuY3Rpb24gcmVtb3ZlUGxhY2VyKCkge1xuICAgICRqKCcjcG9zSW1nJykucmVtb3ZlKCk7XG5cbiAgICBpZiAoYWRkUGljLm1vdmUuaWQpIHtcbiAgICAgICAgJGooJyNzbWFsbEFkZCcpLmNzcyh7XG4gICAgICAgICAgICBsZWZ0OiBhZGRQaWMubW92ZS54LFxuICAgICAgICAgICAgdG9wOiBhZGRQaWMubW92ZS55XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIG9yIHNob290IGJhY2sgcGxhY2VyIHRvIGNwYW5lbFxuICAgICAgICAkaignI3NtYWxsQWRkJykuYW5pbWF0ZSh7XG4gICAgICAgICAgICBsZWZ0OiAnMTkwcHgnLFxuICAgICAgICAgICAgdG9wOiAnMTBweCdcbiAgICAgICAgfSwgMTAwMCk7XG4gICAgfTtcblxuICAgIC8vdGhlcmUgd2VyZSBvdmVybGFwcy4gZmlndXJlIG91dCB3aGVyZSB0aGV5IGFyZSBcbiAgICBudW0gPSByZXN1bHQub3ZlcmxhcC5sZW5ndGg7XG5cbiAgICBvdmVybGFwQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgb3ZlcmxhcENvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2lkJywgJ292ZXJsYXBDb250YWluZXInKTtcblxuICAgIG92ZXJsYXBDb250YWluZXJUb3AgPSBteVNpemUuaGVpZ2h0O1xuICAgIG92ZXJsYXBDb250YWluZXJMZWZ0ID0gbXlTaXplLndpZHRoO1xuICAgIG92ZXJsYXBDb250YWluZXJXaWR0aCA9IDA7XG4gICAgb3ZlcmxhcENvbnRhaW5lckhlaWdodCA9IDA7XG5cbiAgICAkaignI3NxdWFyZW1pbGUnKS5hcHBlbmQob3ZlcmxhcENvbnRhaW5lcik7XG5cbiAgICBvdmVybGFwQ29udGFpbmVyV2lkdGggLT0gKG92ZXJsYXBDb250YWluZXJMZWZ0IC0gbXlTaXplLnNjYWxlKTtcbiAgICBvdmVybGFwQ29udGFpbmVySGVpZ2h0IC09IChvdmVybGFwQ29udGFpbmVyVG9wIC0gbXlTaXplLnNjYWxlKTtcblxuICAgIGZvciAobyBpbiByZXN1bHQub3ZlcmxhcCkge1xuICAgICAgICB4ID0gcmVzdWx0Lm92ZXJsYXBbb11bJ3gnXTtcbiAgICAgICAgeSA9IHJlc3VsdC5vdmVybGFwW29dWyd5J107XG5cbiAgICAgICAgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgbGVmdCA9ICgoeCAqIDcyKSAtIG15U2l6ZS5teVgpICogKG15U2l6ZS5zY2FsZSAvIDcyKSAtIG15U2l6ZS5zY2FsZSArIChteVNpemUud2lkdGggLyAyKTtcbiAgICAgICAgdG9wID0gKCh5ICogNzIpIC0gbXlTaXplLm15WSkgKiAobXlTaXplLnNjYWxlIC8gNzIpIC0gbXlTaXplLnNjYWxlICsgKG15U2l6ZS5oZWlnaHQgLyAyKTtcblxuICAgICAgICBvdmVybGFwQ29udGFpbmVyTGVmdCA9IGxlZnQgPCBvdmVybGFwQ29udGFpbmVyTGVmdCA/IGxlZnQgOiBvdmVybGFwQ29udGFpbmVyTGVmdDtcbiAgICAgICAgb3ZlcmxhcENvbnRhaW5lclRvcCA9IHRvcCA8IG92ZXJsYXBDb250YWluZXJUb3AgPyB0b3AgOiBvdmVybGFwQ29udGFpbmVyVG9wO1xuICAgICAgICBvdmVybGFwQ29udGFpbmVyV2lkdGggPSBsZWZ0ID4gb3ZlcmxhcENvbnRhaW5lcldpZHRoID8gbGVmdCA6IG92ZXJsYXBDb250YWluZXJXaWR0aDtcbiAgICAgICAgb3ZlcmxhcENvbnRhaW5lckhlaWdodCA9IHRvcCA+IG92ZXJsYXBDb250YWluZXJIZWlnaHQgPyB0b3AgOiBvdmVybGFwQ29udGFpbmVySGVpZ2h0O1xuXG4gICAgICAgIGxlZnQgLT0gb3ZlcmxhcENvbnRhaW5lckxlZnQ7XG4gICAgICAgIHRvcCAtPSBvdmVybGFwQ29udGFpbmVyVG9wO1xuXG4gICAgICAgICRqKGRpdikuY3NzKHtcbiAgICAgICAgICAgIGxlZnQ6IGxlZnQgKyAncHgnLFxuICAgICAgICAgICAgdG9wOiB0b3AgKyAncHgnLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI0QxNkEzOCcsXG4gICAgICAgICAgICB3aWR0aDogKG15U2l6ZS5zY2FsZSkgKyAncHgnLFxuICAgICAgICAgICAgaGVpZ2h0OiAobXlTaXplLnNjYWxlKSArICdweCcsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgICAgICB9KTtcblxuICAgICAgICAkaignI292ZXJsYXBDb250YWluZXInKS5hcHBlbmQoZGl2KTtcblxuICAgIH07XG5cbiAgICAkaignI292ZXJsYXBDb250YWluZXInKS5jc3Moe1xuICAgICAgICBsZWZ0OiBvdmVybGFwQ29udGFpbmVyTGVmdCArIFwicHhcIixcbiAgICAgICAgdG9wOiBvdmVybGFwQ29udGFpbmVyVG9wICsgXCJweFwiLFxuICAgICAgICBoZWlnaHQ6IG92ZXJsYXBDb250YWluZXJIZWlnaHQgKyBcInB4XCIsXG4gICAgICAgIHdpZHRoOiBvdmVybGFwQ29udGFpbmVyV2lkdGggKyBcInB4XCJcbiAgICB9KTtcblxuICAgIHNldFRpbWVvdXQoXCIkaignI292ZXJsYXBDb250YWluZXInKS5mYWRlT3V0KCdub3JtYWwnLCBmdW5jdGlvbigpeyRqKCcjb3ZlcmxhcENvbnRhaW5lcicpLnJlbW92ZSgpfSlcIiwgNTAwKTtcblxufTtcblxuZnVuY3Rpb24gaW1hZ2VBZGRlZCgpIHtcblxuICAgICRqKCcjcG9zSW1nJykucmVtb3ZlKCk7XG4gICAgJGooJyNzbWFsbEFkZCcpLnJlbW92ZSgpO1xuXG4gICAgY2xvc2VDcGFuZWwoMSk7XG4gICAgJGooJyNtMW1haW4nKS5odG1sKCcnKTtcblxuICAgIC8vZGJ1ZyhyZXN1bHQuZm9vdCk7XG4gICAgLy93aHkgZG8gaSBoYXZlIHRvIGV2YWwgdGhpcz8gIGl0IGRvZXNudCBsaWtlIHRoZSByZXN1bHQuZm9vdC54IHBhcnQgb3RoZXJ3aXNlLlxuICAgIGV2YWwoJ21ha2VNYXBDYWxsKHsgJyArIHJlc3VsdC5mb290LnggKyAnOicgKyByZXN1bHQuZm9vdC55ICsgJyB9KScpO1xuXG4gICAgaWYgKGFkZFBpYy5tb3ZlLmlkKSB7XG4gICAgICAgIC8vbW92ZWQgYW4gaW1hZ2Ugc3VjY2Vzc2Z1bGx5XG4gICAgICAgICRqKCcjJyArIGFkZFBpYy5tb3ZlLmlkKS5yZW1vdmUoKTtcblxuICAgICAgICBhZGRQaWMubW92ZSA9IHsgeDogMCwgeTogMCwgaWQ6IDAgfTtcbiAgICB9O1xufTtcblxuZnVuY3Rpb24gYWN0aXZhdGVDcGFuZWxQbGFjZXIoKSB7XG5cbiAgICAkaihcIiNwb3NJbWdcIikuYW5pbWF0ZSh7XG4gICAgICAgIG9wYWNpdHk6IDFcbiAgICB9KTtcblxuICAgIHBvc3RWYXJzID0gXCJ3aWR0aD1cIiArIChhZGRQaWMud2lkdGgpO1xuICAgIHBvc3RWYXJzICs9IFwiJmhlaWdodD1cIiArIChhZGRQaWMuaGVpZ2h0KTtcbiAgICBwb3N0VmFycyArPSBcIiZpbmNoWD1cIiArIChhZGRQaWMuaW5jaFgpO1xuICAgIHBvc3RWYXJzICs9IFwiJmluY2hZPVwiICsgKGFkZFBpYy5pbmNoWSk7XG4gICAgcG9zdFZhcnMgKz0gXCImZmlsZUxvYz1cIiArIChhZGRQaWMuc291cmNlKTtcblxuICAgIGlmIChhZGRQaWMubW92ZS5pZCkge1xuICAgICAgICBwb3N0VmFycyArPSBcIiZpZD1cIiArIChhZGRQaWMubW92ZS5pZCk7XG4gICAgfTtcblxuICAgIHJldHVybiBwb3N0VmFycztcbn07XG5cbi8vY2xvc2UgbGlnaHRib3hcbmZ1bmN0aW9uIGNsb3NlTEIoKSB7XG4gICAgJGooJyNsaWdodGJveGJrJykuZmFkZU91dCgnbm9ybWFsJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAkaignI2xpZ2h0Ym94YmsnKS5yZW1vdmUoKTtcbiAgICB9KTtcbn07XG5cbmZ1bmN0aW9uIExpZ2h0Ym94KG9wdGlvbnMpIHtcbiAgICB2YXIgbmV3ZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICBuZXdkaXYuc2V0QXR0cmlidXRlKCdpZCcsICdsaWdodGJveGJrJyk7XG5cbiAgICBsaWdodGJveEh0bWwgPSAnPGltZyBjbGFzcz1cImxic2hhZG93XCIgc3JjPVwiL3N0YXRpYy9zaGFkb3cucG5nXCIvPjxkaXYgaWQ9XCJsaWdodGJveGxpZ2h0XCI+PHNwYW4gY2xhc3M9XCJsaWdodGJveFRpdGxlXCI+JyArIG9wdGlvbnMudGl0bGUgKyAnPC9zcGFuPic7XG5cbiAgICAvL2FkZCBpbml0aWFsIGNvbnRlbnQgXG4gICAgaWYgKCFvcHRpb25zLmNvbnRlbnQpIHtcbiAgICAgICAgb3B0aW9ucy5jb250ZW50ID0gJ0xvYWRpbmcuLi4nO1xuXG4gICAgICAgICRqLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBvcHRpb25zLnVybCxcbiAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlY2VpdmVMYlBvc3RcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgbGlnaHRib3hIdG1sICs9ICc8ZGl2IGlkPVwibGlnaHRib3hjb250ZW50XCI+JyArIG9wdGlvbnMuY29udGVudCArICc8L2Rpdj4nO1xuICAgIGxpZ2h0Ym94SHRtbCArPSAnPC9kaXY+JztcblxuICAgIG5ld2Rpdi5pbm5lckhUTUwgPSBsaWdodGJveEh0bWw7XG5cbiAgICAkaignI2JvZHknKS5hcHBlbmQobmV3ZGl2KTtcblxuICAgIC8vYWRkIHRoZSBjbG9zZSB4IFxuICAgIGlmIChvcHRpb25zLmNsb3NlKSB7XG4gICAgICAgICRqKCcjbGlnaHRib3hsaWdodCcpLmFmdGVyKCc8ZGl2IGlkPVwiY2xvc2VMQlwiIG9uY2xpY2s9XCJjbG9zZUxCKCk7XCI+PC9kaXY+Jyk7XG4gICAgfTtcblxuICAgIC8vc2V0IHRoZSBzaXplIG9mIHRoZSBsaWdodGJveCBjb250ZW50IHRvIG1hdGNoIHRoZSBjb250YWluZXJcbiAgICBzaXplTEIoKTtcbn07XG5cbmZ1bmN0aW9uIHJlY2VpdmVMYlBvc3QoanNvbikge1xuICAgIGV2YWwoXCJyZXN1bHQgPSBcIiArIGpzb24pO1xuXG4gICAgJGooJyNsaWdodGJveGNvbnRlbnQnKS5odG1sKHJlc3VsdC5odG1sKTtcbn07XG5cbmZ1bmN0aW9uIHNpemVMQigpIHtcbiAgICBjb250YWluZXJIZWlnaHQgPSAkaignI2xpZ2h0Ym94bGlnaHQnKS5oZWlnaHQoKTtcbiAgICAkaignI2xpZ2h0Ym94Y29udGVudCcpLmNzcyh7IGhlaWdodDogY29udGFpbmVySGVpZ2h0IC0gMjUgKyBcInB4XCIgfSk7XG59O1xuXG4vL21hcENvb3JkIGlzIGNhbGxlZCB3aGVuIGRvdWJsZSBjbGljayBvbiBzY2FsZWQgbWFwIC0gdHJhdmVscyB0byB0aGF0IGxvY2F0aW9uLlxuZnVuY3Rpb24gbWFwQ29vcmQoZSkge1xuICAgIC8vdmFyIGU9bmV3IE1vdXNlRXZlbnQoZSk7XG5cbiAgICBtYXBYID0gKGUuY2xpZW50WCkgLSAobXlTaXplLndpZHRoIC0gMTkwKTtcbiAgICBtYXBZID0gKGUuY2xpZW50WSkgLSAobXlTaXplLmhlaWdodCAtIDE5MCk7XG5cbiAgICBpZiAobWFwWCA8IDApIHsgbWFwWCA9IDA7IH07XG4gICAgaWYgKG1hcFggPiAxOTApIHsgbWFwWCA9IDE5MDsgfTtcbiAgICBpZiAobWFwWSA+IDE5MCkgeyBtYXBZID0gMTkwOyB9O1xuXG4gICAgLy9nb3RvIHZhcmlhYmxlcyB0byByZWZsZWN0IGNoYW5nZXMgaW4gc2NhbGVcbiAgICBnb3RvWCA9IG1hcFggKiAyNDAwMDtcbiAgICBnb3RvWSA9IG1hcFkgKiAyNDAwMDtcbiAgICAvL2dvIHRvIHRoaXMgbG9jYXRpb25cbiAgICBnb1RvTG9jKGdvdG9YLCBnb3RvWSk7XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcbiJdfQ==
