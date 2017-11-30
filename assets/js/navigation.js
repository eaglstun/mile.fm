let ThumbsMenu = require( './thumbsmenu' );

class Navigation {
    /**
     * 
     * @param {*} start 
     */
    getPopular( start ) {
        $j( '#m2main' ).html( 'Loading popular...' );
        $j( '#m2' ).slideDown();

        let popularThumbs = new ThumbsMenu( {
            action: '/thumbs/popular',
            title: 'Most Popular',
            container: 'm2'
        } );
    };

    /**
     * 
     * @param {*} start 
     */
    getRecent( start ) {
        let recentThumbs = new ThumbsMenu( {
            action: '/thumbs/recent',
            title: 'Recently Added',
            container: 'm2'
        } );

        $j( '#m2' ).slideDown();
    };
}

module.exports = new Navigation;