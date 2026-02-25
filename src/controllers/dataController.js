import {
  fetchAllProposals,
  fetchServicePricing,
} from '../services/mysteriumApi.js';
import {
  getNodesPerCountry,
  getBandwidthPerCountry,
  getTopCountries,
  getServiceTypesForCountry,
} from '../utils/calculations.js';

// GET /price
export async function getPricing(req, res) {
  res.json(await fetchServicePricing());
}

// GET /proposals
export async function getProposals(req, res) {
  res.json(await fetchAllProposals());
}

// GET /nodes_per_country
export async function getNodesPerCountryAll(req, res) {
  const data = await fetchAllProposals();
  res.json({ nodesPerCountry: getNodesPerCountry(data) });
}

// GET /nodes_per_country/:countryCode
export async function getNodesForCountry(req, res) {
  const cc = req.params.countryCode.toUpperCase();
  const data = await fetchAllProposals();
  const count = data.filter(item => item.location?.country === cc).length;
  res.json({ countryCode: cc, count });
}

// GET /nodes_per_country/:countryCode/services
export async function getServicesForCountry(req, res) {
  const cc = req.params.countryCode.toUpperCase();
  const data = await fetchAllProposals();
  const services = getServiceTypesForCountry(data, cc);
  const total = Object.values(services).reduce((s, v) => s + v, 0);
  res.json({ countryCode: cc, total_nodes: total, services });
}

// GET /bandwidth_per_country
export async function getBandwidthPerCountryAll(req, res) {
  const data = await fetchAllProposals();
  res.json({ bandwidthPerCountry: getBandwidthPerCountry(data) });
}

// GET /bandwidth_per_country/:countryCode
export async function getBandwidthForCountry(req, res) {
  const cc = req.params.countryCode.toUpperCase();
  const data = await fetchAllProposals();
  let bandwidth = 0;
  data.forEach(item => {
    if (item.location?.country === cc) bandwidth += item.quality?.bandwidth || 0;
  });
  res.json({ countryCode: cc, bandwidth });
}

// GET /stats/top_countries?n=10
export async function getTopCountriesStats(req, res) {
  const n = Math.min(parseInt(req.query.n) || 10, 50);
  const data = await fetchAllProposals();
  const nodesPerCountry = getNodesPerCountry(data);
  const bandwidthPerCountry = getBandwidthPerCountry(data);
  res.json(getTopCountries(nodesPerCountry, bandwidthPerCountry, n));
}

// GET /health
export async function getHealth(req, res) {
  res.json({
    status: 'ok',
    uptime_seconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}

// GET /help
export async function getHelp(req, res) {
  res.json({
    base_url: 'https://mysterium-api.adinetech.com',
    endpoints: [
      { method: 'GET', path: '/', description: 'Full aggregated network snapshot. Updates all Prometheus gauges.' },
      { method: 'GET', path: '/metrics', description: 'Prometheus scrape endpoint.' },
      { method: 'GET', path: '/price', description: 'Raw service pricing from Discovery API — all 6 service types.' },
      { method: 'GET', path: '/proposals', description: 'Full raw proposals list (~41k entries).' },
      { method: 'GET', path: '/stats/top_countries?n=10', description: 'Top N countries by node count and bandwidth.' },
      { method: 'GET', path: '/nodes_per_country', description: 'Node count per country (all countries).' },
      { method: 'GET', path: '/nodes_per_country/:cc', description: 'Node count for a specific country (ISO alpha-2, e.g. US).' },
      { method: 'GET', path: '/nodes_per_country/:cc/services', description: 'Service type breakdown for a specific country.' },
      { method: 'GET', path: '/bandwidth_per_country', description: 'Bandwidth (Mbps) per country (all countries).' },
      { method: 'GET', path: '/bandwidth_per_country/:cc', description: 'Bandwidth (Mbps) for a specific country.' },
      { method: 'GET', path: '/health', description: 'Health check — returns uptime and timestamp.' },
      { method: 'GET', path: '/help', description: 'This endpoint.' },
    ],
  });
}
