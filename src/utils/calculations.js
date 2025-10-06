// Calculate total and average metrics from proposals data
export function calculateMetrics(data) {
  let totalQuality = 0;
  let totalLatency = 0;
  let totalBandwidth = 0;
  let nodesPerCountry = {};
  let bandwidthPerCountry = {};

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

  const totalNodes = data.length;
  const avgQuality = totalQuality / totalNodes;
  const avgLatency = totalLatency / totalNodes;
  const avgBandwidth = totalBandwidth / totalNodes;

  return {
    totalNodes,
    totalQuality,
    totalLatency,
    totalBandwidth,
    avgQuality,
    avgLatency,
    avgBandwidth,
    nodesPerCountry,
    bandwidthPerCountry
  };
}

// Parse pricing data from API response
export function parsePricingData(price) {
  let resi_wireguard_gib_value = 0;
  let resi_scraping_gib_value = 0;
  let resi_data_transfer_gib_value = 0;
  let resi_dvpn_gib_value = 0;
  let other_wireguard_gib_value = 0;
  let other_scraping_gib_value = 0;
  let other_data_transfer_gib_value = 0;
  let other_dvpn_gib_value = 0;

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

  return {
    resi_wireguard_gib_value,
    resi_scraping_gib_value,
    resi_data_transfer_gib_value,
    resi_dvpn_gib_value,
    other_wireguard_gib_value,
    other_scraping_gib_value,
    other_data_transfer_gib_value,
    other_dvpn_gib_value
  };
}

// Get nodes count by country
export function getNodesPerCountry(data) {
  const nodesPerCountry = {};
  data.forEach(item => {
    const country = item.location.country;
    if (nodesPerCountry[country]) {
      nodesPerCountry[country] += 1;
    } else {
      nodesPerCountry[country] = 1;
    }
  });
  return nodesPerCountry;
}

// Get bandwidth by country
export function getBandwidthPerCountry(data) {
  const bandwidthPerCountry = {};
  data.forEach(item => {
    const country = item.location.country;
    if (bandwidthPerCountry[country]) {
      bandwidthPerCountry[country] += item.quality.bandwidth || 0;
    } else {
      bandwidthPerCountry[country] = item.quality.bandwidth || 0;
    }
  });
  return bandwidthPerCountry;
}
