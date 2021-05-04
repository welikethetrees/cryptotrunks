import { web3, wallet, contract, formattedResult } from './common.js';

var currentSeed;
var tokenId;
var isLoading = false;

var generateButtonBackground;
var generateButtonText;

function regenerateRandomInt() {
    let min = 1;
    let max = 1e9;
    currentSeed = Math.floor(Math.random() * (max - min + 1)) + min;
}

async function generateTrunk() {
  document.querySelector('#generate-in-progress').style = "display:block";
  document.querySelector('#generate-done').style = "display:none";

  regenerateRandomInt();

  let url = `https://service.cryptotrunks.co/metadata.json?address=${wallet}&seed=${currentSeed}`
  let result = await (await fetch(url)).json();

  document.querySelector('#generate-info').innerHTML = formattedResult(result);
  document.querySelector('#generate-trunk-image').src = result.image;

  document.querySelector('#generate-in-progress').style = "display:none";
  document.querySelector('#generate-done').style = "display:block";
}

async function claimTrunk() {
  // Loading
  if (isLoading) {
    return false;
  }

  // Disable button
  generateButtonBackground = document.querySelector('#generate-confirm').style["background-image"];
  generateButtonText = document.querySelector('#generate-confirm-text').innerHTML;
  document.querySelector('#generate-confirm').style["background-image"] = "url('../images/button_mask.svg'), url('../images/button_background_disabled.svg')";
  document.querySelector('#generate-confirm-text').innerHTML = "CONNECTING...";
  document.querySelector('#loading-text').innerHTML = "CONNECTING...";
  document.querySelector('#loading-modal').style = "display:flex";
  isLoading = true;

  // Fetch fee (enforced by contract).
  let url = `https://service.cryptotrunks.co/fee.json?address=${wallet}`
  let result = await (await fetch(url)).json();
  let fee = web3.utils.toWei(String(result.result));

  // Listener.
  contract.events.RemoteMintFulfilled({}, function(error, result) {
    if (!error) {
      if (result.returnValues.tokenId == tokenId) {
        let resultId = result.returnValues.resultId;
        console.log("Minted: " + resultId);
        window.location.href = `individual-trunk-page.html?token=${resultId}`;
      } else {
        document.result = result;
        console.log("Result: " + result);
      }
    } else {
      console.log("Mint error: " + error.message);
    }
  });

  contract.events.Transfer({}, function(error, results) {
    document.querySelector('#loading-text').innerHTML = "MINTING YOUR TRUNK...";
  });

  // Minting.
  let mint = await contract.methods.mintTrunk(currentSeed)
    .send({ from: wallet, value: fee })
    .catch(error => {
      document.querySelector('#generate-confirm').style["background-image"] = generateButtonBackground;
      document.querySelector('#generate-confirm-text').innerHTML = generateButtonText;
      document.querySelector('#loading-modal').style = "display:none";
      isLoading = false;
    });

  // Store for RemoteMintFulfilled to read back.
  tokenId = mint.events.Transfer.returnValues.tokenId;
}

document.onload = generateTrunk();
document.querySelector('#generate-reroll').addEventListener('click', generateTrunk);
document.querySelector('#generate-confirm').addEventListener('click', claimTrunk);
