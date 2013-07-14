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
                zoom: 14,
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

    function setTweet(coord, tweet) {
        _centerMap(coord[0], coord[1]);
        var marker = new google.maps.Marker({
            position: _getPositionObj(coord[0], coord[1]),
            map: _map,
            icon: "img/marker_twitter.png"
        });
        google.maps.event.addListener(marker, 'click', function() {
            _setTweet(tweet);
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