function toggleDebug(tab, asset) {
    let debug_url = new URL(tab.url);
    if (debug_url.searchParams.has('debug')) {
        debug_url.searchParams.delete("debug");
        setIcon('off');
    } else {
        debug_url.searchParams.set('debug', asset);
        setIcon('on');
    }
    chrome.tabs.update(tab.id, { url: debug_url.href });
}

function setIcon(icon) {
    let iconPath = icon === 'on' ? 'debug_on.png' : 'debug_off.png';
    chrome.action.setIcon({ path: iconPath });
}

function singleClick(tab) {
    toggleDebug(tab, 1);
}

function doubleClick(tab) {
    toggleDebug(tab, 'assets');
}

let clickCount = 0;
chrome.action.onClicked.addListener((tab) => {
    clickCount++;
    if (clickCount === 1) {
        singleClickTimeout = setTimeout(() => {
            clickCount = 0;
            singleClick(tab);
        }, 400);
    } else if (clickCount === 2) {
        clearTimeout(singleClickTimeout);
        clickCount = 0;
        doubleClick(tab);
    }
});

function getCurrentTab(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            callback(tabs[0]);
        }
    });
}

function changeIcon() {
    getCurrentTab((tab) => {
        if (tab?.url) {
            let currentUrl = new URL(tab.url);
            setIcon(currentUrl.searchParams.has('debug') ? 'on' : 'off');
        } else {
            setIcon('off');
        }
    });
}

chrome.tabs.onActivated.addListener(() => {
    changeIcon();
});

chrome.commands.onCommand.addListener((command) => {
    getCurrentTab((tab) => {
        if (tab) {
            toggleDebug(tab, command === 'toggle-odoo-debug-asset' ? 'assets' : 1);
        }
    });
});
