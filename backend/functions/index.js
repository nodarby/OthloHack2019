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

        var urlEX = url.replace( "." , "?" );
        var flagA = 0
        var good = 0
        var bad = 0
        var value = ""

        await admin.database().ref('abstract').once("value").then( async function (snapshot) {
            cors(req, res, async () => {
                snapshot.forEach(async function (child) {
                    var postedUrl = child.val().url
                    if (postedUrl == url){
                        flagA = 1
                        good = child.val().good
                        bad = child.val().bad
                    }
                    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
                })
                // Push the new message into the Realtime Database using the Firebase Admin SDK

                if(flagA){
                    return res.json({
                        url:url,
                        good:good,
                        bad:bad,
                        value:value,
                        main:"読み取り",
                    })
                }else{
                    await admin.database().ref('abstract').child(urlEX).set({
                        url:url,
                        good:0,
                        bad:0,
                        value:"none",
                    });
                    return res.json({
                        url:url,
                        good:0,
                        bad:0,
                        value:"none",
                        main:"作成"
                    })
                }
            })
        });
    })



});