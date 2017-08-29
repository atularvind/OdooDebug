function toggleDebug(tab, asset){
    var debug_url = new URL(tab.url);
    if (debug_url.searchParams.has('debug')){
        debug_url.searchParams.delete("debug");
        chrome.browserAction.setIcon({'path': 'debug_off.png'});
    }
    else {
        debug_url.searchParams.set('debug',asset);
        chrome.browserAction.setIcon({'path': 'debug_on.png'});
    }
    chrome.tabs.update(tab.id, {url: debug_url.href});
}

chrome.browserAction.onClicked.addListener(function(tab) {
    toggleDebug(tab);
});

function getCurrentTabUrl(callback) {
    var queryInfo = {
      active: true,
      currentWindow: true
    };
    chrome.tabs.query(queryInfo, function(tabs) {
        var tab = tabs[0];
        callback(tab);
    });
}

chrome.commands.onCommand.addListener(function(command) {
    getCurrentTabUrl(function(tab) {
        if (command == 'toggle-odoo-debug-asset'){
            toggleDebug(tab, asset='asset');
        }
        else{
            toggleDebug(tab, asset=1);
        }
    });
});
