// TODO: Trocar validações de campos pra Express Validator

module.exports = function(application) {
    var firebaseAdmin = application.config.firebase.database;
    var db  = firebaseAdmin.database();
    var ref = db.ref("server");
    
    // GET USERS
    application.get("/users", (req, res) => {
        var usersRef = ref; //.child("users")

        usersRef.on("value", 
            (snapshot) => {
                res.json(snapshot.val());
                usersRef.off("value");
            },
            (errorObject) => {
                console.log(`The read failed: ${errorObject.code}`);
                res.send(`The read failed: ${errorObject.code}`);
            });
    });

    // GET USER
    application.get("/user", (req, res) => {
        var userId = req.query.userId;

        var usersRef = ref.child(`/users/${userId}/`);

        usersRef.on("value", 
            (snapshot) => {
                res.json(snapshot.val());
                usersRef.off("value");
            },
            (errorObject) => {
                console.log(`The read failed: ${errorObject.code}`);
                res.send(`The read failed: ${errorObject.code}`);
            });
    });

    // INSERT USER
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

        const id = parseInt(Math.random() * 1000000000, 10);
        
        var usersRef = ref.child(`/users/${id}/`);

        usersRef = usersRef.set({
            name     : data.name,
            lastName : data.lastName,
        },
        (error) => {
            if (error) {
                res.send(`Data could not be inserted. Error: ${error}`);
            } else {
                res.send(`${data.name} ${data.lastName} registered.`);
            }
        });
    });

    // UPDATE USER
    application.patch("/users", (req, res) => {
        var data = req.body;

        var userId = req.query.userId;        

        if (userId == '' || userId == 'undefined') {
            res.send("The field userID cannot be null");
            return false;
        }
        // TODO: Utilizar apenas os campos enviados pro update
        var usersRef = ref.child(`/users/${userId}/`);

        usersRef = usersRef.update({
            name     : data.name,
            lastName : data.lastName,
        },
        (error) => {
            if (error) {
                res.send(`Data could not be inserted. Error: ${error}`);
            } else {
                res.send(`${data.name} ${data.lastName} updated.`);
            }
        });
    });

    // DELETE USER
    application.delete('/users', (req, res) => {
         var userId = req.query.userId; 

        if (userId == '' || userId == 'undefined') {
            res.send("userID cannot be null");
            return false;
        }

        var usersRef = ref.child(`/users/${userId}/`);
        usersRef.remove()
            .then(() => {
                res.send(`User removed`);
            })
            .catch((error) => {
                res.send(`Fail: ${error}`)
            });
    });
}