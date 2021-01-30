const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

/** getStatus - callback for route GET /status*/
function getStatus(req, res) {
  if (redisClient.isAlive() && dbClient.isAlive()) {
    res.status(200).json({ redis: true, db: true });
  }
}

/** getStats - callback for route GET /stats*/
async function getStats(req, res) {
  const userNum = await dbClient.nbUsers();
  const fileNum = await dbClient.nbFiles();
  res.status(200).json({ users: userNum, files: fileNum });
}

module.exports = { getStats, getStatus };
