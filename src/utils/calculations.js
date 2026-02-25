// Compute a percentile value from a sorted array of numbers
function percentile(sorted, p) {
  if (!sorted.length) return 0;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

// Calculate total and average metrics from proposals data
export function calculateMetrics(data) {
  let totalQuality = 0;
  let totalLatency = 0;
  let totalBandwidth = 0;
  let totalUptime = 0;
  let totalPacketLoss = 0;
  let nodesPerCountry = {};
  let nodesPerServiceType = {};
  let bandwidthPerCountry = {};
  let nodesWithQuality = 0;
  const latencies = [];

  data.forEach(item => {
    // Service type breakdown
    const serviceType = item.service_type;
    if (serviceType) {
      nodesPerServiceType[serviceType] = (nodesPerServiceType[serviceType] || 0) + 1;
    }

    // Country node count
    const country = item.location?.country;
    if (country) {
      nodesPerCountry[country] = (nodesPerCountry[country] || 0) + 1;
    }

    // Quality-based metrics (only from nodes that report quality)
    if (item.quality) {
      nodesWithQuality++;
      const lat = item.quality.latency || 0;
      totalQuality += item.quality.quality || 0;
      totalLatency += Math.min(lat, 10000); // cap at 10s — excludes dead-node outliers
      totalBandwidth += item.quality.bandwidth || 0;
      totalUptime += item.quality.uptime || 0;
      totalPacketLoss += item.quality.packetLoss || 0;
      latencies.push(lat);

      if (country) {
        bandwidthPerCountry[country] = (bandwidthPerCountry[country] || 0) + (item.quality.bandwidth || 0);
      }
    }
  });

  const totalNodes = data.length;
  const n = nodesWithQuality || 1;

  // Sort for percentile calculations (cap outliers here too)
  const sortedLatencies = latencies.map(l => Math.min(l, 10000)).sort((a, b) => a - b);

  return {
    totalNodes,
    totalBandwidth,
    avgQuality: totalQuality / n,
    avgLatency: totalLatency / n,
    avgBandwidth: totalBandwidth / n,
    avgUptime: totalUptime / n,
    avgPacketLoss: totalPacketLoss / n,
    p50Latency: percentile(sortedLatencies, 50),
    p95Latency: percentile(sortedLatencies, 95),
    nodesPerCountry,
    nodesPerServiceType,
    bandwidthPerCountry,
  };
}

// Top N countries by node count or bandwidth
export function getTopCountries(nodesPerCountry, bandwidthPerCountry, n = 10) {
  const byNodes = Object.entries(nodesPerCountry)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([country, count]) => ({ country, count }));

  const byBandwidth = Object.entries(bandwidthPerCountry)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([country, bandwidth]) => ({ country, bandwidth }));

  return { byNodes, byBandwidth };
}

// Service type breakdown for a single country
export function getServiceTypesForCountry(data, countryCode) {
  const services = {};
  data.forEach(item => {
    if (item.location?.country === countryCode) {
      const svc = item.service_type;
      if (svc) services[svc] = (services[svc] || 0) + 1;
    }
  });
  return services;
}

// Get nodes count by country (standalone helper used by dataController)
export function getNodesPerCountry(data) {
  const nodesPerCountry = {};
  data.forEach(item => {
    const country = item.location?.country;
    if (country) nodesPerCountry[country] = (nodesPerCountry[country] || 0) + 1;
  });
  return nodesPerCountry;
}

// Get bandwidth by country (standalone helper used by dataController)
export function getBandwidthPerCountry(data) {
  const bandwidthPerCountry = {};
  data.forEach(item => {
    const country = item.location?.country;
    if (country) {
      bandwidthPerCountry[country] = (bandwidthPerCountry[country] || 0) + (item.quality?.bandwidth || 0);
    }
  });
  return bandwidthPerCountry;
}

// Parse ALL 6 service-type prices from https://discovery.mysterium.network/api/v4/prices
export function parsePricingData(price) {
  const result = {
    resi_wireguard_gib_value: 0,
    resi_scraping_gib_value: 0,
    resi_quic_scraping_gib_value: 0,
    resi_data_transfer_gib_value: 0,
    resi_dvpn_gib_value: 0,
    resi_monitoring_gib_value: 0,
    other_wireguard_gib_value: 0,
    other_scraping_gib_value: 0,
    other_quic_scraping_gib_value: 0,
    other_data_transfer_gib_value: 0,
    other_dvpn_gib_value: 0,
    other_monitoring_gib_value: 0,
  };

  if (!price?.defaults?.current) return result;
  const { residential, other } = price.defaults.current;

  if (residential) {
    result.resi_wireguard_gib_value = parseFloat(residential.wireguard?.price_per_gib_human_readable) || 0;
    result.resi_scraping_gib_value = parseFloat(residential.scraping?.price_per_gib_human_readable) || 0;
    result.resi_quic_scraping_gib_value = parseFloat(residential.quic_scraping?.price_per_gib_human_readable) || 0;
    result.resi_data_transfer_gib_value = parseFloat(residential.data_transfer?.price_per_gib_human_readable) || 0;
    result.resi_dvpn_gib_value = parseFloat(residential.dvpn?.price_per_gib_human_readable) || 0;
    result.resi_monitoring_gib_value = parseFloat(residential.monitoring?.price_per_gib_human_readable) || 0;
  }
  if (other) {
    result.other_wireguard_gib_value = parseFloat(other.wireguard?.price_per_gib_human_readable) || 0;
    result.other_scraping_gib_value = parseFloat(other.scraping?.price_per_gib_human_readable) || 0;
    result.other_quic_scraping_gib_value = parseFloat(other.quic_scraping?.price_per_gib_human_readable) || 0;
    result.other_data_transfer_gib_value = parseFloat(other.data_transfer?.price_per_gib_human_readable) || 0;
    result.other_dvpn_gib_value = parseFloat(other.dvpn?.price_per_gib_human_readable) || 0;
    result.other_monitoring_gib_value = parseFloat(other.monitoring?.price_per_gib_human_readable) || 0;
  }

  return result;
}
