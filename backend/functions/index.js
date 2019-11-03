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


        //現在時刻取得（yyyymmddhhmmss）
        function getCurrentTime() {
            var now = new Date();
            var res = "" + now.getFullYear() + padZero(now.getMonth() + 1) + padZero(now.getDate()) + padZero(now.getHours()) +
                padZero(now.getMinutes()) + padZero(now.getSeconds());
            return res;
        }

        //先頭ゼロ付加
        function padZero(num) {
            return (num < 10 ? "0" : "") + num;
        }

        // Grab the text parameter.

        const url = req.body.url;
        const title = req.body.title;
        var today = 0;
        today = getCurrentTime()



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
                    time:today,
                });
                return res.json({
                    url:url,
                    good:good,
                    bad:bad,
                    value:value,
                    time:today,
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
        var bad = 0
        var bookmark = {}
        var url,title,hash,time,id
        var n = 0

        await admin.database().ref('vote').orderByChild("time").once("value").then( async function (snapshot) {
            cors(req, res, async () => {
                snapshot.forEach(function (child) {
                    var postedUserId = child.val().userId
                    var value = child.val().value
                    if (value == "good" && postedUserId==userId){
                        url = child.val().url
                        hash = child.val().hash
                        bookmark[url] = {
                            id:n,
                            url:url,
                            time:child.val().time,
                        }
                        n -= 1
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
                                baf = child.val().bad
                                time=bookmark[postedUrl].time
                                id=bookmark[postedUrl].id
                                bookmark[postedUrl]={
                                    id:id,
                                    title:title,
                                    good:good,
                                    bad:bad,
                                    time:time,
                                }
                            }
                    })
                })
                return res.json(bookmark)
            })
        });
    })
});


exports.pageInfo = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {


        // Grab the text parameter.
        const url = req.query.url;

        var flagA = 0
        var good = 0
        var bad = 0
        var hash,title
        var comment = {}

        await admin.database().ref('abstract').once("value").then( async function (snapshot) {
            cors(req, res, async () => {
                snapshot.forEach(function (child) {
                    var postedUrl = child.val().url
                    if (postedUrl == url){
                        flagA = 1
                        good = child.val().good
                        bad = child.val().bad
                        hash = child.val().hash
                        title = child.val().title
                    }
                })

                await admin.database().ref('comment').once("value").then( async function (snapshot) {
                    cors(req, res, async () => {
                        snapshot.forEach(function (children) {
                            var postedHash = children.key
                            if (postedHash == hash) {
                                children.forEach(function (child){
                                    child.forEach(function(data){
                                        comment[data.key] = data.val()
                                    })
                                })
                            }
                        })
                    })
                })


                if(flagA){
                    return res.json({
                        url:url,
                        good:good,
                        bad:bad,
                        title:title,
                        comment:comment,
                        main:"コメント読み込んだよ",
                    })
                }else{
                    return res.json({
                        url:url,
                        title:"",
                        good:0,
                        bad:0,
                        comment:comment,
                        main:"URL無いっすよ"
                    })
                }
            })
        });
    })
});

exports.comment = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {

        // Grab the text parameter.

        const url = req.body.url;
        const postedComment = req.body.comment;

        var hash,n=1,good,bad,title
        var comment = {}

        await admin.database().ref('abstract').once("value").then( async function (snapshot) {
            cors(req, res, async () => {
                snapshot.forEach(function (child) {
                    var postedUrl = child.val().url

                    if (postedUrl == url){
                        hash = child.val().hash
                        good = child.val().good
                        bad = child.val().bad
                        title = child.val().title
                    }
                })

                await admin.database().ref('comment').once("value").then( async function (snapshot) {
                    cors(req, res, async () => {
                        snapshot.forEach(function (children) {
                            var postedHash = children.key
                            if (postedHash == hash) {
                                children.forEach(function (child){
                                    child.forEach(function(data){
                                        comment[data.key] = data.val()
                                        n += 1
                                    })
                                })
                            }
                        })
                    })
                })

                await admin.database().ref('comment/' + hash + "/main"+ n).set({
                        good:0,
                        bad:0,
                        main:postedComment
                }).then(function () {
                    comment[n] = {
                        good:0,
                        bad:0,
                        main:postedComment
                    }
                })




                return res.json({
                    url:url,
                    good:good,
                    bad:bad,
                    title:title,
                    comment:comment,
                    main:"コメント投稿したぞ",
                })
            })
        });
    })

});