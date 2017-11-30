//object to handle building next / prev menu items
function ThumbsMenu( vars, customQuery ) {

    var options = {
        action: 'getRecent', //the function that does the ajax call
        container: 'm2', //where it goes
        index: 0, //where we are in our list
        limit: 8, //how many thumbs do we show at once
        listThumbs: new Array( 0 ), //holds the aray of thumbs /coordinates
        rss: '', // url to RSS feed
        selected: 0, //which one we have clicked on
        title: 'Thumbs Menu', //the text to display in menu header
        vars: {} //any extra post varaibles that do not change, like {userid: 9}
    };

    //set variables passes in into the option
    for ( var i in vars ) {
        options[ i ] = vars[ i ];
    };

    //define other parts of the menu
    options.titleId = $j( '#' + options.container + " .cTitle" ).get( 0 );
    options.nextId = options.container + "next";
    options.prevId = options.container + "prev";
    options.mainId = options.container + "main";

    $j( '#' + options.prevId ).css( { display: 'none' } );
    $j( '#' + options.nextId ).css( { display: 'none' } );

    //toggle rss feed
    let disp = '';

    if ( options.rss ) {
        disp = 'block';
    } else {
        disp = 'none';
    };

    let rssfeed = $j( '#' + options.container + ' a.btnRSS' ).css( { display: disp } );

    rssfeed.attr( 'href', options.rss );

    var ajaxCall = function() {
        //set the message title

        options.titleId.innerHTML = "Loading " + options.title + "...";
        $j( '#' + options.mainId ).html( '<img src="/static/ajax-loader.gif"/>' );

        options.vars.start = options.listThumbs.length;

        $j.ajax( {
            data: options.vars,
            dataType: 'json',
            type: 'POST',
            success: function( json ) {
                console.log( 'json', json );

                if ( json.success == 'false' ) {
                    $j( '#' + options.container + 'main' ).html( json.html );

                    options.titleId.innerHTML = options.title;

                } else {
                    concatTo( json );
                };
            },
            url: options.action
        } );
    };


    //add the new records we received via ajax to the array	
    var concatTo = function( newThumbs ) {
        if ( newThumbs.thumbs ) {
            oldThumbs = options.listThumbs;

            x = oldThumbs.concat( newThumbs.thumbs );

            options.listThumbs = x;
        } else {

        };

        if ( newThumbs.stamp ) {
            options.vars.stamp = newThumbs.stamp;
        };

        setNav();
        formatNav();
        formatThumbs();
        formatTitle();
    };

    var formatTitle = function( title ) {

        if ( title ) {
            options.title = title;
        };

        let len = ( options.index + options.limit ) < options.listThumbs.length ? ( options.index + options.limit ) : options.listThumbs.length;

        let newtitle = options.title + " ( " + ( options.index + 1 ) + " - " + len + " )";

        options.titleId.innerHTML = newtitle;
    };

    //decide if next and prev buttons are to show
    var setNav = function() {

        if ( options.listThumbs.length > ( options.index + options.limit ) ) {
            $j( '#' + options.nextId ).css( { visibility: 'visible' } );
            $j( '#' + options.nextId ).css( { display: 'inline' } );
        } else {
            $j( '#' + options.nextId ).css( { visibility: 'hidden' } );
            $j( '#' + options.nextId ).css( { display: 'inline' } );
        };

    };

    //set action for the previous and next buttons
    var formatNav = function() {
        //set the next button to go to the next set of thumbs
        $j( '#' + options.nextId ).unbind( 'click' ).click( function() {
            $j( '#' + options.prevId ).css( { visibility: 'visible' } );
            $j( '#' + options.prevId ).css( { display: 'inline' } );

            options.index += options.limit;
            formatTitle();
            setNav();
            //if we are past the limit, do another ajax call
            if ( options.index + options.limit >= ( options.listThumbs.length ) ) {
                //disable the next button
                $j( '#' + options.nextId ).css( { visibility: 'hidden' } );
                ajaxCall();
            } else {
                formatThumbs();
            };

            return false;
        } );


        //set the prev button
        $j( '#' + options.prevId ).unbind( 'click' ).click( function() {
            options.index -= options.limit;

            formatTitle();
            setNav();

            if ( options.index >= 0 ) {
                formatThumbs();
            } else {
                options.index = 0;
            };

            if ( options.index == 0 ) {
                $j( '#' + options.prevId ).css( { visibility: 'hidden' } );
            };
        } );
    };

    //build the html that goes into whatever div
    var formatThumbs = function() {
        //where we are in the index, plus the number of how many we want to see
        let end = ( options.index + options.limit ) < options.listThumbs.length ? ( options.index + options.limit ) : options.listThumbs.length;

        //the html we insert into the appropriate menu
        let output = '<div>';

        //any scripts to eval afterwards
        let afterI = "";

        for ( let i = options.index; i < end; i++ ) {
            if ( options.listThumbs[ i ] ) {

                id = options.mainId + 'Thumb' + options.listThumbs[ i ][ 'id' ];

                output += '<div class="panelThumbs" id="' + id + '" ';
                //add location if is in there - want to go to
                if ( options.listThumbs[ i ][ 'locX' ] ) {

                    coords = {
                        x: options.listThumbs[ i ][ 'locX' ],
                        y: options.listThumbs[ i ][ 'locY' ],
                        id: options.listThumbs[ i ][ 'id' ]
                    };

                    output += 'coords=\'' + serial( coords ) + '\' ';

                    //attach listener to for go to loc
                    afterI += "$j('#" + id + "').click(findCoords);";

                } else if ( options.listThumbs[ i ][ 'loc' ] ) {
                    //if this is their waiting list
                    afterI += "$j('#" + id + "').click(function(e){waitingList(e, options.listThumbs[" + i + "], " + i + ")});";
                } else if ( options.listThumbs[ i ][ 'userid' ] ) {
                    //this is their friends list
                    output += 'onclick="getFriendInfo(\'' + options.listThumbs[ i ][ 'userid' ] + '\', this)" user=\'' + options.listThumbs[ i ][ 'user' ] + '\' ';
                } else {
                    //other?
                    output += ' ';
                };

                //close the <div class="panelThumbs"
                output += '>';

                //the actual thumbnail image
                if ( options.listThumbs[ i ][ 'userid' ] ) {
                    //user pic
                    dir = '/profile';
                } else {
                    //anything else
                    dir = '/thumbs';
                };

                output += '	<img class="panelThumb" src="/static/72spacer.gif" style="background-image:url(/content/' + dir + '/' + options.listThumbs[ i ][ 'thumb' ] + ')"/>';

                //add in vote count if there
                if ( options.listThumbs[ i ][ 'votes' ] ) {
                    output += '	<span class="addedDate">' + plural( options.listThumbs[ i ][ 'votes' ], 'vote' ) + '</span>';
                };

                //add user name if there
                if ( options.listThumbs[ i ][ 'user' ] ) {
                    output += '	<span class="addedDate">' + options.listThumbs[ i ][ 'user' ] + '</span>';
                };

                //add in date added if there
                if ( options.listThumbs[ i ][ 'date' ] ) {
                    output += '	<span class="addedDate">' + options.listThumbs[ i ][ 'date' ] + '</span>';
                }

                //add option to delete if this is waiting list 
                if ( options.listThumbs[ i ][ 'loc' ] ) {
                    output += '	<img class="deletePic" indx="' + i + '" del="' + options.listThumbs[ i ][ 'loc' ] + '" src="/static/deletePic.png" id="del' + options.listThumbs[ i ][ 'id' ] + '">';
                    afterI += "$j('#del" + options.listThumbs[ i ][ 'id' ] + "').click(function(e){confirmDelete(e, options.listThumbs)});";
                };

                output += '</div>';
            } else {
                end--;

            };
        };

        output += '<br style="clear:both"/></div>';

        $j( '#' + options.mainId ).html( output );

        eval( afterI );
    };

    var waitingList = function( e, obj, i ) {

        $j( '#m1main' ).html( 'Please Wait...' );
        $j( '#m1err' ).html( '' );
        setTitle( 'm1', 'Add Your Picture' );
        setNav( 'm1', 'off' );

        options.selected = i;

        imgloc = '/content/original/' + obj.loc;
        height = obj.height;
        width = obj.width;

        var pic = new Image();

        pic.onerror = function() {
            alert( 'there was an error! sorry!\n' + imgloc );
        };

        pic.onload = function() {

            $j( '#smallAdd' ).remove();

            if ( addPic.move.id ) {
                $j( '#' + addPic.move.id ).css( {
                    borderWidth: '0px',
                    opacity: 1,
                    padding: '0px'
                } );

                addPic.move = {
                    x: 0,
                    y: 0,
                    id: 0
                };
            };

            readyToAdd( imgloc, width, height );
            dActivate();
        };


        pic.src = imgloc;

    };

    var dActivate = function() {
        //activate the add picture for wiating list - not upload / link
        $j( '#smallAdd' ).draggable( {
            start: activateSmallAdd,
            drag: smallAddDrag,
            stop: cSmallAdd
        } );
    };

    //check to see if dragged picture overlaps others on mouse up
    var cSmallAdd = function() {
        //waiting list add
        postVars = activateCpanelPlacer();

        $j.ajax( {
            data: postVars,
            success: cOverlap,
            type: 'POST',
            url: '/mile/add/'
        } );

    };

    var cOverlap = function( json ) {
        //check overlaps on wiating list add
        eval( 'result = ' + json );

        if ( result.success == true ) {
            //remove from waiting list
            i = options.selected;
            options.listThumbs.splice( i, 1 );

            formatThumbs();
            imageAdded();
        } else {
            removePlacer();
        };
    };

    var confirmDelete = function( e, obj ) {
        if ( e ) {
            //moz
            e.stopPropagation();
        } else {
            //IE
            e = window.event;
        };

        del = e.target.getAttribute( 'del' );
        indx = e.target.getAttribute( 'indx' );

        uploadText = '<img src="/content/original/' + del + '" height="100" width="100" style="float:left;margin:10px"> Are you sure you want to delete this picture from your waiting list?<br/>';

        uploadText += '<a class="fakeButton" id="confirmDelete">Yes</a> <a class="fakeButton">No</a>';
        $j( '#m1main' ).html( uploadText );

        $j( '#confirmDelete' ).click( function() {
            doDelete( del, obj, indx );
        } );

        setTitle( 'm1', 'Confirm Delete' );
        setNav( 'm1', 'off' );

        $j( '#m1' ).slideDown();
    };

    var doDelete = function( src, obj, indx ) {
        $j.ajax( {
            data: {
                src: src
            },
            success: recDel,
            type: 'post',
            url: '/thumbs/delete'
        } );

        obj.splice( indx, 1 );
        formatThumbs();

        if ( options.listThumbs.length < ( options.index + 8 ) ) {
            ajaxCall();
        };

        $j( '#m1main' ).html( '' );
        closeCpanel( 1 );
    };

    //load initial content
    console.log( 'thumbsmenu options', options );

    if ( !options.listThumbs.length ) {
        ajaxCall();
    } else {
        setNav();
        formatTitle();
        formatNav();
        formatThumbs();
    };
};

module.exports = ThumbsMenu;