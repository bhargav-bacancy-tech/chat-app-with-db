var express = require('express')
var mongoose = require('mongoose')
var req = require('request')
var roomschema = require('../model/roomSchema.js')
var userschema = require('../model/userSchema')
var router = express.Router()

var {addRoom,getParticularRoom,joinRoom,leaveRoom,updateRoom} = require('../controller/roomController.js')

router.post('/add',addRoom);

router.get('/getparticular',getParticularRoom);
router.post('/update',updateRoom);
router.post('/join',joinRoom);
router.post('/leave',leaveRoom);
module.exports = router