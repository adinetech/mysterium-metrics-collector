
import express from 'express';
import fetch from 'node-fetch';
import client from 'prom-client';

const app = express();

app.use(express.static('public'));

const port = 80;

// Available functions - fetchAllProposals, fetchPublicProposals, fetchRegistrationFee, ServicePricing.

async function fetchAllProposals() {
  const url = 'https://discovery.mysterium.network/api/v3/proposals?&access_policy=all';
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function fetchPublicProposals() {
  const url = 'https://discovery.mysterium.network/api/v3/proposals';
  const response = await fetch(url);
  const pubData = await response.json();
  return pubData;
}

async function fetchRegistrationFee() {
  const url = 'https://transactor.mysterium.network/api/v1/fee/137/register';
  const response = await fetch(url);
  const data = await response.json();
  const feeInNormalUnits = data.fee / 1e18; 
  return feeInNormalUnits;
}

async function ServicePricing() {
  const url = 'https://discovery.mysterium.network/api/v4/prices';
  const response = await fetch(url);
  const price = await response.json();
  return price;
}
  
const register = new client.Registry();

const totalNodesGauge = new client.Gauge({
  name: 'mysterium_total_nodes',
  help: 'Total number of Mysterium Network Nodes',
});
const publicNodesGauge = new client.Gauge({
  name: 'mysterium_public_nodes',
  help: 'Total number of public Mysterium Network Nodes',
});
const avgQualityGauge = new client.Gauge({
  name: 'mysterium_avg_quality',
  help: 'Average quality of Mysterium Network Nodes',
});
const avgLatencyGauge = new client.Gauge({
  name: 'mysterium_avg_latency',
  help: 'Average latency of Mysterium Network Nodes',
});

const totalBandwidthGauge = new client.Gauge({
  name: 'mysterium_total_bandwidth',
  help: 'Total bandwidth of the Mysterium Network Nodes',
});

const avgBandwidthGauge = new client.Gauge({
  name: 'mysterium_avg_bandwidth',
  help: 'Average bandwidth of Mysterium Network Nodes',
});

const avgPublicQualityGauge = new client.Gauge({
  name: 'mysterium_avg_public_quality',
  help: 'Average quality of public Mysterium Network Nodes',
});

const avgPublicLatencyGauge = new client.Gauge({
  name: 'mysterium_avg_public_latency',
  help: 'Average latency of public Mysterium Nodes',
});

const totalPublicBandwidthGauge = new client.Gauge({
  name: 'mysterium_total_public_bandwidth',
  help: 'Total bandwidth of the public Mysterium Network Nodes',
});

const avgPublicBandwidthGauge = new client.Gauge({
  name: 'mysterium_avg_public_bandwidth',
  help: 'Average bandwidth of public Mysterium Network Nodes',
});

const feeGauge = new client.Gauge({
  name: 'mysterium_current_fee',
  help: 'Mysterium Network registration/settlement fees in MYST - powered by Transactor API.',
});

const residential_wireguard_gib = new client.Gauge({
  name: 'mysterium_residential_wireguard_gib',
  help: 'Residential Wireguard price per GiB',
});

const residential_scraping_gib = new client.Gauge({
  name: 'mysterium_residential_scraping_gib',
  help: 'Residential Scraping price per GiB',
});

const residential_data_transfer_gib = new client.Gauge({
  name: 'mysterium_residential_data_transfer_gib',
  help: 'Residential Data Transfer price per GiB',
});


const residential_dvpn_gib = new client.Gauge({
  name: 'mysterium_residential_dvpn_gib',
  help: 'Residential DVPN price per GiB',
});


const other_wireguard_gib = new client.Gauge({
  name: 'mysterium_other_wireguard_gib',
  help: 'Other Wireguard price per GiB',
});


const other_scraping_gib = new client.Gauge({
  name: 'mysterium_other_scraping_gib',
  help: 'Other Scraping price per GiB',
});


const other_data_transfer_gib = new client.Gauge({
  name: 'mysterium_other_data_transfer_gib',
  help: 'Other Data Transfer price per GiB',
});

const other_dvpn_gib = new client.Gauge({
  name: 'mysterium_other_dvpn_gib',
  help: 'Other DVPN price per GiB',
});

register.registerMetric(totalNodesGauge);
register.registerMetric(publicNodesGauge);
register.registerMetric(avgQualityGauge);
register.registerMetric(avgLatencyGauge);
register.registerMetric(totalBandwidthGauge);
register.registerMetric(avgBandwidthGauge);
register.registerMetric(avgPublicQualityGauge);
register.registerMetric(avgPublicLatencyGauge);
register.registerMetric(totalPublicBandwidthGauge);
register.registerMetric(avgPublicBandwidthGauge);
register.registerMetric(feeGauge);

register.registerMetric(residential_wireguard_gib);
register.registerMetric(residential_scraping_gib);
register.registerMetric(residential_data_transfer_gib);
register.registerMetric(residential_dvpn_gib);
register.registerMetric(other_wireguard_gib);
register.registerMetric(other_scraping_gib);
register.registerMetric(other_data_transfer_gib);

const bandwidthPerCountryGauges = {};
const nodesPerCountryGauges = {};

function createDynamicGauges(data, name, help) {
    Object.keys(data).forEach(key => {
        const bandwidthGaugeName = `${name}_bandwidth_${key}`;
        const nodesGaugeName = `${name}_nodes_${key}`;

        console.log(`Creating gauges for ${key}: ${bandwidthGaugeName}, ${nodesGaugeName}`);

        if (!bandwidthPerCountryGauges[key] || !nodesPerCountryGauges[key]) {
            bandwidthPerCountryGauges[key] = new client.Gauge({
                name: bandwidthGaugeName,
                help: `${help} bandwidth for country ${key}`,
            });
            nodesPerCountryGauges[key] = new client.Gauge({
                name: nodesGaugeName,
                help: `${help} nodes for country ${key}`,
            });

            register.registerMetric(bandwidthPerCountryGauges[key]);
            register.registerMetric(nodesPerCountryGauges[key]);
        }

        bandwidthPerCountryGauges[key].set(data[key]);
        nodesPerCountryGauges[key].set(data[key]);
    });
}

app.get('/', async (req, res) => {
  try {
    const [data, pubData, fee, price] = await Promise.all([fetchAllProposals(), fetchPublicProposals(), fetchRegistrationFee(), ServicePricing()]);

    const totalNodes = data.length;
    const publicNodes = pubData.length;

    let totalQuality = 0;
    let totalLatency = 0;
    let totalBandwidth = 0;
    let nodesPerCountry = {};
    let bandwidthPerCountry = {};

    let pubTotalQuality = 0;
    let pubTotalLatency = 0;
    let pubTotalBandwidth = 0;
    let pubNodesPerCountry = {};

// Pricing data from Discovery API v4: https://discovery.mysterium.network/api/v4/prices
    
    let resi_wireguard_gib_value = 0;
    let resi_scraping_gib_value = 0;
    let resi_data_transfer_gib_value = 0;
    let resi_dvpn_gib_value = 0;
    let other_wireguard_gib_value = 0;
    let other_scraping_gib_value = 0;
    let other_data_transfer_gib_value = 0;
    let other_dvpn_gib_value = 0;

    data.forEach(item => {
      if (item.quality) {
        totalQuality += item.quality.quality || 0;
        totalLatency += item.quality.latency || 0;
        totalBandwidth += item.quality.bandwidth || 0;

        const country = item.location.country;
        if (bandwidthPerCountry[country]) {
          bandwidthPerCountry[country] += item.quality.bandwidth || 0;
        } else {
          bandwidthPerCountry[country] = item.quality.bandwidth || 0;
        }
      }

      const country = item.location.country;
      if (nodesPerCountry[country]) {
        nodesPerCountry[country] += 1;
      } else {
        nodesPerCountry[country] = 1;
      }
    });

    pubData.forEach(item => {
      if (item.quality) {
        pubTotalQuality += item.quality.quality || 0;
        pubTotalLatency += item.quality.latency || 0;
        pubTotalBandwidth += item.quality.bandwidth || 0;
      }

      const country = item.location.country;
      if (pubNodesPerCountry[country]) {
        pubNodesPerCountry[country] += 1;
      } else {
        pubNodesPerCountry[country] = 1;
      }
    });

    console.log('Service pricing data:', price);

    if (price && price.defaults && price.defaults.current) {
      const { residential, other } = price.defaults.current;
    
      if (residential) {
        resi_wireguard_gib_value = parseFloat(residential.wireguard?.price_per_gib_human_readable) || 0;
        resi_scraping_gib_value = parseFloat(residential.scraping?.price_per_gib_human_readable) || 0;
        resi_data_transfer_gib_value = parseFloat(residential.data_transfer?.price_per_gib_human_readable) || 0;
        resi_dvpn_gib_value = parseFloat(residential.dvpn?.price_per_gib_human_readable) || 0;
      }
      if (other) {
        other_wireguard_gib_value = parseFloat(other.wireguard?.price_per_gib_human_readable) || 0;
        other_scraping_gib_value = parseFloat(other.scraping?.price_per_gib_human_readable) || 0;
        other_data_transfer_gib_value = parseFloat(other.data_transfer?.price_per_gib_human_readable) || 0;
        other_dvpn_gib_value = parseFloat(other.dvpn?.price_per_gib_human_readable) || 0;
      }
    }        
    const avgQuality = totalQuality / totalNodes;
    const avgLatency = totalLatency / totalNodes;
    const avgBandwidth = totalBandwidth / totalNodes;
    const pubAvgQuality = pubTotalQuality / publicNodes;
    const pubAvgLatency = pubTotalLatency / publicNodes;
    const pubAvgbandwidth = pubTotalBandwidth / publicNodes;

    const responseData = {
      total_nodes: totalNodes, 
      avg_quality: avgQuality, 
      avg_latency: avgLatency, 
      total_bandwidth: totalBandwidth, 
      avg_bandwidth: avgBandwidth, 
      public_nodes: publicNodes, 
      pub_avg_quality: pubAvgQuality, 
      pub_avg_latency: pubAvgLatency, 
      pub_total_bandwidth: pubTotalBandwidth, 
      pub_avg_bandwidth: pubAvgbandwidth, 
      current_fee: fee, 
      residential_wireguard_gib: resi_wireguard_gib_value,
      residential_scraping_gib: resi_scraping_gib_value,
      residential_data_transfer_gib: resi_data_transfer_gib_value,
      residential_dvpn_gib: resi_dvpn_gib_value,
      other_wireguard_gib: other_wireguard_gib_value,
      other_scraping_gib: other_scraping_gib_value,
      other_data_transfer_gib: other_data_transfer_gib_value,
      other_dvpn_gib: other_dvpn_gib_value,
      bandwidthPerCountry: bandwidthPerCountry,
      nodes_per_country: nodesPerCountry,
    };
    totalNodesGauge.set(totalNodes);
    publicNodesGauge.set(publicNodes);
    avgQualityGauge.set(avgQuality);
    avgLatencyGauge.set(avgLatency);
    totalBandwidthGauge.set(totalBandwidth);
    avgBandwidthGauge.set(avgBandwidth);
    avgPublicQualityGauge.set(pubAvgQuality);
    avgPublicLatencyGauge.set(pubAvgLatency);
    totalPublicBandwidthGauge.set(pubTotalBandwidth);
    avgPublicBandwidthGauge.set(pubAvgbandwidth);
    feeGauge.set(fee);

    residential_wireguard_gib.set(resi_wireguard_gib_value);
    residential_scraping_gib.set(resi_scraping_gib_value);
    residential_data_transfer_gib.set(resi_data_transfer_gib_value);
    residential_dvpn_gib.set(resi_dvpn_gib_value);
    other_wireguard_gib.set(other_wireguard_gib_value);
    other_scraping_gib.set(other_scraping_gib_value);
    other_data_transfer_gib.set(other_data_transfer_gib_value);
    other_dvpn_gib.set(other_dvpn_gib_value);

    createDynamicGauges(bandwidthPerCountry, 'mysterium_bandwidth', 'Total bandwidth');
    createDynamicGauges(nodesPerCountry, 'mysterium_nodes', 'Total nodes');

    res.json(responseData);
  } catch (error) {
    console.error('Failed to fetch node statistics:', error);
    res.status(500).json({ error: 'Failed to fetch node statistics' });
  }
});

client.collectDefaultMetrics({ register });

app.get('/metrics', async (req, res) => { //1
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.get('/fee', async (req, res) => { //2
  try {
    const fee = await fetchRegistrationFee();
    res.json({ fee });
  } catch (error) {
    console.error('Failed to fetch registration fee:', error);
    res.status(500).json({ error: 'Failed to fetch registration fee' });
  }
});

app.get('/price', async (req, res) => { //3
  try {
    const price = await ServicePricing();
    res.json(price);
  } catch (error) {
    console.error('Failed to fetch service pricing:', error);
    res.status(500).json({ error: 'Failed to fetch service pricing' });
  }
});

app.get('/proposals', async (req, res) => { //4
  try {
    const data = await fetchAllProposals();
    res.json(data);
  } catch (error) {
    console.error('Failed to fetch provider data:', error);
    res.status(500).json({ error: 'Failed to fetch provider data' });
  }
});

app.get("/providers", async (req, res) => { //5
  try {
    const data = await fetchAllProposals();
    res.json({ total_providers: data.length });
  } catch (error) {
    console.error('Failed to fetch provider count:', error);
    res.status(500).json({ error: 'Failed to fetch provider count' });
  }
});

app.get("/public_providers", async (req, res) => { //6
  try {
    const data = await fetchPublicProposals();
    res.json({ total_providers: data.length });
  } catch (error) {
    console.error('Failed to fetch public provider count:', error);
    res.status(500).json({ error: 'Failed to fetch public provider count' });
  }
});

app.get('/total_bandwidth', async (req, res) => { // 7 - in Gbps
  try {
    const data = await fetchAllProposals();
    let total_bandwidth = 0;
    data.forEach(item => {
      if (item.quality) {
        total_bandwidth += item.quality.bandwidth || 0;
      }
    });
    res.json({ total_bandwidth });
  } catch (error) {
    console.error('Failed to fetch total bandwidth:', error);
    res.status(500).json({ error: 'Failed to fetch total bandwidth' });
  }
});

app.get('/public_total_bandwidth', async (req, res) => { // 8 - in Gbps
  try {
    const data = await fetchPublicProposals();
    let total_bandwidth = 0;
    data.forEach(item => {
      if (item.quality) {
        total_bandwidth += item.quality.bandwidth || 0;
      }
    });
    res.json({ total_bandwidth });
  } catch (error) {
    console.error('Failed to fetch public total bandwidth:', error);
    res.status(500).json({ error: 'Failed to fetch public total bandwidth' });
  }
});

app.get('/avg_quality', async (req, res) => { // 9
  try {
    const data = await fetchAllProposals();
    let total_quality = 0;
    data.forEach(item => {
      if (item.quality) {
        total_quality += item.quality.quality || 0;
      }
    });
    const avg_quality = total_quality / data.length;
    res.json({ avg_quality });
  } catch (error) {
    console.error('Failed to fetch average quality:', error);
    res.status(500).json({ error: 'Failed to fetch average quality' });
  }
});

app.get('/public_avg_quality', async (req, res) => { // 10
  try {
    const data = await fetchPublicProposals();
    let total_quality = 0;
    data.forEach(item => {
      if (item.quality) {
        total_quality += item.quality.quality || 0;
      }
    });
    const avg_quality = total_quality / data.length;
    res.json({ avg_quality });
  } catch (error) {
    console.error('Failed to fetch public average quality:', error);
    res.status(500).json({ error: 'Failed to fetch public average quality' });
  }
});

app.get('/avg_latency', async (req, res) => { // 11
  try {
    const data = await fetchAllProposals();
    let total_latency = 0;
    data.forEach(item => {
      if (item.quality) {
        total_latency += item.quality.latency || 0;
      }
    });
    const avg_latency = total_latency / data.length;
    res.json({ avg_latency });
  } catch (error) {
    console.error('Failed to fetch average latency:', error);
    res.status(500).json({ error: 'Failed to fetch average latency' });
  }
});

app.get('/public_avg_latency', async (req, res) => { // 12
  try {
    const data = await fetchPublicProposals();
    let total_latency = 0;
    data.forEach(item => {
      if (item.quality) {
        total_latency += item.quality.latency || 0;
      }
    });
    const avg_latency = total_latency / data.length;
    res.json({ avg_latency });
  } catch (error) {
    console.error('Failed to fetch public average latency:', error);
    res.status(500).json({ error: 'Failed to fetch public average latency' });
  }
});

app.get('/public_providers', async (req, res) => { // 13
    try {
      const data = await fetchPublicProposals();
      res.json({ public_providers: data.length });
    } catch (error) {
      console.error('Failed to fetch public providers:', error);
      res.status(500).json({ error: 'Failed to fetch public providers' });
    }
});
app.get('/nodes_per_country', async (req, res) => { // 14
  try {
    const data = await fetchAllProposals();
    let nodesPerCountry = {};
    data.forEach(item => {
      const country = item.location.country;
      if (nodesPerCountry[country]) {
        nodesPerCountry[country] += 1;
      } else {
        nodesPerCountry[country] = 1;
      }
    });
    res.json({ nodesPerCountry });
  } catch (error) {
    console.error('Failed to fetch nodes per country:', error);
    res.status(500).json({ error: 'Failed to fetch nodes per country' });
  }
});

app.get('/nodes_per_country/:countryCode', async (req, res) => { //15
  const { countryCode } = req.params;
  try {
    const data = await fetchAllProposals();
    let count = 0;
    data.forEach(item => {
      if (item.location.country === countryCode) {
        count += 1;
      }
    });
    res.json({ countryCode, count });
  } catch (error) {
    console.error(`Failed to fetch nodes for country ${countryCode}:`, error);
    res.status(500).json({ error: `Failed to fetch nodes for country ${countryCode}` });
  }
});

app.get('/bandwidth_per_country', async (req, res) => { //16
  try {
    const data = await fetchAllProposals();
    let bandwidthPerCountry = {};
    data.forEach(item => {
      const country = item.location.country;
      if (bandwidthPerCountry[country]) {
        bandwidthPerCountry[country] += item.quality.bandwidth || 0;
      } else {
        bandwidthPerCountry[country] = item.quality.bandwidth || 0;
      }
    });
    res.json({ bandwidthPerCountry });
  } catch (error) {
    console.error('Failed to fetch bandwidth per country:', error);
    res.status(500).json({ error: 'Failed to fetch bandwidth per country' });
  }
});

app.get('/bandwidth_per_country/:countryCode', async (req, res) => { //17
  const { countryCode } = req.params;
  try {
    const data = await fetchAllProposals();
    let bandwidth = 0;
    data.forEach(item => {
      if (item.location.country === countryCode) {
        bandwidth += item.quality.bandwidth || 0;
      }
    });
    res.json({ countryCode, bandwidth });
  } catch (error) {
    console.error(`Failed to fetch bandwidth for country ${countryCode}:`, error);
    res.status(500).json({ error: `Failed to fetch bandwidth for country ${countryCode}` });
  }
});

//The code has 18 API Endpoints in total

app.get ('/help', async (req, res) => { //14
  res.json({ 
    endpoints: [
      '/metrics', //1
      '/fee', //2
      '/price', //3
      '/proposals', //4
      '/providers', //5
      '/public_providers', //6
      '/total_bandwidth', //7
      '/public_total_bandwidth', //8
      '/avg_quality', //9
      '/public_avg_quality', //10
      '/avg_latency', //11
      '/public_avg_latency', //12
      '/public_providers', //13
      '/nodes_per_country', //14
      '/bandwidth_per_country', //15
      '/nodes_per_country/:countryCode', //16
      '/bandwidth_per_country/:countryCode' //17
    ]
  });
}
);
setInterval(async () => {
  try {
    await fetch('http://localhost');
  } catch (error) {
    console.error('Failed to fetch node statistics:', error);
  }
}
, 60000); //60000 - 1 min

app.get('/dashboard', (req, res) => {
  res.sendFile('dashboard.html', { root: './public' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});