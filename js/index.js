import { contract, wallet } from './common.js';

async function updateProgress() {
  var supply = 19500;
  var minted = parseInt(await contract.methods.getGenerativeMinted().call());
  let generative = minted.toLocaleString().concat(" / ").concat(supply.toLocaleString());
  document.querySelector('#progress-generative').innerHTML = generative.concat(" CLAIMED");
  var progress = parseInt((parseFloat(minted) / parseFloat(supply)) * 100);
  document.querySelector('#progress-bar-generative').style = `background-size: contain, contain, ${progress}% 90%, contain;`;

  supply = 1500;
  minted = parseInt(await contract.methods.getGenesisMinted().call());
  let genesis = minted.toLocaleString().concat(" / ").concat(supply.toLocaleString());
  document.querySelector('#progress-genesis').innerHTML = genesis.concat(" CLAIMED");
  var progress = parseInt((parseFloat(minted) / parseFloat(supply)) * 100);
  document.querySelector('#progress-bar-genesis').style = `background-size: contain, contain, ${progress}% 90%, contain;`;
}

document.onload = updateProgress();
