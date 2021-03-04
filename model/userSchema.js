var express = require('express')
var url = require('../connection')
var mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const {jwtSecret, Secret}= require('../config/public');
//mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
var userSchema =new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    user_name : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    chat_rooms : {
        type:Array,
        required:false
    }
})
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
      {
        _id: this._id,
        user_name: this.user_name,
        name: this.name,
        
      },
      jwtSecret
    );
  };
var user_exports = mongoose.model("user_details", userSchema);

// var user= new user_exports({
//     name: "bhargav",
//     user_name: " bhargu_27"
// })
// user.save(function(err,data){
//     if(err){
//         throw error;
//     }
//     else{
//         console.log(data);
//         console.log("Record added");
        
//     }
// })
module.exports = user_exports;
//module.exports = userSchema