const axios = require("axios");

let cachedToken = null;
let tokenExpiry = 0;

exports.getFatSecretAccessToken = async () => {
  // simple in-memory cache (Lambda reuse)
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const credentials = Buffer.from(
    `${process.env.FAT_SECRET_CONSUMER_KEY}:${process.env.FAT_SECRET_CONSUMER_SECRET}`
  ).toString("base64");

  const response = await axios.post(
    "https://oauth.fatsecret.com/connect/token",
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  cachedToken = response.data.access_token;
  tokenExpiry = Date.now() + response.data.expires_in * 1000 - 60000;

  return cachedToken;
};
