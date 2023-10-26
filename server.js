const express = require('express')
const app = express()
const http = require('http').createServer(app)

const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Socket 
const io = require('socket.io')(http)
const users = {}

io.on('connection', (socket) => {
    console.log('Connected...')

    socket.on('new-user-joined', name => {
        console.log(".....name.....", name, socket.id)
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name)
    })
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })

    socket.on('private-message', (data) => {
        const recipientSocket = findSocketByUserId(data.recipientId);
        if (recipientSocket) {
            recipientSocket.emit('private message', data.message);
        }
    });

})