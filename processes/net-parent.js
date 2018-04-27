const path = require('path');
const cp = require("child_process");
let child = cp.fork(path.join(__dirname, "net-child.js"));
let server = require("net").createServer();

server.on("connection", (socket) => {
    console.log('parent');
    socket.end("Parent handled connection");
});

server.listen(1403, () => {
    child.send("Parent passing down server", server);
});