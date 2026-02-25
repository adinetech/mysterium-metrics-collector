import {
  fetchAllProposals,
  fetchPublicProposals,
  fetchRegistrationFee,
  fetchServicePricing,
} from '../services/mysteriumApi.js';
import { calculateMetrics, parsePricingData } from '../utils/calculations.js';
import * as metrics from '../metrics/prometheusMetrics.js';

// GET / — full aggregated snapshot + Prometheus gauge update
export async function getAggregatedMetrics(req, res) {
  const [data, pubData, fee, price] = await Promise.all([
    fetchAllProposals(),
    fetchPublicProposals(),
    fetchRegistrationFee(),
    fetchServicePricing(),
  ]);

  const allMetrics = calculateMetrics(data);
  const pubMetrics = calculateMetrics(pubData);
  const p = parsePricingData(price);

  const responseData = {
    // All-node counts & quality
    total_nodes: allMetrics.totalNodes,
    avg_quality: allMetrics.avgQuality,
    avg_latency: allMetrics.avgLatency,
    avg_uptime: allMetrics.avgUptime,
    avg_packet_loss: allMetrics.avgPacketLoss,
    total_bandwidth: allMetrics.totalBandwidth,
    avg_bandwidth: allMetrics.avgBandwidth,
    nodes_per_service_type: allMetrics.nodesPerServiceType,

    // Public-node metrics
    public_nodes: pubMetrics.totalNodes,
    pub_avg_quality: pubMetrics.avgQuality,
    pub_avg_latency: pubMetrics.avgLatency,
    pub_avg_uptime: pubMetrics.avgUptime,
    pub_avg_packet_loss: pubMetrics.avgPacketLoss,
    pub_total_bandwidth: pubMetrics.totalBandwidth,
    pub_avg_bandwidth: pubMetrics.avgBandwidth,

    // Fee
    current_fee: fee,

    // Residential pricing per GiB (MYST) — all 6 service types
    residential_wireguard_gib: p.resi_wireguard_gib_value,
    residential_scraping_gib: p.resi_scraping_gib_value,
    residential_quic_scraping_gib: p.resi_quic_scraping_gib_value,
    residential_data_transfer_gib: p.resi_data_transfer_gib_value,
    residential_dvpn_gib: p.resi_dvpn_gib_value,
    residential_monitoring_gib: p.resi_monitoring_gib_value,

    // Other pricing per GiB (MYST) — all 6 service types
    other_wireguard_gib: p.other_wireguard_gib_value,
    other_scraping_gib: p.other_scraping_gib_value,
    other_quic_scraping_gib: p.other_quic_scraping_gib_value,
    other_data_transfer_gib: p.other_data_transfer_gib_value,
    other_dvpn_gib: p.other_dvpn_gib_value,
    other_monitoring_gib: p.other_monitoring_gib_value,

    // Per-country breakdowns
    bandwidthPerCountry: allMetrics.bandwidthPerCountry,
    nodes_per_country: allMetrics.nodesPerCountry,
  };

  // Update Prometheus gauges — all nodes
  metrics.totalNodesGauge.set(allMetrics.totalNodes);
  metrics.avgQualityGauge.set(allMetrics.avgQuality);
  metrics.avgLatencyGauge.set(allMetrics.avgLatency);
  metrics.avgUptimeGauge.set(allMetrics.avgUptime);
  metrics.avgPacketLossGauge.set(allMetrics.avgPacketLoss);
  metrics.totalBandwidthGauge.set(allMetrics.totalBandwidth);
  metrics.avgBandwidthGauge.set(allMetrics.avgBandwidth);

  // Update Prometheus gauges — public nodes
  metrics.publicNodesGauge.set(pubMetrics.totalNodes);
  metrics.avgPublicQualityGauge.set(pubMetrics.avgQuality);
  metrics.avgPublicLatencyGauge.set(pubMetrics.avgLatency);
  metrics.avgPublicUptimeGauge.set(pubMetrics.avgUptime);
  metrics.avgPublicPacketLossGauge.set(pubMetrics.avgPacketLoss);
  metrics.totalPublicBandwidthGauge.set(pubMetrics.totalBandwidth);
  metrics.avgPublicBandwidthGauge.set(pubMetrics.avgBandwidth);

  // Fee
  metrics.feeGauge.set(fee);

  // Residential pricing gauges
  metrics.residential_wireguard_gib.set(p.resi_wireguard_gib_value);
  metrics.residential_scraping_gib.set(p.resi_scraping_gib_value);
  metrics.residential_quic_scraping_gib.set(p.resi_quic_scraping_gib_value);
  metrics.residential_data_transfer_gib.set(p.resi_data_transfer_gib_value);
  metrics.residential_dvpn_gib.set(p.resi_dvpn_gib_value);
  metrics.residential_monitoring_gib.set(p.resi_monitoring_gib_value);

  // Other pricing gauges
  metrics.other_wireguard_gib.set(p.other_wireguard_gib_value);
  metrics.other_scraping_gib.set(p.other_scraping_gib_value);
  metrics.other_quic_scraping_gib.set(p.other_quic_scraping_gib_value);
  metrics.other_data_transfer_gib.set(p.other_data_transfer_gib_value);
  metrics.other_dvpn_gib.set(p.other_dvpn_gib_value);
  metrics.other_monitoring_gib.set(p.other_monitoring_gib_value);

  // Dynamic country & service-type gauges
  metrics.updateBandwidthGauges(allMetrics.bandwidthPerCountry);
  metrics.updateNodesGauges(allMetrics.nodesPerCountry);
  metrics.updateServiceTypeGauges(allMetrics.nodesPerServiceType);

  res.json(responseData);
}

// GET /metrics — Prometheus scrape endpoint
export async function getPrometheusMetrics(req, res) {
  res.set('Content-Type', metrics.register.contentType);
  res.end(await metrics.register.metrics());
}
