chrome.runtime.onMessage.addListener(function (request, sender, callback) {
  axios.get("https://us-central1-assessmenter-6777c.cloudfunctions.net/helloWorld").then(function (response) {
    console.log(response.data);
    callback(response);
  }).catch(function (error) {
    console.log(error);
  })
  return true
});
