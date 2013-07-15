/**
 * @author Iker Garitaonandia - @ikertxu
 * @web http://orloxx.github.io
 * @timestamp 7/14/13 10:26 PM
 */

var map = new (function() {
    var _map = null;

    this.initGoogleMaps = initGoogleMaps;
    this.setTweet = setTweet;

    function initGoogleMaps() {
        google.maps.event.addDomListener(window, 'load', function(){
            var mapOptions = {
                zoom: 13,
                center: new google.maps.LatLng(41.4, 2.17),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                panControl: false,
                scaleControl: false,
                rotateControl: false,
                streetViewControl: false
            };
            _map = new google.maps.Map(document.getElementById('map'),
                mapOptions);
        });
    }

    function setTweet(tweet) {
        var lat = 0, lon = 0;
        if(tweet.geo) {
            lat = tweet.geo.coordinates[0];
            lon = tweet.geo.coordinates[1];
        }
        else if(tweet.coordinates) {
            lat = tweet.coordinates.coordinates[1];
            lon = tweet.coordinates.coordinates[0];
        }
        else return;
        _centerMap(lat, lon);
        var marker = new google.maps.Marker({
            position: _getPositionObj(lat, lon),
            map: _map,
            icon: "img/marker_twitter.png"
        });
        google.maps.event.addListener(marker, 'click', function() {
            _setTweet(tweet);
            _centerMap(lat, lon);
        });
        _setTweet(tweet);
    }

    function _setTweet(tweet) {
        var $tweet = $('.tweet');
        $tweet.find('.screen_name').attr('href',
            'http://twitter.com/' + tweet.user.screen_name);
        $tweet.find('.screen_name').html('@' + tweet.user.screen_name);
        $tweet.find('.text').html(tweet.text);
        $('.avatar').html('<img src="' + tweet.user.profile_image_url +
            '" alt="' + tweet.user.screen_name + '"/>');
    }

    function _centerMap(lat, lon) {
        _map.setCenter(_getPositionObj(lat, lon));
    }

    function _getPositionObj(lat, lon) {
        return new google.maps.LatLng(lat, lon);
    }
});