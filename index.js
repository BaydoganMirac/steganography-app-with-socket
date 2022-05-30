const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 3000
const functions = require('./functions');
const clients = [];
// Multer Options
const multer = require('multer');
const path = require('path');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "./upload"))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      req.newFileName = uniqueSuffix+file.originalname;
      cb(null, uniqueSuffix+file.originalname)
    }
})
const imageUpload = multer({ storage: storage });
// socket
io.on('connection', async (socket) => {
    console.log(socket.id +' connected');
    socket.emit('myID', socket.id);
    socket.on('myUserName', function(data){
        clients.push({id:data.id, userName: data.name})
        console.log(clients)
        io.emit('userList', (clients));
        socket.on('disconnect', () => {
            console.log(socket.id +' disconnected');
            clients.splice(clients.indexOf(socket.id), 1);
        });
    });
});

app.use(express.static(path.join(__dirname, "./upload")))

// Endpoints
app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/public/index.html')
})
app.post('/encode', imageUpload.single('image'), (req, res) => {
    console.log(req);
    functions.encodeImage(req.newFileName,req.body.message, req.body.id, req.body.forWho);
    setTimeout(function(){
        io.emit('encodedImage',{user: req.body.forWho, sender: req.body.id, image: '-'+req.body.id+'-'+req.body.forWho+'-'+req.newFileName});
    },5000)

    return res.json({
        message: 'success'
    })
})
app.get('/decode/:image', (req, res)=>{
    console.log(req.params.image)
    functions.decodeImage(req.params.image, res)
})
app.get('/upload/:image', (req,res)=>{
    res.sendFile(__dirname + '/upload/'+req.params.image)
})
server.listen(port, () => {
  console.log(`Stenography App listening on port ${port}`)
})