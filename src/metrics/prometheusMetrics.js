import client from 'prom-client';

export const register = new client.Registry();

// Node count metrics
export const totalNodesGauge = new client.Gauge({
  name: 'mysterium_total_nodes',
  help: 'Total number of Mysterium Network nodes (all access policies)',
});
export const publicNodesGauge = new client.Gauge({
  name: 'mysterium_public_nodes',
  help: 'Total number of public Mysterium Network nodes',
});

// Quality metrics
export const avgQualityGauge = new client.Gauge({
  name: 'mysterium_avg_quality',
  help: 'Average quality score of all nodes (0–3 scale)',
});
export const avgPublicQualityGauge = new client.Gauge({
  name: 'mysterium_avg_public_quality',
  help: 'Average quality score of public nodes (0–3 scale)',
});

// Latency metrics
export const avgLatencyGauge = new client.Gauge({
  name: 'mysterium_avg_latency',
  help: 'Average latency of all nodes in ms',
});
export const avgPublicLatencyGauge = new client.Gauge({
  name: 'mysterium_avg_public_latency',
  help: 'Average latency of public nodes in ms',
});

// Uptime metrics
export const avgUptimeGauge = new client.Gauge({
  name: 'mysterium_avg_uptime',
  help: 'Average uptime of all nodes in hours',
});
export const avgPublicUptimeGauge = new client.Gauge({
  name: 'mysterium_avg_public_uptime',
  help: 'Average uptime of public nodes in hours',
});

// Packet loss metrics
export const avgPacketLossGauge = new client.Gauge({
  name: 'mysterium_avg_packet_loss',
  help: 'Average packet loss % across all nodes',
});
export const avgPublicPacketLossGauge = new client.Gauge({
  name: 'mysterium_avg_public_packet_loss',
  help: 'Average packet loss % across public nodes',
});

// Bandwidth metrics
export const totalBandwidthGauge = new client.Gauge({
  name: 'mysterium_total_bandwidth',
  help: 'Total aggregated bandwidth of all nodes in Mbps',
});
export const avgBandwidthGauge = new client.Gauge({
  name: 'mysterium_avg_bandwidth',
  help: 'Average bandwidth per node in Mbps',
});
export const totalPublicBandwidthGauge = new client.Gauge({
  name: 'mysterium_total_public_bandwidth',
  help: 'Total bandwidth of public nodes in Mbps',
});
export const avgPublicBandwidthGauge = new client.Gauge({
  name: 'mysterium_avg_public_bandwidth',
  help: 'Average bandwidth per public node in Mbps',
});

// Fee metric
export const feeGauge = new client.Gauge({
  name: 'mysterium_current_fee',
  help: 'Registration/settlement fee in MYST (Polygon chain 137)',
});

// Pricing metrics — Residential (6 service types from Discovery API /api/v4/prices)
export const residential_wireguard_gib = new client.Gauge({
  name: 'mysterium_residential_wireguard_gib',
  help: 'Residential Wireguard price per GiB in MYST',
});
export const residential_scraping_gib = new client.Gauge({
  name: 'mysterium_residential_scraping_gib',
  help: 'Residential Scraping price per GiB in MYST',
});
export const residential_quic_scraping_gib = new client.Gauge({
  name: 'mysterium_residential_quic_scraping_gib',
  help: 'Residential QUIC Scraping price per GiB in MYST',
});
export const residential_data_transfer_gib = new client.Gauge({
  name: 'mysterium_residential_data_transfer_gib',
  help: 'Residential Data Transfer price per GiB in MYST',
});
export const residential_dvpn_gib = new client.Gauge({
  name: 'mysterium_residential_dvpn_gib',
  help: 'Residential dVPN price per GiB in MYST',
});
export const residential_monitoring_gib = new client.Gauge({
  name: 'mysterium_residential_monitoring_gib',
  help: 'Residential Monitoring price per GiB in MYST',
});

