var mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient
var url = 'mongodb://localhost:27017/data'
const http = require('http')  
const port = 80
const requestHandler = (request, response) => {  
var body = []
request.on('data', function(chunk) {
  body.push(chunk)
}).on('end', function() {
  body = Buffer.concat(body).toString()
  bodyJson = JSON.parse(body)  
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err)
  } else {
    var collection = db.collection('data')
    collection.insert(bodyJson, function (err, result) {
      if (err) {
        console.log(err)
      }
      db.close()
    })
  }
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
