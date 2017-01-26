/*jslint node: true */

'use strict';
module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('discogsinfo');
var DiscogsDataHelper = require('./discogs_data_helper');

app.launch(function(req, res) {
  var prompt = 'You can ask me to pick a record from your collection.';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

app.intent('discogsinfo', {
  'slots': { },
  'utterances': ['{pick|choose|select|find} {me |} {a|an |} {album|record|vinyl}']
},
function(req, res) {
    // retrieve the access token from the session
    var accessToken = req.sessionDetails.accessToken

    // if we don't have one, end the session and ask the user to link the account
    if (accessToken === null) {
        res.linkAccount().shouldEndSession(true).say('Your Discogs account is not linked. Please use the Alexa App to link the account.')
        return true
    }
    // otherwise fetch the random release
    else {
        var discogs = new DiscogsDataHelper();
        discogs.requestRandomRelease(accessToken, function(err, obj) {
          console.log(obj)
          res.say(obj).send()
        });

        return false;
    }
});

//hack to support custom utterances in utterance expansion string
var utterancesMethod = app.utterances;
  app.utterances = function() {
  return utterancesMethod().replace(/\{\-\|/g, '{');
};

module.exports = app;
