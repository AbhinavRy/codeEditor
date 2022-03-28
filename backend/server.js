const express = require('express');
const connectDB = require('./config/db');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);

const userRouters = require('./routers/user');
const projectRouters = require('./routers/project');

//Connect Database
connectDB();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ extended: false }));

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    },
});

// io.on('connection', (socket) => {
//     console.log("socket", socket);
//     console.log("socket is active to be connected");
//     socket.on('updateCode', (payload) => {
//         console.log("payload", payload);
//         io.emit('updateCode', payload);
//     })
// })

app.use('/api/user', userRouters);
app.use('/api/project', projectRouters);

app.listen(5000, () => {
    console.log('server running on port 5000');
});
