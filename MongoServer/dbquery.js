var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var http = require('http');
var oooo = [];

http.createServer(function(request, response) {

    response.setHeader('Access-Control-Allow-Headers', '*');

    var headers = request.headers;
    var method = request.method;
    var url = request.url;
    var body = [];
    request.on('error', function(err) {
        console.error(err);
    }).on('data', function(chunk) {
        body.push(chunk);
    }).on('end', function() {
        body = Buffer.concat(body).toString();
        // BEGINNING OF NEW STUFF

        response.on('error', function(err) {
            console.error(err);
        });

        response.writeHead(200, { 'Content-Type': 'application/json' })

        MongoClient.connect('mongodb://mohsenhq:Mohsenhq102@localhost:27017/data?authMechanism=DEFAULT&authSource=admin', function(err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err)
            } else {
                var collection = db.collection('data');
                collection.find({}).sort({ _id: -1 }).limit(1).toArray(function(err, results) {
                    oooo = results;
                });
            }
        });

        response.write(JSON.stringify(oooo));
        response.end();
        // Note: the 2 lines above could be replaced with this next one:
        // response.end(JSON.stringify(responseBody))

        // END OF NEW STUFF
    });
}).listen(80);