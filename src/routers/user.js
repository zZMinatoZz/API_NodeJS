const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
// install 'multer' lib for uploading
const multer = require('multer');
// install sharp to handle image (resize, convert etc...)
const sharp = require('sharp');
const router = new express.Router();

router.post('/users', async (req, res) => {
    // console.log(req.body);
    // res.send('testing');

    const user = new User(req.body);

    // use async await
    try {
        const token = await user.generateAuthToken();
        await user.save();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }


    // user.save().then(() => {
    //     res.status(201).send(user);
    // }).catch((e) => {
    //     res.status(400).send(e);
    // });
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send();
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

// get all users
// auth: before get user, it will run middleware first
router.get('/users/me', auth, async (req, res) => {
    // get all users by using empty object
    // User.find({}).then((users) => {
    //     res.status(200).send(users);
    // }).catch((e) => {
    //     res.status(400).send(e);
    // });

    // try {
    //     const users = await User.find({});
    //     res.send(users);
    // } catch (e) {
    //     res.status(500).send(e);
    // }

    res.send(req.user);

});

// get user
// router.get('/users/:id', async (req, res) => {

//     const _id = req.params.id;

//     try {
//         const user = await User.findById(_id);
//         if (!user) {
//             res.status(404).send();
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send(e);
//     }

//     // User.findById(_id).then((user) => {
//     //     if (!user) {
//     //         res.status(404).send();
//     //     }
//     //     res.status(200).send(user);
//     // }).catch((e) => {
//     //     res.status(500).send(e);
//     // });
// });



// update user
router.patch('/users/me', auth, async (req, res) => {

    // **handling when trying to update a property does not exist
    // get all properties from body
    const updates = Object.keys(req.body);
    // list properties have right to update
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    // every() will loop all updates elements, if all elements satisfy condition, it will return true, otherwise if one of elements is not satisfy condition, it return false
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    });

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        // default new = false: return user before updated, true will return user after updated
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        // because when run update, it won't run the function before saved that we set up, so we will using different way instead of findByIdAndUpdate()
        // const user = await User.findById(req.params.id);

        // if (!user) {
        //     return res.status(404).send();
        // }

        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();

        res.send(req.user);

    } catch (e) {
        res.status(400).send(e);
    }
});

// delete user
router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id);
        // if (!user) {
        //     return res.status(404).send();
        // }

        await req.user.remove();

        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});
// dest: destination - location to store file uploaded
const upload = multer({
    limits: {
        // bytes
        fileSize: 1000000
    },
    // filter and allow to upload exactly files with extension
    // cb: callback, cb will run when fileFilter done
    fileFilter(req, file, cb) {

        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image file'));
        }

        cb(undefined, true);

        // send an error to person who upload file
        // cb(new Error('File must be a PDF'));
        // // if everything fine
        // cb(undefined, true)
        // // silent reject upload
        // cb(undefined, false)
    }
});

// customize an error that upload return
// const errorMiddleware = (req, res, next) => {
//     throw new Error('From my middleware')
// }

// passing middleware of multer. it will handle and find the param named 'avatar' in the request 
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize(250).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

// delete avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(400).send(e);
    }

});

// get avatar of user
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/jpg');
        res.send(user.avatar);
    } catch (e) {
        res.status(400).send(e);
    }
})

module.exports = router;