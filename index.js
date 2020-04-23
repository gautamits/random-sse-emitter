var faker = require('faker')
var express = require('express')
var request = require('superagent')
var app = express();
var fs = require('fs');
const readline = require('readline');
var cors = require('cors')
app.use(cors())


const data = fs.readFileSync('star-wars.txt', 'utf8');

async function chuck(req, res) {
    try {
        const result = await request.get('https://api.chucknorris.io/jokes/random')
        //const result2 = await result.json()
        //console.log({result2});
        res.status(200).type('json').send(result.text)
    }
    catch (err) {
        console.log({ err })
        res.status(500);
        res.send(err)

    }
}
app.get('/', function (req, res) {
    res.send("Hello world!");
});

app.get('/success', function (req, res) {
    res.send('success')

})

app.get('/error', function (req, res) {
    var error = new Error('something went wrong')
    next(error);
})

app.get('/chuck', chuck)

// setInterval(function () {
//     console.log(faker.lorem.paragraph());
// }, 100)

app.get('/counter', function(req, res){
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-transform',
        'Connection': 'keep-alive',
    });
    const initialIndex = req.headers['last-event-id'] ? Number(req.headers['last-event-id']) + 1 :  0
    // res.write('\n');
    myFunction(req, res, initialIndex);
})

function myFunction(req, res, id) {
    let lines = data.split("\n");
    if (id === lines.length - 1) {
        res.end()
        return
    }

    res.write(`id: ${id} \n`);
    res.write(`data: ${lines[id]} \n\n`);
    // chrome times out after 2 minutes
    var rand = Math.round(Math.random() * (60000*4 - 500)) + 500; // generate new time (between 3sec and 500"s)
    console.log(`${rand / 60000}m`)
    setTimeout(()=>myFunction(req, res, id+1), rand);
}

app.use((err, req, res, next) => {
    res.status(500);
    res.send('something went wrong')
})
app.listen(80)
