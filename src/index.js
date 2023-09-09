const express = require('express');
// ensure that file run 
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
const userRoute = require('./routers/user');
const taskRoute = require('./routers/task');



const app = express();
// setup port follow environment to be able run on heroku
const port = process.env.PORT;

// register middleware, must be adding is above other app.use calls
// app.use((req, res, next) => {
//     console.log(req.method, req.path);
//     next();
// });

// challenge
// app.use((req, res, next) => {
//     res.status(503).send('Server is maintenancing, try it later!');
// });

// configuring express to automatically parse the income JSON to an object
app.use(express.json());
app.use(userRoute);
app.use(taskRoute);

//
// Without middleware: new request => run route handler
//
// with middleware: new request => do something => run route handler
//



app.listen(port, () => {
    console.log('Server is up on port ' + port);
});