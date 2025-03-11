async function fetchData() {
    try {
        const response = await fetch('/');
        const data = await response.json();
        updateDashboard(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function updateDashboard(data) {
    // Update Node Statistics
    document.getElementById('totalNodes').textContent = data.total_nodes.toLocaleString();
    document.getElementById('publicNodes').textContent = data.public_nodes.toLocaleString();

    // Update Quality Metrics
    document.getElementById('avgQuality').textContent = data.avg_quality.toFixed(2);
    document.getElementById('pubAvgQuality').textContent = data.pub_avg_quality.toFixed(2);

    // Update Bandwidth Statistics
    document.getElementById('totalBandwidth').textContent = (data.total_bandwidth / 1000).toFixed(2) + ' Gbps';
    document.getElementById('pubTotalBandwidth').textContent = (data.pub_total_bandwidth / 1000).toFixed(2) + ' Gbps';

    // Update Latency Metrics
    document.getElementById('avgLatency').textContent = data.avg_latency.toFixed(2) + ' ms';
    document.getElementById('pubAvgLatency').textContent = data.pub_avg_latency.toFixed(2) + ' ms';

    // Update Pricing Information
    document.getElementById('resiWireguard').textContent = data.residential_wireguard_gib.toFixed(4) + ' MYST';
    document.getElementById('resiScraping').textContent = data.residential_scraping_gib.toFixed(4) + ' MYST';
    document.getElementById('resiDataTransfer').textContent = data.residential_data_transfer_gib.toFixed(4) + ' MYST';
    document.getElementById('resiDvpn').textContent = data.residential_dvpn_gib.toFixed(4) + ' MYST';
    
    document.getElementById('otherWireguard').textContent = data.other_wireguard_gib.toFixed(4) + ' MYST';
    document.getElementById('otherScraping').textContent = data.other_scraping_gib.toFixed(4) + ' MYST';
    document.getElementById('otherDataTransfer').textContent = data.other_data_transfer_gib.toFixed(4) + ' MYST';
    document.getElementById('otherDvpn').textContent = data.other_dvpn_gib.toFixed(4) + ' MYST';

    // Update Country Statistics
    const countryStats = document.getElementById('countryStats');
    countryStats.innerHTML = '';
    
    const countries = Object.entries(data.nodes_per_country)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);

    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Country</th>
            <th>Nodes</th>
            <th>Bandwidth (Mbps)</th>
        </tr>
        ${countries.map(([country, nodes]) => `
            <tr>
                <td>${country}</td>
                <td>${nodes.toLocaleString()}</td>
                <td>${(data.bandwidthPerCountry[country] || 0).toFixed(2)}</td>
            </tr>
        `).join('')}
    `;
    countryStats.appendChild(table);

    // Update Charts
    updateCharts(data);
}

function updateCharts(data) {
    const ctx = document.getElementById('geographicDistribution').getContext('2d');
    
    const countries = Object.entries(data.nodes_per_country)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: countries.map(country => country[0]),
            datasets: [{
                label: 'Number of Nodes',
                data: countries.map(country => country[1]),
                backgroundColor: '#EA339A',
                borderColor: '#EA339A',
                borderWidth: 0,
                borderRadius: 4,
                barThickness: 20
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff',
                        font: {
                            family: 'Inter'
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(234, 51, 154, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            family: 'Inter'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            family: 'Inter'
                        }
                    }
                }
            }
        }
    });
}

// Fetch data every 30 seconds
fetchData();
setInterval(fetchData, 30000);