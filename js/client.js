/**
 * @author Iker Garitaonandia - @ikertxu
 * @web http://orloxx.github.io
 * @timestamp 7/14/13 5:57 PM
 */

var client = new (function() {
    this.userNotLogged = userNotLogged;
    this.userLogged = userLogged;

    var _host = window.location.host.split(":")[0] + ":23786",
        _socket = null;

    loadScript(document, "//" + _host + "/socket.io/socket.io.js",
        'socket-definition', initSocket);

    var DEFAULT_LOCATION = city.locations.any;

    var _userObj = {
        params: {
            locations: DEFAULT_LOCATION.geo
        }
    };

    $(initDOM);

    function initDOM() {
        var i = 0,
            zone = $('#zone');
        _.each(city.locations, function(loc, key) {
            _userObj.params.locations = i === 0 ?
                city.locations[key].geo :
                DEFAULT_LOCATION.geo;
            zone.append('<option value="' + key + '">' + loc.name + '</option>');
            i++;
        });

        zone.on('change', function(e) {
            var val = $(this).val();
            _userObj.params.locations = city.locations[val].geo;
            startStream($('.playback'));
        });

        var track = $('#track');
        track.on('focus', function() {
            if($(this).val() === $(this).attr('title')) {
                $(this).val("");
            }
            $(this).addClass("active");
        });
        track.on('blur', function() {
            if($.trim($(this).val()) === "") {
                $(this).val($(this).attr('title'));
            }
            $(this).removeClass("active");
        });
    }

    function initSocket() {
        if(io !== undefined) {
            _socket = io.connect(_host);
            _socket.on('tweets', function(tweet) {
                newTweet(tweet);
            });

            map.initGoogleMaps();
            setTimeout(function() {
                $('#blooper').find('.error').fadeIn('slow');
            }, 2000);
        }
    }

    function newTweet(tweet) {
        var track = $('#track');
        if(track.val() == "" ||
            track.val() == track.attr('title') ||
            tweet.text.toLowerCase().indexOf(track.val().toLowerCase()) != -1)
        {
            map.setTweet(tweet);
        }
    }

    function userNotLogged() {
        $('#login').show();
        $('header').hide();
    }

    function userLogged(tokens) {
        _userObj.access_token = tokens.access_token;
        _userObj.access_secret = tokens.access_secret;
        initSocketConnection();
    }

    function initSocketConnection() {
        $(function() {
            $('#login').hide();
            $('header').show();
            $('.play').on('click', startStream);
            $('.pause').on('click', stopStream);
        })
    }

    function startStream(ele) {
        ele = ele.currentTarget ? $(this).parent() : ele;
        if(ele) {
            ele.attr('rel', "paused");
            ele.find('.play').hide();
            ele.find('.pause').show();
        }
        _socket.emit('start stream', _userObj);
    }
    function stopStream(ele) {
        ele = ele.currentTarget ? $(this).parent() : ele;
        if(ele) {
            ele.attr('rel', "playing");
            ele.find('.play').show();
            ele.find('.pause').hide();
        }
        _socket.emit('stop stream', _userObj);
    }

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
});
