import client from 'prom-client';

export const register = new client.Registry();

// Node count
export const totalNodesGauge = new client.Gauge({ name: 'mysterium_total_nodes', help: 'Total nodes (all access policies)' });
export const publicNodesGauge = new client.Gauge({ name: 'mysterium_public_nodes', help: 'Total public nodes' });

// Quality
export const avgQualityGauge = new client.Gauge({ name: 'mysterium_avg_quality', help: 'Avg quality score (0–3)' });
export const avgPublicQualityGauge = new client.Gauge({ name: 'mysterium_avg_public_quality', help: 'Avg quality score — public nodes (0–3)' });

// Latency — mean + percentiles
export const avgLatencyGauge = new client.Gauge({ name: 'mysterium_avg_latency', help: 'Avg latency ms (outliers capped at 10s)' });
export const avgPublicLatencyGauge = new client.Gauge({ name: 'mysterium_avg_public_latency', help: 'Avg latency ms — public nodes' });
export const p50LatencyGauge = new client.Gauge({ name: 'mysterium_p50_latency', help: 'Median (p50) latency ms' });
export const p95LatencyGauge = new client.Gauge({ name: 'mysterium_p95_latency', help: 'p95 latency ms' });
export const p50PublicLatencyGauge = new client.Gauge({ name: 'mysterium_p50_public_latency', help: 'Median (p50) latency ms — public nodes' });
export const p95PublicLatencyGauge = new client.Gauge({ name: 'mysterium_p95_public_latency', help: 'p95 latency ms — public nodes' });

// Uptime
export const avgUptimeGauge = new client.Gauge({ name: 'mysterium_avg_uptime', help: 'Avg uptime hrs' });
export const avgPublicUptimeGauge = new client.Gauge({ name: 'mysterium_avg_public_uptime', help: 'Avg uptime hrs — public nodes' });

// Packet loss
export const avgPacketLossGauge = new client.Gauge({ name: 'mysterium_avg_packet_loss', help: 'Avg packet loss %' });
export const avgPublicPacketLossGauge = new client.Gauge({ name: 'mysterium_avg_public_packet_loss', help: 'Avg packet loss % — public nodes' });

// Bandwidth
export const totalBandwidthGauge = new client.Gauge({ name: 'mysterium_total_bandwidth', help: 'Total bandwidth Mbps' });
export const avgBandwidthGauge = new client.Gauge({ name: 'mysterium_avg_bandwidth', help: 'Avg bandwidth per node Mbps' });
export const totalPublicBandwidthGauge = new client.Gauge({ name: 'mysterium_total_public_bandwidth', help: 'Total bandwidth Mbps — public nodes' });
export const avgPublicBandwidthGauge = new client.Gauge({ name: 'mysterium_avg_public_bandwidth', help: 'Avg bandwidth per public node Mbps' });

// Fee
export const feeGauge = new client.Gauge({ name: 'mysterium_current_fee', help: 'Registration/settlement fee in MYST (chain 137)' });

// Pricing — residential (6 service types)
export const residential_wireguard_gib = new client.Gauge({ name: 'mysterium_residential_wireguard_gib', help: 'Residential wireguard price/GiB MYST' });
export const residential_scraping_gib = new client.Gauge({ name: 'mysterium_residential_scraping_gib', help: 'Residential scraping price/GiB MYST' });
export const residential_quic_scraping_gib = new client.Gauge({ name: 'mysterium_residential_quic_scraping_gib', help: 'Residential QUIC scraping price/GiB MYST' });
export const residential_data_transfer_gib = new client.Gauge({ name: 'mysterium_residential_data_transfer_gib', help: 'Residential data transfer price/GiB MYST' });
export const residential_dvpn_gib = new client.Gauge({ name: 'mysterium_residential_dvpn_gib', help: 'Residential dVPN price/GiB MYST' });
export const residential_monitoring_gib = new client.Gauge({ name: 'mysterium_residential_monitoring_gib', help: 'Residential monitoring price/GiB MYST' });

