#premailer-client - a node.js premailer client

##Install

```
npm install premailer-client
```

##Usage

```js
var premailer = require('premailer-client');

var client = premailer.createClient();
client.getAll(options,function(err,documents){
	// HTML document
	console.log(documents.html);
	// Plain text document
	console.log(documents.text);
	// JSON response deserialized
	console.log(documents.response);
})
```

##Test

```
npm test
```

##Licence
(The MIT License) Copyright 2011-2012 Remy Loubradou