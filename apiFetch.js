/* eslint-disable no-plusplus */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const { MongoClient } = require('mongodb');
const assert = require('assert');
const api = require('./apiSaleChain')

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
    mintsPipeline(db, function (err1, mints) {
        let i = 0;
      mints.forEach(mint => {
         //  if (i > 25 && i < 30){
         api.fetch(mint._id, mint.mints); 
        //  }
      });
    // api.fetch('0xaa86c991f431a0cff8aba553b19268debb9b48a4', 1); 
      
    });
  });
};

getMints();