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

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({'foo': 'hello', 'bar': 'hi'}, function() {
      console.log('Settings saved');
  });
  chrome.storage.sync.get(['foo', 'bar'], function(items) {
      console.log('Settings retrieved', items);
  });
});

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
            toggleDebug(tab, asset='asset');
        }
        else if(command == 'edit'){
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.executeScript(tab.id,{code: 'var action = "etfk";'}, function() {
                    chrome.tabs.executeScript(tab.id, {file: 'content.js'});
                });
            });
        }
        else{
            toggleDebug(tab, asset=1);
        }
    });
});
