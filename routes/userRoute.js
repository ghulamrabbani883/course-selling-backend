const express = require('express');
const { getAllCourse, getCourseById } = require('../controller/adminController');
const { getPurchasedCourse, userSignUp, userLogin, purchaseCourse, updateUser, deleteUser } = require('../controller/userController');
const { userAuthenticate, adminAuthenticate } = require('../config/authenticate');
const userRoute = express.Router()


userRoute.post('/signup', userSignUp);
userRoute.post('/login', userLogin);
userRoute.put('/me/:publicId', userAuthenticate, updateUser);
userRoute.delete('/me/:publicId', userAuthenticate, deleteUser)
userRoute.get('/courses', getAllCourse );
userRoute.get('/courses/:courseId', getCourseById)
userRoute.post('/purchasedCourses', userAuthenticate, getPurchasedCourse);
userRoute.post('/purchase/:courseId', userAuthenticate, purchaseCourse);

module.exports = {userRoute}