const io = require('socket.io')(5000)

io.on('connection', socket => {

  console.log('connected');
  const user = socket.handshake.query.user
  socket.join(user)
  console.log(user);

  socket.on('project-update', members => {
    members.forEach(member => {

      socket.broadcast.to(member).emit('project-updated', { user })
    })
  })
})