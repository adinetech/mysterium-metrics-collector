import fetch from 'node-fetch';
import config from '../config/index.js';

// Simple in-memory cache — 60s TTL
const cache = {};
const TTL = 60_000;

function cached(key, fn) {
  const now = Date.now();
  if (cache[key] && now - cache[key].ts < TTL) return Promise.resolve(cache[key].data);
  return fn().then(data => {
    cache[key] = { data, ts: now };
    return data;
  });
}

export function fetchAllProposals() {
  return cached('allProposals', async () => {
    const r = await fetch(config.apis.allProposals);
    return r.json();
  });
}

export function fetchPublicProposals() {
  return cached('publicProposals', async () => {
    const r = await fetch(config.apis.publicProposals);
    return r.json();
  });
}

export function fetchRegistrationFee() {
  return cached('fee', async () => {
    const r = await fetch(config.apis.registrationFee);
    const data = await r.json();
    return data.fee / config.weiConversion;
  });
}

export function fetchServicePricing() {
  return cached('pricing', async () => {
    const r = await fetch(config.apis.pricing);
    return r.json();
  });
}

export function getCacheAge(key) {
  if (!cache[key]) return null;
  return Math.round((Date.now() - cache[key].ts) / 1000);
}
