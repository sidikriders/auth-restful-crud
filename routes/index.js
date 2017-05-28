var express = require('express');
var router = express.Router();

//nantinya di pindahin ke controller
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require ('../models/user.js')
const Token = require('../models/token.js')
const Memo = require('../models/memo.js')
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/porto1')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Catatan Memo Mu' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', {msg: null})
});

router.post('/signup', function(req, res, next) {
    let salt = bcrypt.genSaltSync(saltRounds)
    let hash = bcrypt.hashSync(req.body.newPass,salt)

    User.find({
      $or:[
        {
          username: req.body.newUser
        },
        {
          email: req.body.newEmail
        }
      ]
    }, (err, result) => {
      if (result.length > 0) {
        console.log(result);
        res.render('signup', {msg: 'username or email already exist!'})
      } else {
        User.create({
          username: req.body.newUser,
          email: req.body.newEmail,
          password: hash
        }, (err, result) => {
          res.redirect('/new/login')
        })
      }
    })
})

router.get('/login', function(req, res, next) {
  res.render('login', {msg: null})
})

router.get('/new/login', function(req, res, next) {
  res.render('login', {msg: 'account berhasil di buat'})
})

router.post('/login', function(req, res, next) {
  let currentUser = req.body.username;
  let currentPass = req.body.password;

  User.findOne({
    username: currentUser
  }, (err, result) => {
    if (err) {
      console.log(err);
    } else if (result.length<1) {
      res.render('login', {msg: 'Username tidak ditemukan'})
    } else {
      if(bcrypt.compareSync(currentPass, result.password) === true) {
        var token = jwt.sign({_id: result._id,username: result.username,email:result.email},'myKey')
        Token.create({
          token: token
        }, (err, result) => {
          res.redirect('/home')
        })
      } else {
        res.render('login', {msg: 'Password salah'})
      }
    }
  })
})

router.get('/home', function(req, res, next) {
  Token.find((err, resultToken) => {
    if (resultToken.length < 1) {
      res.render('login', {msg: 'login dlu'})
    } else {
      let currToken = jwt.verify(resultToken[0].token, 'myKey');
      let currID = currToken._id;
      let currUsername = currToken.username;
      let currEmail = currToken.email
      User.find((err, resultUser) => {
        if (err) {
          console.log(err);
        } else {
          let dataUser = resultUser
          Memo.find({
            user_id: currID
          }, (err, resultMemo) => {
            let dataMemo = resultMemo
            res.render('home', {user: dataUser, memo: dataMemo})
          })
        }
      })
    }
  })
})

router.get('/memo/new', function(req, res, next) {
  Token.find((err, resultToken) => {
    if (resultToken.length < 1) {
      res.render('login', {msg: 'login dlu'})
    } else {
      res.render('memo', {data: null})
    }
  })
})

router.post('/memo/new', function(req, res, next) {
  Token.find((err, resultToken) => {
    if (resultToken.length < 1) {
      res.render('login', {msg: 'login dlu'})
    } else {
      let currToken = jwt.verify(resultToken[0].token, 'myKey');
      let userID = currToken._id
      Memo.create({
        title: req.body.newMemoTitle,
        isi: req.body.newMemoIsi,
        user_id: userID
      }, (err, result) => {
        res.redirect('/home')
      })
    }
  })
})

router.get('/memo/:id', function(req, res, next) {
  Token.find((err, resultToken) => {
    if (resultToken.length < 1) {
      res.render('login', {msg: 'login dlu'})
    } else {
      let currToken = jwt.verify(resultToken[0].token, 'myKey');
      let currID = currToken._id;
      let currUsername = currToken.username;
      let currEmail = currToken.email
      Memo.findOne({
        _id: req.params.id
      }, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          if (result.user_id === currID) {
            res.render('memo', {data: result})
          } else {
            res.send('mohon maaf yang bisa lihat hanya yang punya aja')
          }
        }
      })
    }
  })
})

router.get('/memo/edit/:id', function(req, res, next) {
  Token.find((err, resultToken) => {
    if (resultToken.length < 1) {
      res.render('login', {msg: 'login dlu'})
    } else {
      let currToken = jwt.verify(resultToken[0].token, 'myKey');
      let currID = currToken._id;
      let currUsername = currToken.username;
      let currEmail = currToken.email
      Memo.findOne({
        _id: req.params.id
      }, (err, result) => {
        if (result.user_id === currID) {
          res.render('memo-edit', {data: result})
        } else {
          res.send('wkwkw mau ngerjain ya??')
        }
      })
    }
  })
})

router.post('/memo/edit/:id', function(req, res, next) {
  Memo.update({
    _id:req.params.id
  }, {
    $set: {
      title: req.body.updateTitle,
      isi: req.body.updateIsi
    }
  }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/home')
    }
  })
})

router.get('/memo/delete/:id', function(req, res, next) {
  Token.find((err, resultToken) => {
    if (resultToken.length < 1) {
      res.render('login', {msg: 'login dlu'})
    } else {
      let currToken = jwt.verify(resultToken[0].token, 'myKey');
      let currID = currToken._id;
      let currUsername = currToken.username;
      let currEmail = currToken.email
      Memo.find({
        _id: req.params.id
      }, (err, resultCheck) => {
        if (resultCheck.user_id === currID) {
          Memo.remove({
            _id: req.params.id
          }, (err, result) => {
            res.redirect('/home')
          })
        } else {
          res.send('wkwkw mau ngerjain yaa??')
        }
      })
    }
  })
})

router.get('/logout', function(req, res, next) {
  Token.find((err, resultToken) => {
    if (resultToken.length < 1) {
      res.render('login', {msg: 'login dlu'})
    } else {
      let currToken = jwt.verify(resultToken[0].token, 'myKey');
      let currID = currToken._id;
      let currUsername = currToken.username;
      let currEmail = currToken.email
      Token.remove({}, (err, result) => {
        res.redirect('/')
      })
    }
  })
})

module.exports = router;
