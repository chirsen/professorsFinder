'use strict'

var express = require('express');
var http = require('http');
var url = require('url');
var fs = require('fs');
var util = require('util');
var mysql = require('mysql');

var app = express();
var pool = mysql.createPool({
	connectionLimit:10,
	host  : 'localhost',
	user  : 'root',
	password:'q',
	database:'professor'
});


app.use(express.static('public'));

app.get('/reserchersFinder', function(req, res){
	var pathname = url.parse(req.url).pathname;
	res.sendFile(__dirname+"/"+"index.html");
	console.log("接受：");
});


app.get("/upload", function(req, res){
	pool.getConnection(function(err, connction){
		if(err){
			console.log("连接错误");
			throw err;
		}
		connction.query('select * from ccnu where id < 3', function(error, rows){

			var professors = new Object();
			for(var i = 0; i < rows.length; i++){
				var professor = new Object();
				professor.name = rows[i].name;
				professor.direction = rows[i].direction;
				professor.level = rows[i].level;
				professor.school  = rows[i].school;
				professor.link  = rows[i].link;
				professors[i] = professor;
			}

			console.log(professors);
			connction.release();
			var text = JSON.stringify(professors);
			console.log("得到的JSON字符串："+text);
			console.log("转换得到的对象: "+(JSON.parse(text))[0].name);
			res.send(JSON.stringify(professors));

		})
	});
	
});

var server = app.listen(8081, function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log(host+" "+port);
});