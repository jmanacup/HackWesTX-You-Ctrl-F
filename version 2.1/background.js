chrome.runtime.onInstalled.addListener(function() {
    
    chrome.tabs.create({'url': chrome.extension.getURL('instruction.html')}, function(tab) {
        // Tab opened.
    });

});