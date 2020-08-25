const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
// start up a server

// importing the routers
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const app = express();
// template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//mounting the routers

//app.use(express.static(`${__dirname}/public`));

// 1 global middlewares

/// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// set security HTTP headers
app.use(helmet());
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 100 requests within an hour from a given IP
  message: 'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);
// reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // middleware for JSON format
// reading data from forms
app.use(express.urlencoded({ extended: true, limit: '10kb'}));
//parse data from cookies
app.use(cookieParser());
// data sanitization against NoSQL query injection
app.use(mongoSanitize()); // filters out $ and .

// Data sanitization against XSS
app.use(xss()); // malicious html code and js code

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use((req, res, next) => {
  // next is the next middleware function
  //console.log('Hello from middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); //adding a field to request
  //console.log(req.cookies);
  next();
});

app.use('/', viewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/users', userRouter);
// unhandled routes
app.all('*', (req, res, next) => {
  /*
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;
  */
  // next(err); // skips all middlewear and goes straight to error handling middleware
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler.errorHandler);

module.exports = app;

// route handlers

//routes

/*
app.post('/api/v1/tours', createTour);
 
app.patch('/api/v1/tours/:id', updateTour);

app.get('/api/v1/tours', getAllTours);

app.get('/api/v1/tours/:id', getTour);

app.delete('/api/v1/tours/:id', deleteTour);
*/
/*
app.get('/', (req, res) => {
    res.status(200).json({message: 'hello from the server side', app: 'natours'});
});

app.post('/', (req, res) => {
    res.send('you can post to this endpoint');
});
*/
