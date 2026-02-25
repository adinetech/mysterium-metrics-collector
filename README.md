# Mysterium Metrics Collector

An Express.js service that aggregates live Mysterium Network data and exposes it as both a JSON API and a Prometheus metrics endpoint for Grafana dashboards.

---

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Prometheus Metrics](#prometheus-metrics)
- [License](#license)

---

## Features
- Aggregates live node statistics from the Mysterium Discovery API (41k+ nodes)
- Tracks quality, latency, uptime, packet loss, and per-service-type breakdown
- Exposes full pricing for all 6 service types (wireguard, scraping, quic_scraping, data_transfer, dvpn, monitoring)
- Prometheus metrics endpoint for Grafana scraping
- Per-country node count and bandwidth breakdown
- Modular Express.js architecture

---

## Project Structure

```
mysterium-metrics-collector/
├── src/
│   ├── config/              # App configuration
│   │   └── index.js
│   ├── services/            # Mysterium API clients
│   │   └── mysteriumApi.js
│   ├── metrics/             # Prometheus gauge definitions
│   │   └── prometheusMetrics.js
│   ├── controllers/         # Route handlers
│   │   ├── metricsController.js   # / and /metrics
│   │   └── dataController.js      # All other endpoints
│   ├── routes/              # Express router
│   │   └── index.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── utils/
│   │   └── calculations.js  # Aggregation helpers
│   └── app.js
├── public/                  # Live dashboard (Chart.js)
│   ├── dashboard.html
│   ├── dashboard.js
│   └── styles.css
├── grafana/                 # Grafana dashboard JSON
│   └── mysterium-network-stats.json
├── index.js                 # Entry point
├── package.json
└── README.md
```

---

## Requirements
- **Node.js** 14+
- **npm**

---

## Installation

```bash
git clone https://github.com/adinetech/mysterium-metrics-collector.git
cd mysterium-metrics-collector
npm install
```

---

## Configuration

Create a `.env` file in the root (optional — defaults work out of the box):

```env
PORT=80
NODE_ENV=production
```

| Variable | Default | Description |
|---|---|---|
| `PORT` | `80` | HTTP port to listen on |
| `NODE_ENV` | `production` | Environment mode |

---

## Usage

```bash
node index.js
```

Server starts at `http://localhost`. Hit `GET /` for a full live snapshot.

---

## API Endpoints

Base URL: `https://mysterium-api.adinetech.com`

### `GET /`
Full aggregated network snapshot. Also updates all Prometheus gauges.

**Response fields:**
| Field | Description |
|---|---|
| `total_nodes` | All nodes (all access policies) |
| `avg_quality` | Average quality score (0–3 scale) |
| `avg_latency` | Average latency in ms |
| `avg_uptime` | Average uptime in hours |
| `avg_packet_loss` | Average packet loss % |
| `total_bandwidth` | Total bandwidth in Mbps |
| `avg_bandwidth` | Average bandwidth per node in Mbps |
| `nodes_per_service_type` | Node count per service type (dvpn, wireguard, scraping, quic_scraping, data_transfer, monitoring) |
| `public_nodes` | Nodes with public access policy |
| `pub_avg_quality` | Public node average quality |
| `pub_avg_latency` | Public node average latency (ms) |
| `pub_avg_uptime` | Public node average uptime (hrs) |
| `pub_avg_packet_loss` | Public node average packet loss % |
| `pub_total_bandwidth` | Public node total bandwidth (Mbps) |
| `pub_avg_bandwidth` | Public node average bandwidth (Mbps) |
| `current_fee` | Registration/settlement fee in MYST (chain 137) |
| `residential_wireguard_gib` … `other_monitoring_gib` | Pricing per GiB in MYST for all 12 service/category combinations |
| `bandwidthPerCountry` | Bandwidth per country (Mbps) |
| `nodes_per_country` | Node count per country |

---

### `GET /metrics`
Prometheus scrape endpoint. Returns all gauges in Prometheus text format.

---

### `GET /price`
Raw pricing response from the Mysterium Discovery API (`/api/v4/prices`). Contains full per-service-type pricing for both residential and other categories.

---

### `GET /proposals`
Full raw proposals array from the Mysterium Discovery API. Large payload (~40k entries).

---

### `GET /nodes_per_country`
Node count per country (all countries).

```json
{ "nodesPerCountry": { "US": 944, "DE": 952, ... } }
```

### `GET /nodes_per_country/:countryCode`
Node count for a single country (ISO 3166-1 alpha-2).
```
GET /nodes_per_country/US → { "countryCode": "US", "count": 944 }
```

---

### `GET /bandwidth_per_country`
Total bandwidth (Mbps) per country (all countries).

### `GET /bandwidth_per_country/:countryCode`
Bandwidth for a single country.
```
GET /bandwidth_per_country/DE → { "countryCode": "DE", "bandwidth": 197636.57 }
```

---

### `GET /help`
Returns the full endpoint list with descriptions as JSON.

---

## Prometheus Metrics

All metrics are prefixed `mysterium_`. Key gauges:

| Metric | Description |
|---|---|
| `mysterium_total_nodes` | Total node count |
| `mysterium_public_nodes` | Public node count |
| `mysterium_avg_quality` | Avg quality (0–3) |
| `mysterium_avg_latency` | Avg latency (ms) |
| `mysterium_avg_uptime` | Avg uptime (hours) |
| `mysterium_avg_packet_loss` | Avg packet loss % |
| `mysterium_total_bandwidth` | Total bandwidth (Mbps) |
| `mysterium_current_fee` | Fee in MYST |
| `mysterium_residential_wireguard_gib` | Residential wireguard price/GiB |
| `mysterium_residential_quic_scraping_gib` | Residential QUIC scraping price/GiB |
| `mysterium_residential_monitoring_gib` | Residential monitoring price/GiB |
| `mysterium_other_*` | Same set for non-residential |
| `mysterium_nodes_<CC>` | Node count per country (dynamic, e.g. `mysterium_nodes_US`) |
| `mysterium_bandwidth_<CC>` | Bandwidth per country (dynamic) |
| `mysterium_nodes_service_<type>` | Node count per service type (dynamic) |
| _(+ public variants for quality, latency, uptime, packet loss, bandwidth)_ | |

Metrics are scraped at `GET /metrics` and updated on every `GET /` request.

---

## License

MIT
