/*
 * GET home page.
 */

exports.index = function(req, res){
	var http = require('http');
	//var Client = require('node-rest-client').Client;
	//var client = new Client();
	var secretkey = "123456789123456789qwertyuiopasdf";
	var crypto = require('crypto');
	var algorithm = "sha256";
	

	//get connection to mongodb
	var MongoClient = require('mongodb').MongoClient;
	var db = MongoClient.connect('mongodb://username(or pwd):username(or pwd)@ds063330.mongolab.com:63330/gumball', function(err, db) {
	    if(err)
	        throw err;
	    console.log("connected to the mongoDB !");
	    myCollection = db.collection('gumball');
	   var cursor=  myCollection.find();
	    cursor.each(function(err, doc) {
	        if(err)
	            throw err;
	        if(doc==null)
	            return;
	     
	        var hmac  = crypto.createHmac(algorithm,secretkey);
	        hmac.setEncoding('hex');
	    	//hmac.write();
	    	var text = doc.modelNumber+doc.serialNumber+doc.countGumballs+"NoCoinState";
	    	hmac.write(text);
	    	hmac.end();
	    	var hash = hmac.read();
	        console.log(doc);
	        console.log(hash);
	        res.render('index', { id:doc._id,modelNumber : doc.modelNumber, serialNumber : doc.serialNumber, state:"NoCoinState", count :doc.countGumballs,hashmsg: hash});
	    });
	});
};

exports.GumballAction=function(req,res){
	
	var event=req.param('event');
	var state=req.param('state');
	 count=req.param('count');
	var hash = req.param('hashmessage');
	var modelNumber=req.param('modelNumber');
	var serialNumber=req.param('serialNumber');
	var secretkey = "123456789123456789qwertyuiopasdf";
	var id = req.param('id');
	var crypto = require('crypto');
	var algorithm = "sha256";
	
	
	
	if(event==='InsertQuater' && state==='NoCoinState'){
		console.log("Inside insert quarter");
		var text =modelNumber+serialNumber+count+state;
		var hmac  = crypto.createHmac(algorithm,secretkey);
        hmac.setEncoding('hex');
        hmac.write(text);
    	hmac.end();
    	var hashnew = hmac.read();
    	console.log("incoming hash:"+hash);
    	
    	console.log("new hash:"+hashnew);
    	
		if(hashnew==hash)
			{
			state='HasACoin';
			var hmacnew2  = crypto.createHmac(algorithm,secretkey);
	        hmacnew2.setEncoding('hex');
	        var newtext = modelNumber+serialNumber+count+state;
	        hmacnew2.write(newtext);
	    	hmacnew2.end();
	    	var hashnew2 = hmacnew2.read();
			
			res.render('index', { modelNumber : modelNumber, serialNumber : serialNumber, state:state, count : count,hashmsg: hashnew2,id:id});
			}
		else
			{
				res.render('index', { modelNumber : "Information corrupted by user, please restart", serialNumber : "Information corrupted by user, please restart", state:"NoCoinState", count : "Information corrupted by user, please restart",hashmsg: hash,id:id});
			}
		
	}
	
	
	
	if(event==='TurnTheCrank' && state==='HasACoin'){
		var MongoClient = require('mongodb').MongoClient;
		var messagesToBePutInPost=[];
		console.log("modelNumber"+modelNumber);
		console.log("serialNumber"+serialNumber);
		console.log("count"+count);
		console.log("state"+state);
		var text = modelNumber+serialNumber+count+state;
		var hmac  = crypto.createHmac(algorithm,secretkey);
        hmac.setEncoding('hex');
        hmac.write(text);
    	hmac.end();
    	console.log('id'+id);
    	var hashnew = hmac.read();
    	console.log("incoming hash:"+hash);
    	console.log("new generated hash:"+hashnew);
		if(hashnew==hash && count>0)
			{
				var newCount = count -1;
				var myCollection;
				var db = MongoClient.connect('mongodb://username(or pwd):username(or pwd)@ds063330.mongolab.com:63330/gumball', function(err, db) {
				    if(err)
				        throw err;
				    console.log("connected to the mongoDB !");
				    myCollection = db.collection('gumball');
				    console.log("collection name"+myCollection);
				    myCollection.update({modelNumber: modelNumber}, {$set: {countGumballs: newCount}}, function(err) {
				    	if(err)
				    	    throw err;
				    	    console.log('entry updated');
				    	});
				    	var newText = modelNumber+serialNumber+newCount+"NoCoinState";
				    	var hmacnew  = crypto.createHmac(algorithm,secretkey);
				    	hmacnew.setEncoding('hex');
				    	hmacnew.write(newText);
				    	hmacnew.end();
				    	var newHash = hmacnew.read();
				    	console.log(newHash);
				    res.render('index', { modelNumber : modelNumber, serialNumber : serialNumber, state:"NoCoinState", count : newCount,hashmsg: newHash,id:id});
				});

			
			
			}
		else
			{
				if(count == 0)
					{
						res.render('index', { modelNumber : modelNumber, serialNumber : serialNumber, state:"NoCoinState", count : count,hashmsg: hash,id:id});
					}
				else
					{
						res.render('index', { modelNumber : "Information corrupted by user, please restart", serialNumber : "Information corrupted by user, please restart", state:"NoCoinState", count : "Information corrupted by user, please restart",hashmsg: hash,id:id});
					}
			}
		
	}
	else
		{
		console.log("modelNumber:"+modelNumber);
			if(event==='TurnTheCrank' && state==='NoCoinState'){
				res.render('index', { modelNumber : "gumball911", serialNumber : "911", state:"NoCoinState", count : "Count value not displayed as information corrupted by user",hashmsg: hash,id:id});
			}
		}

	
};