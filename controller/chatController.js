var express = require('express');
var mongoose = require('mongoose');
var auth = require('../middleware/auth');
var bcrypt = require('bcrypt');
var Cryptr = require('cryptr');
var mykey = require("../config/public");
var cryptr = new Cryptr("mykey");
const { ObjectID, ObjectId } = require('bson');
var CryptoJS = require('crypto-js');
var req = require('request');
var router = express.Router();
var userModel = require('../model/userSchema.js');
var roomModel = require('../model/roomSchema.js');
const { Secret, jwtSecret } = require('../config/public');

var sendChat = async function (req, res) {
  var { message, user_id, room_id } = req.body;
  var encryptedMessage=cryptr.encrypt(message);
  var check = roomModel.findOneAndUpdate(
    { _id:ObjectId(room_id), users: ObjectId(user_id) },
    {
        $push: { 
            messages: {
                message : encryptedMessage,
                sendby: ObjectId(user_id)
            }
        }
    },
    { upsert: true, new: true }
  );
  await check.exec((error, data) => {
      if (error) {
        var error = {
        is_error: true,
        message: error,
      };
      return res.status(500).send(error);
    } else if (data) {
      var finaldata = {
        is_error: false,
        message: 'value inserted succesfully',
      };
      return res.status(200).send(finaldata);
    } else {
      var error = {
        is_error: true,
        message: "you are not part of this room or room doesn't exists",
      };
      return res.status(404).send(error);
    }
  });
};
var receiveChat = async function (req, res) {
  var { user_id, room_id } = req.body;
  var check = roomModel.findOne(
    { _id: room_id, users: ObjectId(user_id) },['messages'] 
  );
  await check.exec((error,data) => {
    if (error) {
      var error = {
        is_error: true,
        message: error,
      };
      return res.status(501).send(error);
    } else if (data) {
        for(var i in data.messages){
            var message=data.messages[i].message;
            var originalmessage = cryptr.decrypt(message);
            data.messages[i].message=originalmessage;
        }    
        var finaldata = {
        is_error: false,
        message: data,
      };
      return res.status(200).send(finaldata);
    } else {
      var error = {
        is_error: true,
        message:
          'Either there are no messages or you might not be part of this chatroom',
      };
      return res.status(404).send(error);
    }
  });
};
var deleteChat = async function (req, res) {
  var { room_id, user_id, message_id } = req.body;
  var check = roomModel.findOneAndUpdate(
    {
      _id: room_id,
      messages:{
      $elemMatch: {
        _id : ObjectId(message_id),
        sendby : ObjectId(user_id)
      },
        }
    },
    {
      $pull: {
        messages:{_id:ObjectId(message_id)}
      },
    }
  );
  await check.exec((error,data) => {
    if (error) {
      var error = {
        is_error: true,
        message: error,
      };
      return res.status(501).send(error);
    } else if (data) {
      var finaldata = {
        is_error: false,
        message: 'this message was deleted',
      };
      return res.status(200).send(finaldata);
    } else {
      var error = {
        is_error: true,
        message: 'you do not have access to delete this message',
      };
      return res.status(404).send(error);
    }
  });
};
module.exports = { sendChat, receiveChat, deleteChat };
