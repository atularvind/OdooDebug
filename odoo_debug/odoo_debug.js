function toggleDebug(tab, asset){
    var debug_url = new URL(tab.url);
    if (debug_url.searchParams.has('debug')){
        debug_url.searchParams.delete("debug");
        setIcon('off');
    }
    else {
        debug_url.searchParams.set('debug',asset);
        setIcon('on');
    }
    chrome.tabs.update(tab.id, {url: debug_url.href});
}

function setIcon(icon){
    if (icon==='on'){
        chrome.browserAction.setIcon({'path': 'debug_on.png'});
    }
    else if (icon==='off'){
        chrome.browserAction.setIcon({'path': 'debug_off.png'});
    }
}

function singleClick(tab) {
	toggleDebug(tab, asset=1);
}

function doubleClick(tab) {
	toggleDebug(tab, asset='assets');
}
var cc = 0;
chrome.browserAction.onClicked.addListener(function(tab){
	cc++;
    if (cc === 1) {
        sct = setTimeout(function() {
        	cc = 0;
            singleClick(tab);
        }, 400);
    } else if (cc === 2) {
        clearTimeout(sct);
        cc = 0;
        doubleClick(tab);
    }
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

function isValidURL(str) {
	if (str === undefined){return false;}return true;
}

function changeIcon() {
    chrome.tabs.getSelected(null, function(tab) {
        if (isValidURL(tab.url)) {
            var CurrentUrl = new URL(tab.url);
            if (CurrentUrl.searchParams.has('debug')) {
                chrome.browserAction.setIcon({
                    'path': 'debug_on.png'
                });
            } else {
                chrome.browserAction.setIcon({
                    'path': 'debug_off.png'
                });
            }
        }
    });
}

chrome.tabs.onActivated.addListener(function(tab) {
    chrome.tabs.getSelected(null,function(tab) {
        if (!tab.url){
            setIcon('off');
            return;
        }
        var TabUrl = new URL(tab.url);
        if (TabUrl.searchParams.has('debug')){
            setIcon('on');
        }else {
            setIcon('off');
        }
    })
});


chrome.commands.onCommand.addListener(function(command) {
    getCurrentTabUrl(function(tab) {
        if (command == 'toggle-odoo-debug-asset'){
            toggleDebug(tab, asset='assets');
        }
        else{
            toggleDebug(tab, asset=1);
        }
    });
});
