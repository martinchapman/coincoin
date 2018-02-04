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
    
    	xmlHttp.send(JSON.stringify(data));

}

function refreshBalance() {
	
	httpRequestAsync("http://localhost:3000/operator/balance", function(balance) {
		
		$("#transfer").text("Transfer (Balance: " + balance + " coincoins)")
		
	}, "GET");
	
}

$(function(){				
	
	$('#login').click(function(e){
		
		e.preventDefault();
		
		var data = {};
		data.wallet = $("#walletID").val();
		data.password = $("#walletPassword").val();
		
		httpRequestAsync("http://localhost:3000/login", function() {
			
			$('#passwordOutput').text("");
			$("#login").css('display', 'none')
			$("#new").css('display', 'none')
			$("#loginForm").css('display', 'none')
			$("#transferForm").css('display', 'block')
			$("#mine").css('display', 'inline')
			$("#transfer").css('display', 'inline')
			refreshBalance();
			
		}, "POST", data)
		
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
		    
			httpRequestAsync("http://localhost:3001/operator/wallets/" + createWalletResponse.id + "/addresses", function(createAddressResponse) {
				
				console.log("Address creation: " + createAddressResponse);
				
			}, "POST", walletContainer, passwordContainer)
			
		}, "POST", passwordContainer)
		
    });

	$('#mine').click(function(e){
		
		e.preventDefault();
		miner.mine(function() {
			refreshBalance();
		});
		
    });
	
	$('#transfer').click(function(e){
		
		e.preventDefault();
		
		var transaction = {};
		transaction.toAddress = $('#targetAddress').val();
		transaction.amount = $('#amount').val();
		
		httpRequestAsync("http://localhost:3000/operator/wallets/transactions", function() {
			
			refreshBalance();
			
		}, "POST", transaction)
		
    });

});