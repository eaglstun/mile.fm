/*
 *
 */
function zoom( num ) {

    if ( num == 'in' ) {
        num = mySize.scale * 2;
    } else if ( num == 'out' ) {
        num = mySize.scale / 2;
    };

    if ( num > 72 ) {
        num = 72;
    } else if ( num < .0087 ) {
        num = .0087890625;
    };

    if ( num == mySize.scale ) {
        return;
    };

    if ( m = $j( '#mags' ) ) {

        s = ( 72 / num );
        n = Math.log( s ) / Math.log( 2 );

        left = 126 - ( n * 9 );

        m.css( { left: left + "px" } );
    };

    //get the css style sheet 
    if ( document.styleSheets[ 0 ].cssRules ) {
        //correct
        footBlock = document.styleSheets[ 0 ].cssRules[ 0 ].style;
    } else if ( document.styleSheets[ 0 ].rules ) {
        //ie
        footBlock = document.styleSheets[ 0 ].rules[ 0 ].style;
    } else {
        //who knows
        return false;
    };

    if ( num < 18 ) {
        mySize.mag = ( 18 / num );

    } else {
        mySize.mag = 1;
    };

    mySize.scale = num;

    width = ( num * 12 * mySize.mag ) + "px";
    footBlock.height = width;
    footBlock.width = width;

    for ( var x = 0; x < mySize.numCols; x++ ) {
        for ( var y = 0; y < mySize.numRows; y++ ) {

            if ( $j( "#c" + x + "r" + y ) ) {

                $j( "#c" + x + "r" + y ).attr( 'forcereload', 1 ).html( '' );
            };
        };
    };

    //need to reverse the equation, to set the mag x based on the zoom facotr
    leftX = ( 1 / num ) * 72;

    setScreenClass();
};

//initialize feet divs
function buildScreen() {

    //get rid of any divs due to scale or screen size 
    if ( mySize.oldCols > mySize.numCols ) {
        for ( var x = mySize.oldCols; x >= mySize.numCols; x-- ) {
            for ( var y = mySize.oldRows; y >= 0; y-- ) {

                if ( x >= mySize.numCols || y >= mySize.numRows ) {
                    $j( "#c" + x + "r" + y ).remove();
                };

            };
        };
    };

    if ( mySize.oldRows > mySize.numRows ) {
        for ( var y = mySize.oldRows; y >= mySize.numRows; y-- ) {
            for ( var x = mySize.oldCols; x >= 0; x-- ) {
                $j( "#c" + x + "r" + y ).remove();
            };
        };
    };

    for ( var x = 0; x < mySize.numCols; x++ ) {
        for ( var y = 0; y < mySize.numRows; y++ ) {

            if ( $j( "#c" + x + "r" + y ).length == 0 ) {

                var newdiv = document.createElement( 'div' );

                newdiv.setAttribute( 'id', "c" + x + "r" + y );
                newdiv.className = "footBlock";

                $j( '#squaremile' ).append( newdiv );

                $j( "#c" + x + "r" + y ).attr( 'forcereload', 1 );
            };
        };
    };

    moveScreen();

    endMile();
};

//delay loading image into mile div
function loadImage( cls, image ) {
    x = "doLoad('" + cls + "','" + image + "')";
    setTimeout( x, 500 );
};

//load a scaled image into the foot
function doLoad( cls, image ) {

    var obj;

    if ( obj = $j( '.' + cls ) ) {

        pic = new Image();

        pic.onload = function() {
            obj.html( '<img src="' + image + '"/>' );
            obj.css( {
                backgroundImage: 'none',
                backgroundColor: '#D16A38'
            } );
        };

        pic.obj = obj;
        pic.src = image;

    };
};

