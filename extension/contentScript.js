(() => {
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const {url} = obj;
        let title, artist;

        try {
            const split = document.querySelector("#container > h1 > yt-formatted-string").textContent.split("-")
            artist = split[0]
            title = split[1]
        } catch (e) {
            return
        }

        chrome.runtime.sendMessage({title, artist, url, type: "from_content_script"})
    });
})();