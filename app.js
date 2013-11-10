var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8080);

// You can basically ignore this part. It just serves
// the index.html page to the browser

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

// This is where the fun happens

io.sockets.on('connection', function (socket) {

  socket.on('set nickname', function (name) {

      socket.set('nickname', name, function () {
          socket.emit('ready');
      });

  });

  socket.on('send message', function (msg) {

      socket.get('nickname', function (err, name) {

          socket.broadcast.emit('new message', {
              contents: msg, 
              name: name
          });

      });

  });

});
