var firebaseAdmin = require("firebase-admin");

var serviceAccount = require("./key/nodejs-api-3857d-firebase-adminsdk-zjn26-d3f8d2ae52.json");

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://nodejs-api-3857d.firebaseio.com",
});

module.exports = firebaseAdmin;