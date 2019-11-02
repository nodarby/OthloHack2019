const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();
const cors = require('cors')({origin: true});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.abstract = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {


        // Grab the text parameter.
        const url = req.query.url;
        const userId = req.query.userId;

        var flagA = 0
        var good = 0
        var bad = 0
        var value = ""

        await admin.database().ref('abstract').once("value").then( async function (snapshot) {
            cors(req, res, async () => {
                snapshot.forEach(function (child) {
                    var postedUrl = child.val().url
                    if (postedUrl == url){
                        flagA = 1
                        good = child.val().good
                        bad = child.val().bad
                        hash = child.val().hash
                    }
                    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
                })
                // Push the new message into the Realtime Database using the Firebase Admin SDK

                await admin.database().ref('vote').once("value").then(async function (s) {
                    s.forEach(function (child){
                        var postedUrl = child.val().url
                        var postedUserId = child.val().userId
                        if(postedUrl == url && postedUserId==userId ){
                            value = child.val().value
                        }
                    })
                })

                if(flagA){
                    return res.json({
                        url:url,
                        good:good,
                        bad:bad,
                        value:value,
                        main:"読み取り",
                    })
                }else{
                    return res.json({
                        url:url,
                        good:0,
                        bad:0,
                        value:"none",
                        main:"無いっすよ"
                    })
                }
            })
        });
    })
});



exports.assessment = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {

        // Grab the text parameter.

        const url = req.body.url;
        const title = req.body.title;

        var value = req.body.value
        var good
        var bad
        if(value=="good"){
            good = 1
            bad = 0
        }else{
            good = 0
            bad = 1
        }

        var goodDiff = Number(req.body.goodDiff)
        var badDiff = Number(req.body.badDiff)
        var userId = req.body.userId
        var hash = Math.random().toString(32).substring(2)

        await admin.database().ref('abstract').once("value").then( async function (snapshot) {
            cors(req, res, async () => {
                snapshot.forEach(function (child) {
                    var postedUrl = child.val().url

                    if (postedUrl == url){
                        hash = child.val().hash
                        good = Number(child.val().good) + goodDiff
                        bad = Number(child.val().bad) + badDiff
                    }
                    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
                })

                // Push the new message into the Realtime Database using the Firebase Admin SDK

                var today = new Date();

                await admin.database().ref('abstract').child(hash).set({
                    url:url,
                    good:good,
                    bad:bad,
                    hash:hash,
                    title:title,
                });
                await admin.database().ref('vote').child(hash).set({
                    url:url,
                    hash:hash,
                    userId:userId,
                    value:value,
                    time:today
                });
                return res.json({
                    url:url,
                    good:good,
                    bad:bad,
                    value:value,
                    main:"変えました",
                })
            })
        });
    })

});


exports.bookmarks = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {


        // Grab the text parameter.
        const userId = req.query.userId;

        var good = 0
        var bookmark = {}
        var url,title,hash
        var n = 0

        await admin.database().ref('vote').once("value").then( async function (snapshot) {
            cors(req, res, async () => {
                snapshot.forEach(function (child) {
                    var postedUserId = child.val().userId
                    var value = child.val().value
                    if (value == "good" && postedUserId==userId){
                        url = child.val().url
                        hash = child.val().hash
                        bookmark[url] = {
                            url:url,
                        }
                        n += 1
                    }
                    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
                })
                // Push the new message into the Realtime Database using the Firebase Admin SDK

                await admin.database().ref('abstract').once("value").then(async function (s) {
                    s.forEach(function (child){
                        var postedUrl = child.val().url
                            if (bookmark[postedUrl]){
                                title = child.val().title
                                good = child.val().good
                                bookmark[postedUrl]={
                                    title:title,
                                    good:good,
                                }
                            }
                    })
                })
                return res.json(bookmark)
            })
        });
    })
});
