let $ = require( 'jquery' );
let Nav = require( './navigation' );
let ThumbsMenu = require( './thumbsmenu' );

console.log( 'Nav', Nav );

// Navigation > Highest Voted
$( 'ul.submenu a.highestvoted' ).on( 'click', ( e ) => {
    Nav.getPopular( 0 );
    e.preventDefault();
} );

// Navigation > Recently Added
$( 'ul.submenu a.recentlyadded' ).on( 'click', ( e ) => {
    Nav.getRecent( 0 );
    e.preventDefault();
} );

// X buttons
$( 'a.btnX' ).on( 'click', ( e ) => {
    Nav.closePanel( e.target );
    e.preventDefault();
} );