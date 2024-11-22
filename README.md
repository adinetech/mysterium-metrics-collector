# Mysterium Metrics Collector

The **Mysterium Metrics Collector** is an Express.js application designed to fetch and expose metrics from the Mysterium Network API. It gathers various statistics about Mysterium nodes, including proposals, registration fees, and service pricing, and makes them available for monitoring.

---

## Table of Contents
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Metrics](#metrics)
- [License](#license)

---

## Features
- Fetches all proposals from the Mysterium Network.
- Retrieves public proposals.
- Obtains registration fees in human-readable format.
- Gathers service pricing information.
- Exposes metrics for monitoring Mysterium nodes.

---

## Requirements
- **Node.js** (version 14 or higher)
- **npm** (Node package manager)

---

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/adinetech/mysterium-metrics-collector.git
    cd mysterium-metrics-collector
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

---

## Usage
To start the server, run:
```bash
node index.js
```

The server will run on http://localhost.

Main endpoint to fetch node statistics:
```
GET http://localhost/
```

## API Endpoints

### `GET /`
Returns a JSON response containing:
- **Total number of nodes**
- **Average quality and latency of nodes**
- **Total and average bandwidth of nodes**
- **Current registration fee**
- **Bandwidth and node statistics per country**

### `GET /metrics`
Exposes Prometheus metrics for monitoring.

### `GET /fee`:
Retrieves the current registration or settlement fee in MYST from the Transactor API.

### `GET /price`:
Fetches service pricing details from the Discovery API, including various pricing metrics for residential and other services.

### `GET /proposals`:
Returns a list of all proposals from the Mysterium network.

### `GET /providers`:
Provides the total count of providers available in the network.

### `GET /public-providers`:
Returns the count of public providers available in the network.

### `GET /total_bandwidth`:
Calculates and returns the total bandwidth across all Mysterium nodes in Gbps.

### `GET /public_total_bandwidth`:
Calculates and returns the total bandwidth specifically for public Mysterium nodes in Gbps.

### `GET /avg_quality`:
Computes and returns the average quality of all Mysterium nodes.

### `GET /public_avg_quality`:
Computes and returns the average quality specifically for public Mysterium nodes.

### `GET /avg_latency`:
Computes and returns the average latency of all Mysterium nodes.

### `GET /public_avg_latency`:
Computes and returns the average latency specifically for public Mysterium nodes.

### `GET /public_providers`:
Returns a count of public providers currently available in the network.

## Metrics

The application uses `prom-client` to expose various metrics related to Mysterium nodes.

Metrics can be accessed at [http://localhost/metrics](http://localhost/metrics).

## License

This project is licensed under the MIT License.
