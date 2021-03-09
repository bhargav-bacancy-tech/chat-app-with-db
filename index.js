var express = require('express')
var mongoose = require('mongoose')
var socketio = require('socket.io')
var http = require('http')
var path = require('path')
var mongourl = require('./connection')
var bodyParser = require('body-parser');
var userRouter = require('./route/userRoute')
//var userdata= require('./model/userSchema')
//var roomdata= require('./model/roomSchema')
var app = express()
var roomRouter = require('./route/roomRoute');
var chatRouter = require('./route/chatRoute');
var io = socketio(server);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // support json encoded bodies


const publicDirectoryPath=path.join(__dirname,'./public');
app.use(express.static(publicDirectoryPath));

var server = http.createServer(app);

mongoose.connect(mongourl,{useNewUrlParser : true, useUnifiedTopology: true}, (error, success) => {
    if(error){
        console.log("Error connecting to Db : ", e);
    } else {
        server.listen(3000,()=>
        console.log("Connected successfully")
    );
}
});
io.on('connection',(socket)=>{


    socket.on('disconnect',()=>{

    })
})
// var conn = mongoose.connection

// conn.on("connection",()=> {
//     // app.listen(3000,()=>
//     console.log("Connected successfully")
//     });

// conn.on("error",console.error.bind(console, 'connection error:'));
app.use(bodyParser.urlencoded({extended:false}));
app.use('/user',userRouter);
app.use('/room',roomRouter);
app.use('/chat',chatRouter);
app.get('/',(req,res)=>{
    //req.header({'Content-Type':'application/json'});
    res.sendFile(__dirname + '/public/login.html');
    // if(res){
    //     app.get('/chatpage',(req,res)=>{
    //         res.sendFile(__dirname + '/public/chat_ui_final.html');
    //     })
    // }
});
app.get('/chatpage',(req,res)=>{
    res.sendFile(__dirname + '/public/staticUI/chat_ui_final.html');
})

// conn.on("disconnection",()=> console.log("Disconnected successfully"));