//handles positioning the foot divs
function moveScreen() {
    scale = mySize.scale / 72;

    xdiff = Math.floor( ( ( mySize.myX ) / mySize.totalWidth ) * scale ) * mySize.numCols * mySize.mag;
    xdiff = xdiff < 0 ? 0 : xdiff;

    ydiff = Math.floor( ( ( mySize.myY ) / mySize.totalHeight ) * scale ) * mySize.numRows * mySize.mag;
    ydiff = ydiff < 0 ? 0 : ydiff;

    adjX = mySize.myX / ( scale );

    //position target on map
    posMap();

    widthDiff = ( mySize.totalWidth - mySize.width ) / 2;
    heightDiff = ( mySize.totalHeight - mySize.height ) / 2;

    var offsetLeftpx = Math.floor( ( ( mySize.myX * scale ) * -1 ) % ( mySize.totalWidth ) ) + ( mySize.width / 2 );
    var offsetToppx = Math.floor( ( ( mySize.myY * scale ) * -1 ) % ( mySize.totalHeight ) ) + ( mySize.height / 2 );
    //offset Left goes from half the screen width(720) down to this minus width of all feet drawn ~ (-2735) 

    if ( mySize.myX < -1 ) {
        var offsetLeftpx = ( ( mySize.myX * -1 ) * scale ) + ( mySize.width / 2 );
    };

    if ( mySize.myY < -1 ) {
        var offsetToppx = ( ( mySize.myY * -1 ) * scale ) + ( mySize.height / 2 );
    };

    offsetLeftpx = isNaN( offsetLeftpx ) ? 0 : offsetLeftpx;
    offsetToppx = isNaN( offsetToppx ) ? 0 : offsetToppx;

    $j( '#offsetLeft' ).css( { left: offsetLeftpx + "px" } );
    $j( '#offsetTop' ).css( { top: offsetToppx + "px" } );

    mySize.offsetLeft = offsetLeftpx;
    mySize.offsetTop = offsetToppx;

    //the limits of left and top value on screen before shifting
    minL = ( 0 - ( widthDiff ) );
    maxL = ( mySize.width + ( widthDiff / 2 ) );

    minT = ( 0 - ( heightDiff / 2 ) );
    maxT = ( mySize.height + ( heightDiff / 2 ) );

    //$j('squaremile').style.backgroundPosition = offsetLeftpx+"px "+offsetToppx+"px";

    for ( var x = 0; x < mySize.numCols; x++ ) {
        for ( var y = 0; y < mySize.numRows; y++ ) {

            //new left is the offset + pixel feet * column we are on
            newLeft = ( ( offsetLeftpx ) + ( x * mySize.oneFoot * mySize.mag ) );
            newTop = ( ( offsetToppx ) + ( y * mySize.oneFoot * mySize.mag ) );

            //this logic takes care of moving divs from left to right, up to down, etc

            if ( newLeft > maxL ) {
                newLeft -= ( mySize.totalWidth );
            } else if ( newLeft < minL ) {
                newLeft += ( mySize.totalWidth );
            };

            if ( newTop > maxT ) {
                newTop -= ( mySize.totalHeight );
            } else if ( newTop < ( 0 - heightDiff ) * mySize.mag ) {
                newTop += ( mySize.totalHeight );
            };
            //end that logic block

            //figure out which foot we are actually looking at	
            var mileX = ( ( newLeft - offsetLeftpx ) / ( ( scale ) * 864 ) ) + 1 + xdiff;
            var mileY = ( ( newTop - offsetToppx ) / ( ( scale ) * 864 ) ) + 1 + ydiff;

            var object = $j( "#c" + x + "r" + y );


            object.css( {
                left: newLeft + "px",
                top: newTop + "px"
            } );

            //reset z index if not selected
            if ( object.attr( 'selected' ) != 'true' ) {
                object.css( {
                    //zIndex: (5280-(mileY))+(5280-(mileX))
                    zIndex: defaultZIndex( mileY, mileX )
                } );
            };

            object.get( 0 ).className = "footBlock " + mileX + "" + mileY;

            if ( counter == 9 && object.html() == "" ) {
                object.attr( {
                    forcereload: 1
                } );
            };

            if ( ( object.attr( 'milex' ) != mileX ) || ( object.attr( 'miley' ) != mileY ) || mySize.travelling == 99 ) {
                object.attr( {
                    forcereload: 1,
                    milex: mileX,
                    miley: mileY
                } );

                object.html( '' );
            };

        };
    };

};

//do the ajax call to load mile content
function makeMapCall( loc ) {
    if ( mySize.scale > 9 ) {
        var arr = loc ? loc : loadArray;

        if ( arr.length > 0 || loc ) {
            postArray = js_array_to_php_array( arr );
        } else {
            return;
        };

        loadFile = "array=" + escape( postArray );
        loadFile += "&scale=" + mySize.scale;

        $j.ajax( {
            url: '/map/get',
            type: 'POST',
            data: loadFile,
            success: insertIntoFoot
        } );

    };
};

function insertIntoFoot( json ) {

    if ( init == false ) {
        init = true;

        $j( '#squaremile' ).css( {
            backgroundColor: '#fff'
        } );
    };

    eval( 'result = ' + json );

    for ( var i in result.feet ) {

        foot = $j( '.' + i );

        if ( foot.get( 0 ) ) {

            content = result.feet[ i ];
            foot.html( content );
            loadImages( i );

            foot.css( { backgroundImage: 'none' } );
        } else {

        };
    };

    for ( var i in result.empty ) {

        foot = $j( '.' + i );
        if ( foot ) {
            foot.html( '<!-- -->' ); //blank will cause reload
            //foot.css({ backgroundImage:'url(static/white.jpg)' });
        };
    };

    if ( selectedElement.toSelect ) {
        doSelect( selectedElement.toSelect );
    };
};

//called to load images from map
function loadImages( footClass ) {

    //console.log(footClass, 'footClass' ); //1143
    // all the images inside of foot
    images = $j( 'div.' + footClass + ' a img' );

    //replace the low res version w full
    //fix this - not preloading
    images.each( function() {
        src = this.src.replace( "/thumbs", "/original" );
        this.src = src;
    } );

    //prevent tiny earl
    foot.click( function() {
        return false;
    } );

};

function js_array_to_php_array( a ) {
    var a_php = "";
    var total = 0;
    for ( var key in a ) {
        total++;
        a_php = a_php + "s:" +
            String( key ).length + ":\"" + String( key ) + "\";s:" +
            String( a[ key ] ).length + ":\"" + String( a[ key ] ) + "\";";
    };
    a_php = "a:" + total + ":{" + a_php + "}";
    return a_php;
};

