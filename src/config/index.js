export default {
  port: process.env.PORT || 80,
  
  apis: {
    allProposals: 'https://discovery.mysterium.network/api/v3/proposals?&access_policy=all',
    publicProposals: 'https://discovery.mysterium.network/api/v3/proposals',
    registrationFee: 'https://transactor.mysterium.network/api/v1/fee/137/register',
    pricing: 'https://discovery.mysterium.network/api/v4/prices'
  },
  
  refreshInterval: 60000, // 1 minute
  
  weiConversion: 1e18 // For converting fee from wei to MYST
};
