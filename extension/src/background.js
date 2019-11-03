var userId = null;
var currentURL = '';

chrome.storage.local.clear();

chrome.storage.sync.get('userId', function (value) {
  console.log("value", value.userId);
  if (value.userId) {
    userId = value.userId;
  } else {
    userId = (function (){
      return new Date().getTime().toString(16) + Math.floor(65536*Math.random()).toString(16) + Math.floor(65536*Math.random()).toString(16)
    })();
    console.log(userId);
    chrome.storage.sync.set({'userId': userId}, function () {
      console.log(userId);
    });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, callback) {
  if (request.id === 'abstract') { // abstractを取得する
    currentURL = request.url;
    var query = {
      userId: userId,
      url: request.url
    }
    console.log(query)
    axios.get("https://us-central1-assessmenter-6777c.cloudfunctions.net/abstract", { params: query }).then(function (response) {
      console.log(response.data);
      callback(response.data);
    }).catch(function (error) {
      console.log(error);
      callback(null);
    })
    return true
  } else if (request.id === 'assessment'){
    var body = {
      userId: userId,
      title: request.title,
      url: request.url,
      badDiff: request.badDiff,
      goodDiff: request.goodDiff,
      value: request.value
    }
    console.log(body)
    axios.post("https://us-central1-assessmenter-6777c.cloudfunctions.net/assessment", body).then(function (response) {
      console.log(response.data);
      callback(response.data);
    }).catch(function (error) {
      console.log(error);
      callback(null);
    })
    return true
  }
});
