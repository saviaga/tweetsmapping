/**
 * @author Iker Garitaonandia - @ikertxu
 * @web http://orloxx.github.io
 * @timestamp 7/14/13 5:57 PM
 */

var host = "192.168.1.62:8033";

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

var map = null;

function initSocket() {
    if(io !== undefined) {
        var socket = io.connect(host);
        socket.on('tweets', function(tweet) {
            if(map && tweet.geo) {
                setTweet(tweet.geo.coordinates, tweet);
            }
            else {
                console.warn(tweet);
            }
        });
    }

    google.maps.event.addDomListener(window, 'load', function(){
        var mapOptions = {
            zoom: 10,
            center: new google.maps.LatLng(41.4, 2.17),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('map'),
            mapOptions);
    });
}

function setTweet(coord, tweet) {
    centerMap(coord[0], coord[1]);
    var marker = new google.maps.Marker({
        position: getCoordObj(coord[0], coord[1]),
        map: map,
        icon: "img/marker_twitter.png"
    });
    google.maps.event.addListener(marker, 'click', function() {
        setTweetText(tweet.text);
    });
    setTweetText(tweet.text);
}

function setTweetText(text) {
    $('.tweet').html(text);
}

function centerMap(lat, lon) {
    map.setCenter(getCoordObj(lat, lon));
}

function getCoordObj(lat, lon) {
    return new google.maps.LatLng(lat, lon);
}