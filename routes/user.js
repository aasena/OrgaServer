var moment = require('moment');

moment().format();
moment.locale('it');
moment.updateLocale('it', {
    months : [
        "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio",
        "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
    ],
    weekdays : [
        "Lunedì", "Martedì", "Mercoledì", "Giovadì", "Venerdì", "Sabato", "Domenica"
    ]
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

exports.memoId = function(req,res){
    var user = {
        "email": req.body.email
    }
    
    var query_id = 'SELECT id FROM users WHERE email =' + '"' + user.email + '"';
    connection.query(query_id, function (error, results, fields) {
        //Get user's id
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "code": 400,
                "success": false,
                "message": "error ocurred"
            })
        } else {
            if (results.length > 0) {
                //Check if there are matches in memo's table
                var query_memo = 'SELECT id_memo FROM memos WHERE id_user =' + '"' + results[0].id + '"';
                connection.query(query_memo, function (error, results_, fields) {
                    if (error) {
                        console.log("error ocurred", error);
                        res.send({
                            "code": 400,
                            "success": false,
                            "message": "error ocurred"
                        })
                    } else {
                        if (results_.length > 0) {
                            var major = 0;
                            results_.forEach(element => {
                                if (element.id_memo > major)
                                    major = element.id_memo;
                            });
                            res.send({
                                "code": 200,
                                "success": true,
                                "data": {
                                    memo: major + 1,
                                    user: results[0].id 
                                }
                            })
                        } else {
                            res.send({
                                "code": 200,
                                "success": true,
                                "data": {
                                    memo: 0,
                                    user: results[0].id 
                                }
                            })
                        }
                    }
                });
            } else {
                res.send({
                    "code": 204,
                    "success": true,
                    "message": "User not found"
                });
            }
        }
    });
}

exports.memoCreate = function(req,res){
    var today = new Date(Date.now()).toISOString();
    console.log(req.body.date)
    var user = {
        "id_memo": req.body.id_memo,
        "id_user": req.body.id_user,
        "date": req.body.date,
        "time": req.body.time,
        "memo": req.body.memo,
        "today": today
    }

    var query_insert = 'INSERT INTO memos (id_user, id_memo, date_time, memo, created, modified) VALUES ("' + user.id_user + '","' + user.id_memo + '","' + new Date(user.date + ' ' + user.time).toISOString() + '","' + user.memo + '","' + user.today + '","' + user.today + '")';
    connection.query(query_insert, function (error, results, fields) {
        if (error) {
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
                "message": "memo create"
            });
        }
    });
}

exports.memo = function(req,res){
    var user = {
        "id_user": req.body.id,
    }
    
    var query = 'SELECT id_user, id_memo, date_time, memo FROM memos WHERE id_user=' + '"' + user.id_user + '"';
    connection.query(query, function (error, results, fields) {
        if (error) {
            console.log("error ocurred", error_);
            res.send({
                "code": 400,
                "success": false,
                "message": "error ocurred"
            })
        } else {
            var order = results.sort(function compare(a, b) {
                return a.date_time - b.date_time;
            });
            order.forEach(element => {
                element.date_time = moment(element.date_time).format("dddd DD MMMM YYYY, HH:mm");
                console.log(element.date_time)
            });
            res.send({
                "code": 200,
                "success": true,
                "id": results[0].id_user,
                "memo": order
            });
        }
    });
}

exports.memoEdit = function(req,res) {
    console.log("user")
    var user = {
        "id_user": req.body.id_user,
        "id_memo": req.body.id_memo,
        "memo": req.body.memo,
        "date": req.body.date,
        "time": req.body.time
    }
    console.log(user)
    var query = 'UPDATE memos SET date_time=' + '"' + new Date(user.date + ' ' + user.time).toISOString() + '", memo=' + '"' + user.memo + '" WHERE id_user=' + '"' + user.id_user + '" AND id_memo=' + '"' + user.id_memo + '"';
    console.log(query)
    connection.query(query, function (error, results, fields) {
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "title": "Ops!",
                "sub": "Siamo spiacenti, operazione momentaneamente non consentita, riprova tra qualche minuto"
            })
        } else {
            res.send({
                "title": "Operazione Eseguita",
                "sub": "L'operazione è stata eseguita con successo"
            });
        }
    });
}

exports.memoDelete = function(req,res){
    var user = {
        "id_user": req.body.id_user,
        "id_memo": req.body.id_memo
    }
    
    var query = 'DELETE FROM memos WHERE id_user=' + '"' + user.id_user + '"id_memo=' + '"' + user.id_memo + '"';
    connection.query(query, function (error, results, fields) {
        if (error) {
            console.log("error ocurred", error_);
            res.send({
                "title": "Ops!",
                "sub": "Siamo spiacenti, operazione momentaneamente non consentita, riprova tra qualche minuto"
            })
        } else {
            res.send({
                "title": "Operazione Eseguita",
                "sub": "L'operazione è stata eseguita con successo"
            });
        }
    });
}