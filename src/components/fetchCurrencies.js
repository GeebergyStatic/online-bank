// currencyAPI.js

import axios from 'axios';

const BASE_URL = 'https://open.er-api.com/v6/latest';

const fetchCurrencies = async () => {
  try {
    const response = await axios.get(BASE_URL);
    const { data } = response;
    
    if (data && data.rates) {
      const currencies = Object.keys(data.rates).map((currency) => ({
        value: currency,
        label: `${currency} - ${data.rates[currency]}`,
      }));
      return currencies;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching currencies:', error);
    return [];
  }
};

export default fetchCurrencies;
