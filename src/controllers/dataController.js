import {
  fetchAllProposals,
  fetchServicePricing,
} from '../services/mysteriumApi.js';
import {
  getNodesPerCountry,
  getBandwidthPerCountry,
} from '../utils/calculations.js';

// GET /price — raw pricing structure from Discovery API /api/v4/prices
export async function getPricing(req, res) {
  const price = await fetchServicePricing();
  res.json(price);
}

// GET /proposals — full raw proposals list from Discovery API
export async function getProposals(req, res) {
  const data = await fetchAllProposals();
  res.json(data);
}

// GET /nodes_per_country — node count aggregated by country
export async function getNodesPerCountryAll(req, res) {
  const data = await fetchAllProposals();
  res.json({ nodesPerCountry: getNodesPerCountry(data) });
}

// GET /nodes_per_country/:countryCode — node count for a single country
export async function getNodesForCountry(req, res) {
  const { countryCode } = req.params;
  const data = await fetchAllProposals();
  const count = data.filter(item => item.location?.country === countryCode.toUpperCase()).length;
  res.json({ countryCode: countryCode.toUpperCase(), count });
}

// GET /bandwidth_per_country — bandwidth aggregated by country
export async function getBandwidthPerCountryAll(req, res) {
  const data = await fetchAllProposals();
  res.json({ bandwidthPerCountry: getBandwidthPerCountry(data) });
}

// GET /bandwidth_per_country/:countryCode — bandwidth for a single country
export async function getBandwidthForCountry(req, res) {
  const { countryCode } = req.params;
  const data = await fetchAllProposals();
  let bandwidth = 0;
  data.forEach(item => {
    if (item.location?.country === countryCode.toUpperCase()) {
      bandwidth += item.quality?.bandwidth || 0;
    }
  });
  res.json({ countryCode: countryCode.toUpperCase(), bandwidth });
}

// GET /help — list all available endpoints with descriptions
export async function getHelp(req, res) {
  res.json({
    base_url: 'https://mysterium-api.adinetech.com',
    endpoints: [
      { method: 'GET', path: '/', description: 'Full aggregated network snapshot. Also updates all Prometheus gauges.' },
      { method: 'GET', path: '/metrics', description: 'Prometheus scrape endpoint.' },
      { method: 'GET', path: '/price', description: 'Raw service pricing from Discovery API — all 6 service types, residential + other.' },
      { method: 'GET', path: '/proposals', description: 'Full raw proposals list from Discovery API.' },
      { method: 'GET', path: '/nodes_per_country', description: 'Node count per country (all countries).' },
      { method: 'GET', path: '/nodes_per_country/:countryCode', description: 'Node count for a specific country (ISO 3166-1 alpha-2, e.g. US, DE).' },
      { method: 'GET', path: '/bandwidth_per_country', description: 'Bandwidth (Mbps) per country (all countries).' },
      { method: 'GET', path: '/bandwidth_per_country/:countryCode', description: 'Bandwidth (Mbps) for a specific country.' },
      { method: 'GET', path: '/help', description: 'This endpoint.' },
    ],
  });
}
