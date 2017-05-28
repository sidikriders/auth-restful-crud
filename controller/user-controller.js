const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require ('../models/user.js')
const Token = require('../models/token.js')
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/porto1')

function daftarBaru(req, res, next) {
  res.render('signup', {msg: null})
}

function daftarBaruPost(req, res, next) {
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
}

function masuk(req, res, next) {
  res.render('login', {msg: null})
}

function masukBaru(req, res, next) {
  res.render('login', {msg: 'account berhasil di buat'})
}

function masukPost(req, res, next) {
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
}

function keluar(req, res, next) {
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
}

module.exports = {
  daftarBaru,
  daftarBaruPost,
  masuk,
  masukPost,
  masukBaru,
  keluar
}
