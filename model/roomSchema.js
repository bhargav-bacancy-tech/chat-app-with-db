var express = require('express')
var url = require('../connection');
var {ObjectId, Timestamp }= require('bson');
var mongoose = require('mongoose')
//mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
var roomSchema =new mongoose.Schema({
    
    room_name : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    createdby: {
        type: ObjectId,
        required:true
    },
    users: {
        type: Array,
        required: false
    },
    messages:[
        {
            message:String
        },
        {
            message_id:ObjectId
        },
        {
            sendby:ObjectId
        },
        {
            senttime: { type: Date, default: Date.now}
        }
        
    ]

    
  
})
var chatroom_exports = mongoose.model("chatroom_details", roomSchema);

// var room= new chatroom_exports({
//     room_name: "test room 1",
//     description: "room has been made for testing purpose only",
//     createdby: new mongoose.Types.ObjectId('603f1f34cb908218ac4b7fc7')
//     users: [
//         new mongoose.Types.ObjectId('603f1f34cb908218ac4b7fc7')
//     ]
// })
// room.save(function(err,data){
//     if(err){
//         throw err;
//     }
//     else{
//         console.log(data);
//         console.log("Record added");
        
//     }
// })

//module.exports = roomSchema
module.exports = chatroom_exports;