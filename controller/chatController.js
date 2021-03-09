var express = require('express')
var mongoose = require('mongoose')
var auth = require('../middleware/auth')
var bcrypt = require('bcrypt');
const { ObjectID, ObjectId } = require("bson");
var CryptoJS = require("crypto-js");
var req = require('request')
var router = express.Router();
var userModel = require('../model/userSchema.js')
var roomModel = require('../model/roomSchema.js')
const {Secret, jwtSecret} = require("../config/public");

var sendChat= async function(req,res){
    var {message,user_id,room_id}= req.body;
    var check= roomModel.findByOneAndUpdate({room_id},{users:ObjectId(user_id)},{$push:{messages:{
        message:message,
        sendby:ObjectId(user_id),
    }}});
    await check.exec((data,error)=>{
        if(error){
            var error= {
                is_error:true,
                message:error
            }
            return res.status(501).send(error);
        }
        else if(data){
            var finaldata={
                is_error:false,
                message:"value inserted succesfully"
            }
            return res.status(200).send(finaldata);
        }
        else{
            var error={
                is_error:true,
                message:"you are not part of this room or room doesn't exists"
            }
            return res.status(404).send(error);
        }
    })
}
var receiveChat= async function(req,res){
    var {user_id,room_id}=req.body;
    var check = roomModel.findOne({room_id},{users:ObjectId(user_id)},{messages});
    await check.exec((data,error)=>{
        if(error){
            var error= {
                is_error:true,
                message:error
            }
            return res.status(501).send(error);
        }
        else if(data){
            var finaldata={
                is_error:false,
                message:data
            }
            return res.status(200).send(finaldata);

        }
        else{
            var error={
                is_error:true,
                message:"Either there are no messages or you might not be part of this chatroom"
            }
            return res.status(404).send(error);
        }
    })
}
var deleteChat= async function(req,res){
    var {room_id,user_id,message_id}=req.body;
    var check = roomModel.findOneAndUpdate({room_id},{$nin:[messages.message_id=message_id,message.sendby=ObjectId(user_id)]},{$pull:{
        messages: ObjectId(message_id)
    }})
    await check.exec((data,error)=>{
        if(error){
            var error= {
                is_error:true,
                message:error
            }
            return res.status(501).send(error);
        }
        else if(data){
            var finaldata={
                is_error:false,
                message:"this message was deleted"
            }
            return res.status(200).send(finaldata);
        }
        else{
            var error= {
                is_error:true,
                message:"you have not access to delete this message"
            }
            return res.status(501).send(error);
        }
    })
}
module.exports={sendChat,receiveChat,deleteChat};