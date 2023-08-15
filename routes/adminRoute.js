const express = require('express');
const { getAllCourse, getCourseById, createCourse, updateCourse, deleteCourse, adminSignUp, adminLogin } = require('../controller/adminController');
const { adminAuthenticate } = require('../config/authenticate');
const { updateUser, deleteUser } = require('../controller/userController');
const adminRoute = express.Router()


adminRoute.post('/signup', adminSignUp);
adminRoute.post('/login', adminLogin);
adminRoute.put('/user/:publicId', adminAuthenticate, updateUser);
adminRoute.delete('/user/:publicId', adminAuthenticate, deleteUser)
adminRoute.get('/courses', getAllCourse );
adminRoute.get('/courses/:courseId', getCourseById)
adminRoute.post('/courses', adminAuthenticate, createCourse);
adminRoute.put('/courses/:courseId', adminAuthenticate, updateCourse);
adminRoute.delete('/courses/:courseId', adminAuthenticate, deleteCourse);


module.exports = {adminRoute}