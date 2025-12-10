const express = require('express');
const router = express.Router({mergeParams:true});
const courses = require('../controllers/courses.controller')

// router.post('/', courses.createTraining)
router.route('/:id').get(courses.getCourses).put(courses.updateCourse).delete(courses.deleteCourse);

module.exports = router;