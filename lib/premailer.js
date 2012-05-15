/*!
 * premailer-client
 * Premailer API client for node.js
 * Copyright (c) Remy Loubradou <remyloubradou@gmail.com>
 * MIT Licenced
 */

/**
 * Modules dependencies
 */

var async = require('async'),
	http = require('http'),
	querystring = require('querystring'),
	url = require('url');

exports.createClient = function(options){
	return new Client(options);
}

function Client(options){
	this.options = options || {};
	if(!options){
		this.options.port = 80;
		this.options.host = 'premailer.dialect.ca';
		this.options.path = '/api/0.1';
	}
}

Client.prototype.convert = function(options,callback){
	var formdata = querystring.stringify(options);
	var headers = {
		'Content-Type' : 'application/x-www-form-urlencoded',
		'Content-Length' : new Buffer(formdata).length,
		'Accept' : 'application/json',
		'Accept-Charset' : 'utf-8'
	}
	var opts = {
		host : this.options.host,
		port : this.options.port,
		path : this.options.path + '/documents',
		headers : headers
	}
	postRequest(opts,formdata,function(err,body){
		try{
			if(!err) var data = JSON.parse(body);
			callback(err,data);
		}catch(err){
			callback(err,null);
		}
	});
}

Client.prototype.getHTML = function(options,callback){
	var self = this;
	this.convert(options,function(err,data){
		if(!err){
			self.retrieveHTML(data.documents.html,callback);
		}else{
			callback(err,null);
		}
	})
}

Client.prototype.getText = function(options,callback){
	var self = this;
	this.convert(options,function(err,data){
		if(!err){
			self.retrieveText(data.documents.txt,callback)
		}else{
			callback(err,null);
		}
	})
}

Client.prototype.getAll = function(options,callback){
	var self = this;
	this.convert(options,function(err,data){
		if(!err){
			async.parallel([
			    function(callback){
			    	self.retrieveHTML(data.documents.html,callback);
			    },
			    function(callback){
			    	self.retrieveText(data.documents.txt,callback);
			    }
			],function(err,results){
				var at = results[0].charAt(0) === '<';
				var documents;
				if(!err){
					documents = {
						html : at ? results[0] : results[1],
						text : at ? results[1] : results[0],
						response : data
					}
				}
				callback(err,documents);
			});
		}else{
			callback(err,null);
		}
	})
}

Client.prototype.retrieveText = function(urlTxt,callback){
	var headers = {
		'Accept' : 'text/plain',
		'Accept-Charset' : 'utf-8'
	}
	var uri = url.parse(urlTxt);
	var opts = {
		host : uri.hostname,
		port : uri.port,
		path : uri.pathname + '?' + uri.query,
		headers : headers
	}
	getRequest(opts,function(err,body){
		callback(err,body)
	});
}

Client.prototype.retrieveHTML = function(urlHTML,callback){
	var headers = {
		'Accept' : 'text/html',
		'Accept-Charset' : 'utf-8'
	}
	var uri = url.parse(urlHTML);
	var opts = {
		host : uri.hostname,
		port : uri.port,
		path : uri.pathname + '?' + uri.query,
		headers : headers
	}
	getRequest(opts,function(err,body){
		callback(err,body)
	});
}

function postRequest(options,formdata,callback){
	options.method = 'POST';
	var request = http.request(options,function(res){
		var buffer = '';
		res.on('error',function(err){
			callback(err,null);
		});
		res.on('data',function(chunk){
			buffer += chunk;
		});
		res.on('end',function(){
			callback(null,buffer);
		})
	})
	request.on('error',function(err){
		callback(err,null);
	})
	request.write(formdata)
	request.end();
}

function getRequest(options,callback){
	var request = http.get(options,function(res){
		var buffer = '';
		res.on('error',function(err){
			callback(err,null);
		});
		res.on('data',function(chunk){
			buffer += chunk;
		});
		res.on('end',function(){
			callback(null,buffer);
		})
	})
	request.on('error',function(err){
		callback(err,null);
	});
}