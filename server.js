var express = require("express");
var mysql = require('mysql');

var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

var router = express.Router();

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

var user = require('./routes/user');

//route to handle user registration
router.post('/register', user.register);
router.post('/login', user.login);
router.post('/google', user.google);
router.post('/user/memo/id', user.memoId);
router.post('/user/memo/create', user.memoCreate);
router.post('/user/memo', user.memo);
router.post('/user/memo/edit', user.memoEdit);
router.post('/user/memo/delete', user.memoDelete);

app.use('/api', router);
app.listen(3000);

