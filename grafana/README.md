# Grafana Dashboard

Pre-built Grafana dashboard for the **Mysterium Metrics Collector**, visualising all Prometheus metrics exposed by this service.

---

## Requirements

- Grafana **9+** (`schemaVersion: 42`, classic JSON model)
- A **Prometheus datasource** configured in Grafana, scraping `/metrics` from this app

---

## Files

```
grafana/
└── mysterium-network-stats.json   # Import this
```

---

## Import

**Option A — Paste into existing dashboard (recommended if you already have it live):**
1. Open your dashboard → ⚙️ **Settings → JSON Model**
2. Paste the contents of `mysterium-network-stats.json`
3. Click **Save dashboard**

**Option B — Fresh import:**
1. Grafana → **Dashboards → New → Import**
2. Upload `mysterium-network-stats.json`
3. Select your **Prometheus datasource** when prompted
4. Click **Import**

> Dashboard UID is `adrlhrr`. Grafana will detect a conflict if you already have it — use Option A in that case.

---

## Panels

### Network Summary (stat cards)

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

### Pricing row (collapsed by default, MYST / GiB)

| Panel | Metric |
|-------|--------|
| Residential VPN | `mysterium_residential_dvpn_gib` |
| Residential B2B VPN & Data Transfer | `mysterium_residential_data_transfer_gib` |
| Residential Wireguard | `mysterium_residential_wireguard_gib` |
| Residential Scraping | `mysterium_residential_scraping_gib` |
| Other VPN | `mysterium_other_dvpn_gib` |
| Other B2B VPN & Data Transfer | `mysterium_other_data_transfer_gib` |
| Other Wireguard | `mysterium_other_wireguard_gib` |
| Other Scraping | `mysterium_other_scraping_gib` |
| Top 10 Countries by Bandwidth | `mysterium_bandwidth_<CC>` (timeseries) |
| Total Bandwidth by Country | `mysterium_bandwidth_<CC>` (timeseries, >100 Gbps) |

### Advanced row (timeseries over time)

All of the Network Summary metrics plotted as time series for trend analysis.

---

## Dynamic Country Metrics

The collector creates per-country gauges at runtime for each country seen in the network:

| Metric pattern | Description |
|----------------|-------------|
| `mysterium_bandwidth_<CC>` | Total bandwidth for country (ISO 3166-1 alpha-2) |
| `mysterium_nodes_<CC>` | Node count for country |

---

## Refresh Interval

Metrics are refreshed every `REFRESH_INTERVAL` ms (default: 60 000 ms). Set this in `.env`. Prometheus scrape interval should be ≤ this value for accurate panels.
