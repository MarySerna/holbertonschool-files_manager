const sha1 = require('sha1');
const { v4: uuidv4 } = require('uuid');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

async function getConnect(req, res) {
  const header = req.headers.authorization.slice(6);
  const decoded = Buffer.from(header, 'base64').toString(); // decode base64
  const credentials = decoded.split(':');

  const doc = { email: credentials[0], password: sha1(credentials[1]) };
  const user = await dbClient.client.collection('users').findOne(doc);
  if (user) {
    const token = uuidv4();
    const key = `auth_${token}`;
    redisClient.set(key, user._id.toString(), 24 * 3600);
    res.json({ token });
  }
  else res.status(401).json({ error: 'Unauthorized' });
}

async function getDisconnect(req, res) {
  const key = req.headers['x-token'];
  const token = await redisClient.get(`auth_${key}`);
  if (token) {
    redisClient.del(`auth_${key}`);
    res.status(204).end();
  } else res.status(401).json({ error: 'Unauthorized' });
}

module.exports = { getConnect, getDisconnect };
