const { response } = require('express');
const express = require('express');
const server = express();

server.get('/', (req, res) => {
    
    return res.sendFile(__dirname + "/views/index.html")
})

server.listen(3000, () => console.log('rodando'));
