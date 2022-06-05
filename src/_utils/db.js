const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');

let connected = false;

module.exports = async () => {
  if (!connected) {
    await client.connect();
    connected = true;
  }

  return client.db('formula1');
};

module.exports.client = client;
