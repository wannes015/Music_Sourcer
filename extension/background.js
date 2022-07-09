chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (tab.url && tab.url.includes("youtube.com/watch")) {
        chrome.tabs.sendMessage(tabId, {
            url: tab.url
        });
    }
});

let songdata = {
    title: "",
    artist: "",
    url: ""
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Arbitrary string allowing the background to distinguish
    // message types. You might also be able to determine this
    // from the `sender`.
    if (message.type === 'from_content_script') {
        delete message.type
        songdata = message
    } else if (message.type === 'from_popup') {
        sendResponse(songdata);
    }
});
