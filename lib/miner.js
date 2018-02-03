const createHash = require('create-hash');
const config = require('../config');

function httpRequestAsync(theUrl, callback, type, data=null, headers=null) {
	
    var xmlHttp = new XMLHttpRequest();
    
    xmlHttp.onreadystatechange = function() { 
        
    		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
    			
    			callback(xmlHttp.responseText);
        	
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
    
    	xmlHttp.send(data);

}

module.exports = {
	
	mine: function() {
		
		httpRequestAsync(config.NODE_PROXY + "miner/block", function(responseA) {
			
			httpRequestAsync(config.NODE_PROXY + "blockchain/difficulty", function(responseB) {
				
				var block = JSON.parse(responseA).nextBlock;
				
				do {
				
					block.timestamp = new Date().getTime() / 1000;
				    
					block.nonce++;
				    
					block.hash = createHash('sha256').update(block.index + block.previousHash + block.timestamp + JSON.stringify(block.transactions) + block.nonce).digest('hex');
					
					var blockDifficulty = parseInt(block.hash.substring(0, 14), 16);
					
				} while ( blockDifficulty >= JSON.parse(responseB).difficulty );
				
				httpRequestAsync(config.NODE_PROXY + "blockchain/blocks/latest", function(responseC) {
					
					console.log(responseC);
					
				}, "PUT", JSON.stringify(block));
				
			}, "GET")
			
		}, "POST")
	
	}

}