var express = require('express')
var mongoose = require('mongoose')
var req = require('request')
var roomschema = require('../model/roomSchema.js')
var userschema = require('../model/userSchema')
var router = express.Router()

var {sendChat,receiveChat,deleteChat} = require('../controller/chatController.js');

router.post('/send',sendChat);
router.get('/receive',receiveChat);
router.post('/delete',deleteChat);

module.exports = router