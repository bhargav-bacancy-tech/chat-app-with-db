var express = require('express')
var mongoose = require('mongoose')
var mongourl = require('./connection')
var req = require('request')
var app = express()
var bodyParser = require('body-parser');
var userRouter = require('./route/userRoute')
//var userdata= require('./model/userSchema')
//var roomdata= require('./model/roomSchema')
var roomRouter = require('./route/roomRoute');
app.use(bodyParser.json());
mongoose.connect(mongourl,{useNewUrlParser : true, useUnifiedTopology: true}, (error, success) => {
    if(error){
        console.log("Error connecting to Db : ", e);
    } else {
        app.listen(3000,()=>
        console.log("Connected successfully")
    );
}
});

// var conn = mongoose.connection

// conn.on("connection",()=> {
//     // app.listen(3000,()=>
//     console.log("Connected successfully")
//     });

// conn.on("error",console.error.bind(console, 'connection error:'));
app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/src/index.html');
});

app.use('/user',userRouter);
app.use('/room',roomRouter);
// conn.on("disconnection",()=> console.log("Disconnected successfully"));

