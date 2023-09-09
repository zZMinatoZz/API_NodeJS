const mongoose = require('mongoose');


mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    // make sure when mongoose works with mongodb, our indexes are created allowing us to quickly access the data we need to access
    useCreateIndex: true
});

// creating model


// const me = new User({
//     name: ' LuciAn ',
//     email: 'lucian@123.com',
//     password: 'password'
// });

// me.save().then(() => {
//     console.log(me);
// }).catch((error) => {
//     console.log('Error!', error);
// });

// challenge
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
//     }
// });

// const taskToday = new Task({
//     description: '  Playing football with friends    '
// });

// taskToday.save().then(() => {
//     console.log(taskToday);
// }).catch((error) => {
//     console.log('Error!', error);
// });

// REST API
// create: using POST
// read: using GET
// update: using PATCH
// delete: using DELETE

// npm i nodemon --save-dev: save nodemon as a development dependency


// data validation and sanitization
