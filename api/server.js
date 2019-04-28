var express       = require("express");
var bodyParser    = require("body-parser");
var firebaseAdmin = require("firebase-admin");

var serviceAccount = require("../config/firebase/nodejs-api-3857d-firebase-adminsdk-zjn26-d3f8d2ae52.json");

var application = new express();

application.use(bodyParser.urlencoded({extended: true}));
application.use(bodyParser.json());



application.listen(8000, function() {
    console.log("O servidor está escutando a porta 8000");
});

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: 'https://nodejs-api-3857d.firebaseio.com'
});

var db = firebaseAdmin.database();
var ref = db.ref('server/saving-data/fireblog');

application.get('/', (req, res) => {
    res.send({msg: 'oi'});
});

application.post('/api', (req, res) => {
    // var dados = req.body;

    var usersRef = ref.child('users');
    usersRef.set({
        alanisawesome: {
            date_of_birth: "June 23, 1912",
            full_name: "Alan Turing"
        },
        gracehop: {
            date_of_birth: "December 9, 1906",
            full_name: "Grace Hopper"
        }
    });

    res.send('foi!');
});

// Importa o módulo do firebase