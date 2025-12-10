const Course = require('../models/Course')

// @desc   Get courses
// @route  GET /api/courses
// @route  GET /api/trainings/:trainingId/courses
// @access Public
exports.getCourses = async (req, res, next) => {
    try {
        let query
        if (req.params.trainingId) {
            query = Course.find({ training: req.params.trainingId })
        } else {
            query = Course.find()
                // .populate('training')
                .populate({
                    path: 'training',
                    select: '-_id name description'
                })

            // remove id and leave name + desc
        }
        const courses = await query
        if (courses.length === 0) {
            return res
                .status(404)
                .json({ success: false, msg: `Not found ${req.params.trainingId} id` })
        }
        res
            .status(200)
            .json({ success: true, count: courses.length, data: courses })
    } catch (error) {
        next(error)
    }
}

exports.createCourse = async (req, res, next) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json({ success: true, data: course });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
}

exports.updateCourse = async (req, res, next) => {
    try {
        let course = await Course.findById(req.params.id)
        if (!course) {
            return next(new ErrorResponse(`No course with the id of ${req.params.id}`, 404))
        }
        course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({ success: true, data: course })
    } catch (error) {
        next(error)
    }
}

exports.deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id)
        if (!course) {
            return next(new ErrorResponse(`No course with the id of ${req.params.id}`, 404))
        }
        await course.remove()
        res.status(200).json({ success: true, data: {} })
    } catch (error) {
        next(error)
    }
}
