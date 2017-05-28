const jwt = require('jsonwebtoken')
const User = require ('../models/user.js')
const Token = require('../models/token.js')
const Memo = require('../models/memo.js')
const mongoose = require('mongoose');

function index(req, res, next) {
  res.render('index', { title: 'Catatan Memo Mu' });
}

function home(req, res, next) {
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
}

module.exports = {
  index,
  home
}
