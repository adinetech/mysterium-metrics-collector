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

The server will run on http://localhost:3002.

Main endpoint to fetch node statistics:
```
GET http://localhost:3002/
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

## Metrics

The application uses `prom-client` to expose various metrics related to Mysterium nodes, including:
- **Total number of Mysterium nodes**
- **Average quality and latency**
- **Bandwidth statistics per country**
- **Current registration fees**

Metrics can be accessed at [http://localhost:3002/metrics](http://localhost:3002/metrics).

## License

This project is licensed under the MIT License.
