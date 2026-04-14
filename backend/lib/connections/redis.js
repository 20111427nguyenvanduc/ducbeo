const redis = require('redis');

const redisHost = _.get(config, 'redis.host', process.env.REDIS_HOST || 'localhost');
const redisPort = _.get(config, 'redis.port', process.env.REDIS_PORT || 6379);
const redisPassword = _.get(config, 'redis.password', process.env.REDIS_PASSWORD || '');

const options = {
  host: redisHost,
  port: redisPort,
};

if (redisPassword) {
  options.password = redisPassword;
}

const client = redis.createClient(options);

client.on('connect', () => {
  logger.logInfo('Redis connected:', `${redisHost}:${redisPort}`);
});

client.on('error', (err) => {
  logger.logError('Redis error:', err.message);
});

module.exports = client;
