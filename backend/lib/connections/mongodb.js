const mongoUri = _.get(config, 'mongodb.uri', process.env.MONGODB_URI || 'mongodb://localhost:27017/bdshy');

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

db.on('error', (err) => {
  logger.logError('MongoDB connection error:', err.message);
});

db.once('open', () => {
  logger.logInfo('MongoDB connected:', mongoUri);
});

db.on('disconnected', () => {
  logger.logWarn('MongoDB disconnected');
});

module.exports = db;
