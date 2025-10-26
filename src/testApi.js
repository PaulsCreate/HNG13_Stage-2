const axios = require("axios");

(async () => {
  try {
    const res1 = await axios.get("https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies");
    console.log("✅ Countries API OK:", res1.data.length, "countries");

    const res2 = await axios.get("https://open.er-api.com/v6/latest/USD");
    console.log("✅ Exchange API OK:", Object.keys(res2.data.rates).length, "rates");
  } catch (err) {
    console.error("❌ Failed to fetch:", err.message);
  }
})();