//make a shadow - elelment is on screen
function makeshadow( picID ) {

    selectedElement.isSelected = picID;
    selectedElement.toSelect = null;

    //image selected
    obj = $j( '#' + picID );
    obj.css( { zIndex: 50 } );

    //the foot image is in
    p = obj.parents( 'div.footBlock' );
    p.css( {
        zIndex: 50000,
        //backgroundColor: '#f00' 
    } ).attr( { selected: 'true' } );

    //create in DOM
    shadow = document.createElement( 'img' );

    $j( shadow ).attr( {
        src: '/static/shadow.png',
        width: ( obj.width() * 1.25 ),
        height: ( obj.height() * 1.25 ),
        id: 'contentShadow'
    } ).css( {
        left: ( parseFloat( obj.css( 'left' ) ) - ( ( obj.width() * 1.25 ) - obj.width() ) / 2 ) + 'px',
        top: ( parseFloat( obj.css( 'top' ) ) - ( ( obj.height() * 1.25 ) - obj.height() ) / 2 ) + 'px',
        zIndex: 49
    } );

    obj.after( shadow );

    //the scale as relative to 72dpi
    scale = ( mySize.scale / 72 );
    pixelFoot = scale * 864;

    //offset left & top
    lft = ( ( parseInt( obj.css( 'left' ) ) ) + ( parseInt( obj.width() ) / 2 ) ) / scale;
    tp = ( ( parseInt( obj.css( 'top' ) ) ) + ( parseInt( obj.height() ) / 2 ) ) / scale;

    var goToCoords = {
        x: mySize.myX,
        y: mySize.myY,
        move: false
    };

    imgpos = obj.offset();
    imgwid = parseInt( obj.width() );
    imghei = parseInt( obj.height() );

    if ( imgpos ) {
        if ( imgpos.left < 0 || ( imgpos.left + imgwid ) > mySize.width ) {
            goToCoords.x = ( ( p.attr( 'mileX' ) - 1 ) * 864 ) + lft;
            goToCoords.move = true;
        }

        if ( imgpos.top < 0 || ( imgpos.top + imghei ) > mySize.height ) {
            goToCoords.y = ( ( p.attr( 'mileY' ) - 1 ) * 864 ) + tp;
            goToCoords.move = true;
        }
    };

    //fix if off bottom of screen
    offsetY = parseInt( obj.height() );
    offsetX = parseInt( obj.width() );

    //adjst for map overlap
    if ( offsetY > mySize.height ) {
        diffY = ( offsetY - mySize.height ) / 2;
        goToCoords[ 'y' ] += diffY;
    } else {
        diffY = 0;
    };

    fig = ( mySize.width - offsetX ) / 2;

    if ( fig < 600 ) {
        diffX = ( 500 - fig );
        goToCoords[ 'x' ] += diffX;
    } else {
        diffX = 0;
    };

    if ( goToCoords.move == true ) {
        //move to prevent overlap w map
        goToLoc( goToCoords );
    } else {
        //in the right spot
    };

    //show the word balloon
    var comments = document.createElement( 'div' );

    $j( comments ).css( {
        left: parseInt( obj.css( 'left' ) ) + parseInt( obj.width() ) - ( 40 * scale ) + "px",
        top: parseInt( obj.css( 'top' ) ) + parseInt( obj.height() ) - 322 + "px"
    } ).attr( {
        id: 'wordBalloon'
    } ).html(
        '<div id="closeBalloon" onclick="doSelect(\'' + picID + '\' );"></div><div id="balloonContent"></div>'
    );

    p.append( comments );

    getComments( picID );

    return true;
};

function defaultZIndex( row, col ) {
    return ( 5280 - row ) + ( 5280 - col );
};

//doubleclick on content function
function doSelect( picID ) {

    selectedElement.toSelect = null;

    //something is selected? deselct it
    if ( o = selectedElement.isSelected ) {

        //the selected image
        $j( '#' + o ).css( {
            zIndex: '1'
        } );

        $j( '#contentShadow' ).remove();
        $j( '#wordBalloon' ).remove();

        //the foot the image is in
        p = $j( '#' + o ).parents( 'div.footBlock' );
        p.css( {
            backgroundColor: 'transparent',
            zIndex: defaultZIndex( p.attr( 'mileY' ), p.attr( 'mileX' ) )
        } );

        if ( selectedElement.isSelected == picID ) {
            selectedElement.isSelected = null;
            return false;
        };
    };

    selectedElement.isSelected = picID;

    if ( $j( '#' + picID ) ) {
        makeshadow( picID );
    };

    return true;
};

//automatic travelling - goes in 10 steps
//called on map double click
function goToLoc( coords ) {
    //coords - array - required:
    //x: x loc in 72 dpi pixels
    //y: y loc in 72 dpi pixels

    //coords optional
    //id: element to select once travel is complete

    //cancel any existing travels
    if ( intInterval ) {
        intInterval = window.clearInterval( intInterval );
    };

    //select something once we get there
    if ( coords[ 'id' ] ) {
        if ( coords[ 'id' ].indexOf( 'pic' ) == -1 ) {
            coords[ 'id' ] = 'pic' + coords[ 'id' ];
        };
        selectedElement.toSelect = coords[ 'id' ];
    };

    mySize.travelling = 1;

    //55 is 10+9+8..etc
    travelX = Math.floor( mySize.myX - coords[ 'x' ] ) / 55;
    travelY = Math.floor( mySize.myY - coords[ 'y' ] ) / 55;

    if ( !isNaN( travelX ) && !isNaN( travelY ) ) {
        intInterval = window.setInterval( "doTravel(travelX, travelY, 10)", 50 );
    } else {
        //dbug('error in goToLoc' );
    };

};

// automatically postitions the map, with parameters set in goToLoc()
function doTravel( travelX, travelY, count ) {

    counter++;

    mySize.myX -= ( travelX * counter );
    mySize.myY -= ( travelY * counter );

    moveScreen();

    if ( counter >= count ) {
        intInterval = window.clearInterval( intInterval );
        counter = 0;
        mySize.travelling = 0;

        endMile();
    };
};

//get all comments for a selected id
function getComments( div ) {

    $j( '#balloonContent' ).html( '<img src="/static/ajax-loader.gif" class="balloonLoader"/>' );

    id = div.replace( /pic/, '' );

    $j.ajax( {
        url: '/map/get-comments',
        type: 'POST',
        data: {
            id: id
        },
        success: returnComments
    } );

};

function returnComments( html ) {
    $j( '#balloonContent' ).html( html );

    //activate comment submit
    $j( 'form#commentForm' ).click( function() {
        submitComment();
    } );

    activeVote();
};

