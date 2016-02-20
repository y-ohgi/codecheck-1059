'use strict';
var
express = require('express'),
app = express(),
port = process.env.PORT || 3000,
parser = require('body-parser'),
knex = require('knex')({
    dialect: 'sqlite3',
    connection: {
	filename: './data.db'
    }
});

app.use(parser.json());
app.use(express.static(__dirname + '/public'))




app.get('/api/projects', function (req, res, next) {
    res.json('PONG');
    return next();
});

app.get('/api/projects/:id', function (req, res, next) {
    res.json('PONG');
    console.log("GET: "+req.params.id);
    return next();
});

app.delete('/api/projects/:id', function (req, res, next) {
    res.json('PONG');
    console.log("DELETE: "+req.params.id);
    return next();
});


//======
app.get('/api/ping', function (req, res, next) {
    res.json('PONG');
    return next();
});

app.get('/api/notfound', function (req, res, next) {
    res.status(404).json('NotFound');
    return next();
});

app.post('/api/badrequest', function (req, res, next) {
    res.status(400).json('BadRequest');
    return next();
})
/**/



app.listen(port, function () {
    console.log('Server running with port', port);
});
