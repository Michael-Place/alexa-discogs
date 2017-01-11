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
  dis.user().collection().getReleases('mptheapple11', 0, {page: 0, per_page: 50}, function(err, data){
    var info = data['releases'][15]['basic_information'];

    var response = {
      "artist" : info['artists'][0]['name'],
      "album"  : info['title'],
      "year"   : info['year']
    };

    callback(err, phraseForRelease(response));
  });
};

function phraseForRelease(release) {
  return _.template('How about ${album} by ${artist} released in ${year}?')({
    album  : release['album'],
    artist : release['artist'],
    year   : release['year']
  });
}
