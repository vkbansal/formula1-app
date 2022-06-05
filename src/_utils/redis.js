const Redis = require('ioredis');

const client = new Redis();

// let connected = false;

module.exports = async () => {
  // if (!connected) {
  //   await client.connect();
  //   connected = true;
  // }

  return client;
};

module.exports.client = client;
