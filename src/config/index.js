export default {
  port: parseInt(process.env.PORT) || 80,

  apis: {
    // Discovery API
    allProposals: 'https://discovery.mysterium.network/api/v3/proposals?&access_policy=all',
    publicProposals: 'https://discovery.mysterium.network/api/v3/proposals',
    pricing: 'https://discovery.mysterium.network/api/v4/prices',

    // Transactor API
    registrationFee: 'https://transactor.mysterium.network/api/v1/fee/137/register',
    transactorStatus: 'https://transactor.mysterium.network/api/v1/status',
    chainFee: (chainId) => `https://transactor.mysterium.network/api/v1/fee/${chainId}`,
    chainRegisterFee: (chainId) => `https://transactor.mysterium.network/api/v1/fee/${chainId}/register`,
    chainSettleFee: (chainId) => `https://transactor.mysterium.network/api/v1/fee/${chainId}/settle`,
    identityStatus: (id) => `https://transactor.mysterium.network/api/v1/identity/${id}/status`,
    identityEligibility: (address) => `https://transactor.mysterium.network/api/v1/identity/register/eligibility/${address}`,
    providerEligibility: 'https://transactor.mysterium.network/api/v1/identity/register/provider/eligibility',

    // Hermes3 API
    hermesStatus: 'https://hermes3.mysterium.network/api/v1/status',
    providerChannel: (identity) => `https://hermes3.mysterium.network/api/v1/data/provider/${identity}`,
    consumerChannel: (identity) => `https://hermes3.mysterium.network/api/v1/data/consumer/${identity}`,

    // Discovery provider lookup
    providerById: (providerId) => `https://discovery.mysterium.network/api/v3/proposals?provider_id=${providerId}`,
  },

  refreshInterval: parseInt(process.env.REFRESH_INTERVAL) || 60000, // 1 minute

  weiConversion: 1e18, // For converting fee from wei to MYST
};
