YUI.add('Twitter', function (Y) {
    "use strict";

    Y.Twitter = function() {

        var config = {
			consumer_key: "YOUR_CONSUMER_KEY",
			consumer_secret: "YOUR_CONSUMER_SECRET"
		};

        return {

            config : function(params) {
                for(var k in params) {
                    config[k] = params[k];
                }
            },

            call : function (request, callback, params, context) {

                // Define some vars
                var responseHandler = null,
                    yql = null,
                    adding = 'and oauth_consumer_key = "' +
						config.consumer_key +
						'" and oauth_consumer_secret = "' +
						config.consumer_secret + '"';

                // Set params to an object if it is falsy
                params = params || {};

                switch (request) {
                    case "request_token":
                        yql = 'select * ' +
                            'from twitter.oauth.requesttoken ' +
                            'where oauth_callback = "http://' +
                            window.location.host +
                            window.location.pathname + '" ' + adding + ';';
                        responseHandler = this.requestTokenHandler;
                        break;
                    case "access_token":
                        yql = 'select * from twitter.oauth.accesstoken where oauth_verifier="' + config.oauth_verifier + '" and #oauth# ' + adding + ';';
                        responseHandler = this.requestTokenHandler;
                        break;
                }

                if (yql) {
                    yql = yql.replace("#oauth#", ' oauth_token = "' + config.oauth_token + '" AND oauth_token_secret = "' + config.oauth_token_secret + '"');

                    new Y.YQL(yql, function (r) {
                        responseHandler(r.query, callback, context);
                    }, params, {proto: "https"});
                }
                else {
                    throw new Error("No YQL defined");
                }
            },

            requestTokenHandler : function (results, callback) {
                var parts, response, tokens;
                response = results.results.result;
                parts = response.split("&");

                tokens = {};
                tokens.oauth_token = parts[0].split("=")[1];
                tokens.oauth_token_secret = parts[1].split("=")[1];

                callback(tokens);
            }
        };
    }();
}, '0.0.1', { requires: ['io-base', 'myYQL'] });