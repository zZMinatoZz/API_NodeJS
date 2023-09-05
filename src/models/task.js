const mongoose = require('mongoose');


const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true,
        lowercase: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         trim: true,
//         required: true,
//         lowercase: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     },
//     owner: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: 'User'
//     }
// });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;