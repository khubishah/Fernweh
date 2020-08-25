const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const userRouter = express.Router();

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.get('/logout', authController.logout);

userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

// this will come before all the routes below this use
userRouter.use(authController.protect);
userRouter.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);
userRouter.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);

userRouter.delete('/deleteMe', authController.protect, userController.deleteMe);

userRouter.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  // attached on request as req.file since req.body cannot handle an uploaded image
  userController.resizeUserPhoto,
  authController.protect,
  userController.updateMe
);

userRouter.use(authController.restrictTo('admin'));
userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// POST /tour/231231/reviews
// GET /tour/23142/reviews
// GET /tour/11111/reviews/9991230

module.exports = userRouter;
