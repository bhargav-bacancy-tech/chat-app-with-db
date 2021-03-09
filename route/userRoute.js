var express = require('express')
var req = require('request')
var schema = require('../model/userSchema.js')
var router = express.Router()
var auth = require("../middleware/auth")
var {addUser,getUser,getMyroom,getParticularUser,updateName,changePassword,deleteUser} = require('../controller/userController.js')

router.post('/add',addUser);
router.get('/get',getUser);
router.get('/getMyroom',getMyroom);
router.post('/getparticular',getParticularUser);
router.post('/updateName',updateName);
router.post('/changePassword',changePassword);
router.post('/delete',deleteUser);
module.exports = router