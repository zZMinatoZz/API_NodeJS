const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

const router = new express.Router();

// create task
router.post('/tasks', auth, async (req, res) => {

    //    const task = new Task(req.body);

    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }

    // const task = new Task(req.body);
    // task.save().then(() => {
    //     res.status(201).send(task);
    // }).catch((e) => {
    //     res.status(400).send(e);
    // });
});

// get /tasks?completed=true : filtering
// get /tasks?limit=2&skip=2 : pagination
// get /tasks?sortBy=createdAt:desc : sorting
router.get('/tasks', auth, async (req, res) => {

    const match = {};
    const sort = {};

    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try {
        // const tasks = await Task.find({ owner: req.user._id });
        await req.user.populate({
            path: 'tasks',
            match,
            // that property can be used for pagination and sorting
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                // sort: {
                //     // asc is 1, desc is -1
                //     createdAt: -1
                // }
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (e) {
        res.status(500).send(e);
    }

    // Task.find({}).then((tasks) => {
    //     res.status(200).send(tasks);
    // }).catch((e) => {
    //     res.status(500).send(e);
    // })
});

// get task
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        // const task = await Task.findById(_id);
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            res.status(404).send();
        }

        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }

    // Task.findById(_id).then((task) => {
    //     if (!task) {
    //         res.status(404).send();
    //     }
    //     res.send(task);
    // }).catch((e) => {
    //     res.status(500).send(e);
    // });

});

// udapte task
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdate = ['description', 'completed'];
    const isValid = updates.every((update) => {
        return allowedUpdate.includes(update);
    });

    if (!isValid) {
        return res.status(400).send({ error: 'Can\'t update the property that doesn\'t exist' });
    }

    try {

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => {
            task[update] = req.body[update];
        });

        await task.save();

        res.send(task);

    } catch (e) {
        res.status(500).send(e);
    }
});

// delete task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;