import fetch from 'node-fetch';
import config from '../config/index.js';

export async function fetchAllProposals() {
  const response = await fetch(config.apis.allProposals);
  const data = await response.json();
  return data;
}

export async function fetchPublicProposals() {
  const response = await fetch(config.apis.publicProposals);
  const pubData = await response.json();
  return pubData;
}

export async function fetchRegistrationFee() {
  const response = await fetch(config.apis.registrationFee);
  const data = await response.json();
  const feeInNormalUnits = data.fee / config.weiConversion; 
  return feeInNormalUnits;
}

export async function fetchServicePricing() {
  const response = await fetch(config.apis.pricing);
  const price = await response.json();
  return price;
}
