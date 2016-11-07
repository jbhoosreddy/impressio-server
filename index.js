const express = require('express');
const app = express();
const server = require('http').createServer(app);

const httpPort = process.env.HTTP_PORT || 3000;
const socketPort = process.env.SOCKET_PORT || 8000;

const AWS = require('aws-sdk');

console.log('socket server listening to port %s', socketPort);
const io = require('socket.io').listen(socketPort);

const clients = [];

server.listen(httpPort, () => {
  console.log('http server listening to port %s', httpPort);
});

// Set credentials and create an S3 client
AWS.config.loadFromPath('./config.json')
const s3 = new AWS.S3();
//
// s3.listBuckets(function(err, data) {
//   if (err){
//     console.log("Error:", err);
//   }
//   else {
//     console.log(data.Buckets);
//     for (var i in data.Buckets)
//     {
//       var bucket = data.Buckets[i];
//       if(bucket.Name == 'impressio')
//       {
//         console.log("Bucket: ", bucket.Name, '; Ver: ', bucket.CreationDate);
//         break;
//       }
//     }
//   }
// });

const getImages = () => {
  return new Promise((resolve, reject) => {
    s3.listBuckets(function(err, data) {
      if (err){
        console.log("Error:", err);
        reject(err);
      }
      else {
        console.log(data.Buckets);
        for (var i in data.Buckets) {
          var bucket = data.Buckets[i];
          console.log('bucket:' , bucket);
        }
        resolve(data.Buckets);
      }
    });
  });
};

const params = {
  Bucket: 'impressio', /* required */
};
s3.listObjects(params, (err, data) => {
  if (err) {
    console.log(err, err.stack);
  } else {
    console.log('data: ', data);
  }
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

app.post('/api/image', (req, res) => {
  console.log('accessed endpoint', req);
  //console.log('', req);
  // Get image inside const image
  const s3Bucket = new AWS.S3( { params: {Bucket: 'impressio'} } );

  buf = new Buffer(req.body.image.replace(/^data:image\/\w+;base64,/, ""),'base64')

  const data = {
    Key: req.body.userId,
    Body: buf,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg'
  };

  s3Bucket.putObject(data, function(err, data){
    if (err) {
      console.log(err);
      console.log('Error uploading data: ', data);
    } else {
      console.log('succesfully uploaded the image!');
      getImages()
        .then((image) => {
          res.json(image)
        })
        .catch((err) => res.send(err));
    }
  });
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

