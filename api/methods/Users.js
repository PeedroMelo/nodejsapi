module.exports = function(application) {
    var firebaseAdmin = application.config.firebase.database;
    var db  = firebaseAdmin.database();
    var ref = db.ref("server");
    
    let usersPath = '/users';
    
    // GET USERS
    application.get(usersPath, (req, res) => {
        var usersRef = ref.child(usersPath);

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
    application.get(`${usersPath}/*`, (req, res) => {
        var url = req.params[0].split("/");
        var userId = url[0];

        var usersRef = ref.child(`${usersPath}/${userId}/`);
        
        usersRef.on("value", 
            (snapshot) => {
                res.json(snapshot.val());
                usersRef.off("value");
            },
            (errorObject) => {         
                res.send(`The read failed: ${errorObject.code}`);
            });
    });

    // GET USER
    application.get("/user", (req, res) => {
        var userId = req.query.userId;

        var usersRef = ref.child(`${usersPath}/${userId}/`);

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
    application.post(usersPath, (req, res) => {
        var fieldsToUpdate = req.body;

        req.assert('name', {error: '001', msg: 'The field name cannot be empty.'}).notEmpty();
        req.assert('lastName', {error: '001', msg: 'The field lastName cannot be empty.'}).notEmpty();
        req.assert('email',{error: '001', msg: 'The field email cannot be empty.'}).notEmpty();
        req.assert('doc',{error: '001', msg: 'The field doc cannot be empty.'}).notEmpty();
        req.assert('phoneNumber', {error: '001', msg: 'The field phoneNumber cannot be empty.'}).notEmpty();

        var errors = req.validationErrors();

        if (errors) {
            res.send(errors[0].msg);
            return false;
        }

        var id = parseInt(Math.random() * 1000000000, 10);
        
        var usersRef = ref.child(`${usersPath}/${id}/`);

        usersRef.set({
            name        : fieldsToUpdate.name,
            lastName    : fieldsToUpdate.lastName,
            email       : fieldsToUpdate.email,
            doc         : fieldsToUpdate.doc,
            phoneNumber : fieldsToUpdate.phoneNumber,
        },
        (error) => {
            if (error) {
                res.send(`Data could not be inserted. Error: ${error}`);
            } else {
                res.send(`User registered.`);
            }
        });
    });

    // UPDATE USER
    application.patch(`${usersPath}/*`, (req, res) => {        
        
        var fieldsToUpdate = req.body;
        var userId = req.params[0].split("/")[0];

        if (!userId || userId == '' || userId == 'undefined') {
            res.send("The field userID cannot be null");
            return false;
        }
        
        var usersRef = ref.child(`${usersPath}/${userId}/`);

        usersRef.update(fieldsToUpdate,
        (error) => {
            if (error) {
                res.send(`Data could not be updated. Error: ${error}`);
                return false;
            }
        });

        usersRef.on("value", 
            (snapshot) => {
                res.json(snapshot.val());
                usersRef.off("value");
            },
            (errorObject) => {         
                res.send(`The read failed: ${errorObject.code}`);
            });
    });

    // DELETE USER
    application.delete(`${usersPath}/*`, (req, res) => {

        var userId = req.params[0].split("/")[0];

        if (!userId || userId == '' || userId == 'undefined') {
            res.send("The field userID cannot be null");
            return false;
        }
        
        var usersRef = ref.child(`${usersPath}/${userId}/`);
        usersRef.remove()
            .then(() => {
                res.send(`User removed`);
            })
            .catch((error) => {
                res.send(`Fail: ${error}`)
            });
    });
}