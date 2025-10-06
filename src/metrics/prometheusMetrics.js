import client from 'prom-client';

export const register = new client.Registry();

// Node count metrics
export const totalNodesGauge = new client.Gauge({
  name: 'mysterium_total_nodes',
  help: 'Total number of Mysterium Network Nodes',
});

export const publicNodesGauge = new client.Gauge({
  name: 'mysterium_public_nodes',
  help: 'Total number of public Mysterium Network Nodes',
});

// Quality metrics
export const avgQualityGauge = new client.Gauge({
  name: 'mysterium_avg_quality',
  help: 'Average quality of Mysterium Network Nodes',
});

export const avgPublicQualityGauge = new client.Gauge({
  name: 'mysterium_avg_public_quality',
  help: 'Average quality of public Mysterium Network Nodes',
});

// Latency metrics
export const avgLatencyGauge = new client.Gauge({
  name: 'mysterium_avg_latency',
  help: 'Average latency of Mysterium Network Nodes',
});

export const avgPublicLatencyGauge = new client.Gauge({
  name: 'mysterium_avg_public_latency',
  help: 'Average latency of public Mysterium Nodes',
});

// Bandwidth metrics
export const totalBandwidthGauge = new client.Gauge({
  name: 'mysterium_total_bandwidth',
  help: 'Total bandwidth of the Mysterium Network Nodes',
});

export const avgBandwidthGauge = new client.Gauge({
  name: 'mysterium_avg_bandwidth',
  help: 'Average bandwidth of Mysterium Network Nodes',
});

export const totalPublicBandwidthGauge = new client.Gauge({
  name: 'mysterium_total_public_bandwidth',
  help: 'Total bandwidth of the public Mysterium Network Nodes',
});

export const avgPublicBandwidthGauge = new client.Gauge({
  name: 'mysterium_avg_public_bandwidth',
  help: 'Average bandwidth of public Mysterium Network Nodes',
});

// Fee metric
export const feeGauge = new client.Gauge({
  name: 'mysterium_current_fee',
  help: 'Mysterium Network registration/settlement fees in MYST - powered by Transactor API.',
});

// Pricing metrics - Residential
export const residential_wireguard_gib = new client.Gauge({
  name: 'mysterium_residential_wireguard_gib',
  help: 'Residential Wireguard price per GiB',
});

export const residential_scraping_gib = new client.Gauge({
  name: 'mysterium_residential_scraping_gib',
  help: 'Residential Scraping price per GiB',
});

export const residential_data_transfer_gib = new client.Gauge({
  name: 'mysterium_residential_data_transfer_gib',
  help: 'Residential Data Transfer price per GiB',
});

export const residential_dvpn_gib = new client.Gauge({
  name: 'mysterium_residential_dvpn_gib',
  help: 'Residential DVPN price per GiB',
});

// Pricing metrics - Other
export const other_wireguard_gib = new client.Gauge({
  name: 'mysterium_other_wireguard_gib',
  help: 'Other Wireguard price per GiB',
});

export const other_scraping_gib = new client.Gauge({
  name: 'mysterium_other_scraping_gib',
  help: 'Other Scraping price per GiB',
});

export const other_data_transfer_gib = new client.Gauge({
  name: 'mysterium_other_data_transfer_gib',
  help: 'Other Data Transfer price per GiB',
});

export const other_dvpn_gib = new client.Gauge({
  name: 'mysterium_other_dvpn_gib',
  help: 'Other DVPN price per GiB',
});

// Dynamic country metrics storage
export const bandwidthPerCountryGauges = {};
export const nodesPerCountryGauges = {};

// Register all metrics
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
register.registerMetric(other_dvpn_gib);

// Collect default metrics
client.collectDefaultMetrics({ register });

// Helper function to create dynamic country gauges
export function createDynamicGauges(data, name, help) {
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
