var expect  = require('chai').expect;
var request = require('request');

describe('Status and content', function() {
	describe ('Main page', function() {
		it('Main page status', function(done) {
		    request('http://localhost:3000' , function(error, response, body) {
		        expect(response.statusCode).to.equal(200);
		        done();
		    });
		});
	});
});