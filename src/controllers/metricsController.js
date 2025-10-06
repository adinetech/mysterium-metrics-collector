import { 
  fetchAllProposals, 
  fetchPublicProposals, 
  fetchRegistrationFee, 
  fetchServicePricing 
} from '../services/mysteriumApi.js';
import { 
  calculateMetrics, 
  parsePricingData 
} from '../utils/calculations.js';
import * as metrics from '../metrics/prometheusMetrics.js';

// Main aggregation endpoint
export async function getAggregatedMetrics(req, res) {
  const [data, pubData, fee, price] = await Promise.all([
    fetchAllProposals(), 
    fetchPublicProposals(), 
    fetchRegistrationFee(), 
    fetchServicePricing()
  ]);

  // Calculate metrics for all nodes
  const allMetrics = calculateMetrics(data);
  
  // Calculate metrics for public nodes
  const pubMetrics = calculateMetrics(pubData);

  // Parse pricing data
  console.log('Service pricing data:', price);
  const pricingValues = parsePricingData(price);

  // Build response object
  const responseData = {
    total_nodes: allMetrics.totalNodes,
    avg_quality: allMetrics.avgQuality,
    avg_latency: allMetrics.avgLatency,
    total_bandwidth: allMetrics.totalBandwidth,
    avg_bandwidth: allMetrics.avgBandwidth,
    public_nodes: pubMetrics.totalNodes,
    pub_avg_quality: pubMetrics.avgQuality,
    pub_avg_latency: pubMetrics.avgLatency,
    pub_total_bandwidth: pubMetrics.totalBandwidth,
    pub_avg_bandwidth: pubMetrics.avgBandwidth,
    current_fee: fee,
    residential_wireguard_gib: pricingValues.resi_wireguard_gib_value,
    residential_scraping_gib: pricingValues.resi_scraping_gib_value,
    residential_data_transfer_gib: pricingValues.resi_data_transfer_gib_value,
    residential_dvpn_gib: pricingValues.resi_dvpn_gib_value,
    other_wireguard_gib: pricingValues.other_wireguard_gib_value,
    other_scraping_gib: pricingValues.other_scraping_gib_value,
    other_data_transfer_gib: pricingValues.other_data_transfer_gib_value,
    other_dvpn_gib: pricingValues.other_dvpn_gib_value,
    bandwidthPerCountry: allMetrics.bandwidthPerCountry,
    nodes_per_country: allMetrics.nodesPerCountry,
  };

  // Update Prometheus gauges
  metrics.totalNodesGauge.set(allMetrics.totalNodes);
  metrics.publicNodesGauge.set(pubMetrics.totalNodes);
  metrics.avgQualityGauge.set(allMetrics.avgQuality);
  metrics.avgLatencyGauge.set(allMetrics.avgLatency);
  metrics.totalBandwidthGauge.set(allMetrics.totalBandwidth);
  metrics.avgBandwidthGauge.set(allMetrics.avgBandwidth);
  metrics.avgPublicQualityGauge.set(pubMetrics.avgQuality);
  metrics.avgPublicLatencyGauge.set(pubMetrics.avgLatency);
  metrics.totalPublicBandwidthGauge.set(pubMetrics.totalBandwidth);
  metrics.avgPublicBandwidthGauge.set(pubMetrics.avgBandwidth);
  metrics.feeGauge.set(fee);

  // Update pricing gauges
  metrics.residential_wireguard_gib.set(pricingValues.resi_wireguard_gib_value);
  metrics.residential_scraping_gib.set(pricingValues.resi_scraping_gib_value);
  metrics.residential_data_transfer_gib.set(pricingValues.resi_data_transfer_gib_value);
  metrics.residential_dvpn_gib.set(pricingValues.resi_dvpn_gib_value);
  metrics.other_wireguard_gib.set(pricingValues.other_wireguard_gib_value);
  metrics.other_scraping_gib.set(pricingValues.other_scraping_gib_value);
  metrics.other_data_transfer_gib.set(pricingValues.other_data_transfer_gib_value);
  metrics.other_dvpn_gib.set(pricingValues.other_dvpn_gib_value);

  // Create dynamic country gauges
  metrics.createDynamicGauges(allMetrics.bandwidthPerCountry, 'mysterium_bandwidth', 'Total bandwidth');
  metrics.createDynamicGauges(allMetrics.nodesPerCountry, 'mysterium_nodes', 'Total nodes');

  res.json(responseData);
}

// Prometheus metrics endpoint
export async function getPrometheusMetrics(req, res) {
  res.set('Content-Type', metrics.register.contentType);
  res.end(await metrics.register.metrics());
}
