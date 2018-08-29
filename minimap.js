/**
 * Generate a minimap of the current document.
 * The script does not take sections into account.
 *
 * @return {object} Minimap Contructor.
 */
(function() {
    'use strict';

    /**
     * Header contructor
     *
     * @param {Object} domObject DOM object.
     */
    function Header( domObject ) {

        if ( !( this instanceof Header ) ) {
            return new Header( domObject );
        }

        this.target = domObject;
    }

    /**
     * Fetch and add data to object.
     *
     * @return {Header}
     */
    Header.prototype.fetchHeaderData = function fetchHeaderData() {
        const header = this;

        header.tag   = header.target.tagName.toLowerCase();
        header.title = header.target.innerText;
        header.top   = header.target.getBoundingClientRect().top + window.scrollY;

        return header;
    };

    /**
     * Compute the top position of a header in percentage.
     *
     * @return {Header}
     */
    Header.prototype.percentTop = function percentTop() {

        const header     = this;
        const htmlHeight = document.getElementsByTagName('html')[0].clientHeight;
        const bodyHeight = document.getElementsByTagName('body')[0].clientHeight;
        const height     = bodyHeight > htmlHeight ? bodyHeight : htmlHeight;

        header.top = header.top * 100 / height;

        return header;
    };

    /**
     * Build the DOM structure for minimap headers and existing headers.
     *
     * @param  {Integer} index Index allowing to differentiate the header.
     *
     * @return {Header}
     */
    Header.prototype.build = function build( index ) {
        const header = this;

        header.fetchHeaderData();

        if ( header.title !== '' ) {
            header.targetId = header.target.getAttribute( 'id' ) || `c-minimap__${ header.tag }-${ index }`;

            header.target.setAttribute( 'id', header.targetId );

            header.anchor = document.createElement( 'a' );
            header.anchor.setAttribute( 'title', header.title );
            header.anchor.setAttribute( 'class', `c-minimap__link c-minimap__${ header.tag }` );
            header.anchor.setAttribute( 'href', `${ window.location.pathname }#${ header.targetId }` );
            header.anchor.style.top = `${ header.percentTop().top }%`;
        }

        return header;
    };

    /**
     * Minimap contructor
     *
     * @return {Minimap}
     */
    function Minimap() {

        if ( !( this instanceof Minimap ) ) {
            return new Minimap();
        }
    }

    /**
     * Build the minimap.
     *
     * @return {Minimap}
     */
    Minimap.prototype.build = function build() {
        const minimap = this;

        minimap.headers  = [];
        minimap.$headers = document.querySelectorAll( 'h1, h2, h3, h4, h5, h6' );

        minimap.$headers.forEach( ( header, index ) => {
            const item = document.createElement( 'li' );
            const headerAvatar = new Header( header ).build( index ).anchor;

            if ( headerAvatar ) {
                item.appendChild( headerAvatar );

                minimap.headers.push( item );
            }
        });

        if ( minimap.headers.length !== 0 ) {
            const body = document.getElementsByTagName( 'body' )[ 0 ];
            const firstChild = body.children[ 0 ];

            minimap.container = document.createElement( 'ul' );
            minimap.container.classList.add( 'c-minimap' );
            minimap.container.append( ...minimap.headers );

            body.insertBefore( minimap.container, firstChild );
        }

        return minimap;
    };

    /**
     * Initialize Minimap.
     *
     * @return {Minimap}
     */
    Minimap.prototype.init = function init() {
        const minimap = this;

        minimap.build();

        return minimap;
    };

    return new Minimap().init();
})();

browser.runtime.onMessage.addListener( request => {
  const minimapClasses = document.querySelectorAll( '.c-minimap' )[ 0 ].classList;

  minimapClasses.toggle( 'c-minimap--show' );

  return Promise.resolve();
});
