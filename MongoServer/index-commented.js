// content of index.js
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
  console.log(bodyJson)
  
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err)
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to', url)

    // Get the documents collection
    var collection = db.collection('data')

    
    

    // Insert body
    collection.insert(bodyJson, function (err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result)
      }
      //Close connection
      db.close()
    })
  }
})
  // at this point, `body` has the entire request body stored in it as a string
})


 
  console.log(request.url)
  response.end('Hello Node.js Server!')
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
