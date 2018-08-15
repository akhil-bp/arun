var express = require('express');
var router = express.Router();
var userService = require('../services/user.service');//from export.getUsers
var moment = require('moment');//npm install moment --save.....give date formate

var bcrypt = require('bcrypt');//encrypt
var jwt = require('jsonwebtoken');
var config = require('../config');

var multer = require('multer');//file upload
const fs = require('fs');//unlink or storage



var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
    var filename = file.originalname.split(" ").join("_");
    callback(null, Date.now() + '-' + filename);
  }
});
var upload = multer({ storage: storage });




/* GET users listing. */
router.get('/', checkRole, function (req, res, next) {
  res.locals.title = 'user view';
  console.log(req.user);
  res.render('userview');
});
function checkRole(req, res, next) {
  if (req.user.role === 0) {
    res.render('dashboard');
  } else {
    next();
  }
}

//for ajax table view
// router.get('/ajaxget-users', function(req, res, next) {

//   userService.getUsers()
//   .then(function(result){
//     res.json({ success: 1, result: result });
//   })
//   .catch(function(e){
//     res.json({ success: 0, result: [] });
//   })
// });

router.get('/ajax/get-users', function (req, res, next) {
  console.log(req.query.search);
  console.log(req.query);
  var options = {
    select: 'name email role status date',
    lean: true,
    offset: parseInt(req.query.offset),
    limit: parseInt(req.query.limit)
  };
  userService.paginateUser({ $or: [ { name: {$regex: req.query.search} }, { email: {$regex: req.query.search} } ]}, options)
    .then(function (result) {

      //db.users.find({name:{$regex: srch}});
      res.json({ success: 1, rows: result.docs, total: result.total });
    })
    .catch(function (e) {
      res.json({ success: 0, rows: [] });
    })
});





/* GET users listing. */
//router.get('/delete', function(req, res, next) {
//userService.getUsers()
//.then(function(dl){
// console.log(dl);
//  res.locals.success = true;
//res.render('deleteview');
// })
//.catch(function(e){
//  console.log(e);
//  res.locals.success = false;
//res.locals.users = [];
//res.render('deleteview');
//})
//res.send('delete works');
//});

//for view in edit page....another type of then..catch function
router.get('/edit/:id', async function (req, res, next) {
  try {
    var o_id = req.params.id;
    var user = await userService.getUser({ _id: o_id });
    user.date = moment(user.date).format('YYYY-MM-DD');
    res.render('editview', { user: user })
  } catch (e) {
    res.render('editview')
  }
});

//for view in edit page....another type of then..catch function
router.post('/edit/:id', async function (req, res, next) {
  try {
    var o_id = req.params.id;
    var edituser = await userService.updateUser({ _id: o_id },
      {
        $set:
        {
          name: req.body.tname.trim(),
          email: req.body.temail,
          date: req.body.tdate.trim(),
          status: req.body.tstatus,
          role: req.body.trole
        }

      });

    var user = await userService.getUser({ _id: o_id });
    user.date = moment(user.date).format('YYYY-MM-DD');
    //console.log(user);
    res.render('editview', { success: true, user: user });
  } catch (e) {

    res.render('editview', { success: false })
  }

});




//for view in edit page....another type of then..catch function
router.post('/profile-image-upload/:id', upload.single("image"), async function (req, res, next) {
  // id and old_image_id from form post
  try {
    var oldFileName = req.body.deleteold;
    var o_id = req.params.id;
    //console.log(req.file);
    if (req.file) {
      var edituser = await userService.updateUser({ _id: o_id },
        {
          $set:
          {
            profilePic: req.file.originalname,
            profilePicFile: req.file.filename
          }
        });
      console.log(oldFileName);
      fs.unlink('./public/uploads/' + oldFileName, (err) => {
        console.log(err);
      });
      res.json({ success: 1, profilePicFile: req.file.filename });
    } else {
      res.json({ success: 0 });
    }
  } catch (e) {
    console.log(e);
    res.json({ success: 0 });
  }
});
/**
 * delete
 */
router.post('/ajax/delete', async function (req, res, next) {
  try {
    var o_id = req.body.id;
    var result = await userService.updateUser({ _id: o_id },
      { $set: { status: 0 } }
    );

    res.json({ success: 1 });
  } catch (e) {
    res.json({ success: 0 });

  }
});

module.exports = router;

