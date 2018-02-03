$(function(){				
	
	$('#login').click(function(e){
		
		e.preventDefault();
		
		var data = {};
		data.wallet = $("#walletID").val();
		data.password = $("#walletPassword").val();
		
		$.ajax({
			
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			url: 'http://localhost:3000/login',
			
			success: function() {
				
			    console.log("Logged in.")
			
			}
		
		});
		
    });
	
	$('#new').click(function(e){
		
		e.preventDefault();
		
		var passwordContainer = {};
		var password = Math.random().toString(36).slice(-8);
		passwordContainer.password = password;
		
		$.ajax({
			
			type: "POST",
			data: JSON.stringify(passwordContainer),
			contentType: "application/json",
			url: "http://localhost:3001/operator/wallets",
			
			success: function(createWalletResponse) {
				
				$("#walletID").val(createWalletResponse.id);
				$("#walletPassword").val(password);
			    $('#passwordOutput').text("Generated password: " + password);
			    
			    var walletContainer = {};
			    walletContainer.walletId = createWalletResponse.id;
			    
			    $.ajax({
					
					type: "POST",
					beforeSend: function(xhr) { 
						xhr.setRequestHeader('password', password);
					},
					data: JSON.stringify(walletContainer),
					contentType: "application/json",
					url: "http://localhost:3001/operator/wallets/" + createWalletResponse.id + "/addresses",
					
					success: function(createAddressResponse) {
						
						console.log(JSON.stringify(createAddressResponse));
					    
					},
					error: function(error) {
						
						console.log(error);
						
					}
				
				});
			    
			}
		
		});
		
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