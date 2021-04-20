import { walletAddress } from './common.js';

async function fetchCarbonStats() {
  let co2_per_wei = 0.0002874;
  let co2_absorbed_per_year = 21;
  let result = await (await fetch("https://cryptotrunks-python.herokuapp.com/carbon/?address=0x1e9112601f9fa78e978c660d1b68071a3c332500")).json();

  document.querySelector('#carbon-transactions').innerHTML = result["transactions"].toLocaleString();
  document.querySelector('#carbon-gas').innerHTML = result["gas"].toLocaleString();

  let co2 = result["gas"] * co2_per_wei;
  let co2_formatted = Math.round(co2).toLocaleString();
  document.querySelector('#carbon-co2').innerHTML = co2_formatted.concat(" kg of CO₂ emissions.");

  let absorbed = Math.round(co2 / co2_absorbed_per_year);
  let absorbed_formatted = absorbed.toLocaleString();
  document.querySelector('#carbon-years').innerHTML = absorbed_formatted.concat(" years");
}

window.onload = fetchCarbonStats()
