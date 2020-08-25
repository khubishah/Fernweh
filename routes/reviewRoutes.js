const express = require('express');
const reviewController = require('./../controllers/reviewController');
const reviewRouter = express.Router({ mergeParams: true });
// parent router params are passed on thanks to mergeParams
const authController = require('./../controllers/authController');

//tourRouter.param('id', tourController.checkID);
reviewRouter.use(authController.protect);
reviewRouter
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

reviewRouter
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = reviewRouter;
