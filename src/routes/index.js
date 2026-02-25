import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import * as metricsController from '../controllers/metricsController.js';
import * as dataController from '../controllers/dataController.js';

const router = express.Router();

// Core — aggregated snapshot + Prometheus gauge update
router.get('/', asyncHandler(metricsController.getAggregatedMetrics));

// Prometheus scrape endpoint
router.get('/metrics', asyncHandler(metricsController.getPrometheusMetrics));

// Computed / aggregated data endpoints
router.get('/price', asyncHandler(dataController.getPricing));
router.get('/proposals', asyncHandler(dataController.getProposals));
router.get('/nodes_per_country', asyncHandler(dataController.getNodesPerCountryAll));
router.get('/nodes_per_country/:countryCode', asyncHandler(dataController.getNodesForCountry));
router.get('/bandwidth_per_country', asyncHandler(dataController.getBandwidthPerCountryAll));
router.get('/bandwidth_per_country/:countryCode', asyncHandler(dataController.getBandwidthForCountry));

// Help / docs
router.get('/help', asyncHandler(dataController.getHelp));

export default router;