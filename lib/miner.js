const createHash = require('create-hash');
const config = require('../config');

module.exports = {
	
	httpRequestAsync: function (theUrl, callback, type, data=null, headers=null) {
		
	    var xmlHttp = new XMLHttpRequest();
	    
	    xmlHttp.onreadystatechange = function() { 
	        
	    		if (xmlHttp.readyState == 4 && ( xmlHttp.status == 200 || xmlHttp.status == 201 )) {
	    			
	    			callback(xmlHttp.responseText);
	        	
	        } else if ( xmlHttp.readyState == 4 ) {
	        	
	        		console.log("Error (" + xmlHttp.readyState + "/" + xmlHttp.status + "): " + xmlHttp.responseText);
	        		
	        }
	            
	    }
	    
	    xmlHttp.open(type, theUrl, true);
	    
	    if ( type == "POST" || type == "PUT" ) {
	    	
	    		xmlHttp.setRequestHeader("Content-type", "application/json");
	    
	    }
	  
	    var header;
	    for ( header in headers ) {
	    		
	    		xmlHttp.setRequestHeader(header, headers[header]);
	    	
	    }
	    
	    if ( data != null )  {
	    	
	    		xmlHttp.send(JSON.stringify(data));
	    
	    } else {
	    	
	    		xmlHttp.send();
	    	
	    }

	},
	
	mine: function(callback) {
		
		module.exports.httpRequestAsync(config.NODE_PROXY + "/miner/block", function(responseA) {
			
			module.exports.httpRequestAsync(config.NODE_PROXY + "/blockchain/difficulty", function(responseB) {
				
				var block = JSON.parse(responseA).nextBlock;
				
				do {
					
					block.timestamp = new Date().getTime() / 1000;
				    
					block.nonce++;
				    
					block.hash = createHash('sha256').update(block.index + block.previousHash + block.timestamp + JSON.stringify(block.transactions) + block.nonce).digest('hex');
					
					var blockDifficulty = parseInt(block.hash.substring(0, 14), 16);
					
				} while ( blockDifficulty >= JSON.parse(responseB).difficulty );
				
				module.exports.httpRequestAsync(config.NODE_PROXY + "/blockchain/blocks/latest", function(responseC) {
					
					callback();
					
				}, "PUT", block);
				
			}, "GET")
			
		}, "POST")
	
	}

}