// Pricing — other (6 service types)
export const other_wireguard_gib = new client.Gauge({ name: 'mysterium_other_wireguard_gib', help: 'Other wireguard price/GiB MYST' });
export const other_scraping_gib = new client.Gauge({ name: 'mysterium_other_scraping_gib', help: 'Other scraping price/GiB MYST' });
export const other_quic_scraping_gib = new client.Gauge({ name: 'mysterium_other_quic_scraping_gib', help: 'Other QUIC scraping price/GiB MYST' });
export const other_data_transfer_gib = new client.Gauge({ name: 'mysterium_other_data_transfer_gib', help: 'Other data transfer price/GiB MYST' });
export const other_dvpn_gib = new client.Gauge({ name: 'mysterium_other_dvpn_gib', help: 'Other dVPN price/GiB MYST' });
export const other_monitoring_gib = new client.Gauge({ name: 'mysterium_other_monitoring_gib', help: 'Other monitoring price/GiB MYST' });

// Register all static metrics
const staticMetrics = [
  totalNodesGauge, publicNodesGauge,
  avgQualityGauge, avgPublicQualityGauge,
  avgLatencyGauge, avgPublicLatencyGauge,
  p50LatencyGauge, p95LatencyGauge, p50PublicLatencyGauge, p95PublicLatencyGauge,
  avgUptimeGauge, avgPublicUptimeGauge,
  avgPacketLossGauge, avgPublicPacketLossGauge,
  totalBandwidthGauge, avgBandwidthGauge, totalPublicBandwidthGauge, avgPublicBandwidthGauge,
  feeGauge,
  residential_wireguard_gib, residential_scraping_gib, residential_quic_scraping_gib,
  residential_data_transfer_gib, residential_dvpn_gib, residential_monitoring_gib,
  other_wireguard_gib, other_scraping_gib, other_quic_scraping_gib,
  other_data_transfer_gib, other_dvpn_gib, other_monitoring_gib,
];
staticMetrics.forEach(m => register.registerMetric(m));

client.collectDefaultMetrics({ register });

// Dynamic per-country bandwidth gauges
const bandwidthPerCountryGauges = {};
export function updateBandwidthGauges(bandwidthData) {
  Object.keys(bandwidthData).forEach(country => {
    if (!bandwidthPerCountryGauges[country]) {
      bandwidthPerCountryGauges[country] = new client.Gauge({ name: `mysterium_bandwidth_${country}`, help: `Bandwidth Mbps — ${country}` });
      register.registerMetric(bandwidthPerCountryGauges[country]);
    }
    bandwidthPerCountryGauges[country].set(bandwidthData[country]);
  });
}

// Dynamic per-country node-count gauges
const nodesPerCountryGauges = {};
export function updateNodesGauges(nodesData) {
  Object.keys(nodesData).forEach(country => {
    if (!nodesPerCountryGauges[country]) {
      nodesPerCountryGauges[country] = new client.Gauge({ name: `mysterium_nodes_${country}`, help: `Node count — ${country}` });
      register.registerMetric(nodesPerCountryGauges[country]);
    }
    nodesPerCountryGauges[country].set(nodesData[country]);
  });
}

// Dynamic per-service-type node-count gauges
const serviceTypeGauges = {};
export function updateServiceTypeGauges(serviceTypeData) {
  Object.keys(serviceTypeData).forEach(serviceType => {
    const safe = serviceType.replace(/[^a-zA-Z0-9_]/g, '_');
    if (!serviceTypeGauges[safe]) {
      serviceTypeGauges[safe] = new client.Gauge({ name: `mysterium_nodes_service_${safe}`, help: `Node count — service type ${serviceType}` });
      register.registerMetric(serviceTypeGauges[safe]);
    }
    serviceTypeGauges[safe].set(serviceTypeData[serviceType]);
  });
}
