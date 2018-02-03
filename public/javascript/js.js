function httpRequestAsync(theUrl, callback, type, data=null, headers=null) {
	
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
    
    	xmlHttp.send(data);

}

$(function(){				
	
	$('#login').click(function(e){
		
		e.preventDefault();
		
		var data = {};
		data.wallet = $("#walletID").val();
		data.password = $("#walletPassword").val();
		
		httpRequestAsync("http://localhost:3000/login", function() {
			
			console.log("Logged in.")
			
		}, "POST", JSON.stringify(data))
		
    });
	
	$('#new').click(function(e){

		e.preventDefault();
		
		var passwordContainer = {};
		var password = Math.random().toString(36).slice(-8);
		passwordContainer.password = password;
		
		httpRequestAsync("http://localhost:3001/operator/wallets", function(createWalletResponse) {
			
			createWalletResponse = JSON.parse(createWalletResponse)
			
			$("#walletID").val(createWalletResponse.id);
			$("#walletPassword").val(password);
		    $('#passwordOutput').text("Generated password: " + password);
		    
		    var walletContainer = {};
		    walletContainer.walletId = createWalletResponse.id;
		    
			httpRequestAsync("http://localhost:3001/operator/wallets/" + createWalletResponse.id + "/addresses", function(createAddressResponse) {}, "POST", JSON.stringify(walletContainer), passwordContainer)
			
		}, "POST", JSON.stringify(passwordContainer))
		
    });

	$('#mine').click(function(e){
		
		e.preventDefault();
		console.log('select_link clicked');
		
		miner.mine();
		
		/*var data = {};
		data.title = "title";
		data.message = "message";
		
		$.ajax({
			
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			url: 'http://localhost:3000/endpoint',
			
			success: function(data) {
				
			    console.log('success');
			    console.log(JSON.stringify(data));
			
			}
		
		});*/
		
    });

});