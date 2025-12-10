const Training = require('../models/Training')
const path = require('path')

exports.createTraining = async (req, res, next) => {
    try {
        const training = await Training.create(req.body);
        res.status(201).json({ success: true, data: training });
    } catch (error) {
        next(error)
    }
}

exports.getAllTraining = async (req, res, next) => {
    try {
        let queryStr = JSON.stringify(req.query)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

        let query = Training.find(JSON.parse(queryStr));
        // select specific fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // pagination
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 2
        const startIndex = (page - 1) * limit
        const endIndex = page * limit;
        const total = await Training.countDocuments();
        query = query.skip(startIndex).limit(limit)
        const pagination = {};
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit,
            };
        }
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit,
            };
        }

        // result
        const trainings = await query.populate();
        res.status(200).json({ success: true, count: trainings.length, pagination, data: trainings });
    } catch (error) {
        next(error)
    }
}

exports.getTraining = async (req, res, next) => {
    try {
        const training = await Training.findById(req.params.id);
        if (!training) {
            return res.status(400).json({ success: false, msg: 'Not found' });
        }
        res.status(200).json({ success: true, data: training });
    } catch (error) {
        next(error)
    }
};

exports.updateTraining = async (req, res, next) => {
    try {
        const training = await Training.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // A frissített adatokat kapjuk vissza
            runValidators: true, // Ellenőrizze a frissített adatokat a modell
        });
        if (!training) {
            return res.status(400).json({ success: false, msg: "Not found" });
        }
        res.status(200).json({ success: true, data: training });
    } catch (error) {
        next(error)
    }
};

exports.deleteTraining = async (req, res, next) => {
    try {
        const training = await Training.findByIdAndDelete(req.params.id);
        if (!training) {
            return res.status(400).json({ success: false, msg: "Not found" });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error)
    }
};

exports.trainingPhotoUpload = async (req, res, next) => {
    try {
        console.log(req.params.id);
        const training = await Training.findById(req.params.id);
        if (!training) {
            return res.status(400).json({ success: false, error: "Not found" });
        }

        if (!req.files) {
            return res.status(400).json({ success: false, error: "Please upload a file" });
        }
        const file = req.files.file
        if (!file.mimetype.startsWith('image')) {
            return res.status(400).json({ success: false, error: "Please upload an image file" });
        }

        if (file.size > process.env.MAX_FILE_UPLOAD) {
            return res.status(400).json({ success: false, error: `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}` });
        }

        file.name = `photo_${training.id}${path.parse(file.name).ext}`
        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, error: `Problem with file upload` });
            }
        })
        await Training.findByIdAndUpdate(req.params.id, { photo: file.name })
        res.status(200).json({
            success: true,
            data: file.name
        })


    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}