function showComment( id ) {
    $j( 'div.commentSection' ).each( function() {
        $j( this ).css( { display: 'none' } );
    } );

    $j( '#commentSection' + id ).css( { display: 'block' } );

    $j( 'div#commentTabs div.commentTab' ).each( function() {
        $j( this ).addClass( 'deSelected' );
    } );

    $j( '#commentTab' + id ).removeClass( 'deSelected' );
};

//activate the voting block
function activeVote() {
    //attach listeners to voting block
    $j( '#thDown' ).click( parseVote );
    $j( '#thUp' ).click( parseVote );
};

//get a vote
function parseVote() {

    objid = this.getAttribute( 'for' );
    val = this.getAttribute( 'value' );

    //dont do ajax if the is current vote
    if ( !$j( this ).hasClass( 'up' ) ) {
        vote( objid, val );
    };
};

//send a vote in
function vote( objectid, direction ) {
    //direction -1= down, 1 = up

    $j( '#voteBlock' ).html( '<img src="/static/thumbs-loading.png" title="loading..."/>' );

    $j.ajax( {
        url: '/content/vote',
        type: 'POST',
        data: {
            objectid: objectid,
            direction: direction
        },
        success: receiveVote
    } );
};

function receiveVote( json ) {

    eval( 'result = ' + json );

    if ( result.success == true ) {
        $j( '#voteBlock' ).html( result.vote );
        activeVote();
    } else {

    };
};




function getThumb( vote, id ) {
    var voteBlock = "";

    if ( vote == 1 ) {
        voteBlock += '<img src="/static/tup.gif" onclick="vote(' + id + ',-1)"/>';
    } else if ( vote == -1 ) {
        voteBlock += '<img src="/static/tdown.gif" onclick="vote(' + id + ',1)"/>';
    } else {
        voteBlock += '<img src="/static/tdown.gif" onclick="vote(' + id + ',-1)"/>';
        voteBlock += '<img src="/static/tup.gif" onclick="vote(' + id + ',1)"/>';
    };

    return voteBlock;
};

//add a comment to a a section
function addComment() {
    showComment( '3' );
    $j( '#squareComment' ).focus();
};

function addTag() {
    showComment( '4' );
    $j( '#squareTag' ).focus();
};

//submit a comment, put into comment record
function submitComment() {

    var id = $j( '#squareID' ).val();
    var comment = $j( '#squareComment' ).val();

    $j( '#commentBlock' ).html( '<img src="/static/ajax-loader.gif"/>' );

    $j.ajax( {
        url: '/map/comment',
        type: 'POST',
        data: {
            action: 'add',
            id: id,
            comment: comment
        },
        success: returnComments
    } );

};

//submit a tag, put into comment record
function submitTag() {

    var id = $j( '#squareID' ).val();
    var tag = $j( '#squareTag' ).val();

    showComment( '2' );

    $j.ajax( {
        url: '/map/tag',
        type: 'POST',
        data: {
            id: id,
            tag: tag
        },
        success: returnComments
    } );

};

//flag content as innaprropriate
function doFlag( id, reason ) {
    $j.ajax( {
        url: '/map/flag',
        type: 'POST',
        data: {
            objectid: id,
            reason: reason
        },
        success: receiveFlag
    } );
};

function receiveFlag( json ) {
    eval( 'result = ' + json );

    if ( result.msg ) {
        $j( '#lightboxcontent' ).html( result.msg );
    } else {
        closeLB();
    };
};

//do this when pic is missing
function autoFlag( id ) {
    $j.ajax( {
        url: '/map/flag',
        type: 'POST',
        data: {
            objectid: id,
            reason: 'missing'
        },
        success: receiveFlag
    } );
};

function receiveautoFlag( json ) {

};





//random number for goToLoc
function goToRandom() {

    coords = {
        x: Math.random() * 4561920,
        y: Math.random() * 4561920
    };

    goToLoc( coords );
};

//moves the mile when the map target is dragged
function posMile( objectX, objectY ) {
    scale = ( mySize.scale / 72 );

    mySize.myX = Math.floor( objectX * 24010.105 );
    mySize.myY = Math.floor( objectY * 24010.105 );

    moveScreen();
};




function getCoordinates( e ) {

    //get mouse properties
    var e = new MouseEvent( e );

    //relX=(e.x-12)-myX-(mySize.width/2);
    //relY=(e.y-12)-myY-(mySize.height/2);

    //the location of the mouse relative to the top left corner
    //top left (0,0)
    //bottom right (4561919,4561919)
    relX = ( mySize.myX ) + ( e.clientX ) - ( mySize.width / 2 );
    relY = ( mySize.myY ) + ( e.clientY ) - ( mySize.height / 2 );

    //the inch that the mouse is in.
    //top left(1,1)
    //bottom right(63360,63360)
    squareX = Math.ceil( relX / 72 );
    squareY = Math.ceil( relY / 72 );

    //footX and footY refer to square foot sized areas - 1 thru 5280 
    footX = Math.ceil( squareX / 12 );
    footY = Math.ceil( squareY / 12 );

    //the c0r0 div type
    colType = ( ( footX - 1 ) % ( mySize.numCols ) );
    rowType = ( ( footY - 1 ) % ( mySize.numRows ) );

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
    $j( '#smallAdd' ).draggable( {
        start: activateSmallAdd,
        drag: smallAddDrag,
        stop: checkSmallAdd
    } );
};

function activateSmallAdd() {

    //remove the base url
    thumbsrc = ( addPic.source );

    posImg = document.createElement( 'img' );

    $j( posImg ).attr( {
        id: 'posImg',
        src: thumbsrc,
        width: ( addPic.width * mySize.scale ),
        height: ( addPic.height * mySize.scale )
    } ).css( {
        left: '100px',
        top: '100px'
    } );

    $j( '#squaremile' ).append( posImg );

    $j( "#posImg" ).animate( {
        opacity: .5
    } );

};

