import {
  fetchAllProposals,
  fetchPublicProposals,
  fetchRegistrationFee,
  fetchServicePricing,
  getCacheAge,
} from '../services/mysteriumApi.js';
import { calculateMetrics, parsePricingData } from '../utils/calculations.js';
import * as metrics from '../metrics/prometheusMetrics.js';

const START_TIME = Date.now();

// GET / — full aggregated snapshot + Prometheus gauge update
export async function getAggregatedMetrics(req, res) {
  const [data, pubData, fee, price] = await Promise.all([
    fetchAllProposals(),
    fetchPublicProposals(),
    fetchRegistrationFee(),
    fetchServicePricing(),
  ]);

  const all = calculateMetrics(data);
  const pub = calculateMetrics(pubData);
  const p = parsePricingData(price);

  const responseData = {
    // All-node stats
    total_nodes: all.totalNodes,
    avg_quality: all.avgQuality,
    avg_latency: all.avgLatency,
    latency_p50: all.p50Latency,
    latency_p95: all.p95Latency,
    avg_uptime: all.avgUptime,
    avg_packet_loss: all.avgPacketLoss,
    total_bandwidth: all.totalBandwidth,
    avg_bandwidth: all.avgBandwidth,
    nodes_per_service_type: all.nodesPerServiceType,

    // Public-node stats
    public_nodes: pub.totalNodes,
    pub_avg_quality: pub.avgQuality,
    pub_avg_latency: pub.avgLatency,
    pub_latency_p50: pub.p50Latency,
    pub_latency_p95: pub.p95Latency,
    pub_avg_uptime: pub.avgUptime,
    pub_avg_packet_loss: pub.avgPacketLoss,
    pub_total_bandwidth: pub.totalBandwidth,
    pub_avg_bandwidth: pub.avgBandwidth,

    // Fee
    current_fee: fee,

    // Residential pricing (6 service types)
    residential_wireguard_gib: p.resi_wireguard_gib_value,
    residential_scraping_gib: p.resi_scraping_gib_value,
    residential_quic_scraping_gib: p.resi_quic_scraping_gib_value,
    residential_data_transfer_gib: p.resi_data_transfer_gib_value,
    residential_dvpn_gib: p.resi_dvpn_gib_value,
    residential_monitoring_gib: p.resi_monitoring_gib_value,

    // Other pricing (6 service types)
    other_wireguard_gib: p.other_wireguard_gib_value,
    other_scraping_gib: p.other_scraping_gib_value,
    other_quic_scraping_gib: p.other_quic_scraping_gib_value,
    other_data_transfer_gib: p.other_data_transfer_gib_value,
    other_dvpn_gib: p.other_dvpn_gib_value,
    other_monitoring_gib: p.other_monitoring_gib_value,

    // Per-country breakdowns
    bandwidthPerCountry: all.bandwidthPerCountry,
    nodes_per_country: all.nodesPerCountry,

    // Cache info
    cache_age_seconds: getCacheAge('allProposals'),
  };

  // Update Prometheus — all nodes
  metrics.totalNodesGauge.set(all.totalNodes);
  metrics.avgQualityGauge.set(all.avgQuality);
  metrics.avgLatencyGauge.set(all.avgLatency);
  metrics.p50LatencyGauge.set(all.p50Latency);
  metrics.p95LatencyGauge.set(all.p95Latency);
  metrics.avgUptimeGauge.set(all.avgUptime);
  metrics.avgPacketLossGauge.set(all.avgPacketLoss);
  metrics.totalBandwidthGauge.set(all.totalBandwidth);
  metrics.avgBandwidthGauge.set(all.avgBandwidth);

  // Update Prometheus — public nodes
  metrics.publicNodesGauge.set(pub.totalNodes);
  metrics.avgPublicQualityGauge.set(pub.avgQuality);
  metrics.avgPublicLatencyGauge.set(pub.avgLatency);
  metrics.p50PublicLatencyGauge.set(pub.p50Latency);
  metrics.p95PublicLatencyGauge.set(pub.p95Latency);
  metrics.avgPublicUptimeGauge.set(pub.avgUptime);
  metrics.avgPublicPacketLossGauge.set(pub.avgPacketLoss);
  metrics.totalPublicBandwidthGauge.set(pub.totalBandwidth);
  metrics.avgPublicBandwidthGauge.set(pub.avgBandwidth);

  // Fee
  metrics.feeGauge.set(fee);

  // Residential pricing
  metrics.residential_wireguard_gib.set(p.resi_wireguard_gib_value);
  metrics.residential_scraping_gib.set(p.resi_scraping_gib_value);
  metrics.residential_quic_scraping_gib.set(p.resi_quic_scraping_gib_value);
  metrics.residential_data_transfer_gib.set(p.resi_data_transfer_gib_value);
  metrics.residential_dvpn_gib.set(p.resi_dvpn_gib_value);
  metrics.residential_monitoring_gib.set(p.resi_monitoring_gib_value);

  // Other pricing
  metrics.other_wireguard_gib.set(p.other_wireguard_gib_value);
  metrics.other_scraping_gib.set(p.other_scraping_gib_value);
  metrics.other_quic_scraping_gib.set(p.other_quic_scraping_gib_value);
  metrics.other_data_transfer_gib.set(p.other_data_transfer_gib_value);
  metrics.other_dvpn_gib.set(p.other_dvpn_gib_value);
  metrics.other_monitoring_gib.set(p.other_monitoring_gib_value);

  // Dynamic gauges
  metrics.updateBandwidthGauges(all.bandwidthPerCountry);
  metrics.updateNodesGauges(all.nodesPerCountry);
  metrics.updateServiceTypeGauges(all.nodesPerServiceType);

  res.json(responseData);
}

// GET /metrics — Prometheus scrape endpoint
export async function getPrometheusMetrics(req, res) {
  res.set('Content-Type', metrics.register.contentType);
  res.end(await metrics.register.metrics());
}
