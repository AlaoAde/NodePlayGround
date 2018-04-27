let fs = require("fs");
let http = require('http');

let theUser = null;
let userPos = 0;
let tweetFile = "tweets.txt";

http.createServer((request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
    });

    theUser = response;

    response.write(':' + Array(2049).join(' ') + '\n');
    response.write('retry: 2000\n');

    response.socket.on('close', () => {
        theUser = null;
    });
}).listen(1403);

let sendNext = function(fd) {
    let buffer = Buffer.alloc(140);
    fs.read(fd, buffer, 0, 140, userPos * 140, (err, num) => {
        if (!err && num > 0 && theUser) {
            ++userPos;
            theUser.write(`data: ${buffer.toString('utf-8', 0, num)}\n\n`);
            return process.nextTick(() => {
                sendNext(fd);
            });
        }
    });
};

function start() {
    fs.open(tweetFile, 'r', (err, fd) => {
        if (err) {
            return setTimeout(start, 1000);
        }
        fs.watch(tweetFile, (event, filename) => {
            if (event === "change") {
                sendNext(fd);
            }
        });
    });
};

start();

const Twit = require('twit');

let twit = new Twit({
    consumer_key: 'zom5cNvwSXcqFMBb4ivQePuFL',
    consumer_secret: 'rO1zj1HKLzXuAf7G4GHKtAgO3SjDYmHTQpvje02hzOYCGx7gru',
    access_token: '144149809-a5ABLwlD5oud8jqWLrm29wzLJVA659dgSXu7nZ3S',
    access_token_secret: 'ajnqDV6mhG2GWmfzyAF378O8Y2RK0aMC52jhlA8by5wvV'
});


let writeStream = fs.createWriteStream(tweetFile, {
    flags: "a" // indicate that we want to (a)ppend to the file
});

let cleanBuffer = function(len) {
    let buf = Buffer.alloc(len);
    buf.fill('\0');
    return buf;
};

let check = function() {
    twit.get('search/tweets', {
        q: '#nodejs since:2013-01-01'
    }, (err, reply) => {
        let buffer = cleanBuffer(reply.statuses.length * 140);
        reply.statuses.forEach((obj, idx) => {
            buffer.write(obj.text, idx*140, 140);
        });
        writeStream.write(buffer);
    })
    setTimeout(check, 10000);
};

check();