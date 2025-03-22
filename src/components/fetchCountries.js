// countryAPI.js

import axios from 'axios';

const BASE_URL = 'https://restcountries.com/v3.1/all';

// const fetchCountries = async () => {
//   try {
//     const response = await axios
//       .get('https://api-proxy-leoa.onrender.com/countryInfo', {
//         params: {
//           username: 'thegilo', // Replace with your GeoNames username
//         },
//       })
//     const countries = response.data.geonames.map((country) => ({
//       value: country.countryName,
//       label: country.countryName,
//     }));
//     return countries;
//   } catch (error) {
//     console.error('Error fetching countries:', error);
//     return [];
//   }
// };

const fetchCountries = async () => {
  try {
    const response = await axios.get(BASE_URL);
    
    // Map the response to extract country names
    const countries = response.data.map((country) => ({
      value: country.name.common, // Using the common name of the country
      label: country.name.common,
    }));

    return countries;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};


export default fetchCountries;
