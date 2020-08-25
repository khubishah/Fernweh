const AppError = require('./../utils/appError');

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleJWTExpiredError = (err) =>
  new AppError('Your token has expired', 401);

const handleJWTError = (err) =>
  new AppError(`Invalid Token. Please log in again`, 401);

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('.')}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field name ${value}. Please use another value`;
  return new AppError(message, 400);
};

const sendErrorProd = (err, req, res) => {
  // operational, trusted error, send message to client
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
      });
    } // programming or other unknown error

    //console.error('ERROR', err);
    return res.status(500).json({
      status: 'error',
      message: 'something went very wrong',
    });
  }
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later',
  });
};

exports.errorHandler = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500; // 500 = internal server error
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    const error = { ...err };
    error.message = err.message;
    if (error.name === 'CastError') err = handleCastErrorDB(error);
    if (error.code === 11000) err = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') err = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') err = handleJWTError(error);
    if (error.name === 'TokenExpirerError') err = handleJWTExpiredError(error);
    sendErrorProd(err, req, res);
  }
};