function smallAddDrag( e ) {
    posImg = $j( '#posImg' );

    picWidth = addPic.width * mySize.scale;
    picHeight = addPic.height * mySize.scale;

    smX = e.clientX - ( picWidth / 2 );
    smY = e.clientY - ( picHeight / 2 );

    //the actual x and y coorinates, in inches, from the top left
    mLeft = Math.floor( ( ( mySize.myX + ( ( e.clientX - ( mySize.width / 2 ) ) * ( 72 / mySize.scale ) ) ) / 72 ) - ( addPic.width / 2 ) );
    mTop = Math.floor( ( ( mySize.myY + ( ( e.clientY - ( mySize.height / 2 ) ) * ( 72 / mySize.scale ) ) ) / 72 ) - ( addPic.height / 2 ) );

    addPic.inchX = mLeft;
    addPic.inchY = mTop;

    //snap to grid / scale
    adjX = ( ( ( mySize.myX * ( mySize.scale / 72 ) ) + e.clientX - ( mySize.width / 2 ) - ( picWidth / 2 ) ) % mySize.scale );
    adjY = ( ( mySize.myY * ( mySize.scale / 72 ) ) + e.clientY - ( mySize.height / 2 ) - ( picHeight / 2 ) ) % mySize.scale;

    if ( adjX < 0 ) {
        adjX += mySize.scale;
    };

    if ( adjY < 0 ) {
        adjY += mySize.scale;
    };

    smX -= ( adjX );
    smY -= ( adjY );

    posImg.css( { left: smX + "px", top: smY + "px" } );
};

//check to see if dragged picture overlaps others on mouse up
function checkSmallAdd() {

    postVars = activateCpanelPlacer();

    $j.ajax( {
        data: postVars,
        success: checkOverlap,
        type: 'POST',
        url: '/mile/add/',
    } );
};

//response from ajax, to see if pic was inserted or overlaps
function checkOverlap( json ) {
    //not from waiting list
    eval( 'result = ' + json );

    if ( result.success == true ) {

        p = $j( '#' + selectedElement.isSelected ).parent();

        p.css( {
            //zIndex: defaultZIndex(5280-(p.attr('mileY')))+(5280-(p.attr('mileX')))
            zIndex: defaultZIndex( p.attr( 'mileY' ), p.attr( 'mileX' ) )
        } );

        imageAdded();

    } else {
        removePlacer();
    };
};


//move an image that is already placed on the mile
function move( id ) {

    //remove the shadow
    $j( '#contentShadow' ).remove();

    //remove the word balloon
    $j( '#wordBalloon' ).remove();

    //set up the positioning div		
    id = 'pic' + id;
    milepic = $j( '#' + id );

    milepic.css( {
        backgroundColor: '#D16A38',
        border: "2px solid #D16A38",
        opacity: .5,
        paddingBottom: "20px"
    } );

    //set up the scaled thumb
    $j( '#smallAdd' ).remove();

    //set up varialbes in global identifier
    addPic = {
        height: Math.ceil( milepic.attr( 'height' ) / mySize.scale ),
        width: Math.ceil( milepic.attr( 'width' ) / mySize.scale ),
        source: milepic.attr( 'src' ),
        move: {
            x: milepic.css( 'left' ),
            y: milepic.css( 'top' ),
            id: id
        }
    };

    var smallAdd = document.createElement( 'img' );

    src = milepic.attr( 'src' );

    $j( smallAdd ).attr( {
        id: 'smallAdd',
        src: src,
        width: ( addPic.width * mySize.scale ),
        height: ( addPic.height * mySize.scale )
    } ).css( {
        left: milepic.css( 'left' ),
        top: milepic.css( 'top' ),
        zIndex: 5000
    } );

    milepic.parent().append( smallAdd );

    //activate the add picture
    dragActivate();
};

//set browser hash to current location
function setBrowserHash() {

    scale = mySize.scale / 72;

    newHash = "x=" + Math.floor( mySize.myX ) + "&y=" + Math.floor( mySize.myY );
    newHash += "&s=" + mySize.scale;

    oldHash = mySize.hash;

    if ( ( newHash != oldHash ) && ( !isNaN( Math.floor( mySize.myX ) ) ) ) {
        mySize.hash = "#" + newHash;
        window.location.hash = newHash;
    };
};

//flag an offensive, copyight image etc
function startReport( id ) {
    content = "<h2>What do you want to report?<h2>";

    image = $j( '#pic' + id ).attr( 'src' );

    var pic = new Image();
    pic.src = image;
    width = pic.width;
    height = pic.height;

    if ( addPic.height > addPic.width ) {
        var smallH = 200;
        var smallW = ( width / height ) * 200;
    } else {
        var smallW = 200;
        var smallH = ( height / width ) * 200;
    };

    content += '<img src="' + image + '" style="float:right" width="' + smallW + '" height="' + smallH + '"/>';

    content += '<li><a onclick="doFlag(' + id + ',\'copyright\' );">Copyrighted Image</a></li>';
    content += '<li><a onclick="doFlag(' + id + ',\'image\' );">Inappropriate Image</a></li>';
    content += '<li><a onclick="doFlag(' + id + ',\'comment\' );">Offensive Comment / Spam</a></li>';

    content += '<li><a onclick="closeLB();">Never Mind</a></li>';

    //new Lightbox(content, true);
    new Lightbox( {
        close: true,
        content: content,
        title: 'Report bad content'
    } );
};


///cpanel below

