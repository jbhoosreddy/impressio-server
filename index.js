const express = require('express');
const app = express();
const server = require('http').createServer(app);

const httpPort = process.env.HTTP_PORT || 3000;
const socketPort = process.env.SOCKET_PORT || 8000;


console.log('socket server listening to port %s', socketPort);
const io = require('socket.io').listen(socketPort);

const clients = [];

server.listen(httpPort, () => {
  console.log('http server listening to port %s', httpPort);
});


app.get('/api', function(req, res) {
  // TODO: Return description of API
  console.log('nothing here yet');
  res.send('nothing here yet\n');
});

app.get('/api/authenticate', (req, res) => {
  // Application logic to handle that
});

app.post('/api/add/activity', (req, res) => {
  const data = {};
  emit(data);
}); 

// Handles request to '/'
app.use(express.static('public'));

io.sockets.on('connection', socket => {
  console.log('Connected to %s socket clients', clients.length);
  clients.push(socket);
  socket.on('disconnect', data => {
    clients.splice(clients.indexOf(socket), 1);
  });

});

const emit = data => {
  io.sockets.emit('data', data);
}

