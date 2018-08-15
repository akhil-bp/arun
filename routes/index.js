var express = require('express');
var router = express.Router();
var librarydir = require('../lib/library');
var debug = require('debug')('example1:index');
var userService = require('../services/user.service');//requires db statements
var validateSchema = require('../jsonvalidator/valid');//for validation
var bcrypt = require('bcrypt');//encrypt
var jwt = require('jsonwebtoken');
var config = require('../config');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express', libraries: librarydir.msg });
});



router.get('/logout', async function (req, res, next) {
  try {
    res.clearCookie('token');
    //if(removcookie == ""){
    res.redirect('/login');
    
  } catch (e) {
    res.redirect('/login');
  }
});

//login
router.get('/login', async function (req, res, next) {
  try {
    res.locals.success = true;
    res.render('index');
    
  } catch (e) {
    res.render('index');
  }
});
//for view in edit page....another type of then..catch function
router.post('/login', async function (req, res, next) {
  try {
    var mail = req.body.temail;
    var myPlaintextPassword = req.body.password;
    var user = await userService.getUser({ email: mail });
    if(user){
      var dbpswd = user.password;//ghg
      //console.log(dbpswd);
      var rs = await bcrypt.compare(myPlaintextPassword, dbpswd);
      //console.log(rs);
      if(rs){
        var token = jwt.sign({ name: user.name,id: user._id,role: user.role }, config.secret);// secret : "hgh"
        console.log(token);
        res.cookie('token', token, { signed: true });//'token'-> token name
        res.redirect('/users');//app.use(cookieParser(config.cookieSecret));...<---to app.js
        res.locals.success = true;
      } else {
        res.render('index');
        res.locals.success = false;
        //res.send('password incorrect');
      }
      
    }
    else {
      //res.send('incorrect user email or password');
      res.render('index');
      res.locals.success = false;
    }
  } catch (e) {
    res.render('index');
  }

});

router.get('/contactus', function (req, res, next) {
  res.render('contactus', { title: 'contactus' });
});
router.post('/contactus', function (req, res) {
  //res.render('contactus');
  let name = req.body.t1;
  let email = req.body.t2;
  let message = req.body.t3;
  //console.log(name ,email ,message);.....synchronous
  //but debug is asynchronous
  debug(name, email, message);//SET DEBUG=example1:* & npm start.......to view this type it in  cmd
  //var debug = require('debug')('example1:index');..to top
  res.send('got a post request' + name + email + message);
});




router.get('/userform', function (req, res, next) {
  res.render('userform');
});

/*router.post('/userform', validateSchema({ schemaName: 'new-user1', view: 'userform' }), function(req, res) {
  let usr = {
    name: req.body.tname, 
    email: req.body.temail,
    date: req.body.tdate,
    status: req.body.tstatus,
    role: req.body.trole,
    password: req.body.tpassword
  };
  console.log(usr);
  userService.createUser(usr)//createUser required from userService.....see require('') top
  .then(function(result) { 
    res.locals.success = true;
    res.render('userform');
  })
  .catch(function(e){
    console.log(e);
    res.locals.success = false;
    res.render('userform');
  });
}); */
//then catch ->>>> async await
router.post('/userform', validateSchema({ schemaName: 'new-user1', view: 'userform' }), async function (req, res) {
  //res.render('contactus');


  try {
    //User.findOne({ email: req.body.temail }, async function (err, users) {
    var chk = await userService.getUser({ email: req.body.temail })
    if (chk) {
      res.send('mail already exist!');
    } else {
      req.body.tpassword = req.body.tpassword.trim();//delete space before and after
      req.body.tconfpassword = req.body.tconfpassword.trim();
      if (req.body.tpassword && (req.body.tpassword === req.body.tconfpassword)) {

        const saltRounds = 10;
        //var password = 'kllklklk';
        var hash = await bcrypt.hash(req.body.tpassword, saltRounds);
        let usr = {
          name: req.body.tname,
          email: req.body.temail,
          date: req.body.tdate,
          status: req.body.tstatus,
          role: req.body.trole,
          password: hash
        };
        //console.log(usr);
        var temp = await userService.createUser(usr)//createUser required from userService.....see require('') top
        res.locals.success = true;
        res.render('userform');
      } else {
        res.send('password not matching!');
      }
    }
  }

  catch (e) {
    console.log(e);
    res.locals.success = false;
    res.render('userform');
  }
});
//console.log(name ,email ,message);.....synchronous
//but debug is asynchronous
//debug(usr);//SET DEBUG=example1:* & npm start.......to view this type it in  cmd
//var debug = require('debug')('example1:index');..to top
//res.render('userform', { title: 'userform', success: true });
//or
//res.locals.title =  'userform';
//res.locals.success =  true;

module.exports = router;//see bin/www