//item from control1 is clicked, load submenu
function getControl( which ) {

    //remove selected from others 
    $j( '#control1 a' ).each( function( index ) {
        $j( this ).removeClass( 'selected' );
        if ( this.id == 'menu_' + which ) {
            arrowIndex = index;
        };
    } );

    //add selected state 
    $j( '#menu_' + which ).addClass( 'selected' );

    var msgText = '<ul>';

    for ( var i = 0; i < cpanelControls[ which ].length; i += 2 ) {
        msgText += '<li>';
        msgText += '<a class="' + ( arrowIndex == ( i / 2 ) ? 'special' : '' ) + '" ' + cpanelControls[ which ][ i + 1 ] + '>' + cpanelControls[ which ][ i ];
        msgText += '</a></li>';
    };

    $j( '#control2' ).html( msgText + '</ul>' );
};

//get information about a friend
function getFriendInfo( id, obj ) {

    $j( '#friendProfilemain' ).html( 'Loading...' );
    $j( '#friendAddmain' ).html( 'Loading...' );
    $j( '#friendCommentmain' ).html( 'Loading...' );
    $j( '#m4' ).slideDown();

    setTitle( 'm4', obj.getAttribute( 'user' ) );
    setNav( 'm4', 'off' );

    $j.ajax( {
        url: '/profile/public',
        type: 'POST',
        data: {
            userid: id
        },
        success: function( data ) {
            receiveFriendProfile( data, id );
        }
    } );
};

function receiveFriendProfile( json, id ) {

    eval( 'result = ' + json );
    profile = result.profile;

    $j( '#friendProfilemain' ).html( profile );

    //set up thumbs menu for friend recent adds
    friendRecent = new thumbsMenu( {
        action: '/thumbs/recentAdds',
        title: 'Recently Added',
        container: 'friendAdd',
        limit: 4,
        listThumbs: result.adds,
        rss: '/rss',
        vars: { userid: id }
    } );

    //set up thumbs menu for friend recent comments
    friendComents = new thumbsMenu( {
        action: '/thumbs/recentComments',
        title: 'Recent Comments',
        container: 'friendComment',
        limit: 4,
        listThumbs: result.comments,
        vars: { userid: id }
    } );

    $j( '#m4' ).slideDown();
};

//get friends of logged in user
function getFriends() {
    userFriends = new thumbsMenu( {
        action: '/thumbs/friends',
        title: 'Your Friends',
        container: 'm2',
        rss: '/rss/friends/userid/93'
    } );

    $j( '#m2' ).slideDown();
};

//get favorites of logged in user
function getFaves() {
    userFaves = new thumbsMenu( {
        action: '/thumbs/favorites',
        title: 'Your Favorites',
        container: 'm2'
    } );

    $j( '#m2' ).slideDown();
};


//retrieve user information
function getAccount() {

    $j( '#m2main' ).html( 'Loading Your Account Info...<br/><img src="/static/ajax-loader.gif"/>' );
    $j( '#m2err' ).html( '' );

    setTitle( 'm2', 'Your Account Info' );
    setNav( 'm2', 'off' );

    $j( '#m2' ).slideDown();

    $j.ajax( {
        url: '/profile/account',
        type: 'POST',
        success: receiveAccount
    } );
};

//received user profile info
function receiveAccount( html ) {

    //output to screen
    $j( '#m2main' ).html( html );
    $j( '#m2' ).slideDown();
};

//takes new profile info and sends back to server
function UpdateProfile() {
    query = prepArrayForAjax( getFormVars( 'userAccount' ) );

    $j.ajax( {
        url: '/profile/update-account',
        type: 'POST',
        data: query,
        success: profileSuccess
    } );

};

//called after user updates account information
function profileSuccess( json ) {

    eval( 'result = ' + json );

    format = '';

    if ( result.success.length > 0 ) {
        for ( i in result.success ) {
            format += '<li>' + result.success[ i ] + '</li>';
        };
    };

    if ( result.errors.length > 0 ) {
        for ( i in result.success ) {
            format += '<li>' + result.errors[ i ] + '</li>';
        };
    }

    $j( '#m2main' ).html( format );
    $j( '#m2' ).slideDown();
};




//hotlink to an image, step 1
function addImage() {

    var msgText = '	<h4>Enter URL of image:</h4>';

    msgText += '	<form action="javascript:addImage2();" name ="addForm">';
    msgText += '		<input type="text" class="stdInput" id="imgLoc" />';
    msgText += '		<input type="submit" value="Link It!" class="stdButton leftMargin" />';
    msgText += '	</form>';

    msgText += '	<span class="helperText">Enter full path to the image, <br/>eg http://www.server.com/pic.jpg</span>';

    setTitle( 'm1', 'Hotlink to an image on the web' );
    setNav( 'm1', 'off' );

    $j( '#m1main' ).html( msgText );
    $j( '#m1err' ).html();
    $j( '#m1' ).slideDown();
};

//hotlink to an image, step 2
function addImage2() {
    contentInsert = $j( '#imgLoc' ).val();
    if ( contentInsert ) {
        $j( '#imgLoc' ).val( '' );
        $j.ajax( {
            data: {
                content: contentInsert
            },
            success: uploadComplete,
            type: 'POST',
            url: '/content/add',
        } );

        $j( '#m1main' ).html( 'Please Wait' );
    } else {
        $j( '#m1err' ).html( 'Try linking to an image file' );
    };
};

function uploadComplete( json ) {
    eval( 'result = ' + json );

    if ( result.success == true ) {
        readyToAdd( '/content/original/' + result.name, result.dims.width, result.dims.height );

        //activate the add picture
        dragActivate();
    } else {
        $j( '#m1main' ).html( 'There was an error loading the file.  Please check the address and try again.' );
    };
};

//upload from your cpu
function startUpload() {

    setTitle( 'm1', 'Upload an image from your computer' );
    setNav( 'm1', 'off' );

    msgText = "The uploader is not quite working yet!  You can link an image on the web for now.";

    $j( '#m1main' ).html( msgText );
    $j( '#m1err' ).html( '' );

    $j( '#m1' ).slideDown();
};

