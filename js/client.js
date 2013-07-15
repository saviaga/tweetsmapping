/**
 * @author Iker Garitaonandia - @ikertxu
 * @web http://orloxx.github.io
 * @timestamp 7/14/13 5:57 PM
 */

var host = "10.10.10.175:8033";

console.info("Connecting to: " + host);

function loadScript(d, src, id, callback){
    var js, fjs = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id;
    js.src = src;
    fjs.parentNode.insertBefore(js, fjs);
    // then bind the event to the callback function
    // there are several events for cross browser compatibility
    js.onreadystatechange = callback;
    js.onload = callback;
}

loadScript(document, "//" + host + "/socket.io/socket.io.js",
    'socket-definition', initSocket);

function initSocket() {
    if(io !== undefined) {
        var socket = io.connect(host);
        socket.on('tweets', function(tweet) {
            console.log(tweet);
            map.setTweet(tweet);
        });

        map.initGoogleMaps();
        var streamParams = {
            locations: tw.locations.bcn
        };
        socket.emit('start stream', streamParams);
        $('.playback').on('click', function() {
            var state = $(this).attr('rel');
            switch (state) {
                case "playing":
                    $(this).attr('rel', "paused");
                    $(this).find('img').attr('src', 'img/play.png');
                    socket.emit('stop stream');
                    break;
                case "paused":
                    $(this).attr('rel', "playing");
                    $(this).find('img').attr('src', 'img/pause.png');
                    socket.emit('start stream', streamParams);
                    break;
            }
        })
    }
}