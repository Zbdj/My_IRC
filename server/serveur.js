var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);

var io = require('socket.io').listen(server);

var room =  ['random'];

io.sockets.on('connection', function (socket) {

    var channel = Object.keys(io.sockets.adapter.rooms)[0];

    if(socket.room !== true){
        socket.join('random');
        console.log(channel)
    }

        console.log(channel)

        console.log("User connecter sur le channel "+ channel);


    socket.on('pseudo', function (nom) {

        console.log(nom + " est connecté ");

        users.push(nom);

        io.sockets.emit('blaze', nom );
    }); 

    socket.on('data', function (data) {

        console.log('De ' + data.blaze + ': ' + data.message +" dans " + channel );

        io.sockets.in(channel).emit('result', data);
    });

    socket.on('blaze', function (edit_blaze){
        console.log(edit_blaze.ancien_blaze + ' a changer son pseudo en ' + edit_blaze.new_blaze);
        
        socket.broadcast.emit('edit', edit_blaze);
    });


    socket.on('room_name', function(name){
        socket.room = name;

        console.log(room)
        // console.log(socket.room)
        console.log("Le channel" + socket.room +" a été créé ")
        room.push(name)
        console.log(room)

    });

    socket.on('join_room_name', function(name){
        var join_or_no = 0;

            room.forEach(function(element) {
                console.log(element)
                // console.log(name.room_name)

                if(name.room_name === element)
                {
                    socket.leave(channel);

                    channel = name.room_name
            
                    socket.join(channel);

                    join_or_no = 1;
                    console.log(name.pseudo_join + " a rejoint le channel "+ name.room_name)
                    // console.log(join_or_no)
                    io.sockets.in(channel).emit('erreur_join', join_or_no );

                }

                else
                {
                    io.sockets.in(channel).emit('erreur_join', join_or_no );
                    console.log("Le channel demandé n'existe pas ");
                }
            });

    });

    socket.on('quit_room_name', function(name){
        var exist = 0;

        if(channel === name)
        {
            socket.leave(channel);
            channel = 'random'
            socket.join(channel);
            exist = 1;
            io.sockets.emit('quit_serv', exist );
            console.log("Deconnection de " + channel)

        }
        else
        {
            io.sockets.emit('quit_serv', exist );
            console.log("Le channel "+ name +" est mal écrit ou n'existe pas")
        }

    });

    // socket.on('disconnect', function(socket){
    //     socket.leave('random');

    //     console.log(socket)
    // });
});


server.listen(8080);
