const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const cors = require('cors')
const { v4: uuidV4 } = require('uuid')
const { ExpressPeerServer } = require('peer');

// our localhost port
const port = (process.env.PORT || 4000)

const app = express()
app.use(cors({
  // credentials: true,
  // origin: 'http://localhost:3000' // URL of the react (Frontend) app
}));
// our server instance
const server = http.createServer(app)
const peerServer = ExpressPeerServer(server, {
  debug: true
});
// This creates our socket using the instance of the server
const io = socketIO(server)

app.use('/peerjs', peerServer);
// This is what the socket.io syntax is like, we will work this later
io.on('connect', socket => {
  // console.log('New client connected')

  socket.on('test', (interval = 1000) => {
    // console.log('Client is subscribing with interval: ', interval);

    // emit message to the client side
    setInterval(() => {
      socket.emit('getDate', new Date().toUTCString());
    }, interval);
  })


  socket.on('join-room', (roomId, userId, name) => {
    // console.log("joined-room");
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId);
    // messages
    socket.on('message', (message, name) => {
      //send message to the same room
      // console.log("message")
      io.to(roomId).emit('createMessage', message, name)
    });

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })

  // disconnect is fired when a client leaves the server
  // socket.on('disconnect', () => {
  //   console.log('user disconnected')
  // })
})


app.get('/', (req, res) => {
  // let id = uuidV4();
  let id = Math.floor(100000 + Math.random() * 900000);
  // console.log(id);
  res.send({ id: id });
})

server.listen(port, () => console.log(`Listening on port ${port}`))
