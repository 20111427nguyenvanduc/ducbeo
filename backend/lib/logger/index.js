const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

const Logger = (logDir) => {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const dailyRotateTransport = new winston.transports.DailyRotateFile({
    filename: path.join(logDir, 'app-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'info',
  });

  const errorRotateTransport = new winston.transports.DailyRotateFile({
    filename: path.join(logDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
    level: 'error',
  });

  const logger = new winston.Logger({
    transports: [
      new winston.transports.Console({
        level: 'debug',
        colorize: true,
        timestamp: () => new Date().toISOString(),
      }),
      dailyRotateTransport,
      errorRotateTransport,
    ],
  });

  logger.logInfo = (...args) => logger.info(args.join(' '));
  logger.logError = (...args) => logger.error(args.join(' '));
  logger.logWarn = (...args) => logger.warn(args.join(' '));
  logger.logDebug = (...args) => logger.debug(args.join(' '));

  return logger;
};

module.exports = Logger;
