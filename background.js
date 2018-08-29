'use strict';

browser.browserAction.onClicked.addListener( tab => {
  browser.tabs.sendMessage(
      tab.id,
      { greeting: "Button clicked!" }
    ).then( response => {
      console.log( "Message from the content script:" );
      console.log( response.response );
    }).catch( onError );
});

