const axios = require("axios");
const { getFatSecretAccessToken } = require("./getAccessToken");

exports.searchFoods = async (event) => {
  try {
    const query = event.queryStringParameters?.q || "banana";
    const page = event.queryStringParameters?.page || 0;
    const limit = event.queryStringParameters?.limit || 10;

    const token = await getFatSecretAccessToken();

    const response = await axios.get(
      "https://platform.fatsecret.com/rest/foods/search/v1",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search_expression: query,
          page_number: page,
          max_results: limit,
          format: "json",
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "FatSecret OAuth2 search failed",
        error: err.response?.data || err.message,
      }),
    };
  }
};
