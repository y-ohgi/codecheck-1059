'use strict';
var
express = require('express'),
app = express(),
port = process.env.PORT || 3000,
parser = require('body-parser'),
knex = require('knex')({
    dialect: 'sqlite3',
    connection: {
	filename: ':memory:'
    },
    useNullAsDefault: true
});

app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));


app.get('/api/projects', function (req, res, next) {
    
    knex.select("*").from('projects')
	.then(function(projects){
	    res.json(projects);
	    return next();
	})
	.catch(function(err){
	    res.status(500).json(err);
	    return next();
	});
});


app.post('/api/projects', function (req, res, next) {
    
    var title = req.body.title,
	description = req.body.description,
	url = req.body.url;
    
    if(!description || !title){
	res.status(400).json("");
	return next();
    }

    
    knex('projects').insert({
	title: title,
	description: description,
	url: url
    }).then(function(ids){
	res.json({
	    id: ids[0],
	    title: title,
	    description: description,
	    url: url
	});
	return next();
    }).catch(function(err){
	console.log(req.body);
	console.log(err);
	res.status(500).json(err);
	return next();
    });
});


app.get('/api/projects/:id', function (req, res, next) {
    knex.select("*").from('projects').where({id:req.params.id})
	.then(function(project){
	    if(project.length > 0){
	    res.json(project);
	    return next();
	    }
		res.status(404).json("");
		return next();
	})
	.catch(function(err){
	    res.status(500).json(err);
	    return next();
	});
});

app.delete('/api/projects/:id', function (req, res, next) {
    knex('projects').where('id', req.params.id).del()
	.then(function(project){
	    if(project === 0){
		res.status(404).json("");
		return next();
	    }
	    res.json(project);
	    return next();
	}).catch(function(err){
	    res.status(500).json(err);
	    return next();
	});
    
    // res.json('PONG');
    // return next();
});


/** @ToDo
   * Initialize database
   * this is for 'in-memory' database and should be removed
 */
var sqls = require('fs')
	.readFileSync(__dirname + '/specifications/database.sql')
	.toString();

knex.raw(sqls)
    .then(function () {
	/** @ToDo
	 * Run server after database initialization
	 * this is for 'in-memory' database and should be removed
	 */
	app.listen(port, function () {
	    console.log("Server running with port", port)
	});
    });
