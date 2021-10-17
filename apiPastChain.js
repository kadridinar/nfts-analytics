/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const { MongoClient } = require('mongodb');
const assert = require('assert');

const murl = 'mongodb://127.0.0.1:27017/';
const dbName = 'nftanalytics';

const mintsPipeline = function (db, callback) {

  db.collection('assets').aggregate(
    [
      { $match: {} },
      { $unwind: '$asset_contract' },
      { $group: { _id: '$asset_contract', 'mints': { $sum: 1 } } },
      { $sort: {mints: 1 }}
    ], {}
  ).toArray(callback);
};

const getMints = () => {
  MongoClient.connect(murl, function (err, client) {
    const db = client.db(dbName);
    assert.equal(null, err);
    mintsPipeline(db, function (err1, res) {
      console.log(err1, res);
    });
  });
};

getMints();