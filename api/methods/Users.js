// TODO: Trocar validações de campos pra Express Validator

module.exports = function(application) {
    var firebaseAdmin = application.config.firebase.database;
    var db  = firebaseAdmin.database();
    var ref = db.ref("server");
    
    // GET USERS
    application.get("/users", (req, res) => {
        var returnValues = [];
        var usersRef = ref; //.child("users")

        usersRef.on("value", (snapshot) => {
            returnValues = snapshot;
            res.send(returnValues);
        });
    });

    // POST USER
    application.post("/users", (req, res) => {
        var data = req.body;

        if (data.name == '') {
            msg = {
                error: '001',
                msg  : 'The field "name" cannot be empty.'
            };
            res.send(msg);
            return false;
        }

        if (data.lastName == '') {
            msg = {
                error: '001',
                msg  : 'The field "lastName" cannot be empty.'
            };
            res.send(msg);
            return false;
        }
        
        var usersRef = ref.child("users");

        usersRef = usersRef.push({
            name     : data.name,
            lastName : data.lastName,
        });
        res.send(data.name + " " + data.lastName + " registered.");
    });
}