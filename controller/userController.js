var express = require('express')
var mongoose = require('mongoose')
var auth = require('../middleware/auth')
var bcrypt = require('bcrypt');
const { ObjectID, ObjectId } = require("bson");
var CryptoJS = require("crypto-js");
var req = require('request')
var router = express.Router();
var userModel = require('../model/userSchema.js')
const {Secret, jwtSecret} = require("../config/public");
//var userModel = mongoose.model('user_details',userSchema)

var addUser = async function(req, res){
    console.log("Add user called");
    var {name,user_name,password}= req.body;
    var check=userModel.findOne({user_name});
    await check.exec((error,data)=>{
        if(error){
            var error={
                is_error: true,
                message:error
            }
            return res.status(501).send(error);
        }
        else if(data){
            var error = {
                is_error: true,
                message: 'This username already taken'
            }
            return res.status(409).send(error);
        }
        else{
            password = bcrypt.hashSync(password, 10);
            var user = new userModel({
                name,
                user_name,
                password
            })

            user.save(function(error,data){
                if(error){
                    var error={
                        is_error: true,
                        message:error
                    }
                    return res.status(501).send(error);
                }
                else{
                    var finaldata = {
                        data:data,
                        is_error:false
                    }
                    
                    return res.status(200).send(finaldata)
                }
            })
        }
    })

}
    
var getUser = async function(req,res){
    var check=userModel.find({})
    await check.exec((error,data)=>{
        if(error){
            var error= {
                is_error: true,
                message: error
            }
            return res.status(400).send(error);
        }
        else{
            var finaldata= {
                data:data,
                is_error:false
            }
            return res.status(200).send(finaldata);
        }
    })
}
var getMyroom= async function(req,res){
    var {user_name}= req.body;
    var check = userModel.findOne({user_name},['chat_rooms']);
    await check.exec((error,data)=>{
        if(error){
            var error= {
                is_error: true,
                message: error
            }
            return res.status(400).send(error);
        }
        else if(data){
           
            var finaldata={
                is_error:false,
                data:data
            }
            return res.status(200).send(data);
        }
        else{
            var error={
                is_error:true,
                message:`this id doesn't exists`
            }
            return res.status(404).send(error);
        }
    })
}
var getParticularUser = async function(req,res){
    console.log("Getting Particular user");
    console.log(req.body);
    var {user_name,password}= req.body;
    console.log(req.body);
    var check=userModel.findOne({user_name})
    await check.exec((err, data) => {
        if (err) {
            var error = {
            is_error: true,
            message: err.message,
            };
            return res.status(400).send(error);
        } 
        else {
            console.log(data);
            if (data == null || data.length == 0) {
                var error = {
                    is_error: true,
                    message: "Username  invalid",
                };
                return res.status(500).send(error);
            } 
            else {
                
                var check_pass = data.password;
                
                if (bcrypt.compareSync(password, check_pass)) {
                   
                   
                    let token = data.generateAuthToken();
                   
                    var ciphertext = CryptoJS.AES.encrypt(
                    JSON.stringify(token),
                    Secret
                    ).toString();
                    var finaldata = {
                        data: data,
                        token: ciphertext,
                        is_error: false,
                        message: "Signin Successfully",
                    };
                    return res.send(finaldata);
                } 
                else {
                    var error = {
                        is_error: true,
                        message: "Password invalid",
                    };
                    return res.status(500).send(error);
                }
            }
        }
    });
}
var updateName = async function(req,res){
    var {user_id , name} = req.body;
    var check = userModel.findByIdAndUpdate({_id:ObjectId(user_id)},{name:name})
    await check.exec((err,data)=>{
        if(err){
            var error= {
                is_error: true,
                message: error
            }
            return res.status(400).send(error);
        }else{
            var finaldata = {
                is_error:false,
                message:'Your Name has been updated'
            }
            return res.status(200).send(finaldata);
        }
    })
}
var changePassword = async function(req,res){
    let { user_id,oldPassword,newPassword} = req.body;
    var check = userModel.findOneAndUpdate({
       _id: ObjectId(user_id) 
    
    });
    await check.exec((err, data) => {
        if (err) {
            var error = {
            is_error: true,
            message: err.message,
            };
            return res.status(400).send(error);
        } 
        else {
            if (data == null || data.length == 0) {
                var error = {
                    is_error: true,
                    message: "Password invalid",
                };
                return res.status(500).send(error);
            } 
            else {
                var check_pass = data.password;
                if (bcrypt.compareSync(oldPassword, check_pass)) {
                    let token = data.generateAuthToken();
                    var ciphertext = CryptoJS.AES.encrypt(
                    JSON.stringify(token),
                    Secret
                    ).toString();
                    var finaldata = {
                        data: data,
                        token: ciphertext,
                        is_error: false,
                        message: "Password is valid",
                    };  
                    if(!finaldata.is_error){
                        password = bcrypt.hashSync(newPassword, 10);
                        var update = userModel.findOneAndUpdate(
                            { _id: ObjectId(user_id) },
                            {
                                password: password
                            }
                        );
                        update.exec((err,ans)=>{
                            if (err) {
                                var error = {
                                is_error: true,
                                message: err.message,
                                };
                                return res.status(500).send(error);
                            } 
                            else {
                                var finaldata2 = {
                                    password: password,
                                    message: "Password changed successfully",
                                    is_error: false,
                                };
                                return res.status(200).send(finaldata2);
                            }
                        });
                    }
                } 
                else {
                    var error = {
                    is_error: true,
                    message: "Password invalid",
                    };
                    return res.status(500).send(error);
                }
            }
        }
  });
}

var deleteUser = async function(req,res){
    var {user_name}= req.body;
    var check = userModel.findOneAndDelete({user_name});
    await check.exec((err,data)=>{
        if(err){
            var error= {
                is_error: true,
                message: error
            }
            return res.status(400).send(error);
        }
        else if(data){
            var finaldata= {
                message:"data has been deleted",
                is_error:false
            }
            return res.status(200).send(finaldata);
        }
        else{
            var error= {
                is_error: true,
                message: 'user not found'
            }
            return res.status(404).send(error);
        }
    })
}


module.exports = {addUser,getUser,getMyroom,getParticularUser,updateName,changePassword,deleteUser}