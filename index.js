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

  var discogs = new DiscogsDataHelper();

  discogs.requestRandomRelease(function(err, obj) {
    console.log(obj);
    res.say(obj).send();
  });

  return false;
}
);

//hack to support custom utterances in utterance expansion string
var utterancesMethod = app.utterances;
  app.utterances = function() {
  return utterancesMethod().replace(/\{\-\|/g, '{');
};

module.exports = app;
