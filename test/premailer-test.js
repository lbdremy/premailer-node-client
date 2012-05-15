/**
 * Modules dependencies
 */

var premailer = require('./../'),
   vows = require('vows'),
   assert = require('assert');

// Test Suite Premailer
var suite = vows.describe('Premailer API client library');

var options = {
	adapter: 'hpricot',
	line_length: 60,
	preserve_styles: true,
	remove_ids: true,
	remove_classes: false,
	remove_comments: false,
	url : 'http://beta.cibo.io'
}

suite.addBatch({
   'Create a client' : {
      topic : function(){
         var client = premailer.createClient();
         return client;
      },
      'should be OK' : assertClient
   },
   'Get the converted version ' : {
      topic : function(){
         var client = premailer.createClient();
         return client;
      },
      'in the HTML format' : {
         topic : function(client){
            client.getHTML(options,this.callback)         
         },
         'should return a piece of HTML' : function(err,html){
            assert.isNull(err);
            assert.isString(html);
         }
      },
      'in the Text format' : {
         topic : function(client){
            client.getText(options,this.callback)
         },
         'should return text' : function(err,text){
         	assert.isNull(err);
         	assert.isString(text);
         }
      },
      'in the HTML and Text format' : {
         topic : function(client){
            client.getAll(options,this.callback);
         },
         'should return a piece of HTML and a piece of Text' : function(err,documents){
         	assert.isNull(err);
         	assert.isString(documents.html);
         	assert.isString(documents.text);
            assert.isObject(documents.response);
         }
      },
      'but only links to the HTML and Text format' : {
         topic : function(client){
            client.convert(options,this.callback)
         },
         'should return an object containings links and others informations' : function(err,data){
         	assert.isNull(err);
         	assert.isObject(data);
         	assert.isString(data.documents.html);
         	assert.isString(data.documents.txt);
         	assert.equal(data.status,201);
            Object.keys(options).forEach(function(key){
               if(key !== 'url') assert.equal(options[key],data.options[key])
            });
         }
      }
   }
}).export(module);

// Macros
function assertClient(o){
   assert.isString(o.options.host);
}

function assertPremailerError(err,data){
   assert.instanceOf(err,Error);
   assert.isNull(data);
}