const { ObjectId } = require('bson')
var express = require('express')
var mongoose = require('mongoose')
var req = require('request')
var userModel = require('../model/userSchema.js');
//var userModel = require('user_details',userSchema);
var router = express.Router();
var roomModel = require('../model/roomSchema.js');
// var roomModel = mongoose.model('chatroom_details',roomSchema);

var addRoom = async function(req, res){
    var {user_id,
    room_name,
    description 
    } = req.body;
    var check = roomModel.findOne({room_name});
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
                message: 'This roomname already taken'
            }
            return res.status(409).send(error);
        }
        else{
            var room = new roomModel({
                room_name:room_name,
                description:description,
                createdby:ObjectId(user_id),
                users :(ObjectId(user_id))
            })
            room.save(function(error,data){
                if(error){
                    var error={
                        is_error: true,
                        message:error
                    }
                    return res.status(501).send(error);
                }
                else{
                    var check2 = userModel.findByIdAndUpdate({_id:user_id},{$push:{chat_rooms:data._id}})
                    check2.exec((error,data2)=>{
                        if(error){
                            var error={
                                is_error: true,
                                message:error
                            }
                            return res.status(501).send(error);
                        }
                        else if(data2){
                            var finaldata={
                                is_error:false,
                                message:'value has been added'
                            }
                            return res.status(200).send(finaldata)
                
                        }
                    })
                }    
            })
        }
    })
    
}
    
var getParticularRoom = async function(req,res){
    var {user_id,room_name}= req.body;
    var check= roomModel.findOne({room_name},{users:ObjectId(user_id)})
    await check.exec((error,data) => {
        if(error){
            var error={
                is_error: true,
                message:error
            }
            return res.status(501).send(error);
        }
        else if(data){
   
            var finaldata={
                is_error:false,
                message: data
            }
            return res.status(200).send(finaldata);
        }
        else{
            var error ={
                is_error: true,
                message: 'cannot find chat room currently with this name '
            }   
            return res.send(404).send(error);
        }    
    })

}
var joinRoom = async function(req,res){
    var {user_id,room_id}= req.body;
    var check=roomModel.findOneAndUpdate({_id:room_id},{$push :{users:ObjectId(user_id)},})
    await check.exec((err,data)=>{
        if(err){
            var error={
                is_error: true,
                message:error
            }
            return res.status(501).send(error);
        }
        else if(data){
          var check2= userModel.findOneAndUpdate({_id:ObjectId(user_id)},{$push:{chat_rooms:ObjectId(room_id)},});
           check2.exec((error,data2)=>{
              if(error){
                var error={
                    is_error: true,
                    message:error
                }
                return res.status(501).send(error);
              }
              else if(data2){
                var finaldata = {
                    is_error:false,
                    message:'updated successfully'
                } 
                return res.status(200).send(finaldata);
              }
              else{
                var error={
                    is_error: true,
                    message:'you cannot join'
                }
                return res.status(404).send(error);
              }
          })  
        }
        else{
            var error={
                is_error: true,
                message:'you cannot join'
            }
            return res.status(404).send(error);
        }
    })
}
// var getRoom = async function(req,res){
//     // employeeModel.find({name: 'Harsh Reddiar'},(err,data) => {
//         roomModel.find({hourlyRate : {$gt:12}},(err,data) => {
//         if(err){
//             throw err;
//         } 
//         else{
//             console.log("Displaying Data");
//             console.log(data);
//             res.status(200).json({data: data})
//             console.log("Done Displaying");
//         }
//     })
// }

var updateRoom = async function(req,res){
    var { user_id, room_id, room_name,description}= req.body;
    var check = roomModel.findOneAndUpdate({room_id: ObjectId(room_id), created_by:ObjectId(user_id)});
    await check.exec((error,data)=>{
        if(error){
            var error={
                is_error: true,
                message:error
            }
            return res.status(501).send(error);
        }
        else if(data){
            var final_data={
                

            };
            if(room_name){
                var check2=check.updateOne({room_name:room_name});
                check2.exec((error,data2)=>{
                   if(data2){
                    final_data = {
                        message:'value has been updated',
                        is_error:false
                    }
                    
                    }
                    else{
                        var error={
                            is_error: true,
                            message:error
                        }
                        return res.status(501).send(error);
                    }
               })
            }
            if(description){
                var check2=check.updateOne({description:description});
                check2.exec((error,data2)=>{
                   if(data2){
                    final_data = {
                        message:'value has been updated',
                        is_error:false
                    }
                    
                    }
                    else{
                        var error={
                            is_error: true,
                            message:error
                        }
                        return res.status(501).send(error);
                    }
               })
            }
            if(description || room_name){
                
                // final_data = {
                //     message:'value has been updated',
                //     is_error:false
                // }
                return res.status(200).send(final_data);
            }
            

        }
        else{
            var error={
                is_error:true,
                message:'room does not exists'
            }
            return res.status(404).send(error);
        }
    })
}
var leaveRoom = async function(req,res){
    var {user_id,room_id}= req.body;
    var check=roomModel.findOneAndUpdate({_id:room_id},{$pull :{users:ObjectId(user_id)},})
    await check.exec((err,data)=>{
        if(err){
            var error={
                is_error: true,
                message:error
            }
            return res.status(501).send(error);
        }
        else if(data){
          var check2= userModel.findOneAndUpdate({_id:ObjectId(user_id)},{$pull:{chat_rooms:ObjectId(room_id)},});
          check2.exec((error,data2)=>{
              if(error){
                var error={
                    is_error: true,
                    message:error
                }
                return res.status(501).send(error);
              }
              else if(data2){
                var finaldata = {
                    is_error:false,
                    message:'updated successfully'
                } 
                return res.status(200).send(finaldata);
              }
              else{
                var error={
                    is_error: true,
                    message:'you are not in this room'
                }
                return res.status(404).send(error);
            }
          })  
        }
        else{
            var error={
                is_error: true,
                message:'you are not in this room'
            }
            return res.status(404).send(error);
        }
    })
}


module.exports = {addRoom,getParticularRoom,joinRoom,updateRoom,leaveRoom}