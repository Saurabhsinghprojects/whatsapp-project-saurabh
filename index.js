let port=process.env.PORT;
if(port==null || port==""){
    port=4000;
}
const io = require('socket.io')(5000)

const users = {};

io.on('connection', socket =>{
  
    socket.on('new-user-joined', name =>{ 
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });


})

const express=require('express')
const app=new express()
const fs=require('fs')
app.use(express.static('public'))


const homePage=fs.readFileSync('index.html')
app.get('/',(req,res)=>{
    res.end(homePage)
})

app.listen(port,()=>{
    console.log("App listening")
})