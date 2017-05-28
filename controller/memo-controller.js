const jwt = require('jsonwebtoken')
const Token = require('../models/token.js')
const Memo = require('../models/memo.js')
const mongoose = require('mongoose');

function buatBaru(req, res, next) {
  Token.find((err, resultToken) => {
    if (resultToken.length < 1) {
      res.render('login', {msg: 'login dlu'})
    } else {
      res.render('memo', {data: null})
    }
  })
}

function buatBaruPost(req, res, next) {
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
}

function lihatMemo(req, res, next) {
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
}

function editMemo(req, res, next) {
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
}

function editMemoPost(req, res, next) {
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
}

function hapusMemo(req, res, next) {
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
}


module.exports = {
  buatBaru,
  buatBaruPost,
  lihatMemo,
  editMemo,
  editMemoPost,
  hapusMemo
}
