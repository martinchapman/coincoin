function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(JSON.parse(xmlHttp.responseText));
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
    
}

function mine() {
	
	httpGetAsync("http://localhost:3001/miner/block", function(responseA) {
		
		httpGetAsync("http://localhost:3001/blockchain/difficulty", function(responseB) {
			
			var hash;
			
			var block = responseA.nextBlock;
			
			var nonce = block.nonce;
			
			var md = forge.md.sha256.create();
			
			var hash;
			
			do {
			
				timestamp = new Date().getTime() / 1000;
			    
				nonce++;
			    
				md.update(block.index + block.previousHash + timestamp + JSON.stringify(block.transactions) + nonce);
				
				hash = md.digest().toHex();
				
				blockDifficulty = parseInt(hash.substring(0, 14), 16);
				
			} while ( blockDifficulty >= responseB.difficulty );
			
			console.log();
			
		})
		
	})

}