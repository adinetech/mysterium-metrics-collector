import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import * as metricsController from '../controllers/metricsController.js';
import * as dataController from '../controllers/dataController.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Main aggregated metrics endpoint
router.get('/', asyncHandler(metricsController.getAggregatedMetrics));

// Prometheus metrics
router.get('/metrics', asyncHandler(metricsController.getPrometheusMetrics));

// Data endpoints
router.get('/fee', asyncHandler(dataController.getFee));
router.get('/price', asyncHandler(dataController.getPricing));
router.get('/proposals', asyncHandler(dataController.getProposals));
router.get('/providers', asyncHandler(dataController.getProviders));
router.get('/public_providers', asyncHandler(dataController.getPublicProviders));
router.get('/total_bandwidth', asyncHandler(dataController.getTotalBandwidth));
router.get('/public_total_bandwidth', asyncHandler(dataController.getPublicTotalBandwidth));
router.get('/avg_quality', asyncHandler(dataController.getAvgQuality));
router.get('/public_avg_quality', asyncHandler(dataController.getPublicAvgQuality));
router.get('/avg_latency', asyncHandler(dataController.getAvgLatency));
router.get('/public_avg_latency', asyncHandler(dataController.getPublicAvgLatency));
router.get('/nodes_per_country', asyncHandler(dataController.getNodesPerCountryAll));
router.get('/nodes_per_country/:countryCode', asyncHandler(dataController.getNodesForCountry));
router.get('/bandwidth_per_country', asyncHandler(dataController.getBandwidthPerCountryAll));
router.get('/bandwidth_per_country/:countryCode', asyncHandler(dataController.getBandwidthForCountry));
router.get('/help', asyncHandler(dataController.getHelp));
router.get('/provider/:providerId', asyncHandler(dataController.getProviderById));

// Transactor API
router.get('/chain_fee/:chainid', asyncHandler(dataController.getChainFee));
router.get('/chain_register_fee/:chainid', asyncHandler(dataController.getChainRegisterFee));
router.get('/chain_settle_fee/:chainid', asyncHandler(dataController.getChainSettleFee));
router.get('/identity_status/:id', asyncHandler(dataController.getIdentityStatus));
router.get('/identity_eligibility/:address', asyncHandler(dataController.getIdentityEligibility));
router.get('/provider_eligibility', asyncHandler(dataController.getProviderEligibility));
router.get('/transactor_status', asyncHandler(dataController.getTransactorStatus));

// Hermes3 API
router.get('/provider_channel/:identity', asyncHandler(dataController.getProviderChannelData));
router.get('/consumer_channel/:identity', asyncHandler(dataController.getConsumerChannelData));
router.get('/hermes_status', asyncHandler(dataController.getHermesStatus));

export default router;