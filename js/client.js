/**
 * @author Iker Garitaonandia - @ikertxu
 * @web http://orloxx.github.io
 * @timestamp 7/14/13 5:57 PM
 */

var client = new (function() {
	this.userNotLogged = userNotLogged;
	this.userLogged = userLogged;

	var _host = "192.168.1.62:8033",
		_socket = null;

	loadScript(document, "//" + _host + "/socket.io/socket.io.js",
		'socket-definition', initSocket);

	var _userObj = {
		params: {
			locations: coord.locations.ccs
		}
	};

	function initSocket() {
		if(io !== undefined) {
			_socket = io.connect(_host);
			_socket.on('tweets', function(tweet) {
				console.log(tweet);
				map.setTweet(tweet);
			});

			map.initGoogleMaps();
			setTimeout(function() {
				$('#blooper').find('.error').fadeIn('slow');
			}, 2000);
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
			$('.playback').on('click', function() {
				var state = $(this).attr('rel');
				switch (state) {
					case "playing":
						$(this).attr('rel', "paused");
						$(this).find('img.play').show();
						$(this).find('img.pause').hide();
						_socket.emit('stop stream', _userObj);
						break;
					case "paused":
						$(this).attr('rel', "playing");
						$(this).find('img.play').hide();
						$(this).find('img.pause').show();
						_socket.emit('start stream', _userObj);
						break;
				}
			});
		})
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