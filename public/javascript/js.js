const NODE_PROXY = "https://martinchapman.co.uk/coincoin"
	
function refreshBalance() {
	
	coincoin.httpRequestAsync(NODE_PROXY + "/operator/balance", function(balance) {
		
		$("#transfer").text("Transfer (Balance: " + balance + " coincoins)")
		
	}, "GET");
	
}

$(function(){				
	
	$('#login').click(function(e){
		
		e.preventDefault();
		
		if ( $("#walletID").val().length == 64 && $("#walletPassword").val().length > 0 ) {
		
			var data = {};
			data.wallet = $("#walletID").val();
			data.password = $("#walletPassword").val();
			
			coincoin.httpRequestAsync(NODE_PROXY + "/login", function() {
				
				$('#passwordOutput').text("");
				$("#login").css('display', 'none')
				$("#new").css('display', 'none')
				$("#loginForm").css('display', 'none')
				$("#transferForm").css('display', 'block')
				$("#mine").css('display', 'inline')
				$("#transfer").css('display', 'inline')
				$("#logout").css('display', 'inline')
				refreshBalance();
				
			}, "POST", data)
		
		}
		
    });
	
	$('#new').click(function(e){

		e.preventDefault();
		
		var passwordContainer = {};
		var password = Math.random().toString(36).slice(-8);
		passwordContainer.password = password;
		
		coincoin.httpRequestAsync(NODE_PROXY + "/operator/wallets", function(createWalletResponse) {
			
			createWalletResponse = JSON.parse(createWalletResponse)
			
			$("#walletID").val(createWalletResponse.id);
			$("#walletPassword").val(password);
		    $('#passwordOutput').text("Generated password: " + password);
		    
		    var walletContainer = {};
		    walletContainer.walletId = createWalletResponse.id;
		    
			coincoin.httpRequestAsync(NODE_PROXY + "/operator/wallets/" + createWalletResponse.id + "/addresses", function(createAddressResponse) {}, "POST", walletContainer, passwordContainer)
			
		}, "POST", passwordContainer)
		
    });

	$('#mine').click(function(e){
		
		e.preventDefault();
		$("#overlay").css('display', 'inline')
		coincoin.mine(function() {
			$("#overlay").css('display', 'none')
			refreshBalance();
		});
		
    });
	
	$('#transfer').click(function(e){
		
		e.preventDefault();
		
		if ( $("#targetWallet").val().length == 64 && $("#amount").val().length > 0 ) {
			
			var transaction = {};
			transaction.toWallet = $('#targetWallet').val(); 
			transaction.amount = $('#amount').val();
			
			coincoin.httpRequestAsync(NODE_PROXY + "/operator/wallets/transactions", function() {
				
				refreshBalance();
				
			}, "POST", transaction)
		
		}
		
    });
	
	$('#logout').click(function(e){
		
		e.preventDefault();
		
		coincoin.httpRequestAsync(NODE_PROXY + "/logout", function() {
			
			$('#passwordOutput').text("");
			$("#login").css('display', 'inline')
			$("#new").css('display', 'inline')
			$("#loginForm").css('display', 'block')
			$("#transferForm").css('display', 'none')
			$("#mine").css('display', 'none')
			$("#transfer").css('display', 'none')
			$("#logout").css('display', 'none')
			
		}, "POST");
		
	});

});