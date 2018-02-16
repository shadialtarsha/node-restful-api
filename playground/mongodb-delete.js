const { MongoClient, ObjectId } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to Mongodb server');
    }

    //deleteMany
    //deleteOne
    //findOneAndDelete
    const db = client.db('TodoApp');
    db.collection('Todos')
        .deleteOne({ text: 'Something to do' })
        .then((results) => {
            debugger;
            console.log(JSON.stringify(results, undefined, 2));
        })
        .catch((err) => {
            console.log('Unable to delete data', err);
        });
    client.close();
});