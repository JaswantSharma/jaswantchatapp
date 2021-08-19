//node ser ver that handles socket io connection
/* const io = require('socket.io')(9002, {
    cors: {
      origin: '*',
    }
  }); */
  const express = require('express');
  const app = express();
  app.use(express.static(__dirname));
 app.use(express.static(__dirname+"/index.html"));
  const http = require('http');
  const server = http.createServer(app);
  const { Server } = require("socket.io");
  const io = new Server(server);


  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  
  




const  users= {};
//io.on is socket.io instance and it will listen to the connections like jaswant connected rahul connected 
//whenever something will happen to a particular connection taht will be handles by socket.on

io.on("connection",socket=>{
    socket.on('new-user-joined', name=>{
        console.log('welcome',name); 
        users[socket.id]= name;
        socket.broadcast.emit('user-joined',name);
    })
//when someone send a message that event will do the following
//send is a custom name
//it will an event called event and that will be handled in client.js
    socket.on('send',message=>{
        socket.broadcast.emit('recieve',{message:message,name:users[socket.id]})
    });
/* when someone is leaving the chat iot eill fire the left event  */
    /* socket.on('disconnect',message=>{
      socket.broadcast.emit('left',users[socket.id]);
      delete users[socket.id];
 */
      socket.on("disconnect", () => {
        socket.broadcast.emit('left',users[socket.id])
        delete users[socket.id];
      });

  


})
const port =process.env.PORT || '3000'
server.listen(port, () => {
    console.log('listening on *:3000');
  });