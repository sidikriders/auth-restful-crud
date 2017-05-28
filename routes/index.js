var express = require('express');
var router = express.Router();
const userController = require('../controller/user-controller');
const generalController = require('../controller/general-controller');
const memoController = require('../controller/memo-controller');


router.get('/', generalController.index);
router.get('/home', generalController.home);


router.get('/signup', userController.daftarBaru);
router.post('/signup', userController.daftarBaruPost);
router.get('/login', userController.masuk);
router.get('/new/login', userController.masukBaru);
router.post('/login', userController.masukPost);
router.get('/logout', userController.keluar);


router.get('/memo/new', memoController.buatBaru);
router.post('/memo/new', memoController.buatBaruPost);
router.get('/memo/:id', memoController.lihatMemo);
router.get('/memo/edit/:id', memoController.editMemo);
router.post('/memo/edit/:id', memoController.editMemoPost);
router.get('/memo/delete/:id', memoController.hapusMemo);



module.exports = router;
