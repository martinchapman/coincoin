$(function(){				

	$('#mine').click(function(e){
		
		e.preventDefault();
		console.log('select_link clicked');
		
		miner.mine("294182560f3899872f413e01ebca7faa250044db64e63aebe0f997133bc3ecc4", "294182560f3899872f413e01ebca7faa250044db64e63aebe0f997133bc3ecc4");
		
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