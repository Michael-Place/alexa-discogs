/*jslint node: true */

'use strict';

var chai   = require('chai');
var chaiAsPromised = require('chai-as-promised');
var expect = chai.expect;
var DiscogsDataHelper = require('../discogs_data_helper');

chai.config.includeStack = true;

var subject = new DiscogsDataHelper();

subject.requestRandomRelease(function(err, obj) {
  console.log(obj);
});
