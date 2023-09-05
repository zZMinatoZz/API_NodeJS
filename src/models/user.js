const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

// use schema to take advantage of middleware
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('password is not supported, please try another password!');
            }
        }

    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    avatar: {
        // allow to store binary data
        type: Buffer
    }
}, {
    timestamps: true
});
// create virtual, it's not actually changing data that stored in db, it's just a way for mongoose to figure out how these two things are related
userSchema.virtual('tasks', {
    ref: 'Task',
    // where that local data is stored
    localField: '_id',
    // name of the field on the 'task' that's going to create relationship
    foreignField: 'owner'
})

// toJSON automatically get called by JSON.stringify(), when res.send() get called, data will be converted to json by call JSON.stringify (express behaviour) 
userSchema.methods.toJSON = function () {
    const user = this;
    // raw profile data
    const userObject = user.toObject();

    // remove private data of user to response
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

// methods: can access on the instances (instance methods)
userSchema.methods.generateAuthToken = async function () {
    const user = this;

    // object: data that stored in payload, string: secret key
    const token = jwt.sign({ _id: user._id.toString() }, 'secretkey');

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

// statics: add static functions to model, can access on the model (model methods)
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
}

// ** hash the plain text password before saving
// pre: doing something before an event (validation, saving)
// post: doing something after an event
// using regular standard function, because 'this' will be bind to which object that call this function
// in this case, 'this' bind to document that being saved
userSchema.pre('save', async function (next) {
    const user = this;

    // console.log('just before saving');

    // check if password being changed, true when create user and password being changed
    if (user.isModified('password')) {
        // 8: how many round hash being used
        user.password = await bcrypt.hash(user.password, 8);
    }

    // call 'next' to exactly know when code above run done
    next();
});

// delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this;

    await Task.deleteMany({ owner: user._id });

    next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;