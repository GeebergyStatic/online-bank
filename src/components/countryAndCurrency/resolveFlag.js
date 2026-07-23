// resolveFlagUrl.js
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

// Register English locale
countries.registerLocale(enLocale);

const FALLBACK_FLAG = "https://flagcdn.com/w40/un.png";

// Cache helpers
const getCachedCountryCode = (country) => {
    return localStorage.getItem(`country_flag_${country}`);
};

const setCachedCountryCode = (country, code) => {
    localStorage.setItem(`country_flag_${country}`, code);
};

/**
 * Resolve country name to ISO2 code reliably
 * Uses i18n-iso-countries library
 */
const getCountryCode = (countryName) => {
    if (!countryName) return null;

    // Trim and normalize
    const name = countryName.trim();

    // Get ISO2 code
    const code = countries.getAlpha2Code(name, "en");
    if (!code) {
        console.warn(`Could not resolve country code for: "${countryName}"`);
        return null;
    }
    return code.toLowerCase();
};

/**
 * Main function to resolve FlagCDN URL from country name
 * Fully automatic and reliable
 */
export const resolveFlagUrl = async (countryName) => {
    if (!countryName) return FALLBACK_FLAG;

    // 1️⃣ Check cache
    const cached = getCachedCountryCode(countryName);
    if (cached) {
        const cachedUrl = `https://flagcdn.com/w40/${cached}.png`;
        console.log(`Using cached flag for ${countryName}:`, cachedUrl);
        return cachedUrl;
    }

    // 2️⃣ Resolve ISO2 code
    const code = getCountryCode(countryName);
    if (code) {
        const url = `https://flagcdn.com/w40/${code}.png`;
        setCachedCountryCode(countryName, code);
        console.log(`Resolved flag for ${countryName}:`, url);
        return url;
    }

    // 3️⃣ Fallback flag
    console.warn(`Using fallback flag for ${countryName}`);
    return FALLBACK_FLAG;
};
