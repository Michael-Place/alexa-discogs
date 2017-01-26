/*jslint node: true */

'use strict';

var Discogs = require('disconnect').Client;
var _ = require('lodash');

function DiscogsDataHelper() {}

module.exports = DiscogsDataHelper;

DiscogsDataHelper.prototype.requestRandomRelease = function(token, callback) {
  var tokenComponents = token.split(',')
  var oAuth   = new Discogs().oauth();
  oAuth.token = tokenComponents[0]
  oAuth.tokenSecret = tokenComponents[1]
  oAuth.consumerKey = "BUlVPBHdHLtSipCwBzCi"
  oAuth.consumerSecret = "RBiSEufqzZYOCAJdgocwKKbHhyGmKOJh"
  oAuth.method = "oauth"
  oAuth.level = 2

  var dis = new Discogs("AlexaDiscogsClient/0.1 +http://workingonit.org", oAuth);

  // fetch the user identity so we can access the username
  dis.getIdentity(function(err, data){
    var username = data.username
    // use the username to fetch the users profile
    dis.user().getProfile(username, function(err, obj){
      var perPage = 50;
      // determine how many items are in the users collection
      var collectionCount = obj.num_collection;
      // pick a random item
      var selection = random(0, collectionCount);
      console.log("Selected Item #" + selection);

      // calculate which page that item is on based on page size
      var index = (selection % perPage) - 1;
      var page = Math.floor(selection / perPage);
      console.log("Located at index " + index + " on page " + page);

      // fetch the item
      dis.user().collection().getReleases(username, 0, {page: page, per_page: perPage}, function(err, data){
        var info = data['releases'][index]['basic_information'];

        // pull out relevant data from the item
        var response = {
          "artist" : info['artists'][0]['name'],
          "album"  : info['title'],
          "year"   : info['year']
        };

        // compose phrase and call back the handler
        callback(err, phraseForRelease(response));
      });
    });
  });

};

function phraseForRelease(release) {
  return _.template('How about ${album} by ${artist} released in ${year}?')({
    album  : release['album'],
    artist : release['artist'],
    year   : release['year']
  });
}

function random (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
