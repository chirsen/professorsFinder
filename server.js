'use strict'

var express = require('express');
var http = require('http');
var url = require('url');
var fs = require('fs');
var util = require('util');
var mysql = require('mysql');

var app = express();
var pool = mysql.createPool({
	connectionLimit: 10,
	host: 'localhost',
	user: 'root',
	password: 'q',
	database: 'reachers'
});


app.use(express.static('public'));


//如下的所有get均为路由，用于处理客户端提交的请求

app.get('/reserchersFinder', function(req, res) {
	var pathname = url.parse(req.url).pathname;
	res.sendFile(__dirname + "/" + "index.html");
	console.log("接受：");
});

//根据输入框的内容和选择的choose来进行搜索
app.get("/upload", function(req, res) {
	pool.getConnection(function(err, connction) {
		if (err) {
			console.log("连接错误");
			throw err;
		}
		//获取输入框和选择的内容
		var text = req.query.text;
		var choose = req.query.choose;
		console.log("提交的文字：" + text + "选择的choose: " + choose);
		//根据选择的内容进行相应的查询
		var tab;
		switch (Number(choose)) {
			case 1:
				tab = "name";
				break;
			case 2:
				tab = "school";
				break;
			case 3:
				tab = "direction";
				break;
			case 4:
				tab = "position";
				break;
		}
		//对传送过来的输入框中的内容进行处理，以便进行模糊查询
		var myCars = new Array();
		myCars[0] = "%";
		for (var i = 0; i < text.length; i++) {
			myCars[i + 1] = text.charAt(i) + "%";
		}
		text = myCars.join("");
		//log中打印拼接后的字符串
		console.log("拼接之后的text: " + text);

		//根据输入的字符串和选择进行查询：
		var query;
		if(text == ""){
			query = "select * from ccnu order by hot desc limit 10";	
		}else{
			query = "select * from ccnu where " + tab + " like '" + text + "' order by hot desc limit 10";
		}
		//打印查询语句：
		console.log(query);
		connction.query(query, function(error, rows) {
			var professors = new Object();
			for (var i = 0; i < rows.length; i++) {
				var professor = new Object();
				professor.id = rows[i].id;
				professor.name = rows[i].name;
				professor.direction = rows[i].direction;
				professor.position = rows[i].position;
				professor.school = rows[i].school;
				professor.link = rows[i].link;
				professors[i] = professor;
			}

			console.log(professors);
			connction.release();
			var text = JSON.stringify(professors);
			res.send(JSON.stringify(professors));
		});

	});

});

//根据点击的id确定搜索的热度（hot值）
app.get("/uploadid", function(req, res){
	//log中输出选择的id
	console.log("选择的链接的id为："+req.query.id);
	pool.getConnection(function(err, connection){
		if(err){console.log("链接数据库不成功");}
		connection.query("select hot from ccnu where id = "+req.query.id, function(error1, rows1){
			if(error1){console.log("查询hot值不成功");}
			var hot = ++rows1[0].hot;
			connection.query("update ccnu set hot = "+hot+" where id = "+req.query.id, function(error2, rows2){
				if(error2){console.log("更新hot值不成功");}
				console.log("更新hot值为："+hot);
				connection.release();
			});
		});
	});
});

var server = app.listen(8081, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log(host + " " + port);
});