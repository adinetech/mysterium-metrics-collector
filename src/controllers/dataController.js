import { 
  fetchAllProposals, 
  fetchPublicProposals, 
  fetchRegistrationFee, 
  fetchServicePricing 
} from '../services/mysteriumApi.js';
import { 
  getNodesPerCountry, 
  getBandwidthPerCountry 
} from '../utils/calculations.js';
import axios from 'axios';

// Get registration fee
export async function getFee(req, res) {
  const fee = await fetchRegistrationFee();
  res.json({ fee });
}

// Get service pricing
export async function getPricing(req, res) {
  const price = await fetchServicePricing();
  res.json(price);
}

// Get all proposals
export async function getProposals(req, res) {
  const data = await fetchAllProposals();
  res.json(data);
}

// Get total providers count
export async function getProviders(req, res) {
  const data = await fetchAllProposals();
  res.json({ total_providers: data.length });
}

// Get public providers count
export async function getPublicProviders(req, res) {
  const data = await fetchPublicProposals();
  res.json({ total_providers: data.length });
}

// Get total bandwidth
export async function getTotalBandwidth(req, res) {
  const data = await fetchAllProposals();
  let total_bandwidth = 0;
  data.forEach(item => {
    if (item.quality) {
      total_bandwidth += item.quality.bandwidth || 0;
    }
  });
  res.json({ total_bandwidth });
}

// Get public total bandwidth
export async function getPublicTotalBandwidth(req, res) {
  const data = await fetchPublicProposals();
  let total_bandwidth = 0;
  data.forEach(item => {
    if (item.quality) {
      total_bandwidth += item.quality.bandwidth || 0;
    }
  });
  res.json({ total_bandwidth });
}

// Get average quality
export async function getAvgQuality(req, res) {
  const data = await fetchAllProposals();
  let total_quality = 0;
  data.forEach(item => {
    if (item.quality) {
      total_quality += item.quality.quality || 0;
    }
  });
  const avg_quality = total_quality / data.length;
  res.json({ avg_quality });
}

// Get public average quality
export async function getPublicAvgQuality(req, res) {
  const data = await fetchPublicProposals();
  let total_quality = 0;
  data.forEach(item => {
    if (item.quality) {
      total_quality += item.quality.quality || 0;
    }
  });
  const avg_quality = total_quality / data.length;
  res.json({ avg_quality });
}

// Get average latency
export async function getAvgLatency(req, res) {
  const data = await fetchAllProposals();
  let total_latency = 0;
  data.forEach(item => {
    if (item.quality) {
      total_latency += item.quality.latency || 0;
    }
  });
  const avg_latency = total_latency / data.length;
  res.json({ avg_latency });
}

// Get public average latency
export async function getPublicAvgLatency(req, res) {
  const data = await fetchPublicProposals();
  let total_latency = 0;
  data.forEach(item => {
    if (item.quality) {
      total_latency += item.quality.latency || 0;
    }
  });
  const avg_latency = total_latency / data.length;
  res.json({ avg_latency });
}

// Get nodes per country
export async function getNodesPerCountryAll(req, res) {
  const data = await fetchAllProposals();
  const nodesPerCountry = getNodesPerCountry(data);
  res.json({ nodesPerCountry });
}

// Get nodes for specific country
export async function getNodesForCountry(req, res) {
  const { countryCode } = req.params;
  const data = await fetchAllProposals();
  let count = 0;
  data.forEach(item => {
    if (item.location.country === countryCode) {
      count += 1;
    }
  });
  res.json({ countryCode, count });
}

// Get bandwidth per country
export async function getBandwidthPerCountryAll(req, res) {
  const data = await fetchAllProposals();
  const bandwidthPerCountry = getBandwidthPerCountry(data);
  res.json({ bandwidthPerCountry });
}

// Get bandwidth for specific country
export async function getBandwidthForCountry(req, res) {
  const { countryCode } = req.params;
  const data = await fetchAllProposals();
  let bandwidth = 0;
  data.forEach(item => {
    if (item.location.country === countryCode) {
      bandwidth += item.quality.bandwidth || 0;
    }
  });
  res.json({ countryCode, bandwidth });
}

export async function getProviderById(req, res) {
  const { providerId } = req.params;
  const url = `https://discovery.mysterium.network/api/v3/proposals?provider_id=${providerId}`;
  const response = await axios.get(url);
  res.json(response.data);
}

// Help endpoint - list all available endpoints
export async function getHelp(req, res) {
  res.json({ 
    endpoints: [
      '/metrics',
      '/',
      '/fee',
      '/price',
      '/proposals',
      '/providers',
      '/public_providers',
      '/total_bandwidth',
      '/public_total_bandwidth',
      '/avg_quality',
      '/public_avg_quality',
      '/avg_latency',
      '/public_avg_latency',
      '/nodes_per_country',
      '/nodes_per_country/:countryCode',
      '/bandwidth_per_country',
      '/bandwidth_per_country/:countryCode',
      '/provider/:providerId',
      '/chain_fee/:chainid',
      '/chain_register_fee/:chainid',
      '/chain_settle_fee/:chainid',
      '/identity_status/:id',
      '/identity_eligibility/:address',
      '/provider_eligibility',
      '/transactor_status',
      '/provider_channel/:identity',
      '/consumer_channel/:identity',
      '/hermes_status',
      '/help'
    ]
  });
}

// Transactor API endpoints
export async function getChainFee(req, res) {
  const { chainid } = req.params;
  const url = `https://transactor.mysterium.network/api/v1/fee/${chainid}`;
  const response = await axios.get(url);
  res.json(response.data);
}

export async function getChainRegisterFee(req, res) {
  const { chainid } = req.params;
  const url = `https://transactor.mysterium.network/api/v1/fee/${chainid}/register`;
  const response = await axios.get(url);
  res.json(response.data);
}

export async function getChainSettleFee(req, res) {
  const { chainid } = req.params;
  const url = `https://transactor.mysterium.network/api/v1/fee/${chainid}/settle`;
  const response = await axios.get(url);
  res.json(response.data);
}

export async function getIdentityStatus(req, res) {
  const { id } = req.params;
  const url = `https://transactor.mysterium.network/api/v1/identity/${id}/status`;
  const response = await axios.get(url);
  res.json(response.data);
}

export async function getIdentityEligibility(req, res) {
  const { address } = req.params;
  const url = `https://transactor.mysterium.network/api/v1/identity/register/eligibility/${address}`;
  const response = await axios.get(url);
  res.json(response.data);
}

export async function getProviderEligibility(req, res) {
  const url = 'https://transactor.mysterium.network/api/v1/identity/register/provider/eligibility';
  const response = await axios.get(url);
  res.json(response.data);
}

export async function getTransactorStatus(req, res) {
  const url = 'https://transactor.mysterium.network/api/v1/status';
  const response = await axios.get(url);
  res.json(response.data);
}

// Hermes3 API endpoints
export async function getProviderChannelData(req, res) {
  const { identity } = req.params;
  const url = `https://hermes3.mysterium.network/api/v1/data/provider/${identity}`;
  const response = await axios.get(url);
  res.json(response.data);
}

export async function getConsumerChannelData(req, res) {
  const { identity } = req.params;
  const url = `https://hermes3.mysterium.network/api/v1/data/consumer/${identity}`;
  const response = await axios.get(url);
  res.json(response.data);
}

export async function getHermesStatus(req, res) {
  const url = 'https://hermes3.mysterium.network/api/v1/status';
  const response = await axios.get(url);
  res.json(response.data);
}
