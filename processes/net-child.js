process.on("message", function(message, server) {
    console.log(message);
    server.on("connection", function(socket) {
        console.log('child');
        socket.end("Child handled connection");
    });
});