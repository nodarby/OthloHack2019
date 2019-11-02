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

            // Push the new message into the Realtime Database using the Firebase Admin SDK.
            await admin.database().ref('abstract').set({
                url:url,
                main:"main"
            });
            return res.json({
                main:url,
                sub:"作ったぞ",
            })
            // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
        })

});