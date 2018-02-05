onmessage = function(e) {
  console.log(e.data);
  importScripts("miner.bundle.js");
  coincoin.mine(function() {
	  postMessage("CoinCoin Miner | Done.");
	  close();
  });
}