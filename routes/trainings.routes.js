const express = require('express');
const router = express.Router();
const trainings = require('../controllers/trainings.controller')
const courses = require('../controllers/courses.controller')

router.post('/', trainings.createTraining)
router.delete('/:id', trainings.deleteTraining)
router.put(':id', trainings.updateTraining)
router.get('/', trainings.getAllTraining)
router.get('/:id', trainings.getTraining)
router.get('/:trainingId/courses', courses.getCourses)
router.post('/:trainingId/courses', courses.createCourse)

router.route('/:id/photo').put(trainings.trainingPhotoUpload)


module.exports = router;