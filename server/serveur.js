var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    console.log('User connecter');

    socket.on('pseudo', function (nom) {

        console.log(nom + " est connecté ");

        io.sockets.emit('blaze', nom );
    }); 

    socket.on('data', function (data) {
        console.log('De ' + data.blaze + ': ' + data.message);

        io.sockets.emit('result', data);
    }); 

    socket.on('blaze', function (edit_blaze){
        console.log(edit_blaze.ancien_blaze + ' a changer son pseudo en ' + edit_blaze.new_blaze);
        // console.log(edit_blaze);
        socket.broadcast.emit('edit', edit_blaze);
        // socket.emit('edit', edit_blaze);
    })

});


server.listen(8080);
