/**
 * @author Iker Garitaonandia - @ikertxu
 * @web http://orloxx.github.io
 * @timestamp 7/14/13 2:30 PM
 */

var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    twitter = require('ntwitter')

server.listen(8033);

io.configure(function () {
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 10);
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var tw = {}, streams = {};
io.sockets.on('connection', function(socket) {
    function destroyStream(access_token) {
        // destroys any service associated to that access_token
        if(streams[access_token]) {
            streams[access_token].destroy();
            streams[access_token] = null;
        }
    }
    socket.on('start stream', function(o) {
        destroyStream(o.access_token);
        tw[o.access_token] = new twitter({
            consumer_key: "YOUR_CONSUMER_KEY",
            consumer_secret: "YOUR_CONSUMER_SECRET",
            access_token_key: o.access_token,
            access_token_secret: o.access_secret
        });
        tw[o.access_token].stream('statuses/filter', o.params, function(stream) {
            streams[o.access_token] = stream;
            stream.on('data', function(data) {
                socket.emit('tweets', data);
            });
        });
    });
    socket.on('stop stream', function(o) {
        destroyStream(o.access_token);
    });
});

exports = module.exports = server;
// delegates user() function
exports.use = function() {
    app.use.apply(app, arguments);
};