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
      totalQuality += item.quality.quality || 0;
      totalLatency += Math.min(item.quality.latency || 0, 10000); // cap at 10s — excludes dead-node outliers (e.g. 8.6M ms)
      totalBandwidth += item.quality.bandwidth || 0;
      totalUptime += item.quality.uptime || 0;
      totalPacketLoss += item.quality.packetLoss || 0;

      if (country) {
        bandwidthPerCountry[country] = (bandwidthPerCountry[country] || 0) + (item.quality.bandwidth || 0);
      }
    }
  });

  const totalNodes = data.length;
  const n = nodesWithQuality || 1; // avoid divide-by-zero
  const avgQuality = totalQuality / n;
  const avgLatency = totalLatency / n;
  const avgBandwidth = totalBandwidth / n;
  const avgUptime = totalUptime / n;
  const avgPacketLoss = totalPacketLoss / n;

  return {
    totalNodes,
    totalBandwidth,
    avgQuality,
    avgLatency,
    avgBandwidth,
    avgUptime,
    avgPacketLoss,
    nodesPerCountry,
    nodesPerServiceType,
    bandwidthPerCountry,
  };
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

// Get nodes count by country (standalone helper used by dataController)
export function getNodesPerCountry(data) {
  const nodesPerCountry = {};
  data.forEach(item => {
    const country = item.location?.country;
    if (country) {
      nodesPerCountry[country] = (nodesPerCountry[country] || 0) + 1;
    }
  });
  return nodesPerCountry;
}

// Get bandwidth by country (standalone helper used by dataController)
export function getBandwidthPerCountry(data) {
  const bandwidthPerCountry = {};
  data.forEach(item => {
    const country = item.location?.country;
    if (country) {
      const bw = item.quality?.bandwidth || 0;
      bandwidthPerCountry[country] = (bandwidthPerCountry[country] || 0) + bw;
    }
  });
  return bandwidthPerCountry;
}