// Pricing metrics — Other / non-residential
export const other_wireguard_gib = new client.Gauge({
  name: 'mysterium_other_wireguard_gib',
  help: 'Other Wireguard price per GiB in MYST',
});
export const other_scraping_gib = new client.Gauge({
  name: 'mysterium_other_scraping_gib',
  help: 'Other Scraping price per GiB in MYST',
});
export const other_quic_scraping_gib = new client.Gauge({
  name: 'mysterium_other_quic_scraping_gib',
  help: 'Other QUIC Scraping price per GiB in MYST',
});
export const other_data_transfer_gib = new client.Gauge({
  name: 'mysterium_other_data_transfer_gib',
  help: 'Other Data Transfer price per GiB in MYST',
});
export const other_dvpn_gib = new client.Gauge({
  name: 'mysterium_other_dvpn_gib',
  help: 'Other dVPN price per GiB in MYST',
});
export const other_monitoring_gib = new client.Gauge({
  name: 'mysterium_other_monitoring_gib',
  help: 'Other Monitoring price per GiB in MYST',
});

// Register all static metrics
register.registerMetric(totalNodesGauge);
register.registerMetric(publicNodesGauge);
register.registerMetric(avgQualityGauge);
register.registerMetric(avgPublicQualityGauge);
register.registerMetric(avgLatencyGauge);
register.registerMetric(avgPublicLatencyGauge);
register.registerMetric(avgUptimeGauge);
register.registerMetric(avgPublicUptimeGauge);
register.registerMetric(avgPacketLossGauge);
register.registerMetric(avgPublicPacketLossGauge);
register.registerMetric(totalBandwidthGauge);
register.registerMetric(avgBandwidthGauge);
register.registerMetric(totalPublicBandwidthGauge);
register.registerMetric(avgPublicBandwidthGauge);
register.registerMetric(feeGauge);
register.registerMetric(residential_wireguard_gib);
register.registerMetric(residential_scraping_gib);
register.registerMetric(residential_quic_scraping_gib);
register.registerMetric(residential_data_transfer_gib);
register.registerMetric(residential_dvpn_gib);
register.registerMetric(residential_monitoring_gib);
register.registerMetric(other_wireguard_gib);
register.registerMetric(other_scraping_gib);
register.registerMetric(other_quic_scraping_gib);
register.registerMetric(other_data_transfer_gib);
register.registerMetric(other_dvpn_gib);
register.registerMetric(other_monitoring_gib);

// Collect default Node.js process metrics
client.collectDefaultMetrics({ register });

// Dynamic per-country bandwidth gauges (mysterium_bandwidth_<CC>)
const bandwidthPerCountryGauges = {};
export function updateBandwidthGauges(bandwidthData) {
  Object.keys(bandwidthData).forEach(country => {
    if (!bandwidthPerCountryGauges[country]) {
      bandwidthPerCountryGauges[country] = new client.Gauge({
        name: `mysterium_bandwidth_${country}`,
        help: `Total bandwidth for country ${country} in Mbps`,
      });
      register.registerMetric(bandwidthPerCountryGauges[country]);
    }
    bandwidthPerCountryGauges[country].set(bandwidthData[country]);
  });
}

// Dynamic per-country node-count gauges (mysterium_nodes_<CC>)
const nodesPerCountryGauges = {};
export function updateNodesGauges(nodesData) {
  Object.keys(nodesData).forEach(country => {
    if (!nodesPerCountryGauges[country]) {
      nodesPerCountryGauges[country] = new client.Gauge({
        name: `mysterium_nodes_${country}`,
        help: `Node count for country ${country}`,
      });
      register.registerMetric(nodesPerCountryGauges[country]);
    }
    nodesPerCountryGauges[country].set(nodesData[country]);
  });
}

// Dynamic per-service-type node-count gauges (mysterium_nodes_service_<type>)
const serviceTypeGauges = {};
export function updateServiceTypeGauges(serviceTypeData) {
  Object.keys(serviceTypeData).forEach(serviceType => {
    const safe = serviceType.replace(/[^a-zA-Z0-9_]/g, '_');
    if (!serviceTypeGauges[safe]) {
      serviceTypeGauges[safe] = new client.Gauge({
        name: `mysterium_nodes_service_${safe}`,
        help: `Node count for service type: ${serviceType}`,
      });
      register.registerMetric(serviceTypeGauges[safe]);
    }
    serviceTypeGauges[safe].set(serviceTypeData[serviceType]);
  });
}
