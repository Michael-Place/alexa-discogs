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
  'utterances': ['{pick|choose|select|find} {me |} {a|an|some |} {album|record|vinyl}']
},
function(req, res) {
  return pickRandomRelease(req, res)
});

app.intent('help', {
  'slots': { },
  'utterances': ['{for |} {help}']
},
function(req, res) {
    var prompt = 'Collection DJ connects to Discogs.com. It uses your Discogs.com collection to randomly select something for you to listen to. Would you like me to select a record for you?';
    res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

app.intent('yes', {
  'slots': { },
  'utterances': ['{yes|sure|ok}']
},
function(req, res) {
    return pickRandomRelease(req, res)
});

app.intent('no', {
  'slots': { },
  'utterances': ['{no|stop}']
},
function(req, res) {
  var prompt = 'Ok, ask me to pick a record any time.';
  res.say(prompt).shouldEndSession(true);
});

function pickRandomRelease(req, res) {
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
}

//hack to support custom utterances in utterance expansion string
var utterancesMethod = app.utterances;
  app.utterances = function() {
  return utterancesMethod().replace(/\{\-\|/g, '{');
};

module.exports = app;
