const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' }); // do this before app
const app = require('./app');

const port = process.env.PORT || 3000;
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful');
  });

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// unhandled async
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  // shut down application
  console.log('unhandled rejection! Shutting down...');
  // shut down gravefully
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down...');
});

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  // entire node process is an unclean state, so we need to terminate the application
  server.close(() => {
    process.exit(1);
  });
});
