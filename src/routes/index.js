import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import * as metricsController from '../controllers/metricsController.js';
import * as dataController from '../controllers/dataController.js';

const router = express.Router();

// Core
router.get('/', asyncHandler(metricsController.getAggregatedMetrics));
router.get('/metrics', asyncHandler(metricsController.getPrometheusMetrics));

// Data endpoints
router.get('/price', asyncHandler(dataController.getPricing));
router.get('/proposals', asyncHandler(dataController.getProposals));

// Stats
router.get('/stats/top_countries', asyncHandler(dataController.getTopCountriesStats));

// Country endpoints
router.get('/nodes_per_country', asyncHandler(dataController.getNodesPerCountryAll));
router.get('/nodes_per_country/:countryCode/services', asyncHandler(dataController.getServicesForCountry));
router.get('/nodes_per_country/:countryCode', asyncHandler(dataController.getNodesForCountry));
router.get('/bandwidth_per_country', asyncHandler(dataController.getBandwidthPerCountryAll));
router.get('/bandwidth_per_country/:countryCode', asyncHandler(dataController.getBandwidthForCountry));

// Utility
router.get('/health', asyncHandler(dataController.getHealth));
router.get('/help', asyncHandler(dataController.getHelp));

export default router;