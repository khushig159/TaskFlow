require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const auth=require('./middleware/auth')
const {createServer}=require('http')
const cookieParser=require('cookie-parser')
const {Server}=require('socket.io')
const path = require('path');


const app = express();
const httpServer=createServer(app)

app.use(cors({
  origin: ['https://taskflow-client-latest.onrender.com','http://localhost', 'http://localhost:80', 'http://localhost:5173'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

const io = new Server(httpServer, {
  cors: {
    origin: ['https://taskflow-client-latest.onrender.com','http://localhost', 'http://localhost:80', 'http://localhost:5173'],
    credentials: true,
  },
});
app.set('io',io)

io.on('connection',(socket)=>{
    console.log('User connected: ', socket.id);

    socket.on('joinBoard',(boardId)=>{
        socket.join(boardId)
    })
    socket.on('cardMove',({boardId,source,destination,card})=>{
        socket.to(boardId).emit('cardMoved',{source,destination,card})
    })
    socket.on('disconnect',()=>{
        console.log('User disconnected')
    })
})


// Connect DB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use('/api/auth', require('./routes/auth'));

app.use('/api/boards', auth, require('./routes/board'));
app.use('/api/boards/:boardId/lists', auth, require('./routes/list'));
app.use('/api/boards/:boardId/lists/:listId/cards', auth, require('./routes/card'));


const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));