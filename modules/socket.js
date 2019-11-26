const io = require('socket.io')()
const auth = require('../modules/auth')
// namespace definition
const myspace = io.of('/custom')
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
  socket.on("message", msg => {
    console.log(msg)
    socket.broadcast.emit("message", msg)
    io.emit("message", msg)
  })
  socket.on("room", room => {
    socket.join(`${room}`)
    io.to("chat").emit("message", "Hi all")
    socket.to('chat').emit('message', "let's play a game")
    io.of('/custom').to('chat').emit('message', 'message')
  })
  socket.on("disconnect", () => {
    console.log("user disconnected")
  })
})

module.exports = io;