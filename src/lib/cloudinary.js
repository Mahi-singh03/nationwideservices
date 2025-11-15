import crypto from 'crypto';

const utils = {
  // Minimal implementation to satisfy api_sign_request usage in the app.
  api_sign_request: (params = {}, apiSecret = '') => {
    const keys = Object.keys(params).sort();
    const toSign = keys.map((k) => `${k}=${params[k]}`).join('&');
    return crypto.createHash('sha1').update(toSign + apiSecret).digest('hex');
  },
};

export default { utils };
