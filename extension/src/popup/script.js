var source = ""
var userId = chrome.extension.getBackgroundPage().userId;
document.getElementById("bookmarks").href = "http://google.com/"+userId;
