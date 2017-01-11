/*jslint node: true */

'use strict';

var Discogs = require('disconnect').Client;
var _ = require('lodash');

var token    = "qmzRJegzZhtTstZbdmLGiuuqgVChrsmRNzmWOYtg";
var username = "mptheapple11";

function DiscogsDataHelper() {}

module.exports = DiscogsDataHelper;

var dis = new Discogs({userToken: token});

DiscogsDataHelper.prototype.requestRandomRelease = function(callback) {
  dis.user().getProfile(username, function(err, obj){
    var perPage = 50;

    var collectionCount = obj.num_collection;
    var selection = random(0, collectionCount);
    console.log("Selected Item #" + selection + '\n');

    var index = (selection % perPage) - 1;
    var page = Math.floor(selection / perPage);
    console.log("Located at index " + index + "on page " + page);

    dis.user().collection().getReleases(username, 0, {page: page, per_page: perPage}, function(err, data){
      var info = data['releases'][index]['basic_information'];

      var response = {
        "artist" : info['artists'][0]['name'],
        "album"  : info['title'],
        "year"   : info['year']
      };

      callback(err, phraseForRelease(response));
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
