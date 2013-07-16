YUI({
    combine: false,
    filter: "raw",
    debug: false,
    modules: {
        'Twitter': {
            fullpath: 'js/twitter.js'
        },
        'myYQL': {
            fullpath: 'js/yql.js',
            requires: ['jsonp', 'jsonp-url']
        }
    }
}).use('Twitter', 'myYQL', "event",
    function (Y) {

        "use strict";

        var twtBtn = Y.one('#twitterlogin');

        twtBtn.on('click', function (e) {
            Y.Twitter.call("request_token", function (tokens) {
                window.setTimeout(function () {
                    window.location = "https://twitter.com/oauth/authenticate?oauth_token=" + tokens.oauth_token + "&oauth_token_secret=" + tokens.oauth_token_secret;
                }, 10);
            });
        });

        if (getQueryStr('oauth_token')) {
            Y.Twitter.config({
                oauth_token: getQueryStr('oauth_token'),
                oauth_token_secret: getQueryStr('oauth_token_secret'),
                oauth_verifier: getQueryStr('oauth_verifier')
            });

            Y.Twitter.call("access_token", function (tokens) {
                window.location.href = 'http://' + window.location.host +
                    window.location.pathname +
                    '?access_token=' + tokens.oauth_token +
                    '&access_secret=' + tokens.oauth_token_secret
            });
        }
        else if(getQueryStr('access_token')) {
            var tokens = {
                access_token: getQueryStr('access_token'),
                access_secret: getQueryStr('access_secret')
            };
			client.userLogged(tokens);
        }
		else {
			client.userNotLogged();
		}
    }
);

function getQueryStr(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}