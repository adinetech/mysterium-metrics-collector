# Grafana Dashboard

Pre-built Grafana dashboard for the **Mysterium Metrics Collector**, visualising all Prometheus metrics exposed by this service.

---

## Requirements

- Grafana **11+** (dashboard uses the `dashboard.grafana.app/v2beta1` schema)
- A **Prometheus datasource** configured in Grafana, scraping `/metrics` from this app

---

## Files

```
grafana/
└── v2/
    └── mysterium-network-stats-v2.json   # Import this
```

---

## Import

1. Open Grafana → **Dashboards → New → Import**
2. Click **Upload dashboard JSON file**
3. Select `v2/mysterium-network-stats-v2.json`
4. Choose your **Prometheus datasource** when prompted
5. Click **Import**

> **Provisioning?** Drop the JSON into your Grafana provisioning dashboards path and point your provider config at it.

---

## Panels

### Network Summary

| Panel | Metric | Unit |
|-------|--------|------|
| Total Nodes | `mysterium_total_nodes` | count |
| Public Nodes | `mysterium_public_nodes` | count |
| Average Quality | `mysterium_avg_quality` | score |
| Average Latency | `mysterium_avg_latency` | ms |
| Total Bandwidth | `mysterium_total_bandwidth / 1e6` | Tbps |
| Total Public Bandwidth | `mysterium_total_public_bandwidth / 1e6` | Tbps |
| Average Bandwidth | `mysterium_avg_bandwidth` | Mbps |
| Average Public Bandwidth | `mysterium_avg_public_bandwidth` | Mbps |
| Current Network Fee | `mysterium_current_fee` | MYST |

### Pricing (MYST / GiB)

| Panel | Metric |
|-------|--------|
| Residential VPN | `mysterium_residential_dvpn_gib` |
| Residential B2B VPN & Data Transfer | `mysterium_residential_data_transfer_gib` |
| Residential Scraping | `mysterium_residential_scraping_gib` |
| Residential Wireguard | `mysterium_residential_wireguard_gib` |
| Other VPN | `mysterium_other_dvpn_gib` |
| Other B2B VPN & Data Transfer | `mysterium_other_data_transfer_gib` |
| Other Scraping | `mysterium_other_scraping_gib` |
| Other Wireguard | `mysterium_other_wireguard_gib` |

### Per-Country (dynamic)

Dynamic gauges are created at runtime by the collector for each country present in the network:

| Metric pattern | Description |
|----------------|-------------|
| `mysterium_bandwidth_<CC>` | Total bandwidth for country `CC` |
| `mysterium_nodes_<CC>` | Node count for country `CC` |

> Country codes follow [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) (e.g. `US`, `DE`, `SG`).

---

## Metrics Refresh

The collector auto-refreshes all metrics every `REFRESH_INTERVAL` milliseconds (default: `60000` / 1 minute). Set `REFRESH_INTERVAL` in your `.env` to tune this. Prometheus scrape interval should be ≤ this value.

---

## Datasource UID

The dashboard is pre-configured with datasource name `cf0sumxa65gcge`. If your Prometheus datasource has a different UID, Grafana will prompt you to remap it on import.
