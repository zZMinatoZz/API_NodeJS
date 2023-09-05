// CRUD
// install: npm i mongodb: this lib allow us to connect to a mongodb database from nodejs
// const mongodb = require('mongodb');

// mongo client gonna give us access to the function necessary to connect to the db
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;

// we can use this way (destructuring) instead of use 3 lines before
const { MongoClient, ObjectID } = require('mongodb');

// generate new ID
const id = new ObjectID();
console.log(id);

const connectionURL = 'mongodb://127.0.0.1:27017';

// name db
const databaseName = 'task-manager';
// useNewUrlParser: for our Urls to be parsed correctly
// connect to the specific server
MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!');
    }

    // get the connection for the specific database
    const db = client.db(databaseName);

    // db.collection('users').insertOne({
    //     // we can set ID for document which id that created above
    //     _id: id,
    //     name: 'Nam Nguyen',
    //     age: 29
    // }, (error, result) => {
    //     // this callback will be called when the operation is complete
    //     if (error) {
    //         return console.log('Unable to insert user');
    //     }

    //     // ops: an array, contains all of the documents that were inserted
    //     console.log(result.ops);
    // });

    // db.collection('users').insertMany([
    //     {
    //         name: 'Jen',
    //         age: 28
    //     },
    //     {
    //         name: 'Charles',
    //         age: 32
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert documents!');
    //     }

    //     console.log(result.ops);
    // });
    // insert many documents to 'tasks' collection
    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Do the homework',
    //         completed: false
    //     },
    //     {
    //         description: 'Washing dishes',
    //         completed: true
    //     },
    //     {
    //         description: 'Playing football with friends',
    //         completed: true
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert documents');
    //     }

    //     console.log(result.ops);
    // });

    // **querying documents
    // db.collection('users').findOne({ name: 'Jen' }, (error, user) => {
    //     if (error) {
    //         return console.log('Unable to fetch');
    //     }

    //     console.log(user);
    // });
    // query by ID, ID stored by using binary so we can't search by id, we must use ObjectID
    // db.collection('users').findOne({ _id: new ObjectID('64dc96a4f33c641894d787cc') }, (error, user) => {
    //     if (error) {
    //         return console.log('Unable to fetch');
    //     }

    //     console.log(user);
    // });

    // multiple query
    // db.collection('users').find({ age: 29 }).toArray((error, users) => {
    //     console.log(users)
    // });
    // // log total results matched
    // db.collection('users').find({ age: 29 }).count((error, count) => {
    //     console.log(count)
    // });

    // // challenges
    // db.collection('tasks').findOne({ _id: new ObjectID('64dc9d38b9796a2c68dae2fe') }, (error, result) => {
    //     if (error) return console.log('Unable to fetch');
    //     console.log(result);
    // });
    // db.collection('tasks').find({ completed: false }).toArray((error, tasks) => {
    //     console.log(tasks);
    // });

    // *** update documents using promise
    // db.collection('users').updateOne({
    //     _id: new ObjectID('64dc96a4f33c641894d787cc')
    // },
    //     {
    //         $set: {
    //             name: 'Jack'
    //         }
    //     }).then((result) => {
    //         console.log(result);
    //     }).catch((error) => {
    //         console.log(error);
    //     });

    // update multiple
    // db.collection('tasks').updateMany(
    //     {
    //         completed: true
    //     },
    //     {
    //         $set: {
    //             completed: false
    //         }
    //     }
    // ).then((result) => {
    //     console.log(result.modifiedCount);
    // }).catch(() => {
    //     console.log(error);
    // });


    // *** delete documents
    db.collection('users').deleteMany({
        age: 29
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    })

    // challenge
    db.collection('tasks').deleteOne(
        {
            description: 'Do the homework'
        }
    ).then((result) => {
        console.log(result)
    }).catch(() => {
        console.log(error);
    });

    // *** In MongoDB, Ids are know as GUIDs (globally unique identifiers)
    // in SQL, ID is increased automatically, cause problem when we use more than 1 database, like conflicted by same IDs
});


// *** mongoose: a lib installed from npm, allow you to for example: set up validation for documents defining which fields are required, which are optinal, what types
// of data etc..