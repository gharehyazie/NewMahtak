var mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient
var url = 'mongodb://mohsenhq:Mohsenhq102@localhost:27017/data?authMechanism=DEFAULT&authSource=admin'
const http = require('http')
const port = 8082
var cron = require('node-schedule')

// cron.scheduleJob('0 0 0 * * *', function() {
//     MongoClient.connect(url, function(err, db) {
//         if (err) {
//             console.log('Unable to connect to the mongoDB server. Error:', err)
//         } else {
//             // present date
//             currentDate = new Date().toDateString()//.substring(4, 10)

//             // every day addes a 0 data to usageDate collection to avoid missing date
//             db.collection('usageDate').insert({ 'date': currentDate, 'sequence': 0 }, function(err, result) {
//                 if (err) {
//                     console.log(err)
//                 }
//             })


//             // every day addes a 0 data to installDate collection to avoid missing date
//             db.collection('installDate').insert({ 'date': currentDate, 'newInstalls': 0 }, function(err, result) {
//                 if (err) {
//                     console.log(err)
//                 }
//             })

//             // every day addes a empty data to dailyUsers collection to be able to update the collection date
//             db.collection('dailyUsers').insert({ 'date': currentDate, 'UUID': [] }, function(err, result) {
//                 if (err) {
//                     console.log(err)
//                 }
//             })
//         }
//     })
// })
const requestHandler = (request, response) => {
    var body = []
    var res = []
    request.on('data', function (chunk) {
        body.push(chunk)
    }).on('end', function () {
        // request body 
        body = Buffer.concat(body).toString()
        // json parsed body 
        bodyJson = JSON.parse(body)
        // date of current request
        reqDate = new Date(bodyJson.date)
        dateData = reqDate.toDateString() //.substring(4, 10)
        // console.log(dateData)
        // install date of app
        reqInstallDate = new Date(bodyJson['install date'])
        installDate = reqInstallDate.toDateString() //.substring(4, 10)

        ce = Object.keys(bodyJson).filter(v => v.startsWith('CustomEvent_'))

        // ce.forEach(function (element) {
        //     console.log(bodyJson[element])
        //     delete bodyJson[element]
        //     console.log(bodyJson[element])
        // })

        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err)
            } else {

                /** 
                 * data collection
                 * inserts @bodyJson to db
                 */
                var dataCollection = db.collection('data')
                dataCollection.insert(bodyJson, function (err, result) {
                    if (err) {

                        console.log("hello .. " + err)

                    }
                })

                /** 
                 * customEvent collection
                 * inserts customEvents to db
                 */
                var dataCollection = db.collection('customEvent')
                ce.forEach(function (element) {
                    dataCollection.update({
                        'APP': bodyJson['PACKAGE_NAME']
                    }, {
                        $addToSet: {
                            custom: element
                        }
                        // element: bodyJson[element]
                    }, {
                        'upsert': true
                    }, function (err, result) {
                        if (err) {

                            console.log("hello .. " + err)

                        }
                    })
                })

                /** 
                 * daily Users 
                 * inserts uniqe UUIDs based on install date to db
                 */
                var dataCollection = db.collection('dailyUsers')
                dataCollection.update({
                    'date': installDate,
                    'APP': bodyJson['PACKAGE_NAME']
                }, {
                    $addToSet: {
                        'UUID': bodyJson['UUID']
                    }
                }, {
                    'upsert': true
                }, function (err, result) {
                    if (err) {
                        console.log(err)
                    }
                })

                /** 
                 * install date 
                 * counts number of new UUIDs
                 */
                var installDateCollection = db.collection('installDate')
                var rest = []

                function queryCollection(collection, callback) {
                    collection.find({
                        'UUID': bodyJson['UUID']
                    }, {
                        'collection': 1
                    }).toArray(
                        function (err, result) {
                            if (err) {
                                console.log(err)
                            } else if (result.length > 0) {
                                rest.push(result)
                                callback()
                            }
                        })
                }

                queryCollection(db.collection('data'), function () {
                    if (bodyJson.hasOwnProperty('install date') && rest[0].length == 1) {
                        installDateCollection.update({
                            'date': installDate,
                            'APP': bodyJson['PACKAGE_NAME']
                        }, {
                            '$inc': {
                                'newInstalls': 1
                            }
                        }, {
                            'upsert': true
                        }, function (err, result) {
                            if (err) {
                                console.log(err)
                            }
                        })
                    }
                })

                // usage date 
                var usageDateCollection = db.collection('usageDate')
                if (bodyJson.hasOwnProperty('date')) {
                    usageDateCollection.update({
                        'date': dateData,
                        'APP': bodyJson['PACKAGE_NAME']
                    }, {
                        '$inc': {
                            'sequence': 1
                        }
                    }, {
                        'upsert': true
                    }, function (err, result) {
                        if (err) {
                            console.log(err)
                        }
                    })
                }

                // Duration table
                var durationCollection = db.collection('duration')
                if (bodyJson.hasOwnProperty('endDate')) {
                    endDate = new Date(bodyJson['endDate'])
                    startDate = new Date(bodyJson['date'])
                    date = (startDate).toDateString() //.substring(4, 10)
                    durationCollection.insert({
                        'date': date,
                        'APP': bodyJson['PACKAGE_NAME'],
                        'duration': (endDate - startDate) / 1000
                    }, function (err, result) {
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