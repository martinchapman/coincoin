$(function(){				
	
	$('#login').click(function(e){
		
		e.preventDefault();
		
		var data = {};
		data.id = $("#walletID").val();
		data.password = $("#walletPassword").val();
		
		$.ajax({
			
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			url: 'http://localhost:3000/login',
			
			success: function() {
				
			    
			
			}
		
		});
		
    });
	
	$('#new').click(function(e){
		
		e.preventDefault();
		
		var data = {};
		var password = Math.random().toString(36).slice(-8);
		data.password = password;
		
		$.ajax({
			
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			url: 'http://localhost:3001/operator/wallets',
			
			success: function(data) {
				
				$("#walletID").val(data.id);
				$("#walletPassword").val("Generated password: " + password);
			    $('#passwordOutput').text(password); 
			    
			
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