const urlInput = document.querySelector("#url")
const titleInput = document.querySelector("#title")
const artistInput = document.querySelector("#artist")

chrome.runtime.sendMessage({type: 'from_popup'}, (response) => {
    urlInput.value = response.url
    titleInput.value = response.title
    artistInput.value = response.artist
});
