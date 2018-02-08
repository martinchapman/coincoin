onmessage = function(e) {
  console.log(e.data);
  importScripts("miner.bundle.js");
  coincoin.mine(function(response) {
	  postMessage("CoinCoin Miner | " + response);
	  close();
  });
}