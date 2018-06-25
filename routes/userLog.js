var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "localhost",
  user: "finley",
  password: "password",
  database: "orga"
});


connection.connect(function(err){
    if(!err) {
        console.log("Database is connected");
    } else {
        console.log("Error connecting database");
    }
});


exports.login = function(req,res){
    var email = req.body.email;
    var password = req.body.password;
    
    var query = 'SELECT * FROM users WHERE email=' + '"' + email + '"' + ' OR username=' + '"' + email + '"' + ' OR password=' + '"' + password + '"';
    
    connection.query(query, function (error, results, fields) {
        if (error) {
            res.send({
                "code": 400,
                "success": false,
                "message": "Server error"
            })
        } else {
            //Check if exist
            if (results.length > 0) {
                if (!results[0].google) {
                    //Check if the email matches
                    if(results[0].email == email) {
                        //Check if the password matches
                        if(results[0].password == password) {
                            res.send({
                                "code": 200,
                                "success": true,
                                "message": "Login sucessfull"
                            });
                        } else {
                            res.send({
                                "code": 204,
                                "success": false,
                                "message": "Password does not match"
                            });
                        }
                    } else {
                        res.send({
                            "code": 204,
                            "success": false,
                            "message": "Email or Username do not match"
                        });
                    }
                } else {
                    //Check if the username matches
                    if(results[0].username == email) {
                        //Check if the password matches
                        if(results[0].password == password) {
                            res.send({
                                "code": 200,
                                "success": true,
                                "message": "Login sucessfull"
                            });
                        } else {
                            res.send({
                                "code": 204,
                                "success": false,
                                "message": "Password does not match"
                            });
                        }
                    } else {
                        res.send({
                            "code": 204,
                            "success": false,
                            "message": "Email or Username do not match"
                        });
                    }
                }
            } else {
                res.send({
                    "code": 204,
                    "success": false,
                    "message": "Email or Username do not match"
                });
            }
        }
    });
}

exports.register = function(req,res){
    var today = new Date(Date.now()).toISOString();

    var user = {
      "username": req.body.username,
      "email": req.body.email,
      "password": req.body.password,
      "created": today,
      "modified": today
    }
    
    var query = 'SELECT * FROM users WHERE email =' + '"' + user.email + '"' + 'OR username=' + '"' + user.username + '"';
    var query_ = 'INSERT INTO users (email, username, password, created, modified) VALUES ("' + user.email + '","' + user.username + '","' + user.password + '","' + user.created + '","' + user.modified + '")';
    connection.query(query, function (error, results, fields) {
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "code": 400,
                "success": false,
                "message": "error ocurred"
            })
        } else {
            //Check if there are matches
            if (results.length > 0) {
                //Check if the email matches
                if(results[0].email == user.email) {
                    res.send({
                        "code": 204,
                        "success": false,
                        "message": "Email already exist"
                    });
                } 
                //Check if the username matches
                if(results[0].username == user.username) {
                    res.send({
                        "code": 204,
                        "success": false,
                        "message": "Username already exist"
                    });
                }
            } else {
                //Insert to DB new User
                connection.query(query_, function (error_, results_, fields_) {
                    if (error_) {
                        console.log("error ocurred", error_);
                        res.send({
                            "code": 400,
                            "success": false,
                            "message": "error ocurred"
                        })
                    } else {
                        res.send({
                            "code": 200,
                            "success": true,
                            "message": "user registered sucessfully"
                        });
                    }
                });
            }
        }
    });
}

exports.google = function(req, res) {
    var today = new Date(Date.now()).toISOString();

    var user = {
      "username": req.body.username,
      "email": req.body.email,
      "password": "google login",
      "google": req.body.google,
      "created": today,
      "modified": today
    }

    var query = 'SELECT * FROM users WHERE email=' + '"' + email + '"' + ' OR username=' + '"' + username + '"';
    var query_ = 'INSERT INTO users (email, username, password, created, modified, google) VALUES ("' + user.email + '","' + user.username + '","' + user.password + '","' + user.created + '","' + user.modified + '","' + user.google + '")';

    connection.query(query, function (error, results, fields) {
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "code": 400,
                "success": false,
                "message": "error ocurred"
            })
        } else {
            //Check if there are matches
            if (results.length > 0) {
                //Check if the email matches
                if(results[0].email == user.email) {
                    res.send({
                        "code": 200,
                        "success": true,
                        "message": "Email Founded"
                    });
                } else {
                    //Check if the username matches
                    if(results[0].username == user.username) {
                        res.send({
                            "code": 200,
                            "success": true,
                            "message": "Username Founded"
                        });
                    } else {
                        res.send({
                            "code": 204,
                            "success": false,
                            "message": "Error"
                        });
                    }
                }
                
            } else {
                //Insert to DB new User
                connection.query(query_, function (error_, results_, fields_) {
                    if (error_) {
                        console.log("error ocurred", error_);
                        res.send({
                            "code": 400,
                            "success": false,
                            "message": "error ocurred"
                        })
                    } else {
                        res.send({
                            "code": 200,
                            "success": true,
                            "message": "Operation sucessfully"
                        });
                    }
                });
            }
        }
    });
}