//get the list of images that are waiting for this user 
//from plugin or email
var getWaiting;

function getWaitingList( start ) {
    getWaiting = new thumbsMenu( {
        action: '/thumbs/waiting',
        title: 'Your Waiting List',
        container: 'm2'
    } );

    $j( '#m2' ).slideDown();
};

//get the coordinates from the coords="" attribute of an elemnt, go there
function findCoords() {
    text = "coords = " + $j( this ).attr( 'coords' );
    eval( text );

    goToLoc( coords );
};


function recDel( json ) {

};



//sign up form, validate all form info
function signUp() {

    v = getFormVars( 'signup' );

    var errmsg = [];

    if ( !v.user || v.user.length < 2 ) {
        errmsg.push( "Your user name must be at least 2 characters." );
    };

    if ( v.email && !emailValidate( v.email ) ) {
        errmsg.push( "Your email address does not appear to be valid." );
    };

    if ( errmsg.length < 1 ) {
        $j( '#signupMsg' ).html( 'Processing..please wait...' );
        $j( '#signupbutton' ).hide();

        v = prepForQuery( v );

        $j.ajax( {
            url: '/profile/signup',
            type: 'post',
            data: v,
            success: receiveSignup
        } );

    } else {
        output = "Please fix the following errors: <br/>";

        for ( i = 0; i < errmsg.length; i++ ) {
            output += errmsg[ i ] + "<br/>";
        };

        $j( '#signupMsg' ).html( output );
    };

};

function receiveSignup( json ) {
    eval( 'result = ' + json );

    if ( result.errors.length > 0 ) {
        $j( '#signupbutton' ).show();

        output = "Please fix the following errors: <br/>";

        for ( i = 0; i < result.errors.length; i++ ) {
            output += result.errors[ i ] + "<br/>";
        };

        $j( '#signupMsg' ).html( output );

    } else if ( result.success == true ) {

        $j( 'div#control1' ).html( result.panelLeft );
        $j( 'div#control2' ).html( result.panelRight );

        closeCpanel( 6 );
        closeCpanel( 5 );

        activateCpanel();

        //set up the tracking interval and do it once immediately
        startTracking();
    };
};

//get the users profile
function getProfile() {

    $j( '#m2main' ).html( 'Loading Your Profile...' );
    $j( '#m2' ).slideDown( 'normal' );

    setTitle( 'm2', 'Loading Your Profile...' );
    setNav( 'm2', 'off' );

    $j.ajax( {
        url: '/profile/get',
        type: 'POST',
        success: receiveProfile
    } );
};

function receiveProfile( html ) {

    $j( '#m2main' ).html( html );

    setTitle( 'm2', 'Your Profile' );
    setNav( 'm2', 'off' );

    $j( '#m2' ).slideDown();
};

function openSearch() {

    setTitle( 'm2', 'Search For an Image' );
    setNav( 'm2', 'off' );

    var msgText = '<form name="searchParams" id="searchParams" action="/search" method="post">';
    msgText += '<input type="text" class="stdInput" name="searchTerm" id="searchTerm" />';
    msgText += '<input type="button" value="Search" class="stdButton" onclick="sendSearchParms();" />';
    msgText += '</form>';

    $j( '#m2main' ).html( msgText );
    $j( '#m2' ).slideDown();

    $j( 'form#searchParams' ).submit( function() {
        sendSearchParms();
        return false;
    } );
};



function sendSearchParms( term ) {

    search = term ? term : $j( '#searchTerm' ).val();
    search = encodeURIComponent( search );

    searchThumbs = new thumbsMenu( {
        action: '/thumbs/search/query/' + search,
        title: 'Search Results',
        container: 'm2',
        limit: 4
    } );

    $j( '#m2main' ).html( '' );

    setTitle( 'm2', 'Searching... Please Wait' );

    $j( '#m2' ).slideDown();
};

function receiveSearch( xml ) {
    $j( '#m3title' ).html( 'Search Results' );
    $j( '#m3main' ).html( xml.responseText );

    $j( '#m3' ).slideDown();
};

//get the how to screens
function getHelp() {
    new Lightbox( {
        close: true,
        url: '/help/main',
        title: 'Help!'
    } );
};

function getTerms() {
    new Lightbox( {
        close: true,
        url: '/help/terms',
        title: 'Terms and Conditions / Privacy Policy'
    } );
};

function getAbout() {
    new Lightbox( {
        close: true,
        url: '/help/about',
        title: 'About the mile'
    } );
};

function getAPI() {
    new Lightbox( {
        close: true,
        url: 'help/api',
        title: 'API For Developers'
    } );
};

function expandMethod( which ) {
    next = getNext( which );
    if ( next.style.display == "block" ) {
        next.style.display = "none";
    } else {
        next.style.display = "block";
    };
};

//linked an image, or from waiting list.
function readyToAdd( imgloc, width, height ) {
    //set up varialbes in global identifier
    addPic.height = Math.ceil( height / 72 );
    addPic.width = Math.ceil( width / 72 );
    addPic.source = imgloc;

    //scale picture proportionally for thumbnail
    if ( height > width ) {
        smallH = 100;
        smallW = ( width / height ) * 100;
    } else {
        smallW = 100;
        smallH = ( height / width ) * 100;
    };

    //format html 
    uploadText = '<div class="dragHelp">';
    uploadText += '	<img src="' + imgloc + '" id="smallAdd" style="width:' + smallW + 'px; height:' + smallH + 'px;" />';
    uploadText += '	<img src="/static/moveicon.png"/><br/>';
    uploadText += '	Drag it onto an empty space on the mile!';
    uploadText += '</div>';



    $j( '#m1main' ).html( uploadText );
    $j( '#m1' ).slideDown( 'normal' );

};

//adding the image was unsuccessful.
function removePlacer() {
    $j( '#posImg' ).remove();

    if ( addPic.move.id ) {
        $j( '#smallAdd' ).css( {
            left: addPic.move.x,
            top: addPic.move.y
        } );
    } else {
        // or shoot back placer to cpanel
        $j( '#smallAdd' ).animate( {
            left: '190px',
            top: '10px'
        }, 1000 );
    };

    //there were overlaps. figure out where they are 
    num = result.overlap.length;

    overlapContainer = document.createElement( 'div' );
    overlapContainer.setAttribute( 'id', 'overlapContainer' );

    overlapContainerTop = mySize.height;
    overlapContainerLeft = mySize.width;
    overlapContainerWidth = 0;
    overlapContainerHeight = 0;

    $j( '#squaremile' ).append( overlapContainer );

    overlapContainerWidth -= ( overlapContainerLeft - mySize.scale );
    overlapContainerHeight -= ( overlapContainerTop - mySize.scale );

    for ( o in result.overlap ) {
        x = result.overlap[ o ][ 'x' ];
        y = result.overlap[ o ][ 'y' ];

        div = document.createElement( 'div' );

        left = ( ( x * 72 ) - mySize.myX ) * ( mySize.scale / 72 ) - mySize.scale + ( mySize.width / 2 );
        top = ( ( y * 72 ) - mySize.myY ) * ( mySize.scale / 72 ) - mySize.scale + ( mySize.height / 2 );

        overlapContainerLeft = left < overlapContainerLeft ? left : overlapContainerLeft;
        overlapContainerTop = top < overlapContainerTop ? top : overlapContainerTop;
        overlapContainerWidth = left > overlapContainerWidth ? left : overlapContainerWidth;
        overlapContainerHeight = top > overlapContainerHeight ? top : overlapContainerHeight;

        left -= overlapContainerLeft;
        top -= overlapContainerTop;

        $j( div ).css( {
            left: left + 'px',
            top: top + 'px',
            backgroundColor: '#D16A38',
            width: ( mySize.scale ) + 'px',
            height: ( mySize.scale ) + 'px',
            position: 'absolute'
        } );

        $j( '#overlapContainer' ).append( div );

    };

    $j( '#overlapContainer' ).css( {
        left: overlapContainerLeft + "px",
        top: overlapContainerTop + "px",
        height: overlapContainerHeight + "px",
        width: overlapContainerWidth + "px"
    } );

    setTimeout( "$j('#overlapContainer').fadeOut('normal', function(){$j('#overlapContainer').remove()})", 500 );

};

function imageAdded() {

    $j( '#posImg' ).remove();
    $j( '#smallAdd' ).remove();

    closeCpanel( 1 );
    $j( '#m1main' ).html( '' );

    //dbug(result.foot);
    //why do i have to eval this?  it doesnt like the result.foot.x part otherwise.
    eval( 'makeMapCall({ ' + result.foot.x + ':' + result.foot.y + ' })' );

    if ( addPic.move.id ) {
        //moved an image successfully
        $j( '#' + addPic.move.id ).remove();

        addPic.move = { x: 0, y: 0, id: 0 };
    };
};

function activateCpanelPlacer() {

    $j( "#posImg" ).animate( {
        opacity: 1
    } );

    postVars = "width=" + ( addPic.width );
    postVars += "&height=" + ( addPic.height );
    postVars += "&inchX=" + ( addPic.inchX );
    postVars += "&inchY=" + ( addPic.inchY );
    postVars += "&fileLoc=" + ( addPic.source );

    if ( addPic.move.id ) {
        postVars += "&id=" + ( addPic.move.id );
    };

    return postVars;
};

//close lightbox
function closeLB() {
    $j( '#lightboxbk' ).fadeOut( 'normal', function() {
        $j( '#lightboxbk' ).remove();
    } );
};

function Lightbox( options ) {
    var newdiv = document.createElement( 'div' );

    newdiv.setAttribute( 'id', 'lightboxbk' );

    lightboxHtml = '<img class="lbshadow" src="/static/shadow.png"/><div id="lightboxlight"><span class="lightboxTitle">' + options.title + '</span>';

    //add initial content 
    if ( !options.content ) {
        options.content = 'Loading...';

        $j.ajax( {
            url: options.url,
            type: 'post',
            success: receiveLbPost
        } );

    };

    lightboxHtml += '<div id="lightboxcontent">' + options.content + '</div>';
    lightboxHtml += '</div>';

    newdiv.innerHTML = lightboxHtml;

    $j( '#body' ).append( newdiv );

    //add the close x 
    if ( options.close ) {
        $j( '#lightboxlight' ).after( '<div id="closeLB" onclick="closeLB();"></div>' );
    };

    //set the size of the lightbox content to match the container
    sizeLB();
};

function receiveLbPost( json ) {
    eval( "result = " + json );

    $j( '#lightboxcontent' ).html( result.html );
};



//mapCoord is called when double click on scaled map - travels to that location.
function mapCoord( e ) {
    //var e=new MouseEvent(e);

    mapX = ( e.clientX ) - ( mySize.width - 190 );
    mapY = ( e.clientY ) - ( mySize.height - 190 );

    if ( mapX < 0 ) { mapX = 0; };
    if ( mapX > 190 ) { mapX = 190; };
    if ( mapY > 190 ) { mapY = 190; };

    //goto variables to reflect changes in scale
    gotoX = mapX * 24000;
    gotoY = mapY * 24000;
    //go to this location
    goToLoc( gotoX, gotoY );
    return false;
};