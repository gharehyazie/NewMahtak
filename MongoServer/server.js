var mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient
var url = 'mongodb://localhost:27017/data'
const http = require('http')
const port = 8082
var cron = require('node-schedule')

cron.scheduleJob('0 1 0 * * *', function() {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err)
        } else {
            currentDate = new Date().toDateString().substring(4, 10)
            db.collection('usageDate').insert({ currentDate: 0 }, function(err, result) {
                if (err) {
                    console.log(err)
                }
            })
            db.collection('installDate').insert({ currentDate: 0 }, function(err, result) {
                if (err) {
                    console.log(err)
                }
            })

            // db.collection('dailyUsers').insert({ currentDate: '' }, function(err, result) {
            //     if (err) {
            //         console.log(err)
            //     }
            // })
        }
    })
})
const requestHandler = (request, response) => {
    var body = []
    var res = []
    request.on('data', function(chunk) {
        body.push(chunk)
    }).on('end', function() {
        body = Buffer.concat(body).toString()
        bodyJson = JSON.parse(body)
        reqDate = new Date(bodyJson.date)
        reqInstallDate = new Date(bodyJson['install date'])
        MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err)
            } else {

                // data collection
                var dataCollection = db.collection('data')
                dataCollection.insert(bodyJson, function(err, result) {
                        if (err) {
                            console.log(err)
                        }
                    })
                    // // daily Users
                    // currentDate = new Date().toDateString().substring(4, 10)
                    // var dataCollection = db.collection('dailyUsers')
                    // dataCollection.update({ currentDate: 1 }, { $push: { scores: 89 } }, function(err, result) {
                    //     if (err) {
                    //         console.log(err)
                    //     }
                    // })

                // install date 
                var installDateCollection = db.collection('installDate')
                var rest = []

                function queryCollection(collection, callback) {
                    collection.find({ 'UUID': bodyJson['UUID'] }, { 'collection': 1 }).toArray(
                        function(err, result) {
                            if (err) {
                                console.log(err)
                            } else if (result.length > 0) {
                                rest.push(result)
                                callback()
                            }
                        })
                }

                queryCollection(dataCollection, function() {

                    if (bodyJson.hasOwnProperty('install date') && rest[0].length == 1) {
                        var installDate = reqInstallDate.toDateString().substring(4, 10)
                        installDateCollection.update({ 'date': installDate }, { '$inc': { 'newInstalls': 1 } }, { 'upsert': true }, function(err, result) {
                            if (err) {
                                console.log(err)
                            }
                        })
                    }
                })

                // usage date 
                var usageDateCollection = db.collection('usageDate')
                if (bodyJson.hasOwnProperty('date')) {
                    dateData = reqDate.toDateString().substring(4, 10)
                    usageDateCollection.update({ 'date': dateData }, { '$inc': { 'sequence': 1 } }, { 'upsert': true }, function(err, result) {
                        if (err) {
                            console.log(err)
                        }
                    })
                }
            }
            // db.close()
        })
    })
    response.end('Done')
}
const server = http.createServer(requestHandler)
server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
})