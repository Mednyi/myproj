const io = require('socket.io')()
const auth = require('../modules/auth')
let users = require('../models/users')
const mongodb = require('../modules/mongo')
mongodb.initStream(io)
io.on('connection', socket => {
  socket.on('auth', (message) => {   
    try{
      let tokens = auth.authorize(message.name, message.password)
      console.log(JSON.stringify(tokens))
      socket.emit('authenticated',JSON.stringify(tokens))
    } catch (e) {
      socket.emit('authenticated',JSON.stringify({
        code: 404,
        msg: "Unauthorized"
      }))
    }
  })
})
const myspace = io.of('/protected')
myspace.use((socket, next) => {
  try {
    auth.checkAuth(socket.handshake.query.token, socket.handshake.query.user)
  } catch (e) {
    socket.disconnect(true)
  }
  next()
})
myspace.on('connection', socket => {
  console.log("connected")
  socket.on("getUsers", msg => {
    mongodb.findAndGroup('name','users')
    console.log(JSON.stringify(users))
    socket.emit('users',JSON.stringify(users))
  })
  socket.on("message", msg => {
    switch (msg.op) {
      case 'add': 
        mongodb.addOne(msg.value, msg.col_name) 
        break;
    }
  })
  socket.on("room", room => {
    socket.join(`${room}`)
    io.to("chat").emit("message", "Hi all")
    socket.to('chat').emit('message', "let's play a game")
    io.of('/protected').to('chat').emit('message', 'message')
  })
  socket.on("disconnect", () => {
    console.log("user disconnected")
  })
})

module.exports = io;