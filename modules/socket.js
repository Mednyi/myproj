const io = require('socket.io')()
// namespace definition
const myspace = io.of('/custom')